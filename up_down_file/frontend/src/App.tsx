import { UploadForm } from './components/UploadForm';
import { ImageList } from './components/ImageList';

function App() {
  const refreshList = () => {
    // Gọi lại ImageList re-fetch bằng cách thay đổi key hoặc dùng state
    // Ở đây đơn giản: reload component bằng cách force re-render
    window.location.reload(); // cách nhanh, nhưng không tối ưu.
    // Thực tế nên dùng state để trigger fetch.
  };
  // Cách tốt hơn: nâng state images lên App và truyền xuống.
  // Nhưng vì demo, tôi sẽ dùng callback.
  // Bạn có thể cải tiến bằng cách dùng useEffect dependency.
  // Ở đây tôi chỉ demo luồng.
  return (
    <div style={{ padding: '2rem' }}>
      <h1> Upload ảnh</h1>
      <UploadForm onUploadSuccess={() => window.location.reload()} />
      <h2> Danh sách ảnh</h2>
      <ImageList />
    </div>
  );
}

export default App;