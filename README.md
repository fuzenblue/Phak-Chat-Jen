# Phak-Chat-Jen

A modern full-stack web application built with **React + Vite + Tailwind CSS** (frontend) and **Node.js + Express** (backend), featuring integrations with **Google Gemini AI**, **Google Maps API**, **Cloudinary**, and **PostgreSQL (Render)**.

---

## Project Structure

```
Phak-Chat-Jen/
├── client/                      # Frontend (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx            /
│   │   │   ├── ChatPage.jsx            /chat
│   │   │   ├── MapPage.jsx             /map
│   │   │   └── DatabasePage.jsx        /database
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
│   │   │   └── init.js                 Database init script
│   │   ├── routes/
│   │   │   ├── gemini.js               Gemini AI API
│   │   │   ├── maps.js                 Google Maps API
│   │   │   ├── db.js                   PostgreSQL CRUD
│   │   │   └── upload.js               Cloudinary upload
│   │   └── index.js                    Express server
│   ├── .env                            Backend env vars
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Tech Stack

| Layer      | Technology                     |
|------------|--------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS v4 |
| Backend    | Node.js, Express 5             |
| Database   | PostgreSQL (Render)             |
| AI         | Google Gemini 2.0 Flash         |
| Maps       | Google Maps Platform            |
| Storage    | Cloudinary (Image Upload)       |

---

## Quick Start

### 1. Prerequisites

- **Node.js** 18+
- **PostgreSQL** database (Render)
- **API Keys**: Gemini, Google Maps, Cloudinary

### 2. Setup Environment Variables

**Backend** (`server/.env`):
```env
PORT=5000
NODE_ENV=development

# PostgreSQL (Render)
DATABASE_URL=your_render_database_url_here

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

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

### 4. Initialize Database Tables

```bash
cd server
npm run db:init
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

## API Endpoints

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

### Cloudinary Upload
| Method | Endpoint                   | Description         |
|--------|----------------------------|---------------------|
| POST   | `/api/upload`              | Upload image        |
| DELETE | `/api/upload/:publicId`    | Delete image        |

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

## Database Tables

### contacts
| Column     | Type         |
|------------|--------------|
| id         | SERIAL PK    |
| name       | VARCHAR(255) |
| email      | VARCHAR(255) |
| message    | TEXT         |
| created_at | TIMESTAMP    |
| updated_at | TIMESTAMP    |

### places
| Column     | Type             |
|------------|------------------|
| id         | SERIAL PK        |
| name       | VARCHAR(255)     |
| address    | TEXT             |
| latitude   | DOUBLE PRECISION |
| longitude  | DOUBLE PRECISION |
| place_id   | VARCHAR(255) UQ  |
| rating     | DECIMAL(2,1)     |
| notes      | TEXT             |
| created_at | TIMESTAMP        |
| updated_at | TIMESTAMP        |

### chat_history
| Column       | Type      |
|--------------|-----------|
| id           | SERIAL PK |
| user_message | TEXT      |
| ai_response  | TEXT      |
| created_at   | TIMESTAMP |

---

## License

ISC
