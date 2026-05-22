import { Router, type Request, type Response } from 'express';
import { todos } from '../db';
import type { Todo } from '../types';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Lấy danh sách todo của user đăng nhập
router.get('/', authenticateToken, (req: Request, res: Response) => {
    const userId = req.user?.userId;
    // Lọc lấy các todo thuộc về userId này
    const userTodos = Array.from(todos.values()).filter(todo => todo.userId === userId);
    res.json(userTodos);
});

// Tạo todo mới
router.post('/', authenticateToken, (req: Request, res: Response): void => {
    const { text, priority } = req.body;
    if (!text) {
        res.status(400).json({ message: 'Text is required' });
        return;
    }

    const newTodo: Todo = {
        id: crypto.randomUUID(),
        userId: req.user!.userId,
        text: text,
        completed: false,
        priority: priority || 'medium'
    };

    todos.set(newTodo.id, newTodo);
    res.status(201).json(newTodo);
});

// Cập nhật todo
router.put('/:id', authenticateToken, (req: Request, res: Response): void => {
    const { id } = req.params;
    const { text, completed, priority } = req.body;

    const todo = todos.get(id as string);
    // Kiểm tra todo có tồn tại và có thuộc về user đang gọi API không
    if (!todo || todo.userId !== req.user?.userId) {
        res.status(404).json({ message: 'Todo not found' });
        return;
    }

    if (typeof text === 'string') todo.text = text;
    if (typeof completed === 'boolean') todo.completed = completed;
    if (typeof priority === 'string') todo.priority = priority as 'low' | 'medium' | 'high';

    res.json(todo);
});

// Xóa todo
router.delete('/:id', authenticateToken, (req: Request, res: Response): void => {
    const { id } = req.params;

    const todo = todos.get(id as string);
    if (!todo || todo.userId !== req.user?.userId) {
        res.status(404).json({ message: 'Todo not found' });
        return;
    }

    todos.delete(id as string);
    res.json({ message: 'Todo deleted successfully' });
});

export default router;
