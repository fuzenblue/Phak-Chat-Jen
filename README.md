# Phak-Chat-Jen

A modern full-stack e-commerce web application for fresh vegetable farmers and consumers in Thailand. Built with **React + Vite + Tailwind CSS** (frontend) and **Node.js + Express** (backend), featuring AI-powered vegetable freshness analysis, Google Maps integration, real-time inventory management, and a sophisticated agent loop system.

**Status**: ✅ MVP Complete - Week 7 Integration Finished

---

## 🌟 Key Features

### For Consumers 🛍️
- **Interactive Map** — Discover nearby vegetable shops with Google Maps integration
- **Smart Filtering** — Filter by category, price range, distance, and shop status
- **Product Discovery** — Browse shop products with freshness scores and AI analysis
- **DetailedView** — See product freshness analysis, pricing, quantity, and descriptions
- **Favorites** — Save preferred shops for quick access
- **Responsive Design** — Fully optimized for mobile (320px+), tablet, and desktop

### For Merchants 👨‍🌾
- **Shop Management** — Setup store information, location pinning, and business hours
- **Multi-Step Product Upload** — Intuitive 4-step wizard with AI-powered analysis
- **AI Freshness Detection** — Qwen VL Max analyzes vegetable freshness from photos
- **Inventory Management** —Add/edit products with unit system and stock tracking
- **Dashboard** — Monitor products, sold-out status, and sales activity
- **Responsive Admin Interface** — Seamless experience across all devices

### System Features 🤖
- **Agent Loop System** — Automated system for processing and optimizing operations
- **Role-Based Access** — Separate customer and merchant interfaces with authentication
- **Real-Time Inventory** — Track product quantities with sold-out indicators ("ขายหมดแล้ว")
- **Geolocation** — Calculate distances with PostGIS integration
- **Image Optimization** — Cloudinary CDN for fast image delivery
- **Persistent Storage** — PostgreSQL with PostGIS for spatial queries

---

## Project Structure

```
Phak-Chat-Jen/
├── client/                          # Frontend (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── CustomerNavbar.jsx          # Customer navigation bar (responsive)
│   │   │   ├── MerchantNavbar.jsx          # Merchant navigation bar (responsive)
│   │   │   ├── FilterPanel.jsx             # Map filter controls (responsive)
│   │   │   ├── ProductCard.jsx             # Product display card with freshness
│   │   │   ├── StatusBadge.jsx             # Product status indicator
│   │   │   └── FreshnessBar.jsx            # Freshness score visualization
│   │   ├── contexts/
│   │   │   ├── AppContext.jsx              # Shared application state
│   │   │   ├── AuthContext.jsx             # Authentication & user context
│   │   │   └── ProtectedRoute.jsx          # Route protection by role
│   │   ├── pages/
│   │   │   ├── HomePage.jsx                # /          – Landing page
│   │   │   ├── LoginRegisterPage.jsx       # /login     – Auth page
│   │   │   ├── MapPage.jsx                 # /map       – Store discovery map (responsive)
│   │   │   ├── StoreDetailPage.jsx         # /shops/:id – Shop info & products(responsive modal)
│   │   │   ├── MyProductsPage.jsx          # /dashboard – Merchant products list
│   │   │   ├── AddProduct.jsx              # /add-product – Multi-step product upload
│   │   │   ├── EditProductPage.jsx         # /products/:id/edit – Product editing
│   │   │   ├── FavoritesPage.jsx           # /favorites – Saved shops list
│   │   │   ├── CustomerProfilePage.jsx     # /profile – Customer profile settings
│   │   │   ├── StoreSetup.jsx              # /store-setup – Merchant onboarding
│   │   │   ├── AgentActivityPage.jsx       # /agent-activity – Agent monitoring
│   │   │   └── AgentSettingsPage.jsx       # /agent-settings – System configuration
│   │   ├── services/
│   │   │   └── api.js                      # Axios instance with base URL & auth headers
│   │   ├── constants.js                    # CATEGORIES array & shared constants
│   │   ├── App.jsx                         # Router setup & layout
│   │   ├── main.jsx                        # Vite entry point
│   │   └── index.css                       # Tailwind CSS configuration
│   ├── .env                                # Frontend env (VITE_GOOGLE_MAPS_API_KEY)
│   ├── vite.config.js                      # Vite + Tailwind CSS + API proxy
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                          # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js                 # PostgreSQL connection (DATABASE_URL)
│   │   │   └── cloudinary.js               # Cloudinary API configuration
│   │   ├── db/
│   │   │   ├── migrate.js                  # Migration runner
│   │   │   └── migrations/
│   │   │       ├── 01_create_tables.sql    # Core tables (users, shops, posts, etc)
│   │   │       ├── 02_enable_postgis.sql   # PostGIS extension
│   │   │       └── 03_agent_tables.sql     # Agent system tables
│   │   ├── middleware/
│   │   │   └── auth.js                     # JWT verification middleware
│   │   ├── routes/
│   │   │   ├── auth.js                     # /api/auth – register, login
│   │   │   ├── shops.js                    # /api/shops – shop CRUD
│   │   │   ├── posts.js                    # /api/posts – product CRUD
│   │   │   ├── scans.js                    # /api/scans – AI vegetable analysis
│   │   │   ├── maps.js                     # /api/maps – location queries
│   │   │   ├── upload.js                   # /api/upload – Cloudinary upload
│   │   │   ├── favorites.js                # /api/favorites – saved shops
│   │   │   └── agent.js                    # /api/agent – agent system
│   │   ├── agent/
│   │   │   └── loop.js                     # Agent loop orchestration
│   │   ├── utils/
│   │   │   └── isOpenNow.js                # Business hours check utility
│   │   └── index.js                        # Express server entry point
│   ├── test-scan.js                        # Manual AI scan testing script
│   ├── .env                                # Backend env variables
│   └── package.json
│
├── api-contract.md                  # API documentation & endpoints
├── timeline.md                      # Project progress timeline
└── README.md                        # This file
```

---

## Tech Stack

| Layer      | Technology                              | Purpose |
|------------|--------------------------------------|----|
| **Frontend UI** | React 19, Vite 7, Tailwind CSS v4 | Responsive web interface |
| **Backend API** | Node.js 18+, Express 5 | RESTful API server |
| **State Management** | React Hooks, Context API | Client-side state |
| **Database** | PostgreSQL + PostGIS | Relational data & spatial queries |
| **AI Vision** | Qwen VL Max (Alibaba DashScope) | Vegetable freshness analysis |
| **Authentication** | JWT (jsonwebtoken) | Secure user sessions |
| **Maps** | Google Maps Platform API | Location discovery & display |
| **Image Storage** | Cloudinary CDN | Optimized image delivery |
| **Deployment** | Render (PostgreSQL) | Cloud hosting |

---

## 📱 Responsive Design

All pages and components are **fully responsive** with mobile-first design:

✅ Mobile (320px+) — Optimized layouts, touch-friendly buttons, adaptive spacing
✅ Tablet (768px+) — Medium-sized grids, balanced spacing
✅ Desktop (1024px+) — Full-width layouts, multi-column grids

**Key responsive components:**
- **MapPage** — Adaptive controls, responsive bottom sheet
- **StoreDetailPage** — Flexible product grid, auto-height modal
- **AddProduct** — Mobile-optimized steps, responsive inputs
- **Navbars** — Space-efficient on mobile, full features on desktop
- **FilterPanel** — Collapsible on mobile, full-width on desktop

---

## Key System Features

### 🤖 Agent Loop System
Automated background processes for order processing, inventory optimization, and system maintenance. Located in `server/src/agent/loop.js`.

### ✂️ Freshness Analysis
Qwen VL Max AI analyzes vegetable photos to determine:
- **Freshness Score** (0-100%)
- **Quality Assessment** (AI summary)
- **Recommended Price** (based on condition)
- **Visual Analysis** (detailed description)

### 📍 Geolocation Features
- Real-time user location detection
- Distance calculation using PostGIS
- Shop sorting by proximity
- Map-based discovery

---

## Quick Start

### Prerequisites

- **Node.js** 18+ 
- **PostgreSQL** 13+ with PostGIS extension (can use Render cloud database)
- **API Keys** (free tier available):
  - Alibaba DashScope (Qwen VL Max)
  - Google Maps Platform
  - Cloudinary

### 1. Setup Environment Variables

**Backend** (`server/.env`):
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@host:5432/phak_chat_jen

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_chars

# Alibaba DashScope (Qwen VL Max)
DASHSCOPE_API_KEY=sk-your_dashscope_key_here

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Agent System
AGENT_ENABLED=true
AGENT_INTERVAL=300000
```

**Frontend** (`client/.env`):
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_API_URL=http://localhost:5000/api
```

### 2. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Setup Database

```bash
cd server
npm run db:migrate
```

This will:
- Create all tables (users, shops, posts, favorites, etc.)
- Enable PostGIS extension for spatial queries
- Setup agent system tables

### 4. Run Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

### Health Checks

```bash
# Backend health
curl http://localhost:5000/api/health

# Frontend
open http://localhost:5173
```

---

## 📚 API Documentation

Full API documentation available in **[api-contract.md](api-contract.md)**

### Core Endpoints

**Authentication**
- `POST /api/auth/register` — User registration
- `POST /api/auth/login` — User login

**Shops**
- `GET /api/shops` — List all shops
- `GET /api/shops/:id` — Get shop details
- `POST /api/shops` — Create shop (merchant)
- `PATCH /api/shops/:id` — Update shop

**Products**
- `GET /api/posts` — List all products
- `GET /api/posts?shop_id=X` — Products by shop
- `POST /api/posts` — Add product
- `PATCH /api/posts/:id` — Update product
- `DELETE /api/posts/:id` — Remove product

**AI Scanning**
- `POST /api/scans` — Analyze vegetable photo

**Maps**
- `GET /api/maps/nearby` — Find nearby shops

**Agent**
- `GET /api/agent/status` — Agent system status
- `POST /api/agent/action` — Trigger agent action

---

## Database Schema Highlights

### Core Tables
- **users** — Customers & merchants with roles
- **shops** — Store information, location, hours
- **posts** — Products with unit, quantity, price
- **scans** — AI analysis results cached
- **favorites** — Saved shops by customers

### Spatial Features
- PostGIS geometry for shop locations
- Distance queries using ST_Distance
- Nearby shop filtering

### Agent System
- **agent_policies** — System rules & constraints
- **agent_actions** — Executed automation tasks
- **agent_logs** — Action history & debugging

---

## Known Features & Limitations

✅ **Implemented**
- Multi-role authentication (customer/merchant)
- Product freshness analysis with AI
- Real-time inventory tracking
- Map-based shop discovery
- Agent automation system

🚀 **Future Enhancements**
- Real payment processing integration
- Push notifications for new products
- Advanced analytics dashboard
- Barcode scanning for inventory
- Multi-language support

---

**Last Updated**: April 16, 2026  

