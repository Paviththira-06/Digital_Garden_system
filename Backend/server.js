dotenv.config();
import dotenv from 'dotenv';

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler, notFound } from './middlewares/error.middleware.js';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);


// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} [${process.env.NODE_ENV}]`);
  });
};

start();













//   Flow 

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






