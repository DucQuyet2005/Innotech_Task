/**
 * ===========================================
 * COMMENT FORM COMPONENT
 * ===========================================
 * 
 * Form tạo comment mới (top-level).
 * Hỗ trợ Enter để submit, Shift+Enter để xuống dòng.
 */

import React, { useState, useRef } from 'react';
import { FiSend, FiUser } from 'react-icons/fi';
import '../styles/CommentForm.css';

interface CommentFormProps {
  onSubmit: (content: string, author: string) => Promise<void>;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !author.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim(), author.trim());
      setContent('');
      // Giữ lại tên author cho lần comment tiếp theo
    } catch {
      // Error handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Xử lý keyboard shortcuts:
   * - Enter → submit
   * - Shift+Enter → xuống dòng
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  /**
   * Auto-resize textarea theo nội dung.
   */
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit} id="comment-form">
      <div className="form-header">
        <FiUser className="form-icon" />
        <input
          type="text"
          className="author-input"
          placeholder="Tên của bạn..."
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={50}
          id="comment-author-input"
        />
      </div>

      <div className="form-body">
        <textarea
          ref={textareaRef}
          className="content-textarea"
          placeholder="Viết bình luận... (Enter để gửi, Shift+Enter xuống dòng)"
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          rows={2}
          maxLength={2000}
          id="comment-content-textarea"
        />

        <button
          type="submit"
          className={`submit-btn ${content.trim() && author.trim() ? 'active' : ''}`}
          disabled={!content.trim() || !author.trim() || isSubmitting}
          id="comment-submit-btn"
        >
          <FiSend />
          <span>{isSubmitting ? 'Đang gửi...' : 'Đăng'}</span>
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
