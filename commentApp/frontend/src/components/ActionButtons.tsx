/**
 * ===========================================
 * ACTION BUTTONS COMPONENT
 * ===========================================
 * 
 * Các nút hành động cho mỗi comment:
 * Reply, Like, Delete.
 */

import React from 'react';
import { FiMessageCircle, FiHeart, FiTrash2 } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import '../styles/ActionButtons.css';

interface ActionButtonsProps {
  likes: number;
  isLiked: boolean;
  replyCount: number;
  onReply: () => void;
  onLike: () => void;
  onDelete: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  likes,
  isLiked,
  replyCount,
  onReply,
  onLike,
  onDelete,
}) => {
  return (
    <div className="action-buttons">
      <button
        className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
        onClick={onLike}
        title="Thích"
      >
        {isLiked ? <FaHeart /> : <FiHeart />}
        {likes > 0 && <span className="action-count">{likes}</span>}
      </button>

      <button className="action-btn reply-btn" onClick={onReply} title="Trả lời">
        <FiMessageCircle />
        <span className="action-label">Trả lời</span>
        {replyCount > 0 && (
          <span className="action-count">{replyCount}</span>
        )}
      </button>

      <button
        className="action-btn delete-btn"
        onClick={onDelete}
        title="Xóa"
      >
        <FiTrash2 />
      </button>
    </div>
  );
};

export default ActionButtons;
