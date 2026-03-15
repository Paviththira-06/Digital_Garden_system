import User from '../models/user.model.js';

// ── Get All Users (Admin) ─────────────────────────────
const fetchAllUsers = async ({ page, limit }) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const users = await User.find()
    .select('-password')
    .skip(skip)
    .limit(limitNum)
    .lean();

  const total = await User.countDocuments();

  return {
    users,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  };
};

// ── Apply For Seller ──────────────────────────────────
const applyForSeller = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.role === 'seller') {
    const error = new Error('You are already a seller');
    error.statusCode = 400;
    throw error;
  }

  if (user.sellerStatus === 'pending') {
    const error = new Error('Your application is already pending');
    error.statusCode = 400;
    throw error;
  }

  if (user.sellerStatus === 'rejected') {
    const error = new Error('Your application was rejected by admin');
    error.statusCode = 400;
    throw error;
  }

  user.sellerStatus = 'pending';
  user.sellerRequestedAt = Date.now();
  await user.save();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    sellerStatus: user.sellerStatus,
    sellerRequestedAt: user.sellerRequestedAt,
  };
};

// ── Approve Seller (Admin) ────────────────────────────
const approveSeller = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.sellerStatus !== 'pending') {
    const error = new Error('No pending seller application found');
    error.statusCode = 400;
    throw error;
  }

  user.role = 'seller';
  user.sellerStatus = 'approved';
  await user.save();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    sellerStatus: user.sellerStatus,
  };
};

export { fetchAllUsers, applyForSeller, approveSeller };