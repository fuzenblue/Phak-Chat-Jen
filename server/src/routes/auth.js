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
  const { email, password, role } = req.body;

  // 1) Validate required fields
  if (!email || !password || !role) {
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
  const time = new Date().toLocaleTimeString();

  // 1) ตรวจสอบค่าว่าง
  if (!email || !password) {
    console.log(`❌ [LOGIN STEP 1] (${time}): Missing email or password`);
    return res.status(400).json({ message: "กรุณากรอกอีเมลและรหัสผ่าน" });
  }

  try {
    console.log(`\n--- [LOGIN STEP 1] (${time}): Start attempt for: ${email} ---`);

    // 2) ค้นหา User ใน Database
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (rows.length === 0) {
      console.log(`❌ [LOGIN STEP 2]: User not found: ${email}`);
      return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }

    const user = rows[0]; // ประกาศตรงนี้ก่อนถึงจะเรียกใช้ user.id ได้
    console.log(`--- [LOGIN STEP 2]: Found User ID: ${user.id} ---`);

    // 3) ตรวจสอบรหัสผ่าน (ห้ามลืมดัก if !isMatch นะครับ!)
    console.log("--- [LOGIN STEP 3]: Comparing password ---");
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      console.log(`❌ [LOGIN STEP 3]: Wrong password for ${email}`);
      return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }

    // 4) สร้าง Token เมื่อผ่านทุกด่านแล้ว
    console.log("--- [LOGIN STEP 4]: Generating JWT Token ---");
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // 5) ส่งข้อมูลกลับ (ลบ password_hash ออก)
    const { password_hash: _pw, ...userWithoutPassword } = user;

    console.log(`✅ [LOGIN STEP 5]: Login SUCCESS for User: ${email}`);
    return res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error("🔥 [LOGIN ERROR]:", error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
});

export default router;