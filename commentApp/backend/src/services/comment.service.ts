/**
 * ===========================================
 * COMMENT SERVICE - Business Logic Layer
 * ===========================================
 * 
 * Service chứa toàn bộ business logic cho comment operations.
 * Controller chỉ xử lý HTTP request/response, còn logic
 * thực sự nằm ở đây. Giúp code dễ test và tái sử dụng.
 * 
 * === ARCHITECTURE ===
 * Route → Controller → Service → Data Store
 *                        ↕
 *                   Utils (recursive)
 */

import type { Comment, CreateCommentDTO } from '@/types';
import { commentsStore, getNextId } from '@/data/data';
import {
  findCommentById,
  insertReply,
  deleteCommentById,
} from '@/utils/recursive.utils';

/**
 * Lấy tất cả comments của một post.
 */
export function getCommentsByPostId(postId: string): Comment[] {
  return commentsStore.get(postId) || [];
}

/**
 * Tạo comment mới ở top-level (không phải reply).
 * 
 * @param postId - ID bài viết
 * @param dto - Dữ liệu tạo comment (content, author)
 * @returns Comment mới được tạo
 */
export function createNewComment(
  postId: string,
  dto: CreateCommentDTO
): Comment {
  const newComment: Comment = {
    id: getNextId(),
    content: dto.content,
    author: dto.author,
    avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
    createdAt: new Date().toISOString(),
    likes: 0,
    replies: [],
  };

  // Tạo mảng mới nếu post chưa có comments
  if (!commentsStore.has(postId)) {
    commentsStore.set(postId, []);
  }

  commentsStore.get(postId)!.push(newComment);
  return newComment;
}

/**
 * Tạo reply cho một comment cụ thể.
 * 
 * Sử dụng insertReply (recursive) để tìm parent comment
 * ở bất kỳ cấp nào trong tree và chèn reply vào.
 * 
 * @param postId - ID bài viết
 * @param parentCommentId - ID comment cần reply vào
 * @param dto - Dữ liệu reply (content, author)
 * @returns Reply mới hoặc null nếu parent không tồn tại
 */
export function createReplyToComment(
  postId: string,
  parentCommentId: number,
  dto: CreateCommentDTO
): Comment | null {
  const comments = commentsStore.get(postId);
  if (!comments) return null;

  const reply: Comment = {
    id: getNextId(),
    content: dto.content,
    author: dto.author,
    avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
    createdAt: new Date().toISOString(),
    likes: 0,
    replies: [],
  };

  // insertReply dùng recursive để tìm parent ở bất kỳ depth
  const success = insertReply(comments, parentCommentId, reply);
  return success ? reply : null;
}

/**
 * Xóa comment theo ID.
 * 
 * Sử dụng deleteCommentById (recursive) để tìm và xóa
 * comment ở bất kỳ cấp nào. Khi xóa parent → tất cả
 * replies con cũng bị xóa (cascading delete).
 * 
 * @param postId - ID bài viết
 * @param commentId - ID comment cần xóa
 * @returns true nếu xóa thành công
 */
export function removeComment(
  postId: string,
  commentId: number
): boolean {
  const comments = commentsStore.get(postId);
  if (!comments) return false;

  return deleteCommentById(comments, commentId);
}

/**
 * Like/Unlike một comment.
 * 
 * @param postId - ID bài viết
 * @param commentId - ID comment cần like
 * @returns Comment đã cập nhật hoặc null
 */
export function toggleLikeComment(
  postId: string,
  commentId: number
): Comment | null {
  const comments = commentsStore.get(postId);
  if (!comments) return null;

  const { comment } = findCommentById(comments, commentId);
  if (!comment) return null;

  comment.likes += 1;
  return comment;
}
