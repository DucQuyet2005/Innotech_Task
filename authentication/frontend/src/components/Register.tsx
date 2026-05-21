
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await register(name, email, password);
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Đăng ký thất bại');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Đăng ký tài khoản</h2>
            <input type="text" placeholder="Họ và Tên" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Mật khẩu (tối thiểu 6 ký tự)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            <button type="submit">Đăng ký</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link></p>
        </form>
    );
};

export default Register;
