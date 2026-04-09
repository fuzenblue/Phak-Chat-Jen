import cron from 'node-cron';
import pool from '../config/database.js';
import { isOpenNow } from '../utils/isOpenNow.js';

const QWEN_API_KEY = process.env.QWEN_API_KEY;

// เพิ่มบรรทัดนี้ท้ายไฟล์ก่อน startAgentLoop
export async function runAgentOnce() {
  console.log('[Agent] manual trigger:', new Date().toISOString());
  await runAgentLoop();
}

// run every 1 hour
export function startAgentLoop() {
  cron.schedule('0 * * * *', async () => {
    console.log('[Agent] loop started:', new Date().toISOString());
    await runAgentLoop();
  });
  console.log('[Agent] loop scheduled — runs every hour');
}

async function runAgentLoop() {
  try {
    // get all shops that agent active
    const { rows: policies } = await pool.query(
      'SELECT * FROM agent_policies WHERE active = true'
    );

    for (const policy of policies) {
      try {
        await processShop(policy);
      } catch (err) {
        console.error(`[Agent] shop error (shop_id=${policy.shop_id}):`, err.message);
      }
    }
  } catch (err) {
    console.error('[Agent] loop error:', err.message);
  }
}

async function processShop(policy) {
  const { shop_id, max_discount, auto_approve } = policy;

  // ดึง shop info + active posts
  const { rows: shops } = await pool.query(
    'SELECT * FROM shops WHERE id = $1', [shop_id]
  );
  if (shops.length === 0) return;
  const shop = shops[0];

  // skip if shop is closed
  if (!isOpenNow(shop.opening_hours)) return;

  const { rows: posts } = await pool.query(
    `SELECT p.*, vs.freshness_score, vs.veg_type, vs.ai_raw_output
     FROM posts p
     LEFT JOIN vegetable_scans vs ON p.scan_id = vs.id
     WHERE p.shop_id = $1 AND p.status = 'active'`,
    [shop_id]
  );

  if (posts.length === 0) return;

  // get last 10 actions as memory
  const { rows: recentActions } = await pool.query(
    `SELECT action_type, new_value, reason, created_at
     FROM agent_actions
     WHERE shop_id = $1
     ORDER BY created_at DESC LIMIT 10`,
    [shop_id]
  );

  // send to AI decision
  const decisions = await askAgent({ shop, posts, recentActions, max_discount });
  if (!decisions?.length) return;

  // save + execute
  for (const decision of decisions) {
    const post = posts.find(p => p.id === decision.post_id);
    if (!post) continue;

    const withinPolicy = decision.action_type === 'price_update'
      ? ((post.original_price - decision.new_price) / post.original_price * 100) <= max_discount
      : true;

    const status = (auto_approve && withinPolicy) ? 'executed' : 'pending';

    // save action
    await pool.query(
      `INSERT INTO agent_actions (shop_id, post_id, action_type, old_value, new_value, reason, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        shop_id,
        decision.post_id,
        decision.action_type,
        JSON.stringify({ price: post.price }),
        JSON.stringify({ price: decision.new_price }),
        decision.reason,
        status,
      ]
    );

    // if auto_approve apply immediately
    if (status === 'executed') {
      if (decision.action_type === 'price_update') {
        await pool.query('UPDATE posts SET price = $1 WHERE id = $2', [decision.new_price, decision.post_id]);
      }
      if (decision.action_type === 'mark_sold_out') {
        await pool.query('UPDATE posts SET status = $1 WHERE id = $2', ['sold', decision.post_id]);
      }
    }

    console.log(`[Agent] shop=${shop_id} action=${decision.action_type} status=${status}`);
  }
}

async function askAgent({ shop, posts, recentActions, max_discount }) {
  const prompt = `
คุณคือ AI agent ดูแลร้านผักชื่อ "${shop.shop_name}"
เวลาปัจจุบัน: ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}

สินค้าที่ active อยู่:
${posts.map(p => `- id: ${p.id}, ผัก: ${p.veg_type}, ราคาปัจจุบัน: ${p.price}, ราคาตั้งต้น: ${p.original_price}, ความสด: ${p.freshness_score}/100`).join('\n')}

action ล่าสุดของร้านนี้:
${recentActions.length ? recentActions.map(a => `- ${a.action_type}: ${JSON.stringify(a.new_value)} เพราะ "${a.reason}"`).join('\n') : 'ยังไม่มี'}

กฎ: ลดราคาได้สูงสุด ${max_discount}% จากราคาตั้งต้น

วิเคราะห์และตัดสินใจว่าควร action อะไร ตอบเป็น JSON array เท่านั้น:
[
  {
    "post_id": "...",
    "action_type": "price_update" | "mark_sold_out" | "none",
    "new_price": <number หรือ null ถ้าไม่ใช่ price_update>,
    "reason": "<เหตุผลสั้นๆ ภาษาไทย>"
  }
]
ถ้าไม่ต้อง action อะไรให้คืน []
`;

  const response = await fetch('https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${QWEN_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'qwen-vl-max',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    })
  });

  const data = await response.json();
  const text = data.choices[0].message.content;
  const cleaned = text.replace(/```json|```/g, '').trim();

  try {
    const decisions = JSON.parse(cleaned);
    // filter only not none
    return decisions.filter(d => d.action_type !== 'none');
  } catch {
    console.error('[Agent] parse error:', cleaned);
    return [];
  }
}

