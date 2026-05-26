/**
 * ===========================================
 * COMMENT TYPES - Nested Comments System
 * ===========================================
 * Định nghĩa đầy đủ các TypeScript types cho hệ thống
 * comments lồng nhau (nested/tree comments).
 */

/**
 * Interface chính đại diện cho một comment trong hệ thống.
 * Sử dụng recursive type: `replies` chứa mảng Comment[],
 * cho phép nested vô hạn cấp.
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
 * DTO (Data Transfer Object) cho việc tạo comment mới.
 * Client chỉ cần gửi content và author, server sẽ tự
 * generate id, avatar, createdAt, likes, replies.
 */
export interface CreateCommentDTO {
  content: string;
  author: string;
}

/**
 * Generic API response wrapper.
 * Đảm bảo tất cả API responses có format thống nhất.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * API error response format.
 */
export interface ApiError {
  success: false;
  error: string;
  statusCode: number;
}

/**
 * Kết quả tìm kiếm comment trong tree structure.
 * Trả về comment tìm được, mảng cha chứa nó, và comment cha.
 */
export interface FindCommentResult {
  comment: Comment | null;
  parentList: Comment[] | null;
  parentComment: Comment | null;
}
