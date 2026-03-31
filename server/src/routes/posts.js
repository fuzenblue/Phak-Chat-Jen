import express from 'express';
import pool from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /posts/my-shop — view posts of my shop
router.get('/my-shop', requireAuth, async (req, res) => {
  const { status } = req.query;
  const user_id = req.user.id;

  try {
    // find shop of user
    console.log(`[GET /v1/posts/my-shop] Fetching shop for user ${user_id}`);
    const shopResult = await pool.query('SELECT id FROM shops WHERE user_id = $1', [user_id]);
    if (shopResult.rows.length === 0) {
      console.warn(`[GET /v1/posts/my-shop] No shop for user ${user_id}`);
      return res.status(400).json({
        success: false,
        error: { code: 'SHOP_NOT_FOUND', message: 'กรุณาตั้งค่าร้านค้าก่อน' }
      });
    }

    const shop_id = shopResult.rows[0].id;

    let query = `
      SELECT p.*, 
             vs.image_url as scan_image_url, vs.veg_type, vs.freshness_score, vs.ai_raw_output
      FROM posts p
      LEFT JOIN vegetable_scans vs ON p.scan_id = vs.id
      WHERE p.shop_id = $1
    `;
    const values = [shop_id];

    if (status) {
      query += ` AND p.status = $2`;
      values.push(status);
    }

    query += ` ORDER BY p.created_at DESC`;

    const result = await pool.query(query, values);

    const posts = result.rows.map(p => ({
      id: p.id,
      original_price: p.original_price,
      price: p.price,
      status: p.status,
      expired_at: p.expired_at,
      created_at: p.created_at,
      scan: {
        image_url: p.scan_image_url,
        veg_type: p.veg_type,
        freshness_score: p.freshness_score,
        freshness_label: getFreshnessLabel(p.freshness_score),
        ai_summary: p.ai_raw_output?.summary ?? null,
      }
    }));

    res.json({ success: true, data: posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// POST /posts — post product
router.post('/', requireAuth, async (req, res) => {
  const { scan_id, price, original_price, expired_at } = req.body;
  const user_id = req.user.id;

  try {
    const shopResult = await pool.query('SELECT id FROM shops WHERE user_id = $1', [user_id]);
    if (shopResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'ยังไม่มีร้านค้า' }
      });
    }

    const shop_id = shopResult.rows[0].id;

    const result = await pool.query(
      `INSERT INTO posts (scan_id, shop_id, price, original_price, expired_at)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [scan_id, shop_id, price, original_price, expired_at]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// GET /posts/:id — get single post
router.get('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    // check owner
    const check = await pool.query(
      `SELECT p.id FROM posts p
       JOIN shops s ON p.shop_id = s.id
       WHERE p.id = $1 AND s.user_id = $2`,
      [id, user_id]
    );
    if (check.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'ไม่มีสิทธิ์ดู post นี้' }
      });
    }

    const result = await pool.query(
      `SELECT p.*, 
             vs.image_url as scan_image_url, vs.veg_type, vs.freshness_score, vs.ai_raw_output
      FROM posts p
      LEFT JOIN vegetable_scans vs ON p.scan_id = vs.id
      WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'ไม่พบ post' }
      });
    }

    const p = result.rows[0];

    const post = {
      id: p.id,
      original_price: p.original_price,
      price: p.price,
      status: p.status,
      expired_at: p.expired_at,
      created_at: p.created_at,
      scan: {
        image_url: p.scan_image_url,
        veg_type: p.veg_type,
        freshness_score: p.freshness_score,
        freshness_label: getFreshnessLabel(p.freshness_score),
        ai_summary: p.ai_raw_output?.summary ?? null,
      }
    };

    res.json({ success: true, data: post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// PATCH /posts/:id — edit post
router.patch('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { price, status } = req.body;
  const user_id = req.user.id;

  try {
    // check owner
    const check = await pool.query(
      `SELECT p.id FROM posts p
       JOIN shops s ON p.shop_id = s.id
       WHERE p.id = $1 AND s.user_id = $2`,
      [id, user_id]
    );
    if (check.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'ไม่มีสิทธิ์แก้ไข post นี้' }
      });
    }

    const fields = [];
    const values = [];
    let i = 1;

    if (price !== undefined)  { fields.push(`price=$${i++}`);  values.push(price); }
    if (status !== undefined) { fields.push(`status=$${i++}`); values.push(status); }

    if (fields.length === 0) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'no data to edit' }
      });
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE posts SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// DELETE /posts/:id — delete post
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const check = await pool.query(
      `SELECT p.id FROM posts p
       JOIN shops s ON p.shop_id = s.id
       WHERE p.id = $1 AND s.user_id = $2`,
      [id, user_id]
    );
    if (check.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'ไม่มีสิทธิ์ลบ post นี้' }
      });
    }

    await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    res.json({ success: true, data: { message: 'ลบสินค้าเรียบร้อยแล้ว' } });
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