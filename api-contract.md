# ผักชัดเจน — API Contract

**Status**: ✅ Week 7 Complete (MVP)  
**Last Updated**: April 16, 2026

## ข้อตกลงร่วมกัน

- **Base URL**: `http://localhost:5000/api` (dev) | `https://api.phakchatjen.com/api` (production)
- **Authentication**: ทุก request ที่ต้องการ Auth ต้องแนบ Header: `Authorization: Bearer <token>`
- **Response Format**: ทุก response ใช้ format เดียวกัน (ดูด้านล่าง)
- **DateTime**: ใช้ ISO 8601 เสมอ เช่น `"2025-06-01T06:30:00Z"`
- **Money**: ใช้ `number` ทศนิยม 2 ตำแหน่ง (ไม่ใช่ string)
- **Unit System**: ผลิตภัณฑ์รองรับหน่วยต่างๆ (กก., ผลละ, หลาด, ห่อ ฯลฯ)
- **Inventory**: ทุก product มี `quantity` field สำหรับ stock tracking
- **Sold-Out**: เมื่อ quantity = 0 จะแสดง "ขายหมดแล้ว" ทั่วระบบ

---

## Response Format มาตรฐาน

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token หมดอายุหรือไม่ถูกต้อง"
  }
}
```

**Error Codes ที่ใช้:**

| Code | HTTP Status | ความหมาย |
|---|---|---|
| `UNAUTHORIZED` | 401 | ไม่มี token หรือ token ไม่ถูกต้อง |
| `FORBIDDEN` | 403 | มี token แต่ไม่มีสิทธิ์ทำรายการนี้ |
| `NOT_FOUND` | 404 | ไม่พบข้อมูล |
| `VALIDATION_ERROR` | 422 | ข้อมูลที่ส่งมาไม่ครบหรือไม่ถูกรูปแบบ |
| `SERVER_ERROR` | 500 | ข้อผิดพลาดฝั่ง server |

---

## System Health

### `GET /health`
Check backend server status (no auth required)

**Response 200:**
```json
{
  "status": "ok",
  "timestamp": "2025-06-01T12:00:00Z",
  "version": "1.0.0"
}
```

---

## Auth Endpoints

### `POST /auth/register` 🔒
สร้างบัญชีผู้ใช้ใหม่ (role: merchant)

**Request:**
```json
{
  "email": "merchant@example.com",
  "password": "strongpassword123",
  "phone_number": "0812345678"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "u-001",
      "email": "merchant@example.com",
      "phone_number": "0812345678",
      "role": "merchant",
      "created_at": "2025-06-01T08:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation:**
- `email` ต้องไม่ซ้ำกับในระบบ, รูปแบบ email ถูกต้อง
- `password` ต้องมีอย่างน้อย 8 ตัวอักษร

---

### `POST /auth/login`
เข้าสู่ระบบ

**Request:**
```json
{
  "email": "merchant@example.com",
  "password": "strongpassword123"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "u-001",
      "email": "merchant@example.com",
      "role": "merchant"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error 401:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
  }
}
```

---

### `GET /auth/me` (requires auth)
ดึงข้อมูล user ปัจจุบันจาก token (ใช้ตอน frontend check session)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "u-001",
    "email": "merchant@example.com",
    "role": "merchant",
    "shop_id": "s-001"
  }
}
```

> `shop_id` จะเป็น `null` ถ้า merchant ยังไม่ได้ตั้งค่าร้าน

---

## Shop Endpoints

### `POST /shops` (requires auth)
สร้างร้านค้าใหม่ (1 user มีได้ 1 ร้าน)

**Request:**
```json
{
  "shop_name": "ป้าแดงผักสด",
  "shop_address": "ตลาดนัดจตุจักร ซอย 10 กรุงเทพฯ",
  "description": "ผักสดจากไร่ ส่งตรงทุกเช้า",
  "shop_image_url": "https://res.cloudinary.com/...",
  "latitude": 13.7996,
  "longitude": 100.5499,
  "opening_hours": {
    "mon": { "open": "05:00", "close": "13:00" },
    "tue": { "open": "05:00", "close": "13:00" },
    "wed": { "open": "05:00", "close": "13:00" },
    "thu": { "open": "05:00", "close": "13:00" },
    "fri": { "open": "05:00", "close": "13:00" },
    "sat": { "open": "05:00", "close": "14:00" },
    "sun": null
  }
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "s-001",
    "user_id": "u-001",
    "shop_name": "ป้าแดงผักสด",
    "shop_address": "ตลาดนัดจตุจักร ซอย 10 กรุงเทพฯ",
    "description": "ผักสดจากไร่ ส่งตรงทุกเช้า",
    "shop_image_url": "https://res.cloudinary.com/...",
    "latitude": 13.7996,
    "longitude": 100.5499,
    "rating": null,
    "opening_hours": { ... },
    "created_at": "2025-06-01T08:00:00Z"
  }
}
```

---

### `GET /shops/:id`
ดูข้อมูลร้านค้าพร้อม posts ที่ active อยู่ (Consumer ใช้ดูหน้าร้าน)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "s-001",
    "shop_name": "ป้าแดงผักสด",
    "shop_address": "ตลาดนัดจตุจักร ซอย 10 กรุงเทพฯ",
    "description": "ผักสดจากไร่ ส่งตรงทุกเช้า",
    "shop_image_url": "https://res.cloudinary.com/...",
    "latitude": 13.7996,
    "longitude": 100.5499,
    "rating": 4.8,
    "is_open_now": true,
    "opening_hours": { ... },
    "posts": [
      {
        "id": "p-001",
        "category_id": 1,
        "original_price": 35.00,
        "price": 30.00,
        "quantity": 5,
        "unit": "กก.",
        "status": "active",
        "description": "ผักกาดขาวสดสะอาด",
        "ai_analysis": "ผักกาดขาวอยู่ในสภาพดี มีรอยช้ำเล็กน้อย",
        "expired_at": "2025-06-02T13:00:00Z",
        "image_url": "https://res.cloudinary.com/...",
        "freshness_score": 85.0,
        "freshness_label": "สด",
        "created_at": "2025-06-01T06:45:00Z"
      }
    ]
  }
}
```

> `freshness_label` คำนวณจาก `freshness_score` ตามตารางที่ด้านล่าง
> `quantity = 0` จะแสดง "ขายหมดแล้ว" ที่ frontend

---

### `PATCH /shops/:id` (requires auth)
แก้ไขข้อมูลร้าน (เจ้าของร้านเท่านั้น)

**Request:** (ส่งเฉพาะ field ที่ต้องการเปลี่ยน)
```json
{
  "shop_name": "ป้าแดงผักสดใหม่",
  "opening_hours": {
    "sun": { "open": "06:00", "close": "12:00" }
  }
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "s-001",
    "shop_name": "ป้าแดงผักสดใหม่",
    ...
  }
}
```

---

### `GET /shops/nearby`
ดูร้านที่เปิดอยู่ในรัศมีที่กำหนด (Consumer ใช้กับ Map)

**Query Parameters:**

| Param | Type | Required | Description |
|---|---|---|---|
| `lat` | float | ✅ | latitude ของผู้ใช้ |
| `lng` | float | ✅ | longitude ของผู้ใช้ |
| `radius` | int | ✅ | รัศมี (เมตร) เช่น 1000, 3000 |
| `veg_type` | string | ❌ | กรองตามประเภทผัก เช่น "มะเขือเทศ" |

**ตัวอย่าง:** `GET /shops/nearby?lat=13.7996&lng=100.5499&radius=2000&veg_type=มะเขือเทศ`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "s-001",
      "shop_name": "ป้าแดงผักสด",
      "shop_image_url": "https://res.cloudinary.com/...",
      "latitude": 13.7996,
      "longitude": 100.5499,
      "distance_meters": 320,
      "is_open_now": true,
      "min_price": 24.00,
      "post_count": 2,
      "preview_image_url": "https://res.cloudinary.com/..."
    }
  ]
}
```

> `preview_image_url` คือรูปของสินค้าที่ match `veg_type` ที่ filter — ใช้แสดงบน Marker บนแผนที่
> ถ้าไม่ได้ filter `veg_type` ให้ใช้รูปสินค้าแรกของร้านแทน

---

## Scan Endpoints

### `POST /scans` (requires auth)
ส่งรูปผักให้ AI วิเคราะห์และคำนวณราคาแนะนำ

**Request (multipart/form-data):**

| Field | Type | Required | Description |
|---|---|---|---|
| `image` | File | ✅ | ไฟล์รูปภาพ (jpg, png, webp) |
| `veg_type` | string | ✅ | ประเภทผัก เช่น "ผักกาดขาว" |
| `original_price` | number | ✅ | ราคาตั้งต้นก่อนลด |

**Response 201:**
```json
{
  "success": true,
  "data": {
    "scan_id": "vs-001",
    "image_url": "https://res.cloudinary.com/...",
    "veg_type": "ผักกาดขาว",
    "freshness_score": 85.0,
    "freshness_label": "สด",
    "ai_summary": "ผักกาดขาวอยู่ในสภาพดี มีรอยช้ำเล็กน้อยที่ใบนอก ควรขายภายใน 1-2 วัน",
    "estimated_shelf_life_days": 2,
    "recommended_discount_percent": 15,
    "recommended_price": 29.75,
    "original_price": 35.00
  }
}
```

> Backend ทำหน้าที่: Upload Cloudinary → ส่งรูป + veg_type ให้ AI → parse response → คำนวณ recommended_price → return ให้ frontend พร้อมใช้
> Frontend ไม่ต้องคำนวณราคาเอง รับค่ามาแสดงได้เลย

**Depreciation Formula ที่ใช้:**
```
recommended_price = original_price × (1 - recommended_discount_percent / 100)
```

---

## Post Endpoints

### `POST /posts` (requires auth)
ลงขายสินค้า (หลังจาก scan แล้ว merchant กด confirm)

**Request:**
```json
{
  "shop_id": "s-001",
  "category_id": 1,
  "basePrice": 35.00,
  "quantity": 5,
  "unit": "กก.",
  "description": "ผักกาดขาวสดสะอาดจากสวน",
  "ai_analysis": "ผักกาดขาว: สด 85%, มีรอยช้ำเล็กน้อย, ควรขาย 1-2 วัน",
  "image_url": "https://res.cloudinary.com/...",
  "expired_at": "2025-06-02T13:00:00Z"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "p-001",
    "shop_id": "s-001",
    "category_id": 1,
    "original_price": 35.00,
    "price": 35.00,
    "quantity": 5,
    "unit": "กก.",
    "description": "ผักกาดขาวสดสะอาดจากสวน",
    "ai_analysis": "ผักกาดขาว: สด 85%, มีรอยช้ำเล็กน้อย, ควรขาย 1-2 วัน",
    "image_url": "https://res.cloudinary.com/...",
    "freshness_score": 85.0,
    "freshness_label": "สด",
    "status": "active",
    "created_at": "2025-06-01T06:45:00Z",
    "expired_at": "2025-06-02T13:00:00Z"
  }
}
```

**Validation:**
- `quantity` ต้องมากกว่า 0
- `unit` ต้องอยู่ในรายการ UNITS ที่ backend กำหนด (กก., ผลละ, หลาด, ห่อ, etc.)
- `category_id` ต้องเป็น category ที่มีในระบบ
- `basePrice` ต้องมากกว่า 0

---

### `GET /posts/my-shop` (requires auth)
ดู posts ทั้งหมดของร้านตัวเอง (Merchant ใช้ในหน้า My Products/Dashboard)

**Query Parameters:**

| Param | Type | Required | Description |
|---|---|---|---|
| `status` | string | ❌ | `active`, `sold`, `expired` หรือไม่ส่งเพื่อดูทั้งหมด |

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "p-001",
      "category_id": 1,
      "category_name": "ผักสลัด",
      "original_price": 35.00,
      "price": 30.00,
      "quantity": 5,
      "unit": "กก.",
      "description": "ผักกาดขาวสดสะอาดจากสวน",
      "ai_analysis": "ผักกาดขาว: สด 85%, มีรอยช้ำเล็กน้อย",
      "image_url": "https://res.cloudinary.com/...",
      "freshness_score": 85.0,
      "freshness_label": "สด",
      "status": "active",
      "expired_at": "2025-06-02T13:00:00Z",
      "created_at": "2025-06-01T06:45:00Z"
    }
  ]
}
```

**Status Display:**
- When `quantity = 0` → Frontend displays "ขายหมดแล้ว" overlay on card
- When `quantity > 0` and `status = active` → Normal product card
- When `status = expired` or past expiration time → Display as expired

---

### `PATCH /posts/:id` (requires auth)
แก้ไข post เช่น ปรับราคา, จำนวน, หรือเปลี่ยนสถานะ

**Request:** (ส่งเฉพาะ field ที่ต้องการเปลี่ยน)
```json
{
  "price": 25.00,
  "quantity": 3,
  "unit": "กก.",
  "status": "sold"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "p-001",
    "price": 25.00,
    "quantity": 3,
    "unit": "กก.",
    "status": "sold",
    ...
  }
}
```

**status ที่เปลี่ยนได้:** `active` → `sold` หรือ `active` → `expired`
**Validation:**
- `quantity` ต้องมากกว่าหรือเท่ากับ 0 (0 = ขายหมดแล้ว)
- `unit` ต้องอยู่ในรายการ UNITS ที่กำหนด

---

### `DELETE /posts/:id` (requires auth)
ลบ post (เจ้าของร้านเท่านั้น)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "message": "ลบสินค้าเรียบร้อยแล้ว"
  }
}
```

---

## Favorites Endpoints

### `POST /favorites` (requires auth)
เพิ่มร้านโปรด (Consumer)

**Request:**
```json
{
  "shop_id": "s-001"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "f-001",
    "customer_id": "u-005",
    "shop_id": "s-001",
    "created_at": "2025-06-01T09:00:00Z"
  }
}
```

---

### `DELETE /favorites/:shop_id` (requires auth)
เอาร้านออกจากโปรด

**Response 200:**
```json
{
  "success": true,
  "data": {
    "message": "เอาร้านออกจากรายการโปรดแล้ว"
  }
}
```

---

### `GET /favorites` (requires auth)
ดูรายการร้านโปรดทั้งหมดของ consumer

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "f-001",
      "shop": {
        "id": "s-001",
        "shop_name": "ป้าแดงผักสด",
        "shop_image_url": "https://res.cloudinary.com/...",
        "is_open_now": true,
        "min_price": 24.00
      },
      "created_at": "2025-06-01T09:00:00Z"
    }
  ]
}
```

---

## Agent Endpoints

### `GET /agent/policy/:shop_id` (requires auth)
ดึง policy ปัจจุบันของร้าน (ใช้แสดงใน Agent Settings UI)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "shop_id": "s-001",
    "active": true,
    "max_discount": 30,
    "auto_approve": false
  }
}
```

> ถ้าร้านยังไม่เคยตั้ง policy จะ return ค่า default: `active: false`, `max_discount: 30`, `auto_approve: false`

---

### `POST /agent/policy/:shop_id` (requires auth)
บันทึก policy ของร้าน (เจ้าของร้านเท่านั้น)

**Request:**
```json
{
  "active": true,
  "max_discount": 40,
  "auto_approve": false
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "shop_id": "s-001",
    "active": true,
    "max_discount": 40,
    "auto_approve": false
  }
}
```

**Validation:**
- `max_discount` ต้องอยู่ระหว่าง 1–80 (%)
- `auto_approve: true` ได้ก็ต่อเมื่อ `active: true` เท่านั้น

---

### `GET /agent/actions/:shop_id` (requires auth)
ดู action log ของ agent ทั้งหมดของร้าน (ใช้ใน Activity Feed UI)

**Query Parameters:**

| Param | Type | Required | Description |
|---|---|---|---|
| `status` | string | ❌ | `executed`, `pending`, `rejected` หรือไม่ส่งเพื่อดูทั้งหมด |

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "aa-001",
      "post_id": "p-001",
      "action_type": "price_update",
      "old_value": { "price": 30.00 },
      "new_value": { "price": 22.00 },
      "reason": "เหลือเวลา 1.5 ชั่วโมงก่อนปิดร้าน และ freshness_score อยู่ที่ 52 แนะนำลดราคา 27% เพื่อเร่งขาย",
      "status": "pending",
      "created_at": "2025-06-01T11:00:00Z",
      "post_snapshot": {
        "veg_type": "ผักกาดขาว",
        "image_url": "https://res.cloudinary.com/...",
        "freshness_score": 52.0,
        "freshness_label": "ใกล้หมด"
      }
    }
  ]
}
```

> `post_snapshot` คือข้อมูลสินค้า ณ เวลาที่ agent ตัดสินใจ — ใช้แสดงใน Activity Feed ให้เจ้าของร้านเห็น context ก่อน Approve/Reject

---

### `PATCH /agent/actions/:id` (requires auth)
Approve หรือ Reject action ที่ agent รอ confirm (เจ้าของร้านเท่านั้น)

**Request:**
```json
{
  "status": "executed"
}
```

> `status` ที่ส่งได้: `executed` (Approve) หรือ `rejected` (Reject)
> สามารถ patch ได้เฉพาะ action ที่มี `status: "pending"` เท่านั้น

**Response 200 (Approve):**
```json
{
  "success": true,
  "data": {
    "id": "aa-001",
    "status": "executed",
    "post_id": "p-001"
  }
}
```

> เมื่อ `status` เปลี่ยนเป็น `executed` — backend จะ PATCH `/posts/:id` ทันทีเพื่อ apply การเปลี่ยนแปลงจริง

---

## freshness_label Logic

Backend คำนวณ `freshness_label` จาก `freshness_score` ตามนี้เสมอ:

| Score | Label | Badge Color |
|---|---|---|
| 75 – 100 | สด | Green |
| 50 – 74 | ใกล้หมด | Yellow |
| 0 – 49 | ควรเร่งขาย | Red |

> Frontend ไม่ต้องคำนวณเอง รับ `freshness_label` จาก backend แล้วแสดง badge ตาม label ได้เลย

---

## Product Unit System

### Supported Units (หน่วยสินค้า)

Product สามารถใช้หน่วยต่างๆ ได้ตามนี้:

| Unit | Description | Example |
|---|---|---|
| `กก.` | กิโลกรัม | "2 กก." |
| `ผลละ` | ราคาต่อผล | "20 บาทต่อผล" |
| `หลาด` | มัด/ชั่ง | "1 หลาด" |
| `ห่อ` | ห่อ (Wrapping) | "1 ห่อ" |
| `แพค` | แพค | "1 แพค" |
| `โหล` | โหล (12 ชิ้น) | "1 โหล" |

### Unit Display Rules

- Backend ส่ง `unit` field ใน ทุก product response
- Frontend แสดง unit ด้วย format: `{quantity} {unit}` (เช่น: "5 กก.", "12 ผลละ")
- ถ้า product ไม่มี unit ข้อมูล ให้ใช้ค่า default `"กก."`
- Unit ไม่สามารถเปลี่ยนได้หลังจาก product ถูก created (read-only)

---

## Inventory & Sold-Out System

### Quantity Tracking

- **Field**: `quantity` (integer ≥ 0)
- **Update via**: `PATCH /posts/:id` endpoint
- **Display Logic**:
  - `quantity > 0` → Show product normally with `"{quantity} {unit}"` label
  - `quantity = 0` → Show "ขายหมดแล้ว" (sold-out) overlay on product card (ทั้ง MapPage, StoreDetailPage, Dashboard)
  - Product card shows visual overlay at 80% opacity when sold-out

### Sold-Out Badge

Frontend displays "ขายหมดแล้ว" badge in these pages when `quantity == 0`:
- Dashboard / My Products page
- Store Detail page (shop grid)
- Map page (product list)
- Favorites page

---

## Responsive Design Endpoints

### Frontend Expectations

**Mobile-First Approach (320px+):**
- All list endpoints return same data regardless of screen size
- Frontend handles responsive layout/display
- No separate mobile endpoints needed

**Viewport Optimization:**
- Mobile (320-767px): Compact layouts, single column
- Tablet (768-1023px): 2-column grid layouts
- Desktop (1024px+): Multi-column, full-featured layouts

### Data Consistency

- All endpoints return complete data objects
- Frontend uses responsive CSS/Tailwind for layout
- No truncation or modification of data based on device type
- Image URLs returned are full quality — let frontend handle responsive images via CSS

### Product Images

- Return full-resolution image URLs from Cloudinary
- Frontend applies responsive sizing with CSS
- No server-side image manipulation needed
- Example: Frontend shows `h-48 md:h-auto` for responsive heights

---

## Agent System Integration (Week 7)

### Product Aging & Automation

Agent system monitors products and can recommend actions based on:
- **Freshness decay**: Product freshness_score decreases over time
- **Time-based rules**: Hours remaining before shop closes or product expires
- **Inventory pressure**: Low-quantity products nearing expiration

### Agent Endpoints Already Documented

See **Agent Endpoints** section above for:
- `/agent/policy/:shop_id` — Set automation rules
- `/agent/actions/:shop_id` — View action recommendations
- `PATCH /agent/actions/:id` — Approve/reject recommendations

---

## Cloudinary Upload (Frontend Direct Upload)

หน้า Add Product ให้ frontend upload รูปไปที่ Cloudinary โดยตรง (unsigned upload) แล้วส่งแค่ URL มาใน POST/PATCH request

```
รูปร้าน/สินค้า:  Frontend → Cloudinary → URL → POST/PATCH /posts
```

Backend ใช้ URL ที่ส่งมาแสดง image แล้ว

---

## Error Handling & Status Codes

| HTTP Status | Meaning | Example |
|---|---|---|
| 200 | Success (GET/PATCH/DELETE) | Data updated successfully |
| 201 | Created (POST) | New resource created |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | User doesn't have permission |
| 404 | Not Found | Resource doesn't exist |
| 422 | Validation Error | Invalid data format |
| 500 | Server Error | Backend error |

### Common Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "quantity ต้องมากกว่า 0",
    "field": "quantity"
  }
}
```

---

## Pagination (if applicable)

List endpoints (e.g., `/posts/my-shop`, `/shops/nearby`) may return paginated results:

**Query Parameters:**
```
?page=1&limit=20
```

**Response includes:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

---

## Version & Support

- **Last Updated**: April 1, 2026
- **Frontend**: React 19 + Vite 7 + Tailwind CSS v4
- **Backend**: Node.js 18+ + Express 5
