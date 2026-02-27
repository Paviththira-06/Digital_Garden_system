import { sendError } from '../utils/response.util.js';

// Usage: authorize('admin') or authorize('admin', 'manager')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Not authenticated');
    }
    if (!roles.includes(req.user.role)) {
      return sendError(res, 403, 'You do not have permission to perform this action');
    }
    next();
  };
};

export { authorize };