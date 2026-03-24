// server/src/routes/auth.js
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";

const router = Router();

// ─────────────────────────────────────────
// POST /register
// ─────────────────────────────────────────
router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  // 1) Validate required fields
  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
  }

  const allowedRoles = ["customer", "merchant"];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: "role ต้องเป็น customer หรือ merchant เท่านั้น" });
  }

  try {
    // 2) Check duplicate email
    const { rows: existing } = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "อีเมลนี้ถูกใช้งานแล้ว" });
    }

    // 3) Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

   // 4) Insert new user
    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash, role)
      VALUES ($1, $2, $3)
      RETURNING id, email, role`, // ลบ username ออกเพราะใน DB ไม่มีช่องนี้
      [email, hashedPassword, role]
    );

    return res.status(201).json({
      message: "สมัครสมาชิกสำเร็จ",
      user: rows[0],
    });
  } catch (error) {
    console.error("[POST /register]", error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
});

// ─────────────────────────────────────────
// POST /login
// ─────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 1) Validate required fields
  if (!email || !password) {
    return res.status(400).json({ message: "กรุณากรอกอีเมลและรหัสผ่าน" });
  }

  try {
    // 2) Find user by email
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }

    const user = rows[0];

    // 3) Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    // 4) Sign JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // 5) Return token + user (exclude password)
    const { password: _pw, ...userWithoutPassword } = user;

    return res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("[POST /login]", error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
});

export default router;