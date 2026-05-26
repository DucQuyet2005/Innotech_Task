/**
 * ===========================================
 * LOADING SPINNER COMPONENT
 * ===========================================
 */

import React from 'react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-container" id="loading-spinner">
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p className="loading-text">Đang tải bình luận...</p>
    </div>
  );
};

export default LoadingSpinner;
