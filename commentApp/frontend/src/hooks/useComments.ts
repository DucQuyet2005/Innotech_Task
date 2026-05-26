/**
 * ===========================================
 * useComments HOOK - Comment State Management
 * ===========================================
 * 
 * Custom hook quản lý toàn bộ state và operations
 * liên quan đến comments. Cung cấp:
 *   - comments state
 *   - loading/error states
 *   - CRUD operations
 *   - Optimistic UI updates
 * 
 * === STATE FLOW ===
 * 
 * 1. Component mount → loadComments() → fetch từ API → setComments
 * 2. User thêm comment → optimistic update state → call API → reload nếu lỗi
 * 3. User reply → optimistic insert vào tree → call API → reload nếu lỗi
 * 4. User delete → optimistic remove khỏi tree → call API → reload nếu lỗi
 * 
 * === IMMUTABILITY ===
 * 
 * Tất cả state updates đều tạo copy mới (immutable).
 * Ta dùng recursive helper functions để tạo deep copy
 * của tree khi thêm/xóa reply ở bất kỳ cấp nào.
 * Điều này đảm bảo React phát hiện thay đổi và re-render.
 */

import { useState, useEffect, useCallback } from 'react';
import type { Comment } from '../types';
import * as commentApi from '../api';
import toast from 'react-hot-toast';

interface UseCommentsReturn {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  addComment: (content: string, author: string) => Promise<void>;
  addReply: (parentId: number, content: string, author: string) => Promise<void>;
  removeComment: (commentId: number) => Promise<void>;
  likeComment: (commentId: number) => Promise<void>;
  refreshComments: () => Promise<void>;
}

/**
 * RECURSIVE: Chèn reply vào đúng vị trí trong tree (IMMUTABLE).
 * 
 * Tạo copy mới của toàn bộ tree, chỉ thay đổi node cần thiết.
 * Giúp React phát hiện thay đổi reference và re-render.
 * 
 * @example
 * // Tree ban đầu:      Sau khi insertReplyImmutable(tree, 2, newReply):
 * // [A]                 [A]  ← new object (vì chứa child changed)
 * //   [A1(id=2)]          [A1(id=2)]  ← new object
 * //   [A2]                  [newReply] ← reply mới
 * // [B]                   [A2]
 * //                     [B]  ← same reference (không thay đổi)
 */
function insertReplyImmutable(
  comments: Comment[],
  parentId: number,
  reply: Comment
): Comment[] {
  return comments.map((comment) => {
    if (comment.id === parentId) {
      // Tìm thấy parent → tạo copy mới với reply được thêm
      return {
        ...comment,
        replies: [...comment.replies, reply],
      };
    }

    // Chưa tìm thấy → đệ quy vào replies (immutable)
    if (comment.replies.length > 0) {
      const updatedReplies = insertReplyImmutable(
        comment.replies,
        parentId,
        reply
      );
      // Chỉ tạo object mới nếu replies thực sự thay đổi
      if (updatedReplies !== comment.replies) {
        return { ...comment, replies: updatedReplies };
      }
    }

    return comment;
  });
}

/**
 * RECURSIVE: Xóa comment khỏi tree (IMMUTABLE).
 * 
 * Filter ra comment cần xóa, đệ quy vào replies của mỗi comment
 * để tìm và xóa ở mọi cấp.
 */
function removeCommentImmutable(
  comments: Comment[],
  targetId: number
): Comment[] {
  return comments
    .filter((comment) => comment.id !== targetId)
    .map((comment) => ({
      ...comment,
      replies: removeCommentImmutable(comment.replies, targetId),
    }));
}

/**
 * RECURSIVE: Update likes cho comment trong tree (IMMUTABLE).
 */
function updateLikeImmutable(
  comments: Comment[],
  targetId: number,
  newLikes: number
): Comment[] {
  return comments.map((comment) => {
    if (comment.id === targetId) {
      return { ...comment, likes: newLikes };
    }

    if (comment.replies.length > 0) {
      return {
        ...comment,
        replies: updateLikeImmutable(comment.replies, targetId, newLikes),
      };
    }

    return comment;
  });
}

export function useComments(postId: string): UseCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch comments từ API.
   */
  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await commentApi.fetchComments(postId);
      setComments(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load comments';
      setError(message);
      toast.error('Không thể tải bình luận');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  // Load comments khi mount hoặc postId thay đổi
  useEffect(() => {
    loadComments();
  }, [loadComments]);

  /**
   * Thêm comment mới (top-level) với optimistic UI.
   */
  const addComment = useCallback(
    async (content: string, author: string) => {
      try {
        const newComment = await commentApi.createComment(postId, content, author);
        // Optimistic: thêm comment mới vào đầu mảng
        setComments((prev) => [newComment, ...prev]);
        toast.success('Đã đăng bình luận!');
      } catch (err) {
        toast.error('Không thể đăng bình luận');
        // Rollback: reload từ server
        loadComments();
      }
    },
    [postId, loadComments]
  );

  /**
   * Reply vào comment với optimistic UI.
   * 
   * Sử dụng insertReplyImmutable (recursive) để chèn reply
   * vào đúng vị trí trong tree mà không mutate state.
   */
  const addReply = useCallback(
    async (parentId: number, content: string, author: string) => {
      try {
        const reply = await commentApi.createReply(postId, parentId, content, author);
        // Optimistic: chèn reply vào tree (immutable)
        setComments((prev) => insertReplyImmutable(prev, parentId, reply));
        toast.success('Đã trả lời bình luận!');
      } catch (err) {
        toast.error('Không thể trả lời bình luận');
        loadComments();
      }
    },
    [postId, loadComments]
  );

  /**
   * Xóa comment với optimistic UI.
   * 
   * Sử dụng removeCommentImmutable (recursive) để xóa
   * comment ở bất kỳ cấp nào trong tree.
   */
  const removeComment = useCallback(
    async (commentId: number) => {
      // Lưu snapshot để rollback nếu cần
      const previousComments = comments;

      try {
        // Optimistic: xóa ngay khỏi UI
        setComments((prev) => removeCommentImmutable(prev, commentId));
        await commentApi.deleteComment(postId, commentId);
        toast.success('Đã xóa bình luận!');
      } catch (err) {
        toast.error('Không thể xóa bình luận');
        // Rollback về state cũ
        setComments(previousComments);
      }
    },
    [postId, comments]
  );

  /**
   * Like comment.
   */
  const handleLikeComment = useCallback(
    async (commentId: number) => {
      try {
        const updated = await commentApi.likeComment(postId, commentId);
        setComments((prev) =>
          updateLikeImmutable(prev, commentId, updated.likes)
        );
      } catch (err) {
        toast.error('Không thể thích bình luận');
      }
    },
    [postId]
  );

  return {
    comments,
    loading,
    error,
    addComment,
    addReply,
    removeComment,
    likeComment: handleLikeComment,
    refreshComments: loadComments,
  };
}
