import express from 'express';
import pool from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import { isOpenNow } from '../utils/isOpenNow.js';

const router = express.Router();

// GET /shops — list all shops (for map)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, 
             COUNT(p.id) as items_count,
             MIN(p.price) as min_price
      FROM shops s
      LEFT JOIN posts p ON s.id = p.shop_id AND p.status = 'active'
      GROUP BY s.id
    `);

    const shops = result.rows.map(s => ({
      id: s.id,
      name: s.shop_name,
      lat: s.latitude,
      lng: s.longitude,
      min_price: s.min_price || 0,
      items_count: parseInt(s.items_count),
      image_url: s.image_url,
      description: s.description,
      is_open: isOpenNow(s.opening_hours)
    }));

    res.json({ success: true, data: shops });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// GET /shops/my-shop — get current user's shop
router.get('/my-shop', requireAuth, async (req, res) => {
  const user_id = req.user.id;
  try {
    const result = await pool.query('SELECT * FROM shops WHERE user_id = $1', [user_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'No shop' } });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// POST /shops — create shop
router.post('/', requireAuth, async (req, res) => {
  const { shop_name, shop_address, description, shop_image_url, latitude, longitude, opening_hours } = req.body;
  const user_id = req.user.id;

  try {
    // 1 user can have 1 shop (now checking if it's there to return id for updating if needed, but here simple reject as before)
    const existing = await pool.query('SELECT id FROM shops WHERE user_id = $1', [user_id]);
    if (existing.rows.length > 0) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'You already have a shop' }
      });
    }

    const result = await pool.query(
      `INSERT INTO shops (user_id, shop_name, shop_address, description, image_url, latitude, longitude, opening_hours,
        location)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8, ST_SetSRID(ST_MakePoint($9,$10),4326))
       RETURNING *`,
      [user_id, shop_name, shop_address, description, shop_image_url, latitude, longitude,
       JSON.stringify(opening_hours), longitude, latitude]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// GET /shops/nearby — get shops nearby
router.get('/nearby', async (req, res) => {
  const { lat, lng, radius, veg_type } = req.query;

  // validate params
  if (!lat || !lng || !radius) {
    return res.status(422).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'กรุณาระบุ lat, lng และ radius' }
    });
  }

  try {
    // PostGIS query — get shops in radius + get min_price and preview_image
    let query = `
      SELECT 
        s.id,
        s.shop_name,
        s.image_url as shop_image_url,
        s.latitude,
        s.longitude,
        s.opening_hours,
        ROUND(ST_Distance(
          s.location::geography,
          ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography
        )) AS distance_meters,
        MIN(p.price) AS min_price,
        COUNT(p.id) AS post_count,
        (
          SELECT vs.image_url 
          FROM posts p2
          JOIN vegetable_scans vs ON p2.scan_id = vs.id
          WHERE p2.shop_id = s.id 
            AND p2.status = 'active'
            ${veg_type ? `AND vs.veg_type ILIKE $4` : ''}
          LIMIT 1
        ) AS preview_image_url
      FROM shops s
      LEFT JOIN posts p ON p.shop_id = s.id AND p.status = 'active'
      WHERE ST_DWithin(
        s.location::geography,
        ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
        $3
      )
      ${veg_type ? `
        AND s.id IN (
          SELECT DISTINCT p3.shop_id
          FROM posts p3
          JOIN vegetable_scans vs3 ON p3.scan_id = vs3.id
          WHERE p3.status = 'active'
            AND vs3.veg_type ILIKE $4
        )
      ` : ''}
      GROUP BY s.id
      ORDER BY distance_meters ASC
    `;

    const values = [parseFloat(lat), parseFloat(lng), parseInt(radius)];
    if (veg_type) values.push(`%${veg_type}%`);

    const result = await pool.query(query, values);

    // Include all shops (both open and closed), set is_open_now based on actual calculation
    const shops = result.rows.map(s => ({
        id: s.id,
        shop_name: s.shop_name,
        shop_image_url: s.shop_image_url,
        latitude: s.latitude,
        longitude: s.longitude,
        distance_meters: parseInt(s.distance_meters),
        is_open_now: isOpenNow(s.opening_hours),
        min_price: s.min_price ? parseFloat(s.min_price) : null,
        post_count: parseInt(s.post_count),
        preview_image_url: s.preview_image_url ?? s.shop_image_url,
      }));

    res.json({ success: true, data: shops });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// GET /shops/:id — get shop data with posts
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const shopResult = await pool.query('SELECT * FROM shops WHERE id = $1', [id]);
    if (shopResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'shop not found' }
      });
    }

    const shop = shopResult.rows[0];

    // get active posts with scan data
    const postsResult = await pool.query(
      `SELECT p.*, 
              vs.image_url as scan_image_url, vs.veg_type, vs.freshness_score,
              vs.ai_raw_output
       FROM posts p
       LEFT JOIN vegetable_scans vs ON p.scan_id = vs.id
       WHERE p.shop_id = $1 AND p.status = 'active'
       ORDER BY p.created_at DESC`,
      [id]
    );

    const posts = postsResult.rows.map(p => ({
      id: p.id,
      original_price: p.original_price,
      price: p.price,
      status: p.status,
      expired_at: p.expired_at,
      quantity: p.quantity ?? null,
      unit: p.unit || 'กก.',
      description: p.description ?? null,
      scan: {
        image_url: p.scan_image_url,
        veg_type: p.veg_type,
        freshness_score: p.freshness_score,
        freshness_label: getFreshnessLabel(p.freshness_score),
        ai_summary: p.ai_raw_output?.summary ?? null
      }
    }));

    res.json({
      success: true,
      data: {
        ...shop,
        is_open_now: isOpenNow(shop.opening_hours),
        posts
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// PATCH /shops/:id — update shop data
router.patch('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  const { shop_name, shop_address, description, shop_image_url, latitude, longitude, opening_hours } = req.body;

  try { 
    // check if user is the owner of the shop
    const shop = await pool.query('SELECT id FROM shops WHERE id = $1 AND user_id = $2', [id, user_id]);
    if (shop.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'you don\'t have permission to edit this shop' }
      });
    }

    // create dynamic query
    const fields = [];
    const values = [];
    let i = 1;

    if (shop_name)       { fields.push(`shop_name=$${i++}`);     values.push(shop_name); }
    if (shop_address)    { fields.push(`shop_address=$${i++}`);  values.push(shop_address); }
    if (description)     { fields.push(`description=$${i++}`);   values.push(description); }
    if (shop_image_url)  { fields.push(`image_url=$${i++}`);     values.push(shop_image_url); }
    if (opening_hours)   { fields.push(`opening_hours=$${i++}`); values.push(JSON.stringify(opening_hours)); }
    if (latitude && longitude) {
      fields.push(`latitude=$${i++}`, `longitude=$${i++}`, `location=ST_SetSRID(ST_MakePoint($${i++},$${i++}),4326)`);
      values.push(latitude, longitude, longitude, latitude);
    }

    if (fields.length === 0) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'no data to update' }
      });
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE shops SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

function getFreshnessLabel(score) {
  if (score >= 75) return 'สด';
  if (score >= 50) return 'ใกล้หมด';
  return 'ควรเร่งขาย';
}

export default router;