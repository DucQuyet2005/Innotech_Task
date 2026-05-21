# PHÂN TÍCH CHI TIẾT DỰ ÁN & TỔNG KẾT KIẾN THỨC CỐT LÕI
## Dự án: Todo App Fullstack (React + Express + TypeScript + Bun)

Dự án này là một ứng dụng quản lý công việc (Todo App) hoàn chỉnh, được xây dựng theo mô hình **Client-Server** hiện đại, áp dụng kiến trúc sạch (Clean Architecture) ở Backend và phân chia Component hợp lý ở Frontend.

---

## 1. KIẾN TRÚC TỔNG THỂ (OVERALL ARCHITECTURE)

Dự án được chia làm hai phần độc lập:
*   **Backend (RESTful API Server)**: Xử lý logic nghiệp vụ, quản lý dữ liệu in-memory, cung cấp các API endpoints và validate dữ liệu đầu vào. Chạy trên môi trường **Bun Runtime** siêu tốc.
*   **Frontend (Single Page Application)**: Giao diện người dùng tương tác, giao tiếp với API Server qua `fetch`, quản lý trạng thái hiển thị và cập nhật UI thời gian thực. Được build bằng **Vite + React**.

```mermaid
graph LR
    subgraph Frontend (React + Vite)
        UI[User Interface] --> API_Client[todoApi.ts]
    end
    
    subgraph Backend (Express + Bun)
        API_Client -- HTTP Request --> Routes[todo.routes.ts]
        Routes --> Controller[todo.controller.ts]
        Controller --> Service[todo.service.ts]
        Service --> Data[todos.ts (In-Memory)]
    end
```

---

## 2. PHÂN TÍCH CHI TIẾT BACKEND (SERVER-SIDE)

### 2.1 Cấu trúc Thư mục & Luồng dữ liệu (Data Flow)
Backend tuân thủ nghiêm ngặt mô hình phân tầng (Layered Architecture):

1.  **`src/index.ts` (Entry Point)**: Khởi tạo Express app, cấu hình các middleware toàn cục (`cors`, `express.json`), cấu hình routes và đăng ký middleware xử lý lỗi tập trung.
2.  **`src/routes/todo.routes.ts` (Routing Layer)**: Định nghĩa các API endpoints và ánh xạ chúng tới các hàm tương ứng trong Controller.
3.  **`src/controllers/todo.controller.ts` (Controller Layer)**: 
    *   Nhận request từ client.
    *   Trích xuất dữ liệu (`params`, `body`, `query`).
    *   Gọi tầng Service xử lý logic nghiệp vụ.
    *   Trả về HTTP response với status code tương ứng (200, 201, 400, 404, 500).
4.  **`src/services/todo.service.ts` (Business Logic Service Layer)**:
    *   Nơi tập trung toàn bộ nghiệp vụ (tính toán, biến đổi dữ liệu).
    *   Thực hiện kiểm tra tính hợp lệ của dữ liệu (Validation).
    *   Tương tác trực tiếp với tầng Data Store.
5.  **`src/data/todos.ts` (Data Store Layer)**: Lưu trữ mảng `todos` in-memory. Đóng vai trò như một Database tạm thời.
6.  **`src/types/todo.type.ts` (Type Definitions)**: Khai báo cấu trúc dữ liệu (`Todo`, `CreateTodoRequest`, `ApiResponse`) để đảm bảo Type Safety xuyên suốt mã nguồn.

### 2.2 Xử lý Lỗi Tập trung (Centralized Error Handling)
Thay vì dùng block `try/catch` ở khắp nơi và trả về lỗi không thống nhất, hệ thống sử dụng Middleware xử lý lỗi chuyên biệt:
*   **`notFoundHandler`**: Bắt các request đến đường dẫn không tồn tại và trả về lỗi 404 sạch sẽ.
*   **`errorHandler`**: Bắt các lỗi runtime chưa được xử lý trong ứng dụng, log lại thông tin chi tiết trên server và trả về lỗi 500 thân thiện cho Client để tránh rò rỉ thông tin hệ thống.

---

## 3. PHÂN TÍCH CHI TIẾT FRONTEND (CLIENT-SIDE)

### 3.1 Giao tiếp API & Xử lý Trạng thái (State Management)
*   **`todoApi.ts`**: Đóng gói các hàm gọi API bằng `fetch` (`getTodos`, `createTodo`, `toggleTodo`, `deleteTodo`). Giúp code ở Component sạch sẽ hơn, chỉ tập trung vào hiển thị.
*   **`App.tsx` (State Hub)**: Quản lý các state lớn gồm danh sách `todos`, trạng thái `filter` hiện tại, trạng thái tải trang `isLoading`, và thông báo lỗi toàn cục `error`.
*   **Optimistic UI Update**: Khi thực hiện các hành động như thêm hoặc xóa, ứng dụng sẽ cập nhật ngay lập tức UI bằng state local để mang lại trải nghiệm mượt mà không có độ trễ cho người dùng.

### 3.2 Thiết kế Giao diện (UI/UX)
*   **Theme**: Thiết kế theo phong cách Dark Mode hiện đại. Sử dụng kỹ thuật **Glassmorphism** (sử dụng hiệu ứng `backdrop-filter: blur(20px)` trên nền mờ đục nhẹ `rgba`).
*   **CSS Variables**: Toàn bộ hệ màu (Priority color, Accent color, Dark theme) được khai báo tập trung trong `:root` giúp dễ dàng tùy biến hoặc đổi sang Light Mode sau này.
*   **Micro-animations**:
    *   Hiệu ứng Hover nhấc nhẹ card công việc (`transform: translateY(-2px)`).
    *   Hiệu ứng Loading skeleton khi đang chờ dữ liệu API.
    *   Hiệu ứng Shake (rung lắc) khi gặp lỗi nhập liệu.

---

## 4. TỔNG KẾT KIẾN THỨC CỐT LÕI CẦN NẮM VỮNG

Qua dự án này, bạn cần làm chủ các khối kiến thức sau:

### 💡 4.1 Bun Runtime & TypeScript
*   **Bun**: Hiểu cách Bun đóng vai trò là một JS runtime nhanh hơn Node.js, tích hợp sẵn package manager (`bun install`), test runner, và có thể chạy trực tiếp file `.ts` không cần qua bước compile thủ công.
*   **TypeScript Types vs Interfaces**:
    *   Sử dụng `interface` cho cấu trúc đối tượng có thể mở rộng (`Todo`).
    *   Sử dụng `type` cho Union Types (`Priority: 'low' | 'medium' | 'high'`).
*   **Generic Types trong API**: Thiết kế kiểu dữ liệu API chuẩn hóa:
    ```typescript
    export interface ApiResponse<T> {
      success: boolean;
      data?: T;
      error?: string;
    }
    ```

### 💡 4.2 Lập trình REST API (Express + Node/Bun)
*   **HTTP Methods**:
    *   `GET`: Truy xuất tài nguyên.
    *   `POST`: Tạo mới tài nguyên.
    *   `PUT`: Thay thế/Cập nhật toàn bộ tài nguyên.
    *   `DELETE`: Xóa tài nguyên.
*   **HTTP Status Codes**:
    *   `200 OK`: Thành công.
    *   `201 Created`: Tạo mới thành công.
    *   `400 Bad Request`: Lỗi client gửi lên (Sai định dạng dữ liệu, validate thất bại).
    *   `404 Not Found`: Không tìm thấy tài nguyên.
    *   `500 Internal Server Error`: Lỗi hệ thống server.
*   **CORS (Cross-Origin Resource Sharing)**: Hiểu cơ chế bảo mật trình duyệt chặn Client từ origin này (`http://localhost:5173`) gọi API đến một origin khác (`http://localhost:3000`), và cách cấu hình middleware `cors()` ở Backend để cho phép kết nối.

### 💡 4.3 Quản lý State & Hiệu năng trong React
*   **`useCallback`**: Dùng để ghi nhớ (memoize) hàm `fetchTodos`, tránh việc hàm này bị khởi tạo lại mỗi lần `App` re-render, từ đó tránh việc chạy vô tận vòng lặp trong `useEffect`.
*   **Lọc dữ liệu phía Client (Computed State)**: Thay vì tạo thêm một state `filteredTodos` (dễ gây đồng bộ lỗi), ta nên tính toán trực tiếp giá trị này trong lúc render dựa vào state gốc `todos` và state `filter`:
    ```typescript
    const filteredTodos = todos.filter(todo => { ... });
    ```
*   **Luồng dữ liệu một chiều (Unidirectional Data Flow)**: Dữ liệu đi từ trên xuống (Props), sự kiện đi từ dưới lên (Callbacks/Event Handlers).

---

## 5. HƯỚNG DẪN TEST API BẰNG POSTMAN HOẶC cURL

Để kiểm tra backend hoạt động độc lập trước khi chạy frontend:

### 1. Lấy danh sách Todos (GET)
*   **Endpoint**: `http://localhost:3000/api/todos`
*   **Method**: `GET`
*   **cURL**:
    ```bash
    curl http://localhost:3000/api/todos
    ```

### 2. Tạo Todo mới (POST)
*   **Endpoint**: `http://localhost:3000/api/todos`
*   **Method**: `POST`
*   **Headers**: `Content-Type: application/json`
*   **Body (JSON)**:
    ```json
    {
      "title": "Học kiến trúc Clean Architecture",
      "priority": "high"
    }
    ```
*   **cURL**:
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"title":"Học kiến trúc Clean Architecture", "priority":"high"}' http://localhost:3000/api/todos
    ```

### 3. Cập nhật trạng thái hoàn thành (PUT Toggle)
*   **Endpoint**: `http://localhost:3000/api/todos/1/toggle`
*   **Method**: `PUT`
*   **cURL**:
    ```bash
    curl -X PUT http://localhost:3000/api/todos/1/toggle
    ```

### 4. Xóa Todo (DELETE)
*   **Endpoint**: `http://localhost:3000/api/todos/1`
*   **Method**: `DELETE`
*   **cURL**:
    ```bash
    curl -X DELETE http://localhost:3000/api/todos/1
    ```

---

## 6. CÁC LỖI THƯỜNG GẶP VÀ CÁCH XỬ LÝ (TROUBLESHOOTING)

| Lỗi thường gặp | Nguyên nhân | Cách xử lý |
| :--- | :--- | :--- |
| **`Network Error` / `Failed to fetch`** | API Server chưa chạy hoặc sai PORT. | Đảm bảo terminal Backend đang chạy và URL của `API_BASE_URL` trong frontend khớp với PORT của backend (`3000`). |
| **`CORS Error` ở console trình duyệt** | Chưa bật CORS ở Backend hoặc cấu hình whitelist sai. | Sử dụng middleware `app.use(cors())` trong `backend/src/index.ts` trước khi khai báo routes. |
| **Lặp vô tận (Infinite Re-renders)** | Gọi API trực tiếp trong thân React component mà không nằm trong `useEffect`, hoặc thiếu Dependency Array. | Luôn bọc các side-effects/API calls trong `useEffect` và truyền dependency array thích hợp. |
| **Mất dữ liệu sau khi restart server** | Dữ liệu đang được lưu trữ tạm thời trong RAM (In-Memory array). | Đây là hành vi mong muốn cho ứng dụng test. Nếu muốn bền vững, cần tích hợp Database thực tế (MongoDB, PostgreSQL, SQLite). |
