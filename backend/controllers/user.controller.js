import { fetchAllUsers, applyForSeller , approveSeller} from '../services/user.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

// ── Get All Users (Admin) ─────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const data = await fetchAllUsers({ page, limit });
    return sendSuccess(res, 200, 'Users fetched successfully', data);
  } catch (error) {
    return sendError(res, 500, 'Internal server error', error);
  }
};

// ── Apply For Seller ──────────────────────────────────
const applySellerController = async (req, res) => {
  try {
    const user = await applyForSeller(req.user.userId);
    return sendSuccess(res, 200, 'Seller application submitted successfully', { user });
  } catch (error) {
    if (error.statusCode) return sendError(res, error.statusCode, error.message);
    return sendError(res, 500, 'Internal server error', error);
  }
};

// ── Approve Seller (Admin) ────────────────────────────
const approveSellerController = async (req, res) => {
  try {
    const user = await approveSeller(req.params.id);
    return sendSuccess(res, 200, 'Seller approved successfully', { user });
  } catch (error) {
    if (error.statusCode) return sendError(res, error.statusCode, error.message);
    return sendError(res, 500, 'Internal server error', error);
  }
};

export { getAllUsers, applySellerController, approveSellerController };