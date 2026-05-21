/**
 * Todo API Service
 * Chứa tất cả các hàm gọi API đến backend
 * Sử dụng fetch API với async/await
 */

import type { Todo, CreateTodoRequest, ApiResponse } from "../types/todo.type";

// Base URL của backend API
const API_BASE_URL = "http://localhost:3000/api/todos";

/**
 * Lấy toàn bộ danh sách todos từ server
 * GET /api/todos
 */
export const getTodos = async (): Promise<Todo[]> => {
  const response = await fetch(API_BASE_URL);

  if (!response.ok) {
    throw new Error("Không thể lấy danh sách todos");
  }

  const result: ApiResponse<Todo[]> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Lỗi không xác định");
  }

  return result.data;
};

/**
 * Tạo todo mới
 * POST /api/todos
 */
export const createTodo = async (data: CreateTodoRequest): Promise<Todo> => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorResult: ApiResponse<null> = await response.json();
    throw new Error(errorResult.error || "Không thể tạo todo");
  }

  const result: ApiResponse<Todo> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Lỗi không xác định");
  }

  return result.data;
};

/**
 * Cập nhật todo theo ID
 * PUT /api/todos/:id
 */
export const updateTodo = async (
  id: number,
  data: Partial<Todo>
): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorResult: ApiResponse<null> = await response.json();
    throw new Error(errorResult.error || "Không thể cập nhật todo");
  }

  const result: ApiResponse<Todo> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Lỗi không xác định");
  }

  return result.data;
};

/**
 * Xóa todo theo ID
 * DELETE /api/todos/:id
 */
export const deleteTodo = async (id: number): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorResult: ApiResponse<null> = await response.json();
    throw new Error(errorResult.error || "Không thể xóa todo");
  }

  const result: ApiResponse<Todo> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Lỗi không xác định");
  }

  return result.data;
};

/**
 * Toggle trạng thái completed của todo
 * PUT /api/todos/:id/toggle
 */
export const toggleTodo = async (id: number): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/${id}/toggle`, {
    method: "PUT",
  });

  if (!response.ok) {
    const errorResult: ApiResponse<null> = await response.json();
    throw new Error(errorResult.error || "Không thể toggle todo");
  }

  const result: ApiResponse<Todo> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Lỗi không xác định");
  }

  return result.data;
};
