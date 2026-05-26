/**
 * ===========================================
 * API LAYER - Axios Instance & API Methods
 * ===========================================
 * 
 * Tách biệt API layer khỏi components.
 * Sử dụng axios instance với base URL configured.
 */

import axios from 'axios';
import type { Comment, ApiResponse } from '../types';

/**
 * Axios instance với base URL trỏ đến backend.
 */
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Lấy tất cả comments của một post.
 */
export async function fetchComments(postId: string): Promise<Comment[]> {
  const { data } = await api.get<ApiResponse<Comment[]>>(
    `/posts/${postId}/comments`
  );
  return data.data;
}

/**
 * Tạo comment mới ở top-level.
 */
export async function createComment(
  postId: string,
  content: string,
  author: string
): Promise<Comment> {
  const { data } = await api.post<ApiResponse<Comment>>(
    `/posts/${postId}/comments`,
    { content, author }
  );
  return data.data;
}

/**
 * Reply vào một comment.
 */
export async function createReply(
  postId: string,
  commentId: number,
  content: string,
  author: string
): Promise<Comment> {
  const { data } = await api.post<ApiResponse<Comment>>(
    `/posts/${postId}/comments/${commentId}/replies`,
    { content, author }
  );
  return data.data;
}

/**
 * Xóa comment.
 */
export async function deleteComment(
  postId: string,
  commentId: number
): Promise<void> {
  await api.delete(`/posts/${postId}/comments/${commentId}`);
}

/**
 * Like comment.
 */
export async function likeComment(
  postId: string,
  commentId: number
): Promise<Comment> {
  const { data } = await api.post<ApiResponse<Comment>>(
    `/posts/${postId}/comments/${commentId}/like`
  );
  return data.data;
}

export default api;
