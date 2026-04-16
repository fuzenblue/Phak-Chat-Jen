import express from 'express';
import multer from 'multer';
import pool from '../config/database.js';
import cloudinary from '../config/cloudinary.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /descriptions/generate
router.post('/descriptions/generate', requireAuth, upload.single('image'), async (req, res) => {
  const { veg_type, original_price } = req.body;

  if (!req.file) {
    return res.status(422).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'กรุณาแนบรูปภาพ' }
    });
  }

  try {
    // Upload image to Cloudinary
    const imageUrl = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'phakchatjen/descriptions' },
        (err, result) => err ? reject(err) : resolve(result.secure_url)
      );
      stream.end(req.file.buffer);
    });

    // Generate description using Qwen VL
    const description = await generateDescriptionWithQwen(imageUrl, veg_type, original_price);

    res.status(200).json({
      success: true,
      data: {
        description
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

async function generateDescriptionWithQwen(imageUrl, vegType, price) {
  const response = await fetch('https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.QWEN_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'qwen-vl-max',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: imageUrl } },
            {
              type: 'text',
              text: `สร้างคำอธิบายสินค้าสำหรับ ${vegType} ที่มีราคา ฿${price} ต่อหน่วย โดยอธิบายคุณภาพ สภาพความสดใหม่ และข้อดี ซึ่งจะใช้สำหรับรายการสินค้าออนไลน์
              
              ข้อกำหนดสำคัญ (ต้องปฏิบัติตามเสมอ):
              - ความยาวต้องมากกว่าหรือเท่ากับ 150 ตัวอักษร
              - ความยาวต้องไม่เกิน 250 ตัวอักษร
              - หากไม่ตรงตามนี้ ให้แก้ไขให้เป็นไปตามที่กำหนด
              
              ตอบกลับเป็น JSON เท่านั้น:
              {
                "description": "<คำอธิบาย 150-250 ตัวอักษร>"
              }
              
              ห้ามมีข้อความอื่นนอกจาก JSON`
            }
          ]
        }
      ]
    })
  });

  const data = await response.json();
  const text = data.choices[0].message.content;

  // ลบ markdown code block ถ้ามี แล้ว parse JSON
  const cleaned = text.replace(/```json|```/g, '').trim();
  const result = JSON.parse(cleaned);
  return result.description;
}

// POST /scans
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  const { veg_type, original_price } = req.body;
  const user_id = req.user.id;

  if (!req.file) {
    return res.status(422).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'กรุณาแนบรูปภาพ' }
    });
  }

  try {
    // find shop of user
    console.log(`[POST /v1/scans] Checking shop for user ${user_id}`);
    const shopResult = await pool.query('SELECT id FROM shops WHERE user_id = $1', [user_id]);
    if (shopResult.rows.length === 0) {
      console.warn(`[POST /v1/scans] No shop found for user ${user_id}`);
      return res.status(400).json({
        success: false,
        error: { code: 'SHOP_NOT_FOUND', message: 'กรุณาตั้งค่าร้านค้าก่อนใช้งานระบบนี้' }
      });
    }
    const shop_id = shopResult.rows[0].id;

    // 1. Upload image to Cloudinary
    const imageUrl = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'phakchatjen/scans' },
        (err, result) => err ? reject(err) : resolve(result.secure_url)
      );
      stream.end(req.file.buffer);
    });

    // 2. Send image to Qwen VL to analyze
    const aiResult = await analyzeWithQwen(imageUrl, veg_type);

    // 3. Calculate recommended price
    const discount = aiResult.recommended_discount_percent;
    const recommended_price = parseFloat(original_price) * (1 - discount / 100);

    // 4. Save to DB
    const scanResult = await pool.query(
      `INSERT INTO vegetable_scans (shop_id, image_url, veg_type, freshness_score, ai_raw_output)
       VALUES ($1,$2,$3,$4,$5) RETURNING id`,
      [shop_id, imageUrl, veg_type, aiResult.freshness_score, JSON.stringify(aiResult)]
    );

    res.status(201).json({
      success: true,
      data: {
        scan_id: scanResult.rows[0].id,
        image_url: imageUrl,
        veg_type,
        freshness_score: aiResult.freshness_score,
        freshness_label: getFreshnessLabel(aiResult.freshness_score),
        ai_summary: aiResult.summary,
        estimated_shelf_life_days: aiResult.estimated_shelf_life_days,
        recommended_discount_percent: discount,
        recommended_price: Math.round(recommended_price * 100) / 100,
        original_price: parseFloat(original_price),
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

async function analyzeWithQwen(imageUrl, vegType) {
  const response = await fetch('https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.QWEN_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'qwen-vl-max',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: imageUrl } },
            {
              type: 'text',
              text: `วิเคราะห์ความสดของ "${vegType}" ในรูปนี้ แล้วตอบกลับเป็น JSON เท่านั้น ห้ามมีข้อความอื่น:
              {
                "freshness_score": <0-100>,
                "summary": "<สรุปสภาพผักใน 1-2 ประโยค>",
                "estimated_shelf_life_days": <จำนวนวัน>,
                "recommended_discount_percent": <0-80>
              }`
            }
          ]
        }
      ]
    })
  });

  const data = await response.json();
  const text = data.choices[0].message.content;

  // ลบ markdown code block ถ้ามี แล้ว parse JSON
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

function getFreshnessLabel(score) {
  if (score >= 75) return 'สด';
  if (score >= 50) return 'ใกล้หมด';
  return 'ควรเร่งขาย';
}

export default router;