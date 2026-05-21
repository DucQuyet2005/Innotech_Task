/**
 * Todo Service Layer
 * Chứa toàn bộ business logic cho Todo operations
 * Service layer tách biệt logic khỏi controller, giúp code dễ test và maintain
 */

import type {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  Priority,
} from "../types/todo.type";
import { getTodosData, getNextId } from "../data/todos";

// Danh sách priority hợp lệ - dùng để validate
const VALID_PRIORITIES: Priority[] = ["low", "medium", "high"];

/**
 * Lấy toàn bộ todos
 * Trả về bản copy để tránh mutation từ bên ngoài
 */
export const getAllTodos = (): Todo[] => {
  return [...getTodosData()];
};

/**
 * Tìm todo theo ID
 * @returns Todo nếu tìm thấy, undefined nếu không
 */
export const getTodoById = (id: number): Todo | undefined => {
  const todos = getTodosData();
  return todos.find((todo) => todo.id === id);
};

/**
 * Tạo todo mới
 * Validate input trước khi tạo
 * @throws Error nếu title rỗng hoặc priority không hợp lệ
 */
export const createTodo = (data: CreateTodoRequest): Todo => {
  // Validate title - không được rỗng
  if (!data.title || data.title.trim().length === 0) {
    throw new Error("Title không được để trống");
  }

  // Validate priority - chỉ nhận low, medium, high
  if (!VALID_PRIORITIES.includes(data.priority)) {
    throw new Error(
      `Priority không hợp lệ. Chỉ chấp nhận: ${VALID_PRIORITIES.join(", ")}`
    );
  }

  // Tạo todo mới với ID tự tăng và timestamp hiện tại
  const newTodo: Todo = {
    id: getNextId(),
    title: data.title.trim(),
    completed: false,
    priority: data.priority,
    createdAt: new Date().toISOString(),
  };

  // Thêm vào data store
  const todos = getTodosData();
  todos.push(newTodo);

  return newTodo;
};

/**
 * Cập nhật todo theo ID
 * Chỉ cập nhật các fields được gửi lên
 * @throws Error nếu không tìm thấy todo hoặc dữ liệu không hợp lệ
 */
export const updateTodo = (id: number, data: UpdateTodoRequest): Todo => {
  const todos = getTodosData();
  const index = todos.findIndex((todo) => todo.id === id);

  // Kiểm tra todo có tồn tại không
  if (index === -1) {
    throw new Error(`Không tìm thấy todo với id: ${id}`);
  }

  // Validate title nếu được gửi
  if (data.title !== undefined) {
    if (data.title.trim().length === 0) {
      throw new Error("Title không được để trống");
    }
  }

  // Validate priority nếu được gửi
  if (data.priority !== undefined) {
    if (!VALID_PRIORITIES.includes(data.priority)) {
      throw new Error(
        `Priority không hợp lệ. Chỉ chấp nhận: ${VALID_PRIORITIES.join(", ")}`
      );
    }
  }

  // Cập nhật todo - giữ lại các field không thay đổi
  const existingTodo = todos[index]!;
  const updatedTodo: Todo = {
    ...existingTodo,
    title: data.title !== undefined ? data.title.trim() : existingTodo.title,
    priority: data.priority !== undefined ? data.priority : existingTodo.priority,
    completed:
      data.completed !== undefined ? data.completed : existingTodo.completed,
  };

  // Ghi đè todo cũ bằng todo đã cập nhật
  todos[index] = updatedTodo;

  return updatedTodo;
};

/**
 * Xóa todo theo ID
 * @throws Error nếu không tìm thấy todo
 */
export const deleteTodo = (id: number): Todo => {
  const todos = getTodosData();
  const index = todos.findIndex((todo) => todo.id === id);

  // Kiểm tra todo có tồn tại không
  if (index === -1) {
    throw new Error(`Không tìm thấy todo với id: ${id}`);
  }

  // Xóa todo khỏi mảng và trả về todo đã xóa
  const [deletedTodo] = todos.splice(index, 1);
  return deletedTodo!;
};

/**
 * Toggle trạng thái completed của todo
 * true -> false, false -> true
 * @throws Error nếu không tìm thấy todo
 */
export const toggleTodo = (id: number): Todo => {
  const todos = getTodosData();
  const index = todos.findIndex((todo) => todo.id === id);

  // Kiểm tra todo có tồn tại không
  if (index === -1) {
    throw new Error(`Không tìm thấy todo với id: ${id}`);
  }

  // Đảo ngược trạng thái completed
  const existingTodo = todos[index]!;
  const toggledTodo: Todo = {
    ...existingTodo,
    completed: !existingTodo.completed,
  };

  todos[index] = toggledTodo;

  return toggledTodo;
};
