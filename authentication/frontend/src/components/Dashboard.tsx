import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error('Lỗi khi đăng xuất', err);
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', margin: '20px auto' }}>
            <h2>Dashboard</h2>
            {user ? (
                <div>
                    <p>Xin chào, <strong>{user.name}</strong>!</p>
                    <p> Email: {user.email}</p>
                    <p> User ID: {user.id}</p>
                    <button onClick={handleLogout} style={{ marginTop: '10px', backgroundColor: 'red', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Đăng xuất
                    </button>
                </div>
            ) : (
                <p>Đang tải dữ liệu...</p>
            )}
        </div>
    );
};

export default Dashboard;
