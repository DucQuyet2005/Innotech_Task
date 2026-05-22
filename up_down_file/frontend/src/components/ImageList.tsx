import { useState, useEffect } from 'react';
import { fetchImages, deleteImage, type ImageItem } from '../api';

export const ImageList = () => {
    const [images, setImages] = useState<ImageItem[]>([]);
    const [loading, setLoading] = useState(true);

    const loadImages = async () => {
        try {
            const data = await fetchImages();
            setImages(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (filename: string) => {
        if (confirm('Xóa ảnh này?')) {
            await deleteImage(filename);
            loadImages(); // refresh
        }
    };

    useEffect(() => {
        loadImages();
    }, []);

    if (loading) return <p>Đang tải...</p>;

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {images.map((img) => (
                <div key={img.filename} style={{ border: '1px solid #ddd', padding: '0.5rem' }}>
                    <img src={`http://localhost:3000${img.url}`} alt={img.filename} style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
                    <br />
                    <button onClick={() => handleDelete(img.filename)}>Xóa</button>
                </div>
            ))}
        </div>
    );
};