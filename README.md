# Phak-Chat-Jen

A modern full-stack web application built with **React + Vite + Tailwind CSS** (frontend) and **Node.js + Express** (backend), featuring integrations with **Qwen VL Max (Alibaba DashScope)**, **Google Maps API**, **Cloudinary**, and **PostgreSQL + PostGIS (Render)**.

---

## Project Structure

```
Phak-Chat-Jen/
├── client/                      # Frontend (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── CustomerNavbar.jsx
│   │   │   └── MerchantNavbar.jsx
│   │   ├── contexts/
│   │   │   ├── AppContext.jsx          React Context (shared state)
│   │   │   ├── AuthContext.jsx         Authentication context
│   │   │   └── ProtectedRoute.jsx      Route guard
│   │   ├── pages/
│   │   │   ├── HomePage.jsx            /
│   │   │   ├── ChatPage.jsx            /chat
│   │   │   ├── MapPage.jsx             /map
│   │   │   ├── LoginRegisterPage.jsx   /login
│   │   │   ├── MyProductsPage.jsx      /dashboard
│   │   │   └── StoreDetailPage.jsx     /shops/:id
│   │   ├── services/
│   │   │   └── api.js                  Axios base config
│   │   ├── App.jsx                     Router + Layout
│   │   ├── App.css
│   │   ├── main.jsx                    Entry point
│   │   └── index.css                   Tailwind CSS
│   ├── .env                            Frontend env vars
│   └── vite.config.js                  Vite + Tailwind + Proxy
│
├── server/                      # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js             PostgreSQL connection (DATABASE_URL)
│   │   │   └── cloudinary.js           Cloudinary config
│   │   ├── db/
│   │   │   ├── migrate.js              Migration runner
│   │   │   └── migrations/
│   │   │       ├── 01_create_tables.sql
│   │   │       ├── 02_enable_postgis.sql
│   │   │       └── 03_agent_tables.sql
│   │   ├── middleware/
│   │   │   └── auth.js                 JWT authentication middleware
│   │   ├── routes/
│   │   │   ├── auth.js                 Auth (register / login)
│   │   │   ├── shops.js                Shops CRUD
│   │   │   ├── posts.js                Posts CRUD
│   │   │   ├── scans.js                Vegetable scan (Qwen VL Max)
│   │   │   ├── maps.js                 Google Maps API
│   │   │   └── upload.js               Cloudinary upload
│   │   ├── utils/
│   │   │   ├── isOpenNow.js            Business hours helper
│   │   │   └── isOpenNow.test.js
│   │   └── index.js                    Express server
│   ├── test-scan.js                    Manual scan test script
│   ├── .env                            Backend env vars
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 19, Vite 7, Tailwind CSS v4       |
| Backend    | Node.js, Express 5                      |
| Database   | PostgreSQL + PostGIS (Render)           |
| AI Vision  | Qwen VL Max (Alibaba DashScope)         |
| Auth       | JWT (jsonwebtoken)                      |
| Maps       | Google Maps Platform                    |
| Storage    | Cloudinary (Image Upload)               |

---

## Quick Start

### 1. Prerequisites

- **Node.js** 18+
- **PostgreSQL** database with PostGIS extension (Render)
- **API Keys**: Alibaba DashScope, Google Maps, Cloudinary

### 2. Setup Environment Variables

**Backend** (`server/.env`):
```env
# Server
PORT=5000
NODE_ENV=development

# PostgreSQL
DATABASE_URL=your_database_url_here

# JWT
JWT_SECRET=your_jwt_secret_here

# Alibaba DashScope (Qwen VL Max)
DASHSCOPE_API_KEY=your_dashscope_api_key_here

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_cloudinary_api_key_here
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here
```

**Frontend** (`client/.env`):
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 3. Install Dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 4. Run Database Migrations

```bash
cd server
npm run db:migrate
```

### 5. Run the Application

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

---

## License

ISC
