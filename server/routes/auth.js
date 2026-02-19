import { Router } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db/pool.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';

const router = Router();

// ─── REGISTER ───────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { email, password, username, phone_number } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'User already registered', exists: true });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const userResult = await pool.query(
      `INSERT INTO users (email, password_hash, phone)
       VALUES ($1, $2, $3)
       RETURNING id, email, phone, created_at`,
      [email.toLowerCase(), passwordHash, phone_number || null]
    );

    const user = userResult.rows[0];

    // Create profile
    await pool.query(
      `INSERT INTO user_profiles (user_id, username, full_name)
       VALUES ($1, $2, $3)`,
      [user.id, username || null, username || null]
    );

    const token = generateToken(user);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        created_at: user.created_at,
      },
      token,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── LOGIN ──────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return res.status(400).json({ error: 'Email/phone and password are required' });
    }

    let userResult;

    if (email) {
      userResult = await pool.query(
        'SELECT id, email, password_hash, phone, created_at FROM users WHERE email = $1',
        [email.toLowerCase()]
      );
    } else {
      userResult = await pool.query(
        'SELECT id, email, password_hash, phone, created_at FROM users WHERE phone = $1',
        [phone]
      );
    }

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        created_at: user.created_at,
      },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── GET CURRENT USER (verify token) ────────────────────────
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT id, email, phone, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: userResult.rows[0] });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── CHANGE PASSWORD ────────────────────────────────────────
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required' });
    }

    const userResult = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (oldPassword) {
      const valid = await bcrypt.compare(oldPassword, userResult.rows[0].password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [newHash, req.user.id]);

    res.json({ success: true });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
