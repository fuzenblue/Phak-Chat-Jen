import { Router } from 'express';
import pool from '../config/database.js';

const router = Router();

// Allowed tables (whitelist to prevent SQL injection)
const ALLOWED_TABLES = ['contacts', 'places', 'chat_history'];

const validateTable = (table) => {
    if (!ALLOWED_TABLES.includes(table)) {
        throw new Error(`Table "${table}" is not allowed. Allowed tables: ${ALLOWED_TABLES.join(', ')}`);
    }
};

/**
 * GET /api/db/:resource
 * Get all records from a table
 */
router.get('/:resource', async (req, res) => {
    try {
        const { resource } = req.params;
        validateTable(resource);

        const result = await pool.query(
            `SELECT * FROM ${resource} ORDER BY created_at DESC`
        );

        res.json({
            data: result.rows,
            count: result.rowCount,
        });
    } catch (error) {
        console.error('❌ DB Get All Error:', error.message);
        res.status(error.message.includes('not allowed') ? 400 : 500).json({
            error: error.message,
        });
    }
});

/**
 * GET /api/db/:resource/:id
 * Get a single record by ID
 */
router.get('/:resource/:id', async (req, res) => {
    try {
        const { resource, id } = req.params;
        validateTable(resource);

        const result = await pool.query(
            `SELECT * FROM ${resource} WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.json({ data: result.rows[0] });
    } catch (error) {
        console.error('❌ DB Get By ID Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/db/:resource
 * Create a new record
 */
router.post('/:resource', async (req, res) => {
    try {
        const { resource } = req.params;
        validateTable(resource);

        const body = req.body;
        const keys = Object.keys(body);
        const values = Object.values(body);
        const placeholders = keys.map((_, i) => `$${i + 1}`);

        const result = await pool.query(
            `INSERT INTO ${resource} (${keys.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
            values
        );

        res.status(201).json({ data: result.rows[0] });
    } catch (error) {
        console.error('❌ DB Create Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /api/db/:resource/:id
 * Update a record by ID
 */
router.put('/:resource/:id', async (req, res) => {
    try {
        const { resource, id } = req.params;
        validateTable(resource);

        const body = req.body;
        const keys = Object.keys(body);
        const values = Object.values(body);
        const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

        const result = await pool.query(
            `UPDATE ${resource} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${keys.length + 1} RETURNING *`,
            [...values, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.json({ data: result.rows[0] });
    } catch (error) {
        console.error('❌ DB Update Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/db/:resource/:id
 * Delete a record by ID
 */
router.delete('/:resource/:id', async (req, res) => {
    try {
        const { resource, id } = req.params;
        validateTable(resource);

        const result = await pool.query(
            `DELETE FROM ${resource} WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.json({ message: 'Record deleted successfully', data: result.rows[0] });
    } catch (error) {
        console.error('❌ DB Delete Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

export default router;
