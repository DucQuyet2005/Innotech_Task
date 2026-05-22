import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users } from '../db';
import type { User } from '../types';

const router = Router();

router.post('/register', async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ message: 'Username and password are required' });
        return;
    }

    // Kiểm tra trùng username
    for (const user of users.values()) {
        if (user.username === username) {
            res.status(400).json({ message: 'Username already exists' });
            return;
        }
    }

    // Hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Tạo user mới. Bun hỗ trợ sẵn crypto.randomUUID() tương tự browser
    const id = crypto.randomUUID();
    const newUser: User = { id, username, passwordHash };

    users.set(id, newUser);

    res.status(201).json({ message: 'User registered successfully' });
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    let foundUser: User | null = null;
    for (const user of users.values()) {
        if (user.username === username) {
            foundUser = user;
            break;
        }
    }

    if (!foundUser) {
        res.status(401).json({ message: 'Invalid username or password' });
        return;
    }

    // So sánh mật khẩu đã hash
    const isMatch = await bcrypt.compare(password, foundUser.passwordHash);
    if (!isMatch) {
        res.status(401).json({ message: 'Invalid username or password' });
        return;
    }

    // Ký token với hạn 7 ngày
    const token = jwt.sign(
        { userId: foundUser.id, username: foundUser.username },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
    );

    res.json({ token, username: foundUser.username });
});

export default router;
