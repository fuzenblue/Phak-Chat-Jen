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
app.use('/api/upload', uploadRoutes);
app.use('/api/v1/shops',  shopsRoutes);
app.use('/api/v1/posts',  postsRoutes);
app.use('/api/v1/scans',  scansRoutes);
app.use('/api/upload',    uploadRoutes);
app.use('/api/auth', authRoutes);
// ==================== Health Check ====================
app.get('/api/health', async (req, res) => {
    try {
        const dbResult = await pool.query('SELECT NOW()');
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            database: {
                connected: true,
                time: dbResult.rows[0].now,
            },
            services: {
                qwen: !!process.env.QWEN_API_KEY,
                googleMaps: !!process.env.GOOGLE_MAPS_API_KEY,
                cloudinary: !!process.env.CLOUDINARY_CLOUD_NAME,
            },
        });
    } catch (error) {
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            database: {
                connected: false,
                error: error.message,
            },
            services: {
                qwen: !!process.env.QWEN_API_KEY,
                googleMaps: !!process.env.GOOGLE_MAPS_API_KEY,
                cloudinary: !!process.env.CLOUDINARY_CLOUD_NAME,
            },
        });
    }
});

// ==================== Error Handler ====================
app.use((err, req, res, next) => {
    console.error('Server Error:', err.message);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

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
