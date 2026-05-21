/**
 * In-Memory Data Store
 * Lưu trữ danh sách todos trong bộ nhớ (thay cho database)
 * Dữ liệu sẽ mất khi restart server
 */

import type { Todo } from "../types/todo.type";

// Biến đếm tự tăng để tạo unique ID cho mỗi todo
let nextId: number = 4;

// Mảng lưu trữ todos - khởi tạo với dữ liệu mẫu
const todos: Todo[] = [
  {
    id: 1,
    title: "Learn TypeScript",
    completed: false,
    priority: "high",
    createdAt: new Date("2026-05-20T10:00:00Z").toISOString(),
  },
  {
    id: 2,
    title: "Build Todo App",
    completed: false,
    priority: "medium",
    createdAt: new Date("2026-05-20T11:00:00Z").toISOString(),
  },
  {
    id: 3,
    title: "Read documentation",
    completed: true,
    priority: "low",
    createdAt: new Date("2026-05-20T09:00:00Z").toISOString(),
  },
];

/**
 * Lấy reference đến mảng todos
 * Trả về mảng gốc để service có thể thao tác trực tiếp
 */
export const getTodosData = (): Todo[] => todos;

/**
 * Tạo và trả về ID tiếp theo
 * Đảm bảo mỗi todo có ID unique
 */
export const getNextId = (): number => nextId++;
