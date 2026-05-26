/**
 * ===========================================
 * ERROR HANDLING MIDDLEWARE
 * ===========================================
 * 
 * Global error handler cho Express app.
 * Bắt tất cả lỗi không được handle ở route level.
 */

import type { Request, Response, NextFunction } from 'express';

/**
 * Global error handling middleware.
 * Express nhận diện error handler qua 4 parameters (err, req, res, next).
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(`[Error] ${err.message}`);
  console.error(err.stack);

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
}

/**
 * Request logger middleware.
 * Log mỗi request đến server cho debugging.
 */
export function requestLogger(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
}

/**
 * Not found handler.
 * Bắt tất cả routes không tồn tại.
 */
export function notFoundHandler(
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.url} not found`,
  });
}
