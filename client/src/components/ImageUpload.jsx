import { useState } from 'react';
import { uploadImageToCloudinary } from '../utils/cloudinary';

/**
 * ImageUpload Component
 * Handles image upload to Cloudinary with preview and progress
 */
export default function ImageUpload({ onImageUploaded, defaultImage = null }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(defaultImage);
  const [error, setError] = useState('');

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError('');
      setUploading(true);
      setProgress(0);

      // Show local preview immediately
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      // Upload to Cloudinary
      const cloudinaryUrl = await uploadImageToCloudinary(file, (percent) => {
        setProgress(percent);
      });

      // Clean up local preview
      URL.revokeObjectURL(localPreview);

      // Set Cloudinary URL
      setPreviewUrl(cloudinaryUrl);
      onImageUploaded(cloudinaryUrl);
      setUploading(false);
      setProgress(0);
    } catch (err) {
      setError(err.message || 'Upload failed');
      setUploading(false);
      setProgress(0);
      setPreviewUrl(defaultImage);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onImageUploaded(null);
    setError('');
  };

  return (
    <div className="image-upload-container">
      {/* Preview */}
      {previewUrl && (
        <div className="image-preview">
          <img src={previewUrl} alt="Preview" />
          {!uploading && (
            <button
              type="button"
              className="remove-btn"
              onClick={handleRemove}
            >
              ✕ Remove
            </button>
          )}
        </div>
      )}

      {/* Upload Button */}
      {!previewUrl && (
        <label className="upload-btn">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            disabled={uploading}
            style={{ display: 'none' }}
          />
          <span>📷 {uploading ? 'Uploading...' : 'Select Image'}</span>
        </label>
      )}

      {/* Progress Bar */}
      {uploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-text">{progress}%</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="upload-error">
          ⚠️ {error}
        </div>
      )}

      <style jsx>{`
        .image-upload-container {
          width: 100%;
          margin: 10px 0;
        }

        .image-preview {
          position: relative;
          width: 200px;
          height: 200px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(255, 0, 0, 0.8);
          color: white;
          border: none;
          border-radius: 4px;
          padding: 4px 8px;
          cursor: pointer;
          font-size: 12px;
        }

        .remove-btn:hover {
          background: rgba(255, 0, 0, 1);
        }

        .upload-btn {
          display: inline-block;
          padding: 10px 20px;
          background: #4CAF50;
          color: white;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .upload-btn:hover {
          background: #45a049;
        }

        .upload-btn span {
          font-size: 14px;
        }

        .upload-progress {
          margin-top: 10px;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 5px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4CAF50, #8BC34A);
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 12px;
          color: #666;
        }

        .upload-error {
          color: #f44336;
          font-size: 12px;
          margin-top: 5px;
          padding: 8px;
          background: #ffebee;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
