/**
 * Todo Routes
 * Định nghĩa các route endpoints cho Todo API
 * Mỗi route map với một controller method tương ứng
 */

import { Router } from "express";
import * as todoController from "../controllers/todo.controller";

const router: Router = Router();

// GET /api/todos - Lấy toàn bộ todos
router.get("/", todoController.getAllTodos);

// POST /api/todos - Tạo todo mới
router.post("/", todoController.createTodo);

// PUT /api/todos/:id - Cập nhật todo
router.put("/:id", todoController.updateTodo);

// DELETE /api/todos/:id - Xóa todo
router.delete("/:id", todoController.deleteTodo);

// PUT /api/todos/:id/toggle - Toggle completed status
router.put("/:id/toggle", todoController.toggleTodo);

export default router;
