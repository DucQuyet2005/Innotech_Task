# Báo cáo Tổng hợp Kết quả Triển khai dự án Up/Down File (Day 1)

Dự án đã hoàn thành việc xây dựng ứng dụng tải lên, quản lý danh sách và xóa hình ảnh trực quan với cả Frontend và Backend viết bằng TypeScript, chạy trong môi trường Bun.

---

## 1. Kết quả đạt được (Achievements)

### 🖥️ Backend (Express + Multer + TypeScript + Bun)
* **Khởi chạy Server:** Server viết trên Express chạy mượt mà trên cổng `5000` thông qua công cụ runtime Bun (`bun run --watch src/index.ts`).
* **Xử lý Tệp tin (Multer Middleware - `fileHandler.ts`):**
  * Tự động tạo thư mục `uploads/` nếu chưa tồn tại.
  * Đổi tên file ngẫu nhiên để tránh trùng lặp (`Date.now() + Math.random()`).
  * Bộ lọc bảo mật chỉ cho phép tải lên định dạng hình ảnh (`jpg`, `jpeg`, `png`).
  * Giới hạn dung lượng tối đa `5MB` mỗi ảnh.
* **Hệ thống API Endpoint (`upload.ts`):**
  * `POST /api/upload`: Upload 1 ảnh, trả về thông tin file và đường dẫn ảnh.
  * `GET /api/uploads/:filename`: Xem ảnh (Serving Static File).
  * `GET /api/images`: Lấy toàn bộ danh sách file ảnh đang lưu trên server.
  * `DELETE /api/images/:filename`: Xóa file ảnh khỏi thư mục lưu trữ cục bộ.

### 🌐 Frontend (React + Vite + TypeScript)
* **Kết nối API (`api.ts`):**
  * Sử dụng `XMLHttpRequest` để thực hiện upload file, cho phép bắt sự kiện `xhr.upload.onprogress` để cập nhật tiến trình upload theo thời gian thực (Real-time Progress Tracking).
  * Sử dụng Fetch API cho các phương thức lấy danh sách và xóa ảnh.
* **Component `UploadForm.tsx`:**
  * Cho phép chọn ảnh từ máy tính.
  * Preview (xem trước) ảnh ngay lập tức bằng `URL.createObjectURL(file)`.
  * Validate định dạng file và dung lượng file ngay tại Client trước khi gửi.
  * Hiển thị thanh tiến trình tải lên (Progress Bar) kèm phần trăm dạng số trực quan.
* **Component `ImageList.tsx`:**
  * Lấy danh sách ảnh từ Backend và hiển thị dạng danh sách lưới (Grid Layout).
  * Hỗ trợ nút xóa ảnh kèm theo hộp thoại xác nhận (`confirm`).
* **Component `App.tsx`:**
  * Điều phối giao diện chính, kết hợp form upload và danh sách ảnh hiển thị.

---

## 2. Chi tiết các bước triển khai (Implementation Steps)

### Bước 1: Cấu hình và cài đặt Backend
1. Khởi tạo dự án Node/Bun, cài đặt các thư viện thiết yếu: `express`, `cors`, `multer` và các type `@types/express`, `@types/multer`, `@types/cors`.
2. Tạo cấu trúc thư mục backend:
   ```text
   backend/
   ├── src/
   │   ├── routes/
   │   │   └── upload.ts      # Router định nghĩa các REST API
   │   ├── utils/
   │   │   └── fileHandler.ts # Middleware cấu hình Multer lưu file
   │   └── index.ts           # Điểm khởi chạy Express App
   ├── package.json
   └── tsconfig.json
   ```

### Bước 2: Thiết lập Logic Backend
1. **`fileHandler.ts`:** Định nghĩa `storage` của `multer` trỏ đến thư mục `uploads/`, sinh suffix ngẫu nhiên cho tên file và viết hàm `fileFilter` để chặn file lạ.
2. **`upload.ts`:** Viết các route xử lý `POST /upload` sử dụng middleware `upload.single('image')`. Đồng thời cung cấp route `GET /images` đọc thư mục `uploads` qua `fs.readdir` và route `DELETE /images/:filename` để xóa file qua `fs.unlink`.
3. **`index.ts`:** Import router, bật CORS, bật json parser, và lắng nghe kết nối trên cổng `5000`.

### Bước 3: Triển khai Frontend
1. Cấu hình file `api.ts` chứa các hàm fetch tương tác với URL gốc `http://localhost:5000/api`. Hàm `uploadImage` được triển khai bằng `XMLHttpRequest` thay vì `fetch` thông thường để có thể lắng nghe sự kiện tiến trình `onprogress`.
2. Phát triển Component **`UploadForm`**:
   * Sử dụng hook `useState` quản lý trạng thái file đã chọn, ảnh xem trước, trạng thái upload và tiến trình phần trăm.
   * Xử lý validate kiểu file `image/jpeg, image/png` và kích thước tối đa `5 * 1024 * 1024` bytes.
3. Phát triển Component **`ImageList`**:
   * Gọi hàm `fetchImages` khi component mounted (`useEffect`).
   * Sử dụng grid layout hiển thị các ảnh thu nhỏ.
   * Tạo hàm `handleDelete` gọi API xóa và load lại danh sách.
4. Điều chỉnh **`App.tsx`** làm gốc hiển thị chính.

### Bước 4: Chạy thử nghiệm và Đánh giá
1. Khởi động backend bằng lệnh `bun dev` (chạy trên port `5000`).
2. Khởi động frontend bằng lệnh `bun dev` (chạy trên port `3000`/`5173`).
3. Thực hiện thử nghiệm tải ảnh để kiểm tra Progress bar tăng dần từ `0%` đến `100%`.
4. Nhấn Xóa ảnh để kiểm chứng tính năng xóa hoạt động đồng bộ với backend.
