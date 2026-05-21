/**
 * Error Handler Middleware
 * Middleware xử lý lỗi tập trung cho toàn bộ ứng dụng
 * Express nhận diện error handler qua 4 parameters (err, req, res, next)
 */

import type { Request, Response, NextFunction } from "express";
import type { ApiResponse } from "../types/todo.type";

/**
 * Global error handler
 * Bắt tất cả các lỗi không được xử lý ở controller
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`[ERROR] ${new Date().toISOString()}: ${err.message}`);
  console.error(err.stack);

  const response: ApiResponse<null> = {
    success: false,
    error: "Đã xảy ra lỗi server. Vui lòng thử lại sau.",
  };

  res.status(500).json(response);
};

/**
 * Not Found handler
 * Xử lý các request đến route không tồn tại
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const response: ApiResponse<null> = {
    success: false,
    error: `Route ${req.method} ${req.originalUrl} không tồn tại`,
  };

  res.status(404).json(response);
};
