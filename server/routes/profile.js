import { Router } from 'express';
import pool from '../db/pool.js';
import { authMiddleware } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'uploads', 'avatars');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

const router = Router();

// ─── GET PROFILE ────────────────────────────────────────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.email
       FROM user_profiles p
       JOIN users u ON u.id = p.user_id
       WHERE p.user_id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile: result.rows[0] });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── UPDATE PROFILE ─────────────────────────────────────────
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { username, full_name, phone_number, bio, avatar_url, preferences, metadata } = req.body;

    const result = await pool.query(
      `UPDATE user_profiles
       SET username    = COALESCE($1, username),
           full_name   = COALESCE($2, full_name),
           phone_number = COALESCE($3, phone_number),
           bio         = COALESCE($4, bio),
           avatar_url  = COALESCE($5, avatar_url),
           preferences = COALESCE($6, preferences),
           metadata    = COALESCE($7, metadata),
           updated_at  = NOW()
       WHERE user_id = $8
       RETURNING *`,
      [username, full_name, phone_number, bio, avatar_url, 
       preferences ? JSON.stringify(preferences) : null,
       metadata ? JSON.stringify(metadata) : null,
       req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile: result.rows[0] });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── UPLOAD AVATAR ──────────────────────────────────────────
router.post('/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    await pool.query(
      `UPDATE user_profiles SET avatar_url = $1, updated_at = NOW() WHERE user_id = $2`,
      [avatarUrl, req.user.id]
    );

    res.json({ url: avatarUrl });
  } catch (err) {
    console.error('Upload avatar error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
