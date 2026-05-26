/**
 * ===========================================
 * COMMENT LIST COMPONENT
 * ===========================================
 * 
 * Component chính chứa:
 *   - Comment form (tạo comment mới)
 *   - Danh sách comments (recursive tree)
 *   - Loading state
 *   - Empty state
 *   - Error state
 * 
 * Sử dụng useComments hook để quản lý state.
 */

import React from 'react';
import { useComments } from '../hooks/useComments';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import { FiMessageSquare, FiRefreshCw } from 'react-icons/fi';
import '../styles/CommentList.css';

interface CommentListProps {
  postId: string;
}

/**
 * Đếm tổng tất cả comments + replies (recursive).
 */
function countAllComments(comments: { replies: typeof comments }[]): number {
  let count = comments.length;
  for (const comment of comments) {
    count += countAllComments(comment.replies);
  }
  return count;
}

const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const {
    comments,
    loading,
    error,
    addComment,
    addReply,
    removeComment,
    likeComment,
    refreshComments,
  } = useComments(postId);

  const totalCount = countAllComments(comments);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="error-state" id="error-state">
        <p className="error-message">⚠️ {error}</p>
        <button className="retry-btn" onClick={refreshComments}>
          <FiRefreshCw /> Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="comment-list-container" id="comment-list">
      {/* Form tạo comment mới */}
      <CommentForm onSubmit={addComment} />

      {/* Header với counter */}
      <div className="comments-header">
        <div className="comments-title">
          <FiMessageSquare className="comments-icon" />
          <h2>
            Bình luận{' '}
            <span className="comment-count">({totalCount})</span>
          </h2>
        </div>
        <button
          className="refresh-btn"
          onClick={refreshComments}
          title="Làm mới"
        >
          <FiRefreshCw />
        </button>
      </div>

      {/* Danh sách comments hoặc empty state */}
      {comments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="comments-tree">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              depth={0}
              onReply={addReply}
              onDelete={removeComment}
              onLike={likeComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList;