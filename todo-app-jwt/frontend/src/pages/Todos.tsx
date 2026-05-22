import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

// Kiểu dữ liệu cho một Todo item
interface Todo {
    id: string;
    text: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
}

// Kiểu cho modal edit
interface EditModalState {
    isOpen: boolean;
    todo: Todo | null;
}

const Todos: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newText, setNewText] = useState('');
    const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');

    // Trạng thái Modal chỉnh sửa
    const [editModal, setEditModal] = useState<EditModalState>({ isOpen: false, todo: null });
    const [editText, setEditText] = useState('');
    const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>('medium');

    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    // Lấy dữ liệu khi component mount
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const res = await axiosClient.get('/todos');
                setTodos(res.data);
            } catch (err: any) {
                if (err.response?.status === 401 || err.response?.status === 403) {
                    handleLogout();
                }
            }
        };
        fetchTodos();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };

    // === THÊM TODO MỚI ===
    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newText.trim()) return;
        try {
            const res = await axiosClient.post('/todos', { text: newText, priority: newPriority });
            setTodos([...todos, res.data]);
            setNewText('');
            setNewPriority('medium');
        } catch (err) {
            console.error('Failed to add todo', err);
        }
    };

    // === TOGGLE HOÀN THÀNH ===
    const handleToggleComplete = async (todo: Todo) => {
        try {
            const res = await axiosClient.put(`/todos/${todo.id}`, {
                completed: !todo.completed
            });
            setTodos(todos.map(t => t.id === todo.id ? res.data : t));
        } catch (err) {
            console.error('Failed to update todo', err);
        }
    };

    // === XÓA TODO ===
    const handleDelete = async (id: string) => {
        try {
            await axiosClient.delete(`/todos/${id}`);
            setTodos(todos.filter(t => t.id !== id));
        } catch (err) {
            console.error('Failed to delete todo', err);
        }
    };

    // === MỞ MODAL CHỈNH SỬA ===
    const openEditModal = (todo: Todo) => {
        setEditModal({ isOpen: true, todo });
        setEditText(todo.text);
        setEditPriority(todo.priority || 'medium');
    };

    // === ĐÓNG MODAL ===
    const closeEditModal = () => {
        setEditModal({ isOpen: false, todo: null });
        setEditText('');
        setEditPriority('medium');
    };

    // === LƯU CHỈNH SỬA ===
    const handleEditSave = async () => {
        if (!editModal.todo || !editText.trim()) return;
        try {
            const res = await axiosClient.put(`/todos/${editModal.todo.id}`, {
                text: editText,
                priority: editPriority
            });
            setTodos(todos.map(t => t.id === editModal.todo!.id ? res.data : t));
            closeEditModal();
        } catch (err) {
            console.error('Failed to save edit', err);
        }
    };

    // Xử lý phím Enter trong modal
    const handleEditKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleEditSave();
        if (e.key === 'Escape') closeEditModal();
    };

    // === THỐNG KÊ ===
    const totalTodos = todos.length;
    const completedTodos = todos.filter(t => t.completed).length;
    const pendingTodos = totalTodos - completedTodos;

    // Nhãn ưu tiên hiển thị
    const priorityLabel = (p: string) => {
        if (p === 'high') return '🔴 High';
        if (p === 'medium') return '🟡 Medium';
        return '🟢 Low';
    };

    return (
        <div className="todo-page">
            {/* ===== HEADER ===== */}
            <div className="todo-header">
                <div className="todo-header-left">
                    <h1>My Tasks</h1>
                    <p>Welcome back, {username} 👋</p>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {/* ===== THỐNG KÊ ===== */}
            <div className="todo-stats">
                <div className="stat-card">
                    <div className="stat-number">{totalTodos}</div>
                    <div className="stat-label">Total</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{pendingTodos}</div>
                    <div className="stat-label">Pending</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{completedTodos}</div>
                    <div className="stat-label">Done</div>
                </div>
            </div>

            {/* ===== FORM THÊM ===== */}
            <form className="todo-add-form" onSubmit={handleAddTodo}>
                <input
                    type="text"
                    placeholder="✨ Add a new task..."
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                />
                <select
                    className="priority-select"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                </select>
                <button type="submit" className="add-btn">+ Add</button>
            </form>

            {/* ===== DANH SÁCH TODO ===== */}
            <ul className="todo-list">
                {todos.map(todo => (
                    <li
                        key={todo.id}
                        className={`todo-item priority-${todo.priority || 'medium'} ${todo.completed ? 'completed-item' : ''}`}
                    >
                        {/* Checkbox tùy chỉnh */}
                        <label className="custom-checkbox">
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => handleToggleComplete(todo)}
                            />
                            <span className="checkmark"></span>
                        </label>

                        {/* Nội dung todo */}
                        <div className="todo-content">
                            <div
                                className={`todo-text ${todo.completed ? 'completed' : ''}`}
                                onDoubleClick={() => openEditModal(todo)}
                                title="Double click to edit"
                            >
                                {todo.text}
                            </div>
                            <div className="todo-meta">
                                <span className={`priority-badge ${todo.priority || 'medium'}`}>
                                    <span className="priority-dot"></span>
                                    {todo.priority || 'medium'}
                                </span>
                            </div>
                        </div>

                        {/* Nút hành động */}
                        <div className="todo-actions">
                            <button
                                className="action-btn edit-action"
                                onClick={() => openEditModal(todo)}
                                title="Edit"
                            >
                                ✏️
                            </button>
                            <button
                                className="action-btn delete-action"
                                onClick={() => handleDelete(todo.id)}
                                title="Delete"
                            >
                                🗑️
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* ===== EMPTY STATE ===== */}
            {todos.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <h3>No tasks yet</h3>
                    <p>Add your first task using the form above!</p>
                </div>
            )}

            {/* ===== MODAL CHỈNH SỬA ===== */}
            {editModal.isOpen && (
                <div className="modal-overlay" onClick={closeEditModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Edit Task</h3>

                        <div className="modal-field">
                            <label>Task Name</label>
                            <input
                                type="text"
                                autoFocus
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onKeyDown={handleEditKeyDown}
                                placeholder="Enter task name..."
                            />
                        </div>

                        <div className="modal-field">
                            <label>Priority</label>
                            <div className="priority-picker">
                                {(['low', 'medium', 'high'] as const).map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        className={`priority-option ${editPriority === p ? `selected-${p}` : ''}`}
                                        onClick={() => setEditPriority(p)}
                                    >
                                        {priorityLabel(p)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="btn btn-outline" onClick={closeEditModal}>
                                Cancel
                            </button>
                            <button className="btn" onClick={handleEditSave}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Todos;
