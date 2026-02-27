import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response.util.js';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, 'Authorization token missing or malformed');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Token has expired');
    }
    return sendError(res, 401, 'Invalid token');
  }
};

export { authenticate };