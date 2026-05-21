/**
 * TodoItem Component
 * Hiển thị một todo item với checkbox, title, priority badge, ngày tạo, và nút xóa
 * Có hiệu ứng hover và animation khi toggle/delete
 */

import type { Todo } from "../types/todo.type";

// Map priority sang label tiếng Việt
const PRIORITY_LABELS: Record<string, string> = {
  high: "Cao",
  medium: "TB",
  low: "Thấp",
};

// Props interface cho TodoItem
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  /**
   * Format ngày tạo từ ISO string sang dạng dễ đọc
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * Xử lý xóa todo - hiển thị confirm dialog trước
   */
  const handleDelete = () => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa "${todo.title}"?`
    );
    if (confirmed) {
      onDelete(todo.id);
    }
  };

  return (
    <div
      className={`todo-item ${todo.completed ? "todo-item--completed" : ""}`}
      id={`todo-item-${todo.id}`}
    >
      {/* Priority indicator bar */}
      <div className={`todo-item__priority-bar todo-item__priority-bar--${todo.priority}`} />

      {/* Checkbox toggle completed */}
      <label className="todo-item__checkbox-wrapper">
        <input
          type="checkbox"
          className="todo-item__checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          id={`todo-checkbox-${todo.id}`}
          aria-label={`Toggle ${todo.title}`}
        />
        <span className="todo-item__checkmark">
          {todo.completed && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>
      </label>

      {/* Content area: title + meta info */}
      <div className="todo-item__content">
        <span className={`todo-item__title ${todo.completed ? "todo-item__title--completed" : ""}`}>
          {todo.title}
        </span>
        <div className="todo-item__meta">
          {/* Priority badge */}
          <span className={`todo-item__badge todo-item__badge--${todo.priority}`}>
            {PRIORITY_LABELS[todo.priority]}
          </span>
          {/* Created date */}
          <span className="todo-item__date">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {formatDate(todo.createdAt)}
          </span>
        </div>
      </div>

      {/* Delete button */}
      <button
        className="todo-item__delete"
        onClick={handleDelete}
        id={`todo-delete-${todo.id}`}
        aria-label={`Xóa ${todo.title}`}
        title="Xóa công việc"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </button>
    </div>
  );
};

export default TodoItem;
