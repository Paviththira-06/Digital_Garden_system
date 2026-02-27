// Centralized consistent response helpers

const sendSuccess = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, statusCode, message, error = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && error && { stack: error.stack }),
  });
};

export { sendSuccess, sendError };


//  🔄 3. Flow Explanation

// Register Flow:
// ──────────────
// Client POST /api/auth/register
//   └─► auth.routes.js        → routes to controller
//   └─► auth.controller.js    → validates input manually
//   └─► auth.service.js       → checks duplicate, hashes password, creates user
//   └─► user.model.js         → Mongoose schema validation + save
//   └─► response.util.js      → returns 201 + user object (no password)

// Login Flow:
// ───────────
// Client POST /api/auth/login
//   └─► auth.routes.js        → routes to controller
//   └─► auth.controller.js    → validates input manually
//   └─► auth.service.js       → finds user (+password), bcrypt.compare, signs JWT
//   └─► response.util.js      → returns 200 + token + user object

// Protected Route Flow (any future module):
// ──────────────────────────────────────────
// Client GET /api/protected
//   └─► auth.middleware.js    → verifies Bearer JWT → attaches req.user
//   └─► rbac.middleware.js    → checks req.user.role against allowed roles
//   └─► controller            → handles request