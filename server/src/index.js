import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mapsRoutes from './routes/maps.js';
import shopsRoutes from './routes/shops.js';
import postsRoutes from './routes/posts.js';
import scansRoutes from './routes/scans.js';
import uploadRoutes from './routes/upload.js';
import pool from './config/database.js';
import authRoutes from './routes/auth.js';
import agentRoutes from './routes/agent.js';
import favoritesRoutes from './routes/favorites.js';


import { startAgentLoop } from './agent/loop.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== Middleware ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== Request Logger ====================
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

// ==================== Routes ====================
app.use('/api/maps', mapsRoutes);
app.use('/api/v1/shops', shopsRoutes);
app.use('/api/v1/posts', postsRoutes);
app.use('/api/v1/scans', scansRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/v1/agent', agentRoutes);
app.use('/api/v1/favorites', favoritesRoutes);
// ==================== Health Check ====================
app.get('/api/health', async (req, res) => {
    try {
        const dbResult = await pool.query('SELECT NOW()');
        res.json({
            status: 'ok',
            backend_api: 'Phak-Chat-Jen V1',
            database: { connected: true, time: dbResult.rows[0].now },
        });
    } catch (error) {
        res.status(500).json({ status: 'error', database: { connected: false, error: error.message } });
    }
});

// ==================== 404 Handler ====================
app.use((req, res) => {
    console.warn(`[404] Route Not Found: ${req.method} ${req.url}`);
    res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.url} not found on this server.` }
    });
});

// ==================== Error Handler ====================
app.use((err, req, res, next) => {
    console.error('Server Error:', err.message);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

// ==================== Agent Loop ====================
startAgentLoop();

// ==================== Start Server ====================
app.listen(PORT, () => {
    console.log(`\n Server is running on http://localhost:${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Qwen API: ${process.env.QWEN_API_KEY ? ' Configured' : '  Not configured'}`);
    console.log(` Maps API:   ${process.env.GOOGLE_MAPS_API_KEY ? ' Configured' : ' Not configured'}`);
    console.log(`  Database:   ${process.env.DATABASE_URL ? ' Configured (Supabase)' : ' Not configured'}`);
    console.log(` Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? ' Configured' : ' Not configured'}\n`);
});

export default app;
