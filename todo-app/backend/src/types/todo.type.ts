/**
 * Todo Type Definition
 * Định nghĩa cấu trúc dữ liệu cho Todo item
 */

// Priority levels cho todo - chỉ chấp nhận 3 giá trị
export type Priority = "low" | "medium" | "high";

// Interface chính cho Todo item
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: string; // ISO 8601 format
}

// Interface cho request tạo todo mới (không cần id và createdAt)
export interface CreateTodoRequest {
  title: string;
  priority: Priority;
}

// Interface cho request cập nhật todo
export interface UpdateTodoRequest {
  title?: string;
  priority?: Priority;
  completed?: boolean;
}

// Interface chuẩn cho API response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
