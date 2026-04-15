// server/src/routes/auth.js
import { Router } from "express";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import pool from "../config/database.js";

const router = Router();

// ─────────────────────────────────────────
// POST /register
// ─────────────────────────────────────────
router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;

  // 1) Validate required fields
  if (!email || !password || !role) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: "กรุณากรอกข้อมูลให้ครบทุกช่อง" } });
  }

  // 2) Validate password length (minimum 8 characters)
  if (password.length < 8) {
    return res.status(422).json({ success: false, error: { code: 'VALIDATION_ERROR', message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" } });
  }

  const allowedRoles = ["customer", "merchant"];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: "role ต้องเป็น customer หรือ merchant เท่านั้น" } });
  }

  try {
    // 3) Check duplicate email
    const { rows: existing } = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ success: false, error: { code: 'VALIDATION_ERROR', message: "อีเมลนี้ถูกใช้งานแล้ว" } });
    }

    // 4) Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5) Insert new user
    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash, role)
      VALUES ($1, $2, $3)
      RETURNING id, email, role`,
      [email, hashedPassword, role]
    );

    const user = rows[0];

    // 6) Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(201).json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, role: user.role, created_at: new Date().toISOString() },
        token
      }
    });
  } catch (error) {
    console.error("[POST /register]", error);
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" } });
  }
});

// ─────────────────────────────────────────
// POST /login
// ─────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 1) ตรวจสอบค่าว่าง
  if (!email || !password) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: "กรุณากรอกอีเมลและรหัสผ่าน" } });
  }

  try {
    // 2) ค้นหา User ใน Database
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" } });
    }

    const user = rows[0];

    // 3) ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" } });
    }

    // 4) สร้าง Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // 5) ส่งข้อมูลกลับ
    return res.status(200).json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, role: user.role },
        token
      }
    });

  } catch (error) {
    console.error("[POST /login]", error);
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" } });
  }
});

// ─────────────────────────────────────────
// GET /me — get full profile of logged-in user
// ─────────────────────────────────────────
import jwt from 'jsonwebtoken'; // already imported above, kept for clarity

function getAuthUser(req) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

router.get('/me', async (req, res) => {
  const auth = getAuthUser(req);
  if (!auth) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } });

  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.email, u.role, s.id as shop_id FROM users u
       LEFT JOIN shops s ON u.id = s.user_id
       WHERE u.id = $1`,
      [auth.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('[GET /me]', err);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Server error' } });
  }
});

// ─────────────────────────────────────────
// PATCH /profile — update personal info
// ─────────────────────────────────────────
router.patch('/profile', async (req, res) => {
  const auth = getAuthUser(req);
  if (!auth) return res.status(401).json({ message: 'Unauthorized' });

  const { display_name, avatar_url } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE users
       SET display_name = COALESCE($1, display_name),
           avatar_url   = COALESCE($2, avatar_url),
           updated_at   = now()
       WHERE id = $3
       RETURNING id, email, role, display_name, avatar_url, updated_at`,
      [display_name ?? null, avatar_url ?? null, auth.id]
    );
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('[PATCH /profile]', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─────────────────────────────────────────
// PATCH /password — change password
// ─────────────────────────────────────────
router.patch('/password', async (req, res) => {
  const auth = getAuthUser(req);
  if (!auth) return res.status(401).json({ message: 'Unauthorized' });

  const { current_password, new_password } = req.body;
  if (!current_password || !new_password) {
    return res.status(400).json({ message: 'กรุณากรอกรหัสผ่านให้ครบ' });
  }
  if (new_password.length < 6) {
    return res.status(400).json({ message: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร' });
  }

  try {
    const { rows } = await pool.query('SELECT password_hash FROM users WHERE id = $1', [auth.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!isMatch) return res.status(401).json({ message: 'รหัสผ่านเดิมไม่ถูกต้อง' });

    const hashed = await bcrypt.hash(new_password, 10);
    await pool.query('UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2', [hashed, auth.id]);

    res.json({ success: true, message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
  } catch (err) {
    console.error('[PATCH /password]', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
