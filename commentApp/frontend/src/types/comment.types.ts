/**
 * ===========================================
 * COMMENT TYPES - Frontend Type Definitions
 * ===========================================
 * 
 * Types đồng bộ với backend, đảm bảo type safety
 * xuyên suốt fullstack application.
 */

/**
 * Interface Comment - recursive type cho nested comments.
 * `replies` chứa mảng Comment[] → cho phép vô hạn cấp.
 */
export interface Comment {
  id: number;
  content: string;
  author: string;
  avatar: string;
  createdAt: string;
  likes: number;
  replies: Comment[];
}

/**
 * DTO tạo comment mới.
 */
export interface CreateCommentDTO {
  content: string;
  author: string;
}

/**
 * API Response wrapper.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
