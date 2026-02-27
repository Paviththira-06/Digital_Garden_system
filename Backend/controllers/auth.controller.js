import { registerUser, loginUser } from '../services/auth.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

// ── POST /api/auth/register ───────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Manual validation — no third-party libs
    if (!name || !email || !password) {
      return sendError(res, 400, 'Name, email, and password are required');
    }

    if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
      return sendError(res, 400, 'Please provide a valid email address');
    }

    if (typeof password !== 'string' || password.length < 6) {
      return sendError(res, 400, 'Password must be at least 6 characters');
    }

    if (typeof name !== 'string' || name.trim().length < 2) {
      return sendError(res, 400, 'Name must be at least 2 characters');
    }

    const user = await registerUser({ name: name.trim(), email, password });

    return sendSuccess(res, 201, 'User registered successfully', { user });
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    // Mongoose duplicate key fallback
    if (error.code === 11000) {
      return sendError(res, 400, 'Email is already registered');
    }
    return sendError(res, 500, 'Internal server error', error);
  }
};

// ── POST /api/auth/login ──────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required');
    }

    if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
      return sendError(res, 400, 'Please provide a valid email address');
    }

    const data = await loginUser({ email, password });

    return sendSuccess(res, 200, 'Login successful', data);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    return sendError(res, 500, 'Internal server error', error);
  }
};

export { register, login };