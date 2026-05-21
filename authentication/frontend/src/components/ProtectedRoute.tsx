import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Đang kiểm tra quyền truy cập...</div>;
    }

    // Nếu có thông tin user -> cho phép đi tiếp (Outlet)
    // Nếu không có user -> Điều hướng về trang login
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
