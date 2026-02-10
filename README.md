# 🚀 Phak-Chat-Jen

A modern full-stack web application built with **React + Vite + Tailwind CSS** (frontend) and **Node.js + Express** (backend), featuring integrations with **Google Gemini AI**, **Google Maps API**, and **PostgreSQL**.

---

## 📁 Project Structure

```
Phak-Chat-Jen/
├── client/                  # Frontend (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx        # Landing page
│   │   │   ├── ChatPage.jsx        # Gemini AI chat
│   │   │   ├── MapPage.jsx         # Google Maps explorer
│   │   │   └── DatabasePage.jsx    # PostgreSQL CRUD
│   │   ├── services/
│   │   │   └── api.js              # API service layer (Axios)
│   │   ├── App.jsx                 # Main app with routing
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Tailwind CSS
│   ├── .env                        # Frontend env vars
│   └── vite.config.js              # Vite config + proxy
│
├── server/                  # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js         # PostgreSQL connection pool
│   │   ├── db/
│   │   │   └── init.js             # Database initialization script
│   │   ├── routes/
│   │   │   ├── gemini.js           # Gemini AI API routes
│   │   │   ├── maps.js             # Google Maps API routes
│   │   │   └── db.js               # PostgreSQL CRUD routes
│   │   └── index.js                # Express server entry point
│   ├── .env                        # Backend env vars
│   └── package.json
│
└── README.md
```

---

## 🛠️ Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | React 19, Vite, Tailwind CSS v4 |
| Backend    | Node.js, Express 5      |
| Database   | PostgreSQL              |
| AI         | Google Gemini 2.0 Flash |
| Maps       | Google Maps Platform    |

---

## ⚡ Quick Start

### 1. Prerequisites

- **Node.js** 18+ installed
- **PostgreSQL** installed and running
- **API Keys**: Google Gemini API key + Google Maps API key

### 2. Setup Environment Variables

**Backend** (`server/.env`):
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=phakchatjen
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

**Frontend** (`client/.env`):
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 3. Create PostgreSQL Database

```sql
CREATE DATABASE phakchatjen;
```

### 4. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 5. Initialize Database Tables

```bash
cd server
npm run db:init
```

### 6. Run the Application

```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

---

## 📡 API Endpoints

### Gemini AI
| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| POST   | `/api/gemini/chat` | Send prompt to AI  |

### Google Maps
| Method | Endpoint                   | Description         |
|--------|----------------------------|---------------------|
| GET    | `/api/maps/search?query=`  | Search places       |
| GET    | `/api/maps/place/:placeId` | Get place details   |
| GET    | `/api/maps/directions`     | Get directions      |
| GET    | `/api/maps/geocode`        | Geocode address     |

### Database (CRUD)
| Method | Endpoint               | Description      |
|--------|------------------------|------------------|
| GET    | `/api/db/:resource`    | Get all records  |
| GET    | `/api/db/:resource/:id`| Get one record   |
| POST   | `/api/db/:resource`    | Create record    |
| PUT    | `/api/db/:resource/:id`| Update record    |
| DELETE | `/api/db/:resource/:id`| Delete record    |

**Available resources**: `contacts`, `places`, `chat_history`

---

## 📝 License

ISC
