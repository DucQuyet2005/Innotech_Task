/**
 * Todo App Backend - Entry Point
 * Server chính của ứng dụng Todo API
 *
 * Flow: Request -> Middleware -> Routes -> Controller -> Service -> Data -> Response
 */

import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todo.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

// Khởi tạo Express app
const app = express();

// Port từ environment variable hoặc mặc định 3000
const PORT = process.env.PORT || 3000;

// ============ MIDDLEWARE ============

// Cho phép CORS - frontend có thể gọi API từ domain khác
app.use(cors());

// Parse JSON body từ request
app.use(express.json());

// Log request đến server (simple logger)
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ============ ROUTES ============

// Health check endpoint - kiểm tra server hoạt động
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Todo API đang hoạt động!",
    timestamp: new Date().toISOString(),
  });
});

// Mount todo routes tại /api/todos
app.use("/api/todos", todoRoutes);

// ============ ERROR HANDLING ============

// Xử lý route không tồn tại (404)
app.use(notFoundHandler);

// Xử lý lỗi tập trung (500)
app.use(errorHandler);

// ============ START SERVER ============

app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log(` Todo API Server đang chạy!`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(`  Health: http://localhost:${PORT}/api/health`);
  console.log(` Todos: http://localhost:${PORT}/api/todos`);
  console.log("=".repeat(50));
});

export default app;
