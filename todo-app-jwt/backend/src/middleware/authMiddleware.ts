import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Mở rộng Request của Express để chứa thông tin user sau khi decode JWT
declare global {
    namespace Express {
        interface Request {
            user?: { userId: string, username: string };
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    // Token gửi lên thường có format: "Bearer <token>"
    //frontend sẽ gửi token vào header với key 'Authorization' và value là 'Bearer <token>'
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Token is missing' });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
            res.status(403).json({ message: 'Invalid or expired token' });
            return;
        }

        // Gắn thông tin payload vào req.user để các controller sử dụng
        req.user = decoded as { userId: string, username: string };
        next();
    });
};
