/**
 * ===========================================
 * SERVER ENTRY POINT - Express Application
 * ===========================================
 * 
 * File chính khởi tạo Express server với đầy đủ:
 *   - CORS middleware (cho phép frontend cross-origin requests)
 *   - JSON body parser
 *   - Request logger
 *   - API routes
 *   - Error handling middleware
 *   - 404 handler
 */

import express from 'express';
import commentRoutes from '@/routes/commentRoutes';
import {
  errorHandler,
  requestLogger,
  notFoundHandler,
} from '@/middleware/error.middleware';

const app = express();
const PORT = 3000;

// ============================
// MIDDLEWARE SETUP
// ============================

// CORS - Cho phép frontend (port 5173) gọi API
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (_req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }

  next();
});

// Parse JSON request body
app.use(express.json());

// Log tất cả requests
app.use(requestLogger);

// ============================
// API ROUTES
// ============================

// Mount comment routes tại /api/posts/:postId/comments
app.use('/api/posts/:postId/comments', commentRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Nested Comments API is running 🚀',
    timestamp: new Date().toISOString(),
  });
});

// ============================
// ERROR HANDLING
// ============================

// 404 handler (phải đặt sau tất cả routes)
app.use(notFoundHandler);

// Global error handler (phải đặt cuối cùng)
app.use(errorHandler);

// ============================
// START SERVER
// ============================

app.listen(PORT, () => {
  console.log(`\n🚀 Nested Comments API Server`);
  console.log(`   Running at: http://localhost:${PORT}`);
  console.log(`   Health:     http://localhost:${PORT}/api/health`);
  console.log(`   Comments:   http://localhost:${PORT}/api/posts/123/comments\n`);
});

export default app;
