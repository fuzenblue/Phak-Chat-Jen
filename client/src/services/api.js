import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// ==================== Gemini API ====================

export const geminiApi = {
    /**
     * Send a prompt to Gemini AI
     * @param {string} prompt - The text prompt to send
     * @returns {Promise<object>} - The AI response
     */
    chat: async (prompt) => {
        const response = await api.post('/gemini/chat', { prompt });
        return response.data;
    },
};

// ==================== Google Maps API ====================

export const mapsApi = {
    /**
     * Search for places by query
     * @param {string} query - Search query string
     * @returns {Promise<object>} - Places results
     */
    searchPlaces: async (query) => {
        const response = await api.get('/maps/search', { params: { query } });
        return response.data;
    },

    /**
     * Get place details by place ID
     * @param {string} placeId - Google Maps Place ID
     * @returns {Promise<object>} - Place details
     */
    getPlaceDetails: async (placeId) => {
        const response = await api.get(`/maps/place/${placeId}`);
        return response.data;
    },

    /**
     * Get directions between two points
     * @param {string} origin - Origin location
     * @param {string} destination - Destination location
     * @returns {Promise<object>} - Directions data
     */
    getDirections: async (origin, destination) => {
        const response = await api.get('/maps/directions', {
            params: { origin, destination },
        });
        return response.data;
    },
};

// ==================== Database API (PostgreSQL) ====================

export const dbApi = {
    /**
     * Get all items
     * @param {string} resource - Resource name (e.g., 'users', 'places')
     * @returns {Promise<object>} - List of items
     */
    getAll: async (resource) => {
        const response = await api.get(`/db/${resource}`);
        return response.data;
    },

    /**
     * Get item by ID
     * @param {string} resource - Resource name
     * @param {number|string} id - Item ID
     * @returns {Promise<object>} - The item
     */
    getById: async (resource, id) => {
        const response = await api.get(`/db/${resource}/${id}`);
        return response.data;
    },

    /**
     * Create a new item
     * @param {string} resource - Resource name
     * @param {object} data - Item data
     * @returns {Promise<object>} - Created item
     */
    create: async (resource, data) => {
        const response = await api.post(`/db/${resource}`, data);
        return response.data;
    },

    /**
     * Update an item
     * @param {string} resource - Resource name
     * @param {number|string} id - Item ID
     * @param {object} data - Updated data
     * @returns {Promise<object>} - Updated item
     */
    update: async (resource, id, data) => {
        const response = await api.put(`/db/${resource}/${id}`, data);
        return response.data;
    },

    /**
     * Delete an item
     * @param {string} resource - Resource name
     * @param {number|string} id - Item ID
     * @returns {Promise<object>} - Deletion confirmation
     */
    delete: async (resource, id) => {
        const response = await api.delete(`/db/${resource}/${id}`);
        return response.data;
    },
};

export default api;
