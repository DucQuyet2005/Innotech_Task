import express, { type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users, getNextId } from "../db.js";
import { authenticate } from '../middleware/auth.js';
import { EmitFlags } from 'typescript';

const router = express.Router();

//Dang ky 

router.post('/register', async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ message: 'Missing fields' });
    }
    if (!email.includes('@')) {
        return res.status(400).json({ message: 'Invalid email' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Passowrd must be at least 6 characters' });
    }

    const existing = users.find(u => u.email === email);
    if (existing) {
        return res.status(400).json({ message: 'Email alread register' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: getNextId(),
        email,
        password: hashedPassword,
        name,
    };
    users.push(newUser);
    res.status(201).json({ message: 'User created successfully', userId: newUser.id });
});


//Dang nhap

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ message: "Invalid user" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES_IN as any });
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: 'Login successful', user: { id: user.id, email: user.email, name: user.name } });
});

//Dang xuat 

router.post('/logout', (req: Request, res: Response) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
})

//Lay thong tin user hien tai

router.get('/me', authenticate, (req: Request, res: Response) => {
    const user = users.find(u => u.id === req.userId);
    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ id: user.id, email: user.email, name: user.name });
});

router.get('/check', authenticate, (req: Request, res: Response) => {
    res.json({ isAuthenticated: true, userId: req.userId });
});

export default router;