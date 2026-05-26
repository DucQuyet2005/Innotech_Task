/**
 * ===========================================
 * EMPTY STATE COMPONENT
 * ===========================================
 * 
 * Hiển thị khi chưa có comments nào.
 */

import React from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import '../styles/EmptyState.css';

const EmptyState: React.FC = () => {
  return (
    <div className="empty-state" id="empty-state">
      <div className="empty-icon">
        <FiMessageSquare />
      </div>
      <h3 className="empty-title">Chưa có bình luận nào</h3>
      <p className="empty-description">
        Hãy là người đầu tiên chia sẻ suy nghĩ của bạn!
      </p>
    </div>
  );
};

export default EmptyState;
