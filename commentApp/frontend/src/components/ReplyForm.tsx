/**
 * ===========================================
 * REPLY FORM COMPONENT
 * ===========================================
 * 
 * Form reply inline hiện ngay dưới comment khi bấm Reply.
 * Auto focus vào textarea khi hiện.
 */

import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiX } from 'react-icons/fi';
import '../styles/ReplyForm.css';

interface ReplyFormProps {
  parentAuthor: string;
  onSubmit: (content: string, author: string) => Promise<void>;
  onCancel: () => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({
  parentAuthor,
  onSubmit,
  onCancel,
}) => {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto focus khi form hiện
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !author.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim(), author.trim());
      setContent('');
      onCancel(); // Đóng form sau khi submit
    } catch {
      // Error handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <form className="reply-form" onSubmit={handleSubmit}>
      <div className="reply-form-header">
        <span className="replying-to">
          Trả lời <strong>@{parentAuthor}</strong>
        </span>
        <button
          type="button"
          className="cancel-btn"
          onClick={onCancel}
          title="Hủy"
        >
          <FiX />
        </button>
      </div>

      <input
        type="text"
        className="reply-author-input"
        placeholder="Tên của bạn..."
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        maxLength={50}
      />

      <div className="reply-input-wrapper">
        <textarea
          ref={textareaRef}
          className="reply-textarea"
          placeholder="Viết phản hồi... (Enter gửi, Esc hủy)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          maxLength={2000}
        />

        <button
          type="submit"
          className={`reply-submit-btn ${content.trim() && author.trim() ? 'active' : ''}`}
          disabled={!content.trim() || !author.trim() || isSubmitting}
        >
          <FiSend />
        </button>
      </div>
    </form>
  );
};

export default ReplyForm;
