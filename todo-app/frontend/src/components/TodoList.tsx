/**
 * TodoList Component
 * Hiển thị danh sách todos với loading state và empty state
 * Nhận danh sách todos đã được filter từ parent
 */

import type { Todo } from "../types/todo.type";
import TodoItem from "./TodoItem";

// Props interface cho TodoList
interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const TodoList = ({ todos, isLoading, onToggle, onDelete }: TodoListProps) => {
  // Loading state - skeleton loader
  if (isLoading) {
    return (
      <div className="todo-list todo-list--loading">
        <div className="todo-list__loader">
          <div className="skeleton-item" />
          <div className="skeleton-item" />
          <div className="skeleton-item" />
        </div>
      </div>
    );
  }

  // Empty state - khi không có todo nào
  if (todos.length === 0) {
    return (
      <div className="todo-list todo-list--empty">
        <div className="empty-state">
          <div className="empty-state__icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h3 className="empty-state__title">Chưa có công việc nào</h3>
          <p className="empty-state__desc">
            Hãy thêm công việc mới để bắt đầu quản lý!
          </p>
        </div>
      </div>
    );
  }

  // Render danh sách todos
  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TodoList;
