import express from 'express';
import pool from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import { isOpenNow } from '../utils/isOpenNow.js';

const router = express.Router();

// GET /v1/favorites — list all favorites for the logged-in user
router.get('/', requireAuth, async (req, res) => {
  const user_id = req.user.id;
  try {
    const result = await pool.query(
      `SELECT
         f.id,
         f.created_at,
         s.id          AS shop_id,
         s.shop_name,
         s.image_url   AS shop_image_url,
         s.opening_hours,
         MIN(p.price)  AS min_price
       FROM favorites f
       JOIN shops s ON f.shop_id = s.id
       LEFT JOIN posts p ON p.shop_id = s.id AND p.status = 'active'
       WHERE f.user_id = $1
       GROUP BY f.id, f.created_at, s.id, s.shop_name, s.image_url, s.opening_hours
       ORDER BY f.created_at DESC`,
      [user_id]
    );

    const favorites = result.rows.map(row => ({
      id: row.id,
      created_at: row.created_at,
      shop: {
        id: row.shop_id,
        shop_name: row.shop_name,
        shop_image_url: row.shop_image_url,
        is_open_now: isOpenNow(row.opening_hours),
        min_price: row.min_price ? parseFloat(row.min_price) : null,
      },
    }));

    res.json({ success: true, data: favorites });
  } catch (err) {
    console.error('[GET /favorites]', err);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// POST /v1/favorites — add a shop to favorites
router.post('/', requireAuth, async (req, res) => {
  const user_id = req.user.id;
  const { shop_id } = req.body;

  if (!shop_id) {
    return res.status(422).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'shop_id is required' } });
  }

  try {
    const result = await pool.query(
      `INSERT INTO favorites (user_id, shop_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, shop_id) DO NOTHING
       RETURNING id, created_at`,
      [user_id, shop_id]
    );

    if (result.rows.length === 0) {
      // Already favorited — return 200 OK (idempotent)
      return res.json({ success: true, message: 'Already favorited' });
    }

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('[POST /favorites]', err);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// DELETE /v1/favorites/:shop_id — remove a shop from favorites
router.delete('/:shop_id', requireAuth, async (req, res) => {
  const user_id = req.user.id;
  const { shop_id } = req.params;

  try {
    await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND shop_id = $2',
      [user_id, shop_id]
    );
    res.json({ success: true, message: 'Removed from favorites' });
  } catch (err) {
    console.error('[DELETE /favorites]', err);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// GET /v1/favorites/check/:shop_id — check if a specific shop is favorited
router.get('/check/:shop_id', requireAuth, async (req, res) => {
  const user_id = req.user.id;
  const { shop_id } = req.params;

  try {
    const result = await pool.query(
      'SELECT id FROM favorites WHERE user_id = $1 AND shop_id = $2',
      [user_id, shop_id]
    );
    res.json({ success: true, data: { is_favorited: result.rows.length > 0 } });
  } catch (err) {
    console.error('[GET /favorites/check]', err);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

export default router;
