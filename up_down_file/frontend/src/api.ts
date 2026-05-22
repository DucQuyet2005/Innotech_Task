const API_BASE = 'http://localhost:5000/api';

export interface ImageItem {
    filename: string;
    url: string;
}

// Upload ảnh kèm progress tracking
export const uploadImage = async (
    file: File,
    onProgress: (percent: number) => void
): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_BASE}/upload`);
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                onProgress(percent);
            }
        };
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(new Error('Upload thất bại'));
            }
        };
        xhr.onerror = () => reject(new Error('Lỗi mạng'));
        xhr.send(formData);
    });
};

// Lấy danh sách ảnh
export const fetchImages = async (): Promise<ImageItem[]> => {
    const res = await fetch(`${API_BASE}/images`);
    if (!res.ok) throw new Error('Không thể lấy danh sách ảnh');
    return res.json();
};

// Xóa ảnh
export const deleteImage = async (filename: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/images/${filename}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Xóa thất bại');
};