/**
 * Todo Type Definition (Frontend)
 * Phải đồng bộ với backend types
 */

// Priority levels cho todo
export type Priority = "low" | "medium" | "high";

// Filter options cho todo list
export type FilterType = "all" | "active" | "completed";

// Interface chính cho Todo item
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
}

// Interface cho request tạo todo mới
export interface CreateTodoRequest {
  title: string;
  priority: Priority;
}

// Interface chuẩn cho API response từ backend
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
