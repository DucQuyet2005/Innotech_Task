/**
 * ===========================================
 * COMMENT ROUTES - API Route Definitions
 * ===========================================
 * 
 * Định nghĩa các REST API endpoints cho comment system.
 * Routes chỉ map URL → Controller method, không chứa logic.
 * 
 * === API ENDPOINTS ===
 * GET    /api/posts/:postId/comments                    → Lấy tất cả comments
 * POST   /api/posts/:postId/comments                    → Tạo comment mới
 * POST   /api/posts/:postId/comments/:commentId/replies → Reply vào comment
 * DELETE /api/posts/:postId/comments/:commentId          → Xóa comment
 * POST   /api/posts/:postId/comments/:commentId/like    → Like comment
 */

import { Router } from 'express';
import * as commentController from '@/controllers/comment.controller';

const router = Router({ mergeParams: true });

// Lấy tất cả comments của post
router.get('/', commentController.getComments);

// Tạo comment mới (top-level)
router.post('/', commentController.createComment);

// Reply vào một comment
router.post('/:commentId/replies', commentController.createReply);

// Xóa comment
router.delete('/:commentId', commentController.deleteComment);

// Like comment
router.post('/:commentId/like', commentController.likeComment);

export default router;