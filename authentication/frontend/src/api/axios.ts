import axios from 'axios';

const api = axios.create({
    baseURL: '', // Để trống vì chúng ta đã dùng Vite Proxy
    //Neu khong dung vite proxy thi de baseURL: 'http://localhost:5000',
    withCredentials: true, // BẮT BUỘC: để gửi/nhận cookie từ backend
});

export default api;
