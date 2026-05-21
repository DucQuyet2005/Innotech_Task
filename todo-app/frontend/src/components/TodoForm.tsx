/**
 * TodoForm Component
 * Form để tạo todo mới với input title và select priority
 * Có validation trước khi submit
 */

import { useState } from "react";
import type { Priority } from "../types/todo.type";

// Props interface cho TodoForm
interface TodoFormProps {
  onAddTodo: (title: string, priority: Priority) => Promise<void>;
}

const TodoForm = ({ onAddTodo }: TodoFormProps) => {
  // State cho input fields
  const [title, setTitle] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  /**
   * Xử lý submit form
   * Validate title trước khi gọi API
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate title không rỗng
    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề công việc");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await onAddTodo(title.trim(), priority);
      // Reset form sau khi thêm thành công
      setTitle("");
      setPriority("medium");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Có lỗi xảy ra khi thêm todo"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-form__header">
        <div className="todo-form__icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
        <h2 className="todo-form__title">Thêm công việc mới</h2>
      </div>

      <div className="todo-form__body">
        {/* Input title */}
        <div className="todo-form__field">
          <input
            id="todo-title-input"
            type="text"
            className="todo-form__input"
            placeholder="Nhập tên công việc..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            disabled={isSubmitting}
            autoComplete="off"
          />
        </div>

        {/* Select priority + Submit button */}
        <div className="todo-form__actions">
          <select
            id="todo-priority-select"
            className="todo-form__select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            disabled={isSubmitting}
          >
            <option value="low">🟢 Thấp</option>
            <option value="medium">🟡 Trung bình</option>
            <option value="high">🔴 Cao</option>
          </select>

          <button
            id="todo-submit-btn"
            type="submit"
            className="todo-form__btn"
            disabled={isSubmitting || !title.trim()}
          >
            {isSubmitting ? (
              <span className="todo-form__btn-loading">
                <span className="spinner" />
                Đang thêm...
              </span>
            ) : (
              <span className="todo-form__btn-content">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Thêm
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="todo-form__error" role="alert">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {error}
        </div>
      )}
    </form>
  );
};

export default TodoForm;
