import { Router } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const router = Router();

// Multer config — store in memory before uploading to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (JPEG, PNG, GIF, WEBP) are allowed'));
        }
    },
});

/**
 * POST /api/upload
 * Upload a single image to Cloudinary
 */
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Upload to Cloudinary via stream
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'phakchatjen',
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        res.json({
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            size: result.bytes,
        });
    } catch (error) {
        console.error('Upload Error:', error.message);
        res.status(500).json({ error: 'Failed to upload image', details: error.message });
    }
});

/**
 * DELETE /api/upload/:publicId
 * Delete an image from Cloudinary
 */
router.delete('/:publicId', async (req, res) => {
    try {
        const { publicId } = req.params;
        const result = await cloudinary.uploader.destroy(`phakchatjen/${publicId}`);

        res.json({ message: 'Image deleted', result });
    } catch (error) {
        console.error('Delete Error:', error.message);
        res.status(500).json({ error: 'Failed to delete image', details: error.message });
    }
});

export default router;
