/**
 * ===========================================
 * COMMENT ITEM COMPONENT (RECURSIVE)
 * ===========================================
 * 
 * ĐÂY LÀ COMPONENT QUAN TRỌNG NHẤT CỦA HỆ THỐNG.
 * 
 * === RECURSIVE RENDERING ===
 * 
 * CommentItem tự gọi lại chính nó để render replies:
 * 
 *   <CommentItem comment={A}>
 *     <CommentItem comment={A1}>
 *       <CommentItem comment={A1a} />
 *     </CommentItem>
 *     <CommentItem comment={A2} />
 *   </CommentItem>
 * 
 * React sẽ render tree này bằng cách:
 *   1. Render CommentItem cho comment A
 *   2. Trong A, map qua A.replies → render CommentItem cho A1, A2
 *   3. Trong A1, map qua A1.replies → render CommentItem cho A1a
 *   4. A1a không có replies → dừng (base case)
 * 
 * Mỗi level tăng depth +1, dùng để indent và style.
 */

import React, { useState } from 'react';
import type { Comment } from '../types';
import { getRelativeTime } from '../utils/timeUtils';
import ActionButtons from './ActionButtons';
import ReplyForm from './ReplyForm';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import '../styles/CommentItem.css';

interface CommentItemProps {
  comment: Comment;
  depth: number;
  onReply: (parentId: number, content: string, author: string) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
  onLike: (commentId: number) => Promise<void>;
}

/** Giới hạn indent tối đa (tránh UI quá hẹp trên mobile) */
const MAX_INDENT_DEPTH = 6;

/**
 * Đếm tổng số replies ở tất cả các cấp (recursive).
 */
function countTotalReplies(comment: Comment): number {
  let count = comment.replies.length;
  for (const reply of comment.replies) {
    count += countTotalReplies(reply);
  }
  return count;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  depth,
  onReply,
  onDelete,
  onLike,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const hasReplies = comment.replies.length > 0;
  const totalReplies = hasReplies ? countTotalReplies(comment) : 0;

  // Indent giới hạn tại MAX_INDENT_DEPTH
  const effectiveDepth = Math.min(depth, MAX_INDENT_DEPTH);

  const handleReplySubmit = async (content: string, author: string) => {
    await onReply(comment.id, content, author);
    setShowReplyForm(false);
  };

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc muốn xóa bình luận này và tất cả phản hồi?')) {
      onDelete(comment.id);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(comment.id);
  };

  return (
    <div
      className={`comment-item depth-${effectiveDepth} ${depth > 0 ? 'is-reply' : 'is-root'}`}
      id={`comment-${comment.id}`}
    >
      {/* Thread line cho nested replies */}
      {depth > 0 && <div className="thread-line" />}

      <div className="comment-content-wrapper">
        {/* Avatar */}
        <div className="comment-avatar">
          <img
            src={comment.avatar}
            alt={`${comment.author}'s avatar`}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author)}&background=6366f1&color=fff&size=40`;
            }}
          />
        </div>

        <div className="comment-body">
          {/* Header: Author + Time */}
          <div className="comment-header">
            <span className="comment-author">{comment.author}</span>
            <span className="comment-time">{getRelativeTime(comment.createdAt)}</span>
          </div>

          {/* Nội dung bình luận */}
          <div className="comment-text">
            {comment.content.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < comment.content.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>

          {/* Action Buttons */}
          <ActionButtons
            likes={comment.likes + (isLiked ? 1 : 0)}
            isLiked={isLiked}
            replyCount={comment.replies.length}
            onReply={() => setShowReplyForm(!showReplyForm)}
            onLike={handleLike}
            onDelete={handleDelete}
          />

          {/* Reply Form (inline) */}
          {showReplyForm && (
            <ReplyForm
              parentAuthor={comment.author}
              onSubmit={handleReplySubmit}
              onCancel={() => setShowReplyForm(false)}
            />
          )}
        </div>
      </div>

      {/* 
        RECURSIVE RENDERING: 
        Render replies bằng cách map qua comment.replies
        và render CommentItem cho mỗi reply với depth + 1.
        Đây chính là recursive component pattern!
      */}
      {hasReplies && (
        <div className="replies-section">
          {/* Collapse/Expand toggle */}
          <button
            className="collapse-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronDown />}
            <span>
              {isCollapsed
                ? `Hiện ${totalReplies} phản hồi`
                : `Ẩn phản hồi`}
            </span>
          </button>

          {/* Recursive: render mỗi reply bằng CommentItem */}
          {!isCollapsed && (
            <div className="replies-list">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  depth={depth + 1}
                  onReply={onReply}
                  onDelete={onDelete}
                  onLike={onLike}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;