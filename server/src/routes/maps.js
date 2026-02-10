import { Router } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const MAPS_BASE_URL = 'https://maps.googleapis.com/maps/api';

/**
 * GET /api/maps/search?query=...
 * Search for places using Google Places API
 */
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        if (!MAPS_API_KEY) {
            return res.status(500).json({
                error: 'Google Maps API key is not configured. Please set GOOGLE_MAPS_API_KEY in .env file.',
            });
        }

        const url = `${MAPS_BASE_URL}/place/textsearch/json?query=${encodeURIComponent(query)}&key=${MAPS_API_KEY}&language=th`;
        const response = await fetch(url);
        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.error('❌ Maps Search Error:', error.message);
        res.status(500).json({ error: 'Failed to search places', details: error.message });
    }
});

/**
 * GET /api/maps/place/:placeId
 * Get detailed information about a place
 */
router.get('/place/:placeId', async (req, res) => {
    try {
        const { placeId } = req.params;

        if (!MAPS_API_KEY) {
            return res.status(500).json({ error: 'Google Maps API key is not configured.' });
        }

        const url = `${MAPS_BASE_URL}/place/details/json?place_id=${placeId}&key=${MAPS_API_KEY}&language=th`;
        const response = await fetch(url);
        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.error('❌ Place Details Error:', error.message);
        res.status(500).json({ error: 'Failed to get place details', details: error.message });
    }
});

/**
 * GET /api/maps/directions?origin=...&destination=...
 * Get directions between two points
 */
router.get('/directions', async (req, res) => {
    try {
        const { origin, destination, mode = 'driving' } = req.query;

        if (!origin || !destination) {
            return res.status(400).json({ error: 'Origin and destination are required' });
        }

        if (!MAPS_API_KEY) {
            return res.status(500).json({ error: 'Google Maps API key is not configured.' });
        }

        const url = `${MAPS_BASE_URL}/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}&key=${MAPS_API_KEY}&language=th`;
        const response = await fetch(url);
        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.error('❌ Directions Error:', error.message);
        res.status(500).json({ error: 'Failed to get directions', details: error.message });
    }
});

/**
 * GET /api/maps/geocode?address=...
 * Geocode an address to lat/lng
 */
router.get('/geocode', async (req, res) => {
    try {
        const { address } = req.query;

        if (!address) {
            return res.status(400).json({ error: 'Address is required' });
        }

        if (!MAPS_API_KEY) {
            return res.status(500).json({ error: 'Google Maps API key is not configured.' });
        }

        const url = `${MAPS_BASE_URL}/geocode/json?address=${encodeURIComponent(address)}&key=${MAPS_API_KEY}&language=th`;
        const response = await fetch(url);
        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.error('❌ Geocode Error:', error.message);
        res.status(500).json({ error: 'Failed to geocode address', details: error.message });
    }
});

export default router;
