/**
 * ===========================================
 * APP COMPONENT - Root Application
 * ===========================================
 */

import React from 'react';
import { Toaster } from 'react-hot-toast';
import CommentList from './components/CommentList';
import { FiMessageCircle } from 'react-icons/fi';
import './App.css';

const App: React.FC = () => {
  // PostId giả lập - trong thực tế lấy từ URL params
  const postId = '123';

  return (
    <div className="app">
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            borderRadius: '12px',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* App Header */}
      <header className="app-header">
        <h1 className="app-title">
          <FiMessageCircle className="app-title-icon" />
          Nested Comments
        </h1>
        <p className="app-subtitle">
          Hệ thống bình luận lồng nhau — ReactJS + ExpressJS + TypeScript
        </p>
      </header>

      {/* Comment System */}
      <main>
        <CommentList postId={postId} />
      </main>
    </div>
  );
};

export default App;