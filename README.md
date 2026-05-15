# Phak-Chat-Jen

A modern full-stack e-commerce web application for fresh vegetable farmers and consumers in Thailand.

## Introduction

Phak-Chat-Jen (ผักชัดเจน) connects local vegetable farmers directly with consumers. Built with **React 19 + Vite + Tailwind CSS** (frontend) and **Node.js + Express** (backend), featuring:

- AI-powered vegetable freshness analysis (Qwen VL Max)
- Google Maps integration for shop discovery
- Real-time inventory management with unit system
- Role-based authentication (customer/merchant)

## Quick Start Guide

### Prerequisites

- Node.js 18+
- PostgreSQL 13+ (or Supabase)
- API keys: DashScope, Google Maps, Cloudinary

### Setup

```bash
# Clone and install
git clone https://github.com/yourusername/Phak-Chat-Jen.git
cd Phak-Chat-Jen

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

### Environment Variables

**server/.env**
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret
DASHSCOPE_API_KEY=your_key
GOOGLE_MAPS_API_KEY=your_key
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

**client/.env**
```env
VITE_GOOGLE_MAPS_API_KEY=your_key
VITE_API_URL=http://localhost:5000/api
```

### Run

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

Access at: http://localhost:5173

## Deployment

**Live Application**: [https://phak-chat-jen.onrender.com](https://phak-chat-jen.onrender.com)

**API Backend**: [https://phak-chat-jen-api.onrender.com](https://phak-chat-jen-api.onrender.com)
