import express from 'express';
import pool from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Policy

// GET /agent/policy/:shop_id
router.get('/policy/:shop_id', requireAuth, async (req, res) => {
  const { shop_id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM agent_policies WHERE shop_id = $1',
      [shop_id]
    );

    // if not set policy return default
    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: {
          shop_id,
          active: false,
          max_discount: 30,
          auto_approve: false,
        }
      });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// POST /agent/policy/:shop_id
router.post('/policy/:shop_id', requireAuth, async (req, res) => {
  const { shop_id } = req.params;
  const { active, max_discount, auto_approve } = req.body;

  // validation
  if (max_discount < 1 || max_discount > 80) {
    return res.status(422).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'max_discount ต้องอยู่ระหว่าง 1-80' }
    });
  }
  if (auto_approve && !active) {
    return res.status(422).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'auto_approve ใช้ได้เฉพาะเมื่อ active เป็น true' }
    });
  }

  try {
    // upsert — if have update if not have insert
    const result = await pool.query(
      `INSERT INTO agent_policies (shop_id, active, max_discount, auto_approve)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (shop_id) 
       DO UPDATE SET active = $2, max_discount = $3, auto_approve = $4
       RETURNING *`,
      [shop_id, active, max_discount, auto_approve]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// Actions

// GET /agent/actions/:shop_id
router.get('/actions/:shop_id', requireAuth, async (req, res) => {
  const { shop_id } = req.params;
  const { status } = req.query;

  try {
    let query = `
      SELECT 
        aa.*,
        vs.image_url  AS post_image_url,
        vs.veg_type,
        vs.freshness_score,
        p.price       AS current_price
      FROM agent_actions aa
      LEFT JOIN posts p  ON aa.post_id = p.id
      LEFT JOIN vegetable_scans vs ON p.scan_id = vs.id
      WHERE aa.shop_id = $1
    `;
    const values = [shop_id];

    if (status) {
      query += ` AND aa.status = $2`;
      values.push(status);
    }

    query += ` ORDER BY aa.created_at DESC`;

    const result = await pool.query(query, values);

    const actions = result.rows.map(a => ({
      id: a.id,
      post_id: a.post_id,
      action_type: a.action_type,
      old_value: a.old_value,
      new_value: a.new_value,
      reason: a.reason,
      status: a.status,
      created_at: a.created_at,
      post_snapshot: {
        veg_type: a.veg_type,
        image_url: a.post_image_url,
        freshness_score: a.freshness_score,
        freshness_label: getFreshnessLabel(a.freshness_score),
        current_price: a.current_price,
      }
    }));

    res.json({ success: true, data: actions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// PATCH /agent/actions/:id — Approve / Reject
router.patch('/actions/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['executed', 'rejected'].includes(status)) {
    return res.status(422).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'status ต้องเป็น executed หรือ rejected เท่านั้น' }
    });
  }

  try {
    // check if action is pending
    const check = await pool.query(
      'SELECT * FROM agent_actions WHERE id = $1',
      [id]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'ไม่พบ action นี้' }
      });
    }
    if (check.rows[0].status !== 'pending') {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'action นี้ไม่ได้อยู่ในสถานะ pending' }
      });
    }

    const action = check.rows[0];

    // if executed → apply the change to post
    if (status === 'executed' && action.action_type === 'price_update') {
      await pool.query(
        'UPDATE posts SET price = $1 WHERE id = $2',
        [action.new_value.price, action.post_id]
      );
    }
    if (status === 'executed' && action.action_type === 'mark_sold_out') {
      await pool.query(
        'UPDATE posts SET status = $1 WHERE id = $2',
        ['sold', action.post_id]
      );
    }

    // update status of action
    const result = await pool.query(
      'UPDATE agent_actions SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
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

// POST /agent/trigger — manual trigger สำหรับทดสอบ
import { runAgentOnce } from '../agent/loop.js';

router.post('/trigger', requireAuth, async (req, res) => {
  try {
    await runAgentOnce();
    res.json({ success: true, data: { message: 'Agent loop triggered' } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

export default router;