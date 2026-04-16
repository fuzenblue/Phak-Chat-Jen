# Phak-Chat-Jen

A modern full-stack e-commerce web application for fresh vegetable farmers and consumers in Thailand. Built with **React 19 + Vite 7 + Tailwind CSS v4** (frontend) and **Node.js 18+ + Express 5** (backend), featuring AI-powered vegetable freshness analysis (Qwen VL Max), Google Maps integration, real-time inventory management with unit system, and Week 7 automated agent loop system.

**Status**: ✅ **MVP Complete - Week 7 Fully Integrated**  
**Version**: 1.0.0  
**Last Updated**: April 16, 2026

---

## 🌟 Key Features

### For Consumers 🛍️
- **Interactive Map Discovery** — Locate nearby fresh vegetable shops with real-time distance calculation using PostGIS
- **Smart Multi-Filter System** — Filter by product category, price range, distance, and merchant status
- **Product Intelligence** — Browse shop inventory with AI-analyzed freshness scores (0-100%), quality assessments, and recommended pricing
- **Rich Product Details** — View complete product specs including unit type (กก./ผลละ/หลาด/ห่อ/แพค/โหล), stock quantity, freshness analysis, and merchant hours
- **Shop Favorites** — Save preferred shops for quick revisits and comparison
- **Fully Responsive** — Mobile-optimized (320px+), tablet-friendly (768px+), desktop-enhanced (1024px+) with adaptive layouts

### For Merchants 👨‍🌾
- **Complete Shop Setup** — Register store info, set location pin on map, configure business hours (open/closed detection)
- **Intelligent Product Upload Wizard** — 4-step process: photo → AI analysis → unit/quantity → confirmation
- **AI Freshness Science** — Qwen VL Max vision model analyzes photo for freshness, quality grade, and optimal pricing recommendations
- **Inventory Control System** — Add/edit products with 6 unit types, real-time stock management, automatic "ขายหมดแล้ว" (sold-out) display
- **Shop Dashboard** — Monitor all products, view inventory status, track product performance, manage active listings
- **Responsive Merchant Interface** — Full-featured admin experience on mobile, tablet, and desktop

### System Features 🤖
- **Automated Agent Loop** — Background automation for product aging tracking, inventory optimization, and system health monitoring
- **Role-Based Security** — JWT authentication with customer/merchant role separation, protected routes, secure session management
- **Real-Time Inventory System** — Quantity field controls display logic; quantity=0 shows "ขายหมดแล้ว" across all views consistently
- **Geospatial Engine** — PostGIS integration for point-in-polygon shop location, distance radius searches, nearest-shop algorithms
- **CDN Image Delivery** — Cloudinary for automatic image optimization, responsive sizing, and fast global delivery
- **Production Database** — PostgreSQL on Supabase with PostGIS extension, automatic backups, and session pooling

---

## Complete File Structure

## Complete File Structure

```
Phak-Chat-Jen/                          # Root configuration & documentation
├── .env                                # Root env file (git ignored)
├── .gitignore                          # Git ignore rules (root level)
├── package.json                        # Root package (if using monorepo)
├── README.md                           # This file - complete project documentation
├── api-contract.md                     # Full API specification with all endpoints
├── timeline.md                         # Project development timeline (Week 1-7)
├── DEPLOYMENT.md                       # Step-by-step deployment guide (Render + Supabase)
│
├── client/                             # Frontend (React 19 + Vite 7 + Tailwind CSS v4)
│   ├── .env                            # Frontend env variables (VITE_*)
│   ├── .gitignore                      # Client-specific git ignore
│   ├── package.json                    # Frontend dependencies & build scripts
│   ├── package-lock.json               # Locked dependency versions
│   ├── vite.config.js                  # Vite configuration with @tailwindcss/vite plugin
│   ├── eslint.config.js                # ESLint rules for code quality
│   ├── index.html                      # HTML entry point (Google Fonts, Material Icons)
│   ├── README.md                       # Default Vite + React template readme
│   ├── public/                         # Static assets (favicon, vite.svg)
│   │   └── vite.svg
│   │
│   └── src/                            # React source code
│       ├── main.jsx                    # Vite entry point - React root render
│       ├── App.jsx                     # Root component with Router setup
│       ├── index.css                   # Tailwind CSS imports (@tailwind directives)
│       │
│       ├── constants.js                # CATEGORIES array + shared constants
│       │
│       ├── assets/                     # Image/media assets
│       │   └── react.svg
│       │
│       ├── services/
│       │   └── api.js                  # Axios instance with BASE_URL & JWT auth header
│       │
│       ├── contexts/                   # React Context for global state
│       │   ├── AppContext.jsx          # App-wide state (loading, notifications)
│       │   ├── AuthContext.jsx         # Authentication state (user, role, token)
│       │   └── ProtectedRoute.jsx      # Route guard component for role-based access
│       │
│       ├── components/                 # Reusable React components
│       │   ├── CustomerNavbar.jsx      # Main navbar for customers (responsive h-12 md:h-14)
│       │   ├── MerchantNavbar.jsx      # Admin navbar for merchants (responsive h-12 md:h-14)
│       │   ├── FilterPanel.jsx         # Map search/filter controls (collapsible on mobile)
│       │   ├── ProductCard.jsx         # Reusable product display card with freshness badge
│       │   ├── StatusBadge.jsx         # Product status indicator (active/sold-out)
│       │   └── FreshnessBar.jsx        # Visual freshness score bar (0-100%)
│       │
│       └── pages/                      # Route page components (all fully responsive)
│           ├── HomePage.jsx            # /              Landing page with intro
│           ├── LoginRegisterPage.jsx   # /login         Auth form (toggle register/login)
│           ├── MapPage.jsx             # /map           Interactive map with bottom sheet (responsive)
│           ├── StoreDetailPage.jsx     # /shops/:id     Shop detail + product modal (responsive)
│           ├── MyProductsPage.jsx      # /dashboard     Merchant product list (responsive grid)
│           ├── AddProductPage.jsx      # /add-product   4-step product wizard (fully responsive)
│           ├── EditProductPage.jsx     # /products/:id/edit – Edit existing product
│           ├── FavoritesPage.jsx       # /favorites     Customer saved shops gallery
│           ├── CustomerProfilePage.jsx # /profile       Customer account settings
│           ├── StoreSetup.jsx          # /store-setup   Merchant shop onboarding (map pin)
│           ├── AgentActivityPage.jsx   # /agent-activity – Monitor agent loop automation
│           └── AgentSettingsPage.jsx   # /agent-settings – Configure agent behavior
│
└── server/                             # Backend (Node.js 18+ + Express 5)
    ├── .env                            # Backend env variables (DATABASE_URL, JWT_SECRET, API keys)
    ├── .gitignore                      # Server-specific git ignore
    ├── package.json                    # Backend dependencies & npm scripts
    ├── package-lock.json               # Locked dependency versions
    ├── test-scan.js                    # Debug script for testing AI vegetable analysis
    │
    └── src/                            # Express application code
        ├── index.js                    # Express server entry point & route registration
        │
        ├── config/                     # External service configuration
        │   ├── database.js             # PostgreSQL + Supabase connection pool setup
        │   └── cloudinary.js           # Cloudinary image upload API client
        │
        ├── db/                         # Database migrations & initialization
        │   ├── migrate.js              # Migration runner (executes SQL files in order)
        │   └── migrations/             # SQL migration files
        │       ├── 01_create_tables.sql    # Core tables: users, shops, posts, favorites, scans
        │       ├── 02_enable_postgis.sql  # PostGIS extension (for spatial queries)
        │       └── 03_agent_tables.sql    # Agent system: policies, actions, logs
        │
        ├── middleware/                 # Express middleware
        │   └── auth.js                 # JWT verification & user extraction middleware
        │
        ├── routes/                     # API endpoint handlers (8 route files)
        │   ├── auth.js                 # POST /register, POST /login
        │   ├── shops.js                # CRUD endpoints for shop management
        │   ├── posts.js                # CRUD endpoints for products with unit system
        │   ├── scans.js                # POST /scans – Qwen VL Max AI analysis
        │   ├── maps.js                 # GET /nearby – PostGIS distance queries
        │   ├── upload.js               # POST /upload – Cloudinary image upload
        │   ├── favorites.js            # CRUD for customer favorite shops
        │   └── agent.js                # GET /status, action triggers for automation
        │
        ├── agent/                      # Automated agent system
        │   └── loop.js                 # Background process orchestration (Week 7)
        │
        └── utils/                      # Utility functions
            └── isOpenNow.js            # Check if merchant shop is currently open
```

---

## Project Statistics

| Metric | Count | Details |
|--------|-------|---------|
| **Frontend Pages** | 12 | Landing, Login, Map, Store Detail, Dashboard, Add/Edit Product, Favorites, Profile, Setup, Agent×2 |
| **Components** | 6 | Navbar×2, FilterPanel, ProductCard, StatusBadge, FreshnessBar |
| **Contexts** | 3 | AppContext, AuthContext, ProtectedRoute |
| **Backend Routes** | 8 | auth, shops, posts, scans, maps, upload, favorites, agent |
| **Database Tables** | 8+ | users, shops, posts, scans, favorites, agent_policies, agent_actions, agent_logs |
| **Supported Products Units** | 6 | กก. (kg), ผลละ (per piece), หลาด (handfuls), ห่อ (bundles), แพค (packs), โหล (dozens) |
| **API Endpoints** | 40+ | Full list in api-contract.md |
| **Responsive Breakpoints** | 3 | Mobile (320px+), Tablet (768px+), Desktop (1024px+) |

## 🗂️ Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend Framework** | React | 19.2.0 | Dynamic UI rendering with hooks |
| **Frontend Build Tool** | Vite | 7.3.1 | Fast module bundling & HMR |
| **Styling Framework** | Tailwind CSS | 4.1.18 | Utility-first CSS with responsive design |
| **Tailwind Integration** | @tailwindcss/vite | 4.1.18 | Vite plugin for Tailwind (no config file needed) |
| **UI Component Library** | DaisyUI | 5.5.19 | Pre-built Tailwind components |
| **Frontend Routing** | React Router | 7.13.0 | Client-side navigation & protected routes |
| **HTTP Client** | Axios | 1.13.5 | API requests with interceptors (JWT headers) |
| **Maps Integration** | @react-google-maps/api | 2.20.8 | Google Maps embedded library |
| **Backend Framework** | Express | 5.1.0 | RESTful API server |
| **Runtime** | Node.js | 18+ | JavaScript server environment |
| **Database** | PostgreSQL | 13+ | Relational data store (on Supabase) |
| **Geospatial Extension** | PostGIS | 3.x | Spatial queries (distance, geometry) |
| **Database Client** | pg | 8.13.3 | PostgreSQL node driver |
| **Password Hashing** | bcryptjs | 3.0.3 | Secure password encryption |
| **Authentication** | jsonwebtoken | 9.0.3 | JWT token creation & verification |
| **AI Vision Model** | Qwen VL Max | Latest | Alibaba DashScope vegetable analysis |
| **Image Storage** | Cloudinary | 2.9.0 | CDN image hosting & optimization |
| **File Upload** | multer | 2.0.2 | Express multipart form data handling |
| **Task Scheduling** | node-cron | 4.2.1 | Cron-based scheduled tasks (agent loop) |
| **Development** | nodemon | 3.1.9 | Auto-restart on file changes |
| **Environment** | dotenv | 16.4.7 | Load .env variables |
| **Linting** | ESLint | 9.39.1 | Code quality validation |
| **CORS** | cors | 2.8.5 | Cross-origin request handling |
| **Deployment (API)** | Render | - | Backend hosting with Web Service |
| **Deployment (Frontend)** | Render | - | Static site hosting for React build |
| **Deployment (Database)** | Supabase | - | PostgreSQL + PostGIS on cloud |

## Frontend Dependencies (client/package.json)

**Core**
- `react@19.2.0` - UI library
- `vite@7.3.1` - Build tool
- `react-dom@19.2.0` - DOM rendering
- `react-router-dom@7.13.0` - Navigation

**Styling**
- `tailwindcss@4.1.18` - CSS framework
- `@tailwindcss/vite@4.1.18` - Vite plugin (Tailwind CSS v4)
- `daisyui@5.5.19` - Component library

**Features**
- `axios@1.13.5` - HTTP client
- `@react-google-maps/api@2.20.8` - Google Maps widget

**Development**
- `eslint@9.39.1`, `@eslint/js@9.39.1` - Code linting
- `@vitejs/plugin-react@5.1.1` - React support for Vite
- Type definitions for React

## Backend Dependencies (server/package.json)

**Core**
- `express@5.1.0` - Web framework
- `pg@8.13.3` - PostgreSQL driver
- `cors@2.8.5` - CORS middleware
- `dotenv@16.4.7` - Environment variables

**Authentication**
- `jsonwebtoken@9.0.3` - JWT token handling
- `bcryptjs@3.0.3` - Password hashing

**Cloud Services**
- `cloudinary@2.9.0` - Image CDN
- `@google/generative-ai@0.24.0` - AI integration

**File Processing**
- `multer@2.0.2` - Form data parsing

**Automation**
- `node-cron@4.2.1` - Scheduled tasks
- `nodemon@3.1.9` - Development reload

---

## 📱 Responsive Design Architecture

All components implement **mobile-first responsive design**:

```
Base CSS (320px minimum)
├── Mobile adjustments (default)
│
├── sm: 640px (small tablets)
│   └── text-sm, smaller gaps
│
├── md: 768px (tablets & small desktops)
│   └── text-base, balanced spacing, 2-col grids
│
└── lg: 1024px (desktops)
    └── Full layouts, 3-4 col grids, max-widths
```

**Tailwind Classes Used Consistently**

Responsive classes follow this pattern:
```jsx
className="p-3 md:p-5 text-xs md:text-sm"
// Mobile: p-3, text-xs
// Tablet+: p-5, text-sm
```

**Key Responsive Components**

1. **Navbars** (CustomerNavbar.jsx, MerchantNavbar.jsx)
   - Height: `h-12 md:h-14`
   - Padding: `px-2 md:px-4 lg:px-6`
   - Text: `text-xs md:text-sm`
   - Gap: `gap-2 md:gap-3`

2. **MapPage.jsx**
   - Responsive search controls adapt to viewport
   - Bottom sheet: Snap points on mobile, expanded view on desktop
   - Rounded corners: Only top rounded (`rounded-t-3xl`), flat bottom

3. **AddProduct.jsx** (All 4 Steps)
   - Step 1: Grid `grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5`
   - Step 2: Upload area `h-48 md:h-auto`, padding `p-3 md:p-5`
   - Step 3: Image `rounded-lg md:rounded-2xl`, spacing `p-3 md:p-4`
   - Step 4: Icon `w-12 md:w-16 h-12 md:h-16`

4. **StoreDetailPage.jsx**
   - Product grid adapts column count by viewport
   - Modal auto-adjusts height: `max-h-[calc(100vh-60px)]`

5. **FilterPanel.jsx**
   - Collapses into single column on mobile
   - Expands to multi-select dropdowns on tablet+

---

## 🔒 Authentication & Authorization

**JWT-Based Authentication** (server/middleware/auth.js)
- User registration stores hashed password with bcryptjs
- Login creates JWT token (default: 7-day expiration)
- Protected routes verify token in Authorization header: `Bearer <token>`
- Role-based access control: customer OR merchant

**User Roles**
- **customer** — Browse shops, add favorites, view products
- **merchant** — Create shop, add/edit products, view dashboard

**Protected Routes** (client/contexts/ProtectedRoute.jsx)
- Customer routes: /map, /favorites, /profile, /shops/:id
- Merchant routes: /store-setup, /dashboard, /add-product, /edit-product/:id
- Admin routes: /agent-activity, /agent-settings (if implemented)
- Public routes: /, /login

---

## ⚙️ Quick Start Guide

### Prerequisites

**Software**
- **Node.js 18+** — [Download](https://nodejs.org)
- **PostgreSQL 13+** — Local OR cloud via Supabase
- **Git** — Version control (optional)

**API Keys** (all free tiers available)
- **Alibaba DashScope API Key** (Qwen VL Max) — [Get Key](https://dashscope.aliyun.com)
- **Google Maps API Key** — [Get Key](https://cloud.google.com/maps-platform)
- **Cloudinary Account** — [Sign Up](https://cloudinary.com)
- **Supabase Project** (for database) — [Get Started](https://supabase.com)

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/Phak-Chat-Jen.git
cd Phak-Chat-Jen
```

### Step 2: Setup Environment Variables

**Backend** — Create `server/.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (Supabase format)
DATABASE_URL=postgresql://postgres.[PROJECT-ID]:[PASSWORD]@db.[PROJECT-ID].supabase.co:6543/postgres

# JWT Token
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters_recommended_64

# Alibaba DashScope (Qwen VL Max AI)
DASHSCOPE_API_KEY=sk-your-actual-api-key-here

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Cloudinary Image Hosting
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Agent Loop Configuration (Week 7)
AGENT_ENABLED=true
AGENT_INTERVAL=300000
```

**Frontend** — Create `client/.env`:
```env
# Google Maps (same as backend)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# API Server URL (development)
VITE_API_URL=http://localhost:5000/api

# Production URL (change during deployment)
# VITE_API_URL=https://your-api-domain.onrender.com/api
```

### Step 3: Install Dependencies

```bash
# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../client
npm install

# Return to root
cd ..
```

### Step 4: Setup Database

```bash
cd server
npm run db:migrate
```

This automatic migration process:
1. Creates core tables (users, shops, posts, favorites, scans)
2. Enables PostGIS extension for spatial queries
3. Creates agent system tables (policies, actions, logs)

### Step 5: Run Development Servers

**Terminal 1 — Backend (API Server)**
```bash
cd server
npm run dev
# Starts on http://localhost:5000
# API endpoints available at http://localhost:5000/api/...
```

**Terminal 2 — Frontend (React App)**
```bash
cd client
npm run dev
# Starts on http://localhost:5173
# Vite will proxy /api requests to backend
```

### Step 6: Verify Setup

**Check Backend Status**
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-04-16T10:30:00Z",
  "environment": "development"
}
```

**Check Frontend**
- Open [http://localhost:5173](http://localhost:5173) in browser
- Should see landing page without errors
- Console should have no red errors

---

## Available npm Scripts

**Frontend** (client/)
```bash
npm run dev       # Start dev server with Vite HMR
npm run build     # Build production bundle (dist/)
npm run preview   # Preview production build locally
npm run lint      # Check code with ESLint
```

**Backend** (server/)
```bash
npm run dev       # Start with nodemon (auto-reload)
npm start         # Start production server
npm run db:migrate # Run database migrations
```

---

## 📚 API Documentation

**Complete API Specification**: [api-contract.md](api-contract.md)

### Core Endpoints Summary

**User Authentication**
- `POST /api/auth/register` — Create new account
- `POST /api/auth/login` — Get JWT token
- `GET /api/auth/me` — Current user info (requires token)

**Shop Management**
- `GET /api/shops` — List all shops with distance
- `GET /api/shops/:id` — Shop details + products
- `POST /api/shops` — Create new shop (merchant)
- `PATCH /api/shops/:id` — Update shop info
- `GET /api/maps/nearby` — Shops within radius (PostGIS)

**Product Operations**
- `GET /api/posts` — List products with filters
- `GET /api/posts/:id` — Product details
- `POST /api/posts` — Add product (merchant)
- `PATCH /api/posts/:id` — Update product/inventory
- `DELETE /api/posts/:id` — Remove product

**AI Features**
- `POST /api/scans` — Analyze vegetable photo (Qwen VL Max)

**User Favorites**
- `GET /api/favorites` — Get saved shops
- `POST /api/favorites` — Save shop
- `DELETE /api/favorites/:id` — Unsave shop

**Image Upload**
- `POST /api/upload` — Upload to Cloudinary

**Agent System**
- `GET /api/agent/status` — Agent loop status
- `POST /api/agent/action` — Trigger automation

**See [api-contract.md](api-contract.md) for:**
- Complete request/response examples
- All required/optional parameters
- Error codes and status checks
- Pagination specifications
- Product unit system documentation
- Inventory management logic
- Responsive design considerations

---

## 🗄️ Database Architecture

**Core Tables**

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| **users** | Customers & merchants | id, email, password_hash, role, created_at |
| **shops** | Store information | id, owner_id, name, location (POINT), hours |
| **posts** | Products | id, shop_id, name, quantity, unit, price, image_url |
| **scans** | AI analysis results | id, post_id, freshness_score, quality_analysis, cached_at |
| **favorites** | Customer save lists | id, customer_id, shop_id, created_at |

**Agent System Tables** (Week 7)
| Table | Purpose |
|-------|---------|
| **agent_policies** | Rules & constraints for automation |
| **agent_actions** | Executed automation tasks with status |
| **agent_logs** | Detailed logs for debugging & auditing |

**PostGIS Spatial Features**
- Shop location stored as POINT geometry
- Queries use ST_Distance for radius search
- Automatic index on location for performance

**Supported Product Units**
```
กก.    = Kilogram (อก.)
ผลละ  = Per Piece
หลาด  = Handful
ห่อ    = Bundle
แพค    = Pack
โหล    = Dozen
```

---

## 🔧 System Architecture

### Frontend Architecture (React)

```
App.jsx (Router setup)
├── Public Routes
│   ├── HomePage
│   └── LoginRegisterPage
│
├── Customer Routes (ProtectedRoute with role="customer")
│   ├── MapPage + FilterPanel
│   ├── StoreDetailPage (modal product view)
│   ├── FavoritesPage
│   └── CustomerProfilePage
│
└── Merchant Routes (ProtectedRoute with role="merchant")
    ├── StoreSetup (onboarding)
    ├── MyProductsPage (dashboard)
    ├── AddProductPage (4-step wizard)
    ├── EditProductPage
    ├── AgentActivityPage
    └── AgentSettingsPage
```

### Backend Architecture (Express)

```
server/src/index.js (entry point)
├── Middleware
│   ├── CORS (cross-origin requests)
│   ├── Auth (JWT verification)
│   └── Error handlers
│
├── Routes (8 modules)
│   ├── /auth → register, login
│   ├── /shops → shop CRUD
│   ├── /posts → product CRUD
│   ├── /scans → AI analysis
│   ├── /maps → location queries
│   ├── /upload → Cloudinary integration
│   ├── /favorites → save management
│   └── /agent → automation status
│
├── Services
│   ├── Database client (pool)
│   ├── Cloudinary client
│   └── AI model client
│
└── Background Tasks (node-cron)
    └── Agent loop.js (Week 7 automation)
```

### Data Flow Example: Add Product

```
1. Customer selects photo in AddProduct.jsx
2. Step 2: Sends to POST /api/scans (Qwen VL Max)
3. AI returns: freshness_score, quality_analysis
4. Step 3: User enters unit, quantity, price
5. Step 4: Submits to POST /api/posts
6. Backend inserts into posts table
7. Agent loop automatically tracks aging, inventory
8. Inventory updates visible on MapPage (PostGIS distance query)
```

---

## 🚀 Deployment Guide

**Full deployment instructions**: [DEPLOYMENT.md](DEPLOYMENT.md)

### Quick Deployment Summary

**Database Setup**
1. Create Supabase project (PostgreSQL + PostGIS)
2. Get connection string from Project Settings
3. Set DATABASE_URL in backend environment

**API Deployment (Render)**
1. Connect GitHub repo to Render Web Service
2. Set environment variables (DATABASE_URL, API keys, JWT_SECRET)
3. Deploy: Render builds & runs `npm start`
4. API URL: `https://[project-name]-api.onrender.com`

**Frontend Deployment (Render)**
1. Create Static Site from GitHub
2. Build command: `cd client && npm run build`
3. Publish directory: `client/dist`
4. Set VITE_API_URL to deployed backend URL
5. Frontend URL: `https://[project-name]-web.onrender.com`

**Post-Deployment**
- Run migrations on production database
- Test all endpoints with production URLs
- Monitor logs and performance
- Setup automated backups (Supabase)

---

## 🧪 Testing & Development

### Manual AI Testing

Test Qwen VL Max analysis without full app:
```bash
cd server
node test-scan.js
```

This script:
- Loads test vegetable image
- Calls DashScope API
- Prints freshness analysis
- Useful for debugging AI integration

### Database Testing

Check migrations and schema:
```bash
cd server
npm run db:migrate  # Re-apply all migrations
```

Query database directly (local PostgreSQL):
```bash
psql postgresql://user:pass@localhost:5432/phak_chat_jen
SELECT * FROM shops;
SELECT COUNT(*) FROM posts WHERE quantity = 0;
SELECT * FROM agent_logs ORDER BY created_at DESC LIMIT 10;
```

### API Testing (Postman/Thunder Client)

Test endpoints with examples in [api-contract.md](api-contract.md):
1. Register new user: `POST /api/auth/register`
2. Login: `POST /api/auth/login`
3. Copy `token` from response
4. Set `Authorization: Bearer <token>` in headers
5. Test protected endpoints

### Frontend Testing

Run ESLint:
```bash
cd client
npm run lint
```

Build production bundle:
```bash
npm run build
# Creates client/dist/ optimized for deployment
```

Preview production build:
```bash
npm run preview
# Serves dist/ locally to test minified code
```

---

## 📊 Project Completed Features

### Week 7 MVP Status: ✅ COMPLETE

**Authentication & User Management**
- ✅ Register/login with JWT tokens
- ✅ Role-based access (customer/merchant)
- ✅ Protected routes by role

**Consumer Features**
- ✅ Map-based shop discovery (Google Maps + PostGIS)
- ✅ Product search & filtering
- ✅ AI freshness analysis view
- ✅ Shop favorites/saved list
- ✅ Responsive design (mobile, tablet, desktop)

**Merchant Features**
- ✅ Shop creation & management
- ✅ Multi-step product upload wizard
- ✅ AI freshness analysis integration
- ✅ Inventory management (qty, unit system)
- ✅ Product editing & deletion
- ✅ Dashboard with analytics

**System Features**
- ✅ AI vision model integration (Qwen VL Max)
- ✅ Google Maps integration for location
- ✅ Cloudinary image CDN
- ✅ PostgreSQL + PostGIS spatial queries
- ✅ Agent loop automation
- ✅ Real-time inventory tracking
- ✅ Product unit system (6 units)
- ✅ Sold-out state management

**Documentation**
- ✅ README.md (comprehensive overview)
- ✅ api-contract.md (full endpoint docs)
- ✅ DEPLOYMENT.md (production guide)
- ✅ timeline.md (project progress)

### Known Limitations

⚠️ Not Yet Implemented
- Real payment processing (Stripe/TrueeMoney)
- Push notifications
- Real-time inventory sync (WebSockets)
- Mobile app (iOS/Android)
- Multi-language UI (Thai/English)
- Advanced analytics dashboard
- Barcode scanning
- SMS notifications
- Subscription tiers

---

## 🐛 Troubleshooting

### "Cannot find module axios"
```bash
cd client && npm install axios
```

### "DATABASE_URL not set"
Check `.env` file exists and has valid Supabase connection string:
```
postgresql://postgres.[PROJECT-ID]:[PASSWORD]@db.[PROJECT-ID].supabase.co:6543/postgres
```

### "PostGIS not available"
Enable extension on Supabase:
1. Go to Supabase SQL Editor
2. Run: `CREATE EXTENSION IF NOT EXISTS postgis;`

### "Image upload fails"
Verify Cloudinary credentials in `server/.env`:
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

### "Maps not showing"
Check `VITE_GOOGLE_MAPS_API_KEY` in `client/.env` is valid and has correct API scopes enabled

### "AI analysis returns error"
Verify DASHSCOPE_API_KEY valid and has sufficient balance in Alibaba DashScope console

---

## 📖 Additional Resources

**Documentation**
- [api-contract.md](api-contract.md) — Complete API specification
- [DEPLOYMENT.md](DEPLOYMENT.md) — Deployment to Render + Supabase
- [timeline.md](timeline.md) — Week-by-week development progress

**External Services Documentation**
- [Supabase Docs](https://supabase.com/docs) — PostgreSQL + PostGIS setup
- [Render Docs](https://render.com/docs) — Hosting & deployment
- [Google Maps API](https://developers.google.com/maps/documentation) — Maps integration
- [Qwen VL Max](https://help.aliyun.com/document_detail/2530371.html) — AI vision model
- [Cloudinary Docs](https://cloudinary.com/documentation) — Image hosting
- [Tailwind CSS](https://tailwindcss.com/docs) — Styling framework

**Getting Help**
- Check GitHub issues for similar problems
- Review [DEPLOYMENT.md](DEPLOYMENT.md) troubleshooting section
- Test with provided scripts: `server/test-scan.js`

---

## 📝 Contributing

This project uses conventional commits. When making changes:

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes, commit with clear messages
git commit -m "feat: add new feature description"

# Push and create pull request
git push origin feature/your-feature
```

**Code Validation**
```bash
# Before committing
cd client && npm run lint
# Fix ESLint errors: eslint . --fix
```

---

## 📄 License

ISC License - See LICENSE file for details

---

## 👥 Team & Support

**Contact**: [Add team contact info]  
**Issues**: Report bugs on GitHub Issues  
**Status**: Production-ready MVP

---

**Project Timeline**
- **Weeks 1-6**: Core feature development
- **Week 7**: Agent loop system, inventory management, polish
- **Current**: Deployment ready

Last updated: **April 16, 2026**

