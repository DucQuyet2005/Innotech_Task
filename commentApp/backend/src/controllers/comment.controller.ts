/**
 * ===========================================
 * COMMENT CONTROLLER - HTTP Request Handlers
 * ===========================================
 * 
 * Controller chỉ chịu trách nhiệm:
 *   1. Parse request params/body
 *   2. Validate input
 *   3. Gọi service
 *   4. Format và trả response
 * 
 * Không chứa business logic! Logic nằm ở service layer.
 */

import type { Request, Response } from 'express';
import * as commentService from '@/services/comment.service';

/**
 * GET /api/posts/:postId/comments
 * Lấy toàn bộ comments của một post.
 */
export function getComments(req: Request, res: Response): void {
  const postId = req.params.postId as string;
  const comments = commentService.getCommentsByPostId(postId);

  res.json({
    success: true,
    data: comments,
    message: `Found ${comments.length} comments`,
  });
}

/**
 * POST /api/posts/:postId/comments
 * Tạo comment mới ở top-level.
 */
export function createComment(req: Request, res: Response): void {
  const postId = req.params.postId as string;
  const { content, author } = req.body;

  // Validate input
  if (!content || typeof content !== 'string' || !content.trim()) {
    res.status(400).json({
      success: false,
      error: 'Content is required and must be a non-empty string',
    });
    return;
  }

  if (!author || typeof author !== 'string' || !author.trim()) {
    res.status(400).json({
      success: false,
      error: 'Author is required and must be a non-empty string',
    });
    return;
  }

  const newComment = commentService.createNewComment(postId, {
    content: content.trim(),
    author: author.trim(),
  });

  res.status(201).json({
    success: true,
    data: newComment,
    message: 'Comment created successfully',
  });
}

/**
 * POST /api/posts/:postId/comments/:commentId/replies
 * Tạo reply cho một comment.
 */
export function createReply(req: Request, res: Response): void {
  const postId = req.params.postId as string;
  const commentId = parseInt(req.params.commentId as string, 10);
  const { content, author } = req.body;

  // Validate commentId
  if (isNaN(commentId)) {
    res.status(400).json({
      success: false,
      error: 'Invalid comment ID',
    });
    return;
  }

  // Validate input
  if (!content || typeof content !== 'string' || !content.trim()) {
    res.status(400).json({
      success: false,
      error: 'Content is required and must be a non-empty string',
    });
    return;
  }

  if (!author || typeof author !== 'string' || !author.trim()) {
    res.status(400).json({
      success: false,
      error: 'Author is required and must be a non-empty string',
    });
    return;
  }

  const reply = commentService.createReplyToComment(postId, commentId, {
    content: content.trim(),
    author: author.trim(),
  });

  if (!reply) {
    res.status(404).json({
      success: false,
      error: 'Parent comment not found',
    });
    return;
  }

  res.status(201).json({
    success: true,
    data: reply,
    message: 'Reply created successfully',
  });
}

/**
 * DELETE /api/posts/:postId/comments/:commentId
 * Xóa comment (kèm toàn bộ replies con).
 */
export function deleteComment(req: Request, res: Response): void {
  const postId = req.params.postId as string;
  const commentId = parseInt(req.params.commentId as string, 10);

  // Validate commentId
  if (isNaN(commentId)) {
    res.status(400).json({
      success: false,
      error: 'Invalid comment ID',
    });
    return;
  }

  const success = commentService.removeComment(postId, commentId);

  if (!success) {
    res.status(404).json({
      success: false,
      error: 'Comment not found',
    });
    return;
  }

  res.json({
    success: true,
    data: null,
    message: 'Comment deleted successfully',
  });
}

/**
 * POST /api/posts/:postId/comments/:commentId/like
 * Like một comment.
 */
export function likeComment(req: Request, res: Response): void {
  const postId = req.params.postId as string;
  const commentId = parseInt(req.params.commentId as string, 10);

  if (isNaN(commentId)) {
    res.status(400).json({
      success: false,
      error: 'Invalid comment ID',
    });
    return;
  }

  const comment = commentService.toggleLikeComment(postId, commentId);

  if (!comment) {
    res.status(404).json({
      success: false,
      error: 'Comment not found',
    });
    return;
  }

  res.json({
    success: true,
    data: comment,
    message: 'Comment liked successfully',
  });
}
