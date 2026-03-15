//User registration logic
// User login logic
// Password reset logic
// Logout logic
// Profile data fetching
import crypto from 'crypto';
import Blacklist from '../models/blacklist.model.js';
import sendEmail from '../utils/email.util.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

//  Register 
const registerUser = async ({ name, email, password }) => {
  // Check duplicate email
  const existingUser = await User.findOne({ email }).lean();
  if (existingUser) {
    const error = new Error('Email is already registered');
    error.statusCode = 400;
    throw error;
  }

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

//  Login 
const loginUser = async ({ email, password }) => {
  // Fetch user with password explicitly selected
  const user = await User.findOne({ email }).select('+password').lean();
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Sign JWT — only userId and role, no sensitive data
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

// ── Get Profile 
const getProfile = async (userId) => {
  const user = await User.findById(userId).lean();
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};


// Logout 
const logoutUser = async (token) => {
  // Check if token already blacklisted
  const existing = await Blacklist.findOne({ token });
  if (!existing) {
    await Blacklist.create({ token });
  }
};

// ── Forgot Password 
const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('No account found with that email');
    error.statusCode = 404;
    throw error;
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token before saving
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Save to user
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() +3600000; // 1 hr
  await user.save();

  // Send email
  const resetUrl = `http://localhost:5000/api/auth/reset-password/${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: 'Smart Gardening — Password Reset Request',
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password.</p>
      <p>Click the link below to reset it:</p>
      <a href="${resetUrl}" style="
        background: #22c55e;
        color: white;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
      ">Reset Password</a>
      <p>This link expires in <strong>10 minutes</strong>.</p>
      <p>If you did not request this, ignore this email.</p>
    `,
  });
};

// Reset Password 
const resetPassword = async (resetToken, newPassword) => {
  // Hash the token to compare with DB
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Find user with valid token
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpire');

  if (!user) {
    const error = new Error('Invalid or expired reset token');
    error.statusCode = 400;
    throw error;
  }

  // Hash new password
  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(newPassword, salt);

  // Clear reset token fields
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
};

export { registerUser, loginUser, getProfile, logoutUser, forgotPassword, resetPassword };