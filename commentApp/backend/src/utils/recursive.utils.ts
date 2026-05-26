/**
 * ===========================================
 * RECURSIVE UTILITIES - Tree Comment Operations
 * ===========================================
 * 
 * Đây là phần CORE của hệ thống nested comments.
 * Tất cả các thao tác trên cây comment (tìm kiếm, chèn, xóa)
 * đều sử dụng đệ quy (recursion) vì cấu trúc dữ liệu là tree.
 * 
 * === GIẢI THÍCH RECURSIVE LOGIC ===
 * 
 * Cây comment có dạng:
 *   Comment A
 *     ├── Reply A1
 *     │     └── Reply A1a
 *     └── Reply A2
 *   Comment B
 *     └── Reply B1
 * 
 * Để tìm một comment bất kỳ (ví dụ A1a), ta phải:
 *   1. Duyệt qua mỗi comment ở cấp cao nhất (A, B)
 *   2. Nếu không tìm thấy → đệ quy vào replies của nó
 *   3. Lặp lại cho đến khi tìm thấy hoặc hết tree
 * 
 * Pattern này áp dụng cho cả findCommentById, insertReply, deleteComment.
 */

import type { Comment, FindCommentResult } from '@/types';

/**
 * TÌM COMMENT THEO ID (RECURSIVE)
 * ================================
 * 
 * Duyệt toàn bộ tree để tìm comment có id trùng khớp.
 * Trả về comment, mảng cha chứa nó, và comment cha (nếu có).
 * 
 * @param comments - Mảng comments cần tìm kiếm
 * @param targetId - ID comment cần tìm
 * @param parentList - Mảng cha chứa comment hiện tại (dùng cho recursion)
 * @param parentComment - Comment cha (dùng cho recursion)
 * @returns FindCommentResult chứa comment tìm được + context
 * 
 * === FLOW ===
 * findCommentById([A, B], targetId=A1a)
 *   → check A.id !== A1a
 *   → recurse vào A.replies = [A1, A2]
 *     → check A1.id !== A1a
 *     → recurse vào A1.replies = [A1a]
 *       → check A1a.id === A1a ✓ → return!
 */
export function findCommentById(
  comments: Comment[],
  targetId: number,
  parentList: Comment[] | null = null,
  parentComment: Comment | null = null
): FindCommentResult {
  for (const comment of comments) {
    // Base case: tìm thấy comment
    if (comment.id === targetId) {
      return {
        comment,
        parentList: parentList ?? comments,
        parentComment,
      };
    }

    // Recursive case: tìm trong replies
    if (comment.replies && comment.replies.length > 0) {
      const result = findCommentById(
        comment.replies,
        targetId,
        comment.replies,
        comment
      );
      // Nếu tìm thấy trong nhánh con → trả về ngay
      if (result.comment) {
        return result;
      }
    }
  }

  // Không tìm thấy trong toàn bộ nhánh này
  return { comment: null, parentList: null, parentComment: null };
}

/**
 * CHÈN REPLY VÀO COMMENT (RECURSIVE)
 * ====================================
 * 
 * Tìm comment cha theo parentId, rồi push reply mới vào
 * mảng replies của nó. Sử dụng findCommentById bên trong.
 * 
 * @param comments - Mảng comments gốc
 * @param parentId - ID comment cần reply vào
 * @param reply - Comment reply mới
 * @returns true nếu chèn thành công, false nếu không tìm thấy parent
 * 
 * === IMMUTABILITY NOTE ===
 * Hàm này MUTATE trực tiếp mảng comments (in-memory store).
 * Trong frontend, ta sẽ xử lý immutable bằng cách tạo copy mới.
 */
export function insertReply(
  comments: Comment[],
  parentId: number,
  reply: Comment
): boolean {
  const { comment: parent } = findCommentById(comments, parentId);

  if (!parent) {
    return false;
  }

  // Push reply vào mảng replies của comment cha
  parent.replies.push(reply);
  return true;
}

/**
 * XÓA COMMENT THEO ID (RECURSIVE)
 * =================================
 * 
 * Tìm comment cần xóa, xác định mảng cha chứa nó,
 * rồi splice ra khỏi mảng đó.
 * 
 * @param comments - Mảng comments gốc (top-level)
 * @param targetId - ID comment cần xóa
 * @returns true nếu xóa thành công
 * 
 * === LƯU Ý ===
 * Khi xóa 1 comment, tất cả replies con cũng bị xóa theo
 * (vì chúng nằm trong mảng replies của comment bị xóa).
 * Đây là cascading delete tự nhiên nhờ tree structure.
 */
export function deleteCommentById(
  comments: Comment[],
  targetId: number
): boolean {
  // Tìm comment trong tree
  const { comment, parentList } = findCommentById(comments, targetId);

  if (!comment || !parentList) {
    // Trường hợp đặc biệt: comment nằm ở top-level
    // (parentList = null khi comment ở root level)
    const topIndex = comments.findIndex((c) => c.id === targetId);
    if (topIndex !== -1) {
      comments.splice(topIndex, 1);
      return true;
    }
    return false;
  }

  // Xóa comment khỏi mảng cha
  const index = parentList.findIndex((c) => c.id === targetId);
  if (index !== -1) {
    parentList.splice(index, 1);
    return true;
  }

  return false;
}

/**
 * ĐẾM TỔNG SỐ REPLIES (RECURSIVE)
 * ==================================
 * 
 * Đếm tất cả replies ở mọi cấp trong tree.
 * Hữu ích cho hiển thị "X replies" trên UI.
 */
export function countAllReplies(comment: Comment): number {
  let count = comment.replies.length;
  for (const reply of comment.replies) {
    count += countAllReplies(reply);
  }
  return count;
}
