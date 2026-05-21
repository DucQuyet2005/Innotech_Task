# HƯỚNG DẪN TRIỂN KHAI VÀ CHẠY DỰ ÁN TỪ ĐẦU ĐẾN CUỐI (STEP-BY-STEP & RUN GUIDE)
## Dự án: Todo App Fullstack (React + Express + TypeScript + Bun)

Tài liệu này hướng dẫn chi tiết các bước thiết lập, cài đặt dependencies, và chạy dự án từ số 0 đến khi hoàn thiện hoàn chỉnh cả Backend và Frontend.

---

## 🛠️ GIAI ĐOẠN 0: CÀI ĐẶT MÔI TRƯỜNG (PREREQUISITES)

Dự án sử dụng **Bun** làm JS runtime chính (thay thế Node.js/npm) để tối ưu tốc độ.

1.  **Cài đặt Bun trên Windows (PowerShell)**:
    Mở PowerShell với quyền Administrator và chạy lệnh:
    ```powershell
    powershell -c "irm bun.sh/install.ps1 | iex"
    ```
2.  **Kiểm tra phiên bản Bun sau khi cài**:
    ```bash
    bun --version
    ```

---

## 📁 GIAI ĐOẠN 1: THIẾT LẬP THƯ MỤC & CẤU TRÚC DỰ ÁN

Tạo cấu trúc thư mục chính của dự án:
```bash
# Tạo thư mục gốc dự án
mkdir todo-app
cd todo-app

# Tạo thư mục cho backend
mkdir backend
```

---

## 💻 GIAI ĐOẠN 2: TRIỂN KHAI BACKEND (API SERVER)

### Bước 2.1: Khởi tạo project Backend
Di chuyển vào thư mục backend và khởi tạo file `package.json` cùng `tsconfig.json`:
```bash
cd backend
```

Tạo file `package.json` với nội dung cấu hình Bun + Express:
```json
{
  "name": "todo-backend",
  "version": "1.0.0",
  "module": "src/index.ts",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "bun --watch src/index.ts",
    "start": "bun src/index.ts"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.2"
  },
  "dependencies": {
    "cors": "^2.8.6",
    "express": "^5.2.1"
  }
}
```

Tạo file `tsconfig.json` cho cấu hình TypeScript compiler của Bun:
```json
{
  "compilerOptions": {
    "lib": ["ESNext"],
    "target": "ESNext",
    "module": "Preserve",
    "moduleDetection": "force",
    "allowJs": true,
    "types": ["bun"],
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "baseUrl": "./src"
  },
  "include": ["src/**/*.ts"]
}
```

### Bước 2.2: Cài đặt Dependencies Backend
Chạy lệnh sau trong thư mục `backend/`:
```bash
bun install
```

### Bước 2.3: Tạo các files source code Backend theo thứ tự
Tạo các thư mục con trong `backend/src/`:
```bash
mkdir -p src/types src/data src/services src/controllers src/routes src/middleware
```

Lần lượt tạo các file mã nguồn:
1.  **`src/types/todo.type.ts`**: Định nghĩa types cho Todo (`Todo`, `CreateTodoRequest`, `ApiResponse`).
2.  **`src/data/todos.ts`**: Tạo data store in-memory lưu trữ mảng todos mẫu ban đầu.
3.  **`src/services/todo.service.ts`**: Viết business logic cho các chức năng CRUD và validate đầu vào.
4.  **`src/controllers/todo.controller.ts`**: Xử lý nhận req, gọi service, trả về HTTP status codes & JSON response.
5.  **`src/routes/todo.routes.ts`**: Ánh xạ controller tới các endpoint HTTP.
6.  **`src/middleware/errorHandler.ts`**: Viết global error handler và 404 handler.
7.  **`src/index.ts`**: File chính để cài đặt Express server, CORS, JSON parser và lắng nghe port `3000`.

### Bước 2.4: Khởi chạy Backend Server ở chế độ Watch Mode
Chạy lệnh sau để bật server backend:
```bash
bun run dev
```
*Server sẽ tự động restart mỗi khi bạn lưu thay đổi trong code (Watch Mode).*

---

## 🎨 GIAI ĐOẠN 3: TRIỂN KHAI FRONTEND (REACT APP)

### Bước 3.1: Khởi tạo dự án Frontend bằng Vite
Quay lại thư mục gốc dự án (`todo-app`) và chạy lệnh tạo project React + TypeScript:
```bash
cd ..
bun create vite frontend --template react-ts
```

### Bước 3.2: Cài đặt Dependencies Frontend
Di chuyển vào thư mục `frontend/` và cài đặt các thư viện cần thiết:
```bash
cd frontend
bun install
```

### Bước 3.3: Tạo cấu trúc thư mục & Tạo các files React Components
Tạo các thư mục con trong `frontend/src/`:
```bash
mkdir -p src/types src/services src/components
```

Lần lượt viết mã nguồn cho các file:
1.  **`src/types/todo.type.ts`**: Định nghĩa types đồng bộ với backend.
2.  **`src/services/todoApi.ts`**: Viết các API client calls (`fetch` requests) gọi lên server `http://localhost:3000/api/todos`.
3.  **`src/components/TodoForm.tsx`**: Form nhập liệu title, select priority và nút Add.
4.  **`src/components/TodoItem.tsx`**: Item hiển thị thông tin từng task kèm checkbox, date, badge và nút Delete.
5.  **`src/components/FilterButtons.tsx`**: Nút lọc All / Active / Completed và số lượng task đếm ngược.
6.  **`src/components/TodoList.tsx`**: Render danh sách TodoItem, xử lý skeleton loader và empty state.
7.  **`src/index.css`**: Ghi đè file css mặc định bằng các thuộc tính Custom CSS Variables (Dark theme, glassmorphism, animations).
8.  **`src/App.tsx`**: Root component tập hợp các components, quản lý state chính (`todos`, `isLoading`, `error`).
9.  **`index.html`**: Đổi tên title, thêm meta description tối ưu SEO.

### Bước 3.4: Khởi chạy Frontend Dev Server
Chạy lệnh sau trong thư mục `frontend/`:
```bash
bun run dev
```
*Trình duyệt sẽ mở app tại địa chỉ `http://localhost:5173/`.*

---

## 🚀 GIAI ĐOẠN 4: CHẠY ĐỒNG THỜI TOÀN BỘ ỨNG DỤNG

Để dự án hoạt động đồng bộ, bạn cần mở **2 terminal độc lập** để chạy đồng thời cả hai phần:

*   **Terminal 1 (Backend API)**:
    ```bash
    cd backend
    bun run dev
    # Lắng nghe tại http://localhost:3000
    ```

*   **Terminal 2 (Frontend UI)**:
    ```bash
    cd frontend
    bun run dev
    # Truy cập giao diện tại http://localhost:5173
    ```

---

## 📦 GIAI ĐOẠN 5: BUILD PRODUCTION (KHI TRIỂN KHAI THỰC TẾ)

Khi muốn đóng gói ứng dụng để đưa lên server production:

1.  **Build Frontend (tạo file tĩnh HTML/CSS/JS tối ưu hóa)**:
    ```bash
    cd frontend
    bun run build
    # Thư mục build output sẽ nằm ở `frontend/dist/`
    ```
2.  **Chạy Backend ở Production mode (không bật watch-mode)**:
    ```bash
    cd backend
    bun run start
    ```
