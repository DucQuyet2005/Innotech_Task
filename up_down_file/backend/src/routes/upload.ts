import { Router } from 'express';
import { upload } from '../utils/fileHandler';
import fs from 'fs';
import path from 'path';

const router = Router();
const uploadDir = 'uploads';

// POST /api/upload - upload ảnh
router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Không có file' });
    const fileUrl = `/api/uploads/${req.file.filename}`;
    res.json({
        message: 'Upload thành công',
        filename: req.file.filename,
        url: fileUrl
    });
});

// GET /api/uploads/:filename - lấy ảnh (static)
router.get('/uploads/:filename', (req, res) => {
    const filepath = path.join(uploadDir, req.params.filename);
    if (fs.existsSync(filepath)) return res.sendFile(path.resolve(filepath));
    res.status(404).json({ error: 'Không tìm thấy ảnh' });
});

// GET /api/images - lấy danh sách tất cả ảnh đã upload
router.get('/images', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) return res.status(500).json({ error: 'Lỗi đọc thư mục' });
        const images = files
            .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
            .map(file => ({ filename: file, url: `/api/uploads/${file}` }));
        res.json(images);
    });
});

// DELETE /api/images/:filename - xóa ảnh
router.delete('/images/:filename', (req, res) => {
    const filepath = path.join(uploadDir, req.params.filename);
    fs.unlink(filepath, (err) => {
        if (err) return res.status(404).json({ error: 'Xóa thất bại' });
        res.json({ message: 'Xóa thành công' });
    });
});

export default router;