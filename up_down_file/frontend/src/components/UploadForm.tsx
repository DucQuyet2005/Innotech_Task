import { useState } from 'react';
import { uploadImage } from '../api';

interface Props {
    onUploadSuccess: () => void; // refresh danh sách
}

export const UploadForm = ({ onUploadSuccess }: Props) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // Validate trước khi upload
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setError('Chỉ chấp nhận file JPG, PNG');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Kích thước tối đa 5MB');
            return;
        }
        setError('');
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setUploading(true);
        setProgress(0);
        try {
            await uploadImage(selectedFile, (percent) => setProgress(percent));
            onUploadSuccess(); // refresh list
            setSelectedFile(null);
            setPreviewUrl(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
            <input type="file" accept="image/jpeg,image/png" onChange={handleFileChange} disabled={uploading} />
            {previewUrl && (
                <div>
                    <img src={previewUrl} alt="Preview" style={{ width: '150px', marginTop: '1rem' }} />
                </div>
            )}
            {selectedFile && !uploading && (
                <button onClick={handleUpload}>Upload</button>
            )}
            {uploading && (
                <div>
                    <progress value={progress} max={100} />
                    <span>{progress}%</span>
                </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};