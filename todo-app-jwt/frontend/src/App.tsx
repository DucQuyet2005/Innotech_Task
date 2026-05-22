import { type JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Todos from './pages/Todos';
import './App.css';

// Higher-Order Component để bảo vệ các route yêu cầu đăng nhập
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/todos" element={
          <PrivateRoute>
            <Todos />
          </PrivateRoute>
        } />
        {/* Nếu người dùng vào các đường dẫn không tồn tại, đẩy về danh sách todo */}
        <Route path="*" element={<Navigate to="/todos" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
