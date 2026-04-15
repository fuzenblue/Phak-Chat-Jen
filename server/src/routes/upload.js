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
            return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'No image file provided' } });
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
            success: true,
            data: {
                url: result.secure_url,
                public_id: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
                size: result.bytes,
            },
        });
    } catch (error) {
        console.error('Upload Error:', error.message);
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to upload image' } });
    }
});

/**
 * DELETE /api/upload/:publicId
 * Delete an image from Cloudinary
 */
router.delete('/:publicId', async (req, res) => {
    try {
        const { publicId } = req.params;
        await cloudinary.uploader.destroy(`phakchatjen/${publicId}`);

        res.json({ success: true, data: { message: 'Image deleted successfully' } });
    } catch (error) {
        console.error('Delete Error:', error.message);
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to delete image' } });
    }
});

export default router;
