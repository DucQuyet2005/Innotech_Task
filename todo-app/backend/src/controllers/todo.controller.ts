/**
 * Todo Controller
 * Xử lý HTTP request/response cho Todo endpoints
 * Controller chỉ lo việc nhận request, gọi service, và trả response
 * Không chứa business logic
 */

import type { Request, Response } from "express";
import type {
  CreateTodoRequest,
  UpdateTodoRequest,
  ApiResponse,
  Todo,
} from "../types/todo.type";
import * as todoService from "../services/todo.service";

/**
 * GET /api/todos
 * Lấy toàn bộ danh sách todos
 */
export const getAllTodos = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const todos = todoService.getAllTodos();

    const response: ApiResponse<Todo[]> = {
      success: true,
      data: todos,
      message: `Lấy thành công ${todos.length} todos`,
    };

    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Lỗi khi lấy danh sách todos",
    };
    res.status(500).json(response);
  }
};

/**
 * POST /api/todos
 * Tạo todo mới
 * Body: { title: string, priority: "low" | "medium" | "high" }
 */
export const createTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, priority } = req.body as CreateTodoRequest;

    const newTodo = todoService.createTodo({ title, priority });

    const response: ApiResponse<Todo> = {
      success: true,
      data: newTodo,
      message: "Tạo todo thành công",
    };

    // 201 Created - resource mới đã được tạo
    res.status(201).json(response);
  } catch (error) {
    // Validation error -> 400 Bad Request
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi khi tạo todo",
    };
    res.status(400).json(response);
  }
};

/**
 * PUT /api/todos/:id
 * Cập nhật todo theo ID
 * Body: { title?: string, priority?: Priority, completed?: boolean }
 */
export const updateTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);

    // Validate ID là số hợp lệ
    if (isNaN(id)) {
      const response: ApiResponse<null> = {
        success: false,
        error: "ID không hợp lệ",
      };
      res.status(400).json(response);
      return;
    }

    const updateData = req.body as UpdateTodoRequest;
    const updatedTodo = todoService.updateTodo(id, updateData);

    const response: ApiResponse<Todo> = {
      success: true,
      data: updatedTodo,
      message: "Cập nhật todo thành công",
    };

    res.status(200).json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Lỗi khi cập nhật todo";

    // Phân biệt lỗi 404 (không tìm thấy) và 400 (validation)
    const statusCode = message.includes("Không tìm thấy") ? 404 : 400;

    const response: ApiResponse<null> = {
      success: false,
      error: message,
    };
    res.status(statusCode).json(response);
  }
};

/**
 * DELETE /api/todos/:id
 * Xóa todo theo ID
 */
export const deleteTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);

    // Validate ID là số hợp lệ
    if (isNaN(id)) {
      const response: ApiResponse<null> = {
        success: false,
        error: "ID không hợp lệ",
      };
      res.status(400).json(response);
      return;
    }

    const deletedTodo = todoService.deleteTodo(id);

    const response: ApiResponse<Todo> = {
      success: true,
      data: deletedTodo,
      message: "Xóa todo thành công",
    };

    res.status(200).json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Lỗi khi xóa todo";
    const statusCode = message.includes("Không tìm thấy") ? 404 : 500;

    const response: ApiResponse<null> = {
      success: false,
      error: message,
    };
    res.status(statusCode).json(response);
  }
};

/**
 * PUT /api/todos/:id/toggle
 * Toggle trạng thái completed của todo
 */
export const toggleTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);

    // Validate ID là số hợp lệ
    if (isNaN(id)) {
      const response: ApiResponse<null> = {
        success: false,
        error: "ID không hợp lệ",
      };
      res.status(400).json(response);
      return;
    }

    const toggledTodo = todoService.toggleTodo(id);

    const response: ApiResponse<Todo> = {
      success: true,
      data: toggledTodo,
      message: `Todo "${toggledTodo.title}" đã ${toggledTodo.completed ? "hoàn thành" : "chưa hoàn thành"}`,
    };

    res.status(200).json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Lỗi khi toggle todo";
    const statusCode = message.includes("Không tìm thấy") ? 404 : 500;

    const response: ApiResponse<null> = {
      success: false,
      error: message,
    };
    res.status(statusCode).json(response);
  }
};
