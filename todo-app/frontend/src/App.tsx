/**
 * App Component - Root component của ứng dụng Todo
 *
 * Responsibilities:
 * - Quản lý state chính (todos, filter, loading, error)
 * - Gọi API thông qua todoApi service
 * - Truyền data và handlers xuống các child components
 *
 * Flow: App -> TodoForm (tạo todo)
 *       App -> FilterButtons (filter todos)
 *       App -> TodoList -> TodoItem (hiển thị todos)
 */

import { useState, useEffect, useCallback } from "react";
import type { Todo, Priority, FilterType } from "./types/todo.type";
import * as todoApi from "./services/todoApi";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import FilterButtons from "./components/FilterButtons";

function App() {
  // ============ STATE ============

  // Danh sách tất cả todos từ server
  const [todos, setTodos] = useState<Todo[]>([]);

  // Filter hiện tại: all | active | completed
  const [filter, setFilter] = useState<FilterType>("all");

  // Loading state khi đang fetch data
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Error message khi có lỗi
  const [error, setError] = useState<string>("");

  // ============ FETCH TODOS ============

  /**
   * Lấy toàn bộ todos từ server
   * Chạy khi component mount lần đầu
   */
  const fetchTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await todoApi.getTodos();
      setTodos(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Không thể kết nối đến server"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // useEffect - gọi fetchTodos khi component mount
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // ============ HANDLERS ============

  /**
   * Thêm todo mới
   * Gọi API POST và cập nhật state
   */
  const handleAddTodo = async (title: string, priority: Priority) => {
    const newTodo = await todoApi.createTodo({ title, priority });
    // Thêm todo mới vào đầu danh sách
    setTodos((prev) => [newTodo, ...prev]);
  };

  /**
   * Toggle trạng thái completed
   * Gọi API PUT toggle và cập nhật state
   */
  const handleToggleTodo = async (id: number) => {
    try {
      const updatedTodo = await todoApi.toggleTodo(id);
      // Cập nhật todo trong danh sách
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể cập nhật todo"
      );
    }
  };

  /**
   * Xóa todo
   * Gọi API DELETE và cập nhật state
   */
  const handleDeleteTodo = async (id: number) => {
    try {
      await todoApi.deleteTodo(id);
      // Loại bỏ todo khỏi danh sách
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể xóa todo"
      );
    }
  };

  // ============ COMPUTED VALUES ============

  /**
   * Filter todos theo trạng thái hiện tại
   * all: tất cả, active: chưa hoàn thành, completed: đã hoàn thành
   */
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true; // "all"
  });

  // Đếm số todos chưa hoàn thành
  const activeCount = todos.filter((todo) => !todo.completed).length;

  // ============ RENDER ============

  return (
    <div className="app">
      {/* Background decorations */}
      <div className="app__bg">
        <div className="app__bg-circle app__bg-circle--1" />
        <div className="app__bg-circle app__bg-circle--2" />
        <div className="app__bg-circle app__bg-circle--3" />
      </div>

      <div className="app__container">
        {/* Header */}
        <header className="app__header">
          <div className="app__logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1 className="app__title">Todo App</h1>
          <p className="app__subtitle">Quản lý công việc hiệu quả</p>
        </header>

        {/* Error banner */}
        {error && (
          <div className="app__error" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>{error}</span>
            <button
              className="app__error-close"
              onClick={() => setError("")}
              aria-label="Đóng thông báo lỗi"
            >
              ✕
            </button>
          </div>
        )}

        {/* Form thêm todo */}
        <TodoForm onAddTodo={handleAddTodo} />

        {/* Filter buttons + counter */}
        <FilterButtons
          activeFilter={filter}
          onFilterChange={setFilter}
          todoCount={filteredTodos.length}
          activeCount={activeCount}
        />

        {/* Danh sách todos */}
        <TodoList
          todos={filteredTodos}
          isLoading={isLoading}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
        />
      </div>
    </div>
  );
}

export default App;
