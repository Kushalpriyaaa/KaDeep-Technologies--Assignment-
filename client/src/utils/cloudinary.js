/**
 * Cloudinary Configuration and Upload Utility
 * 
 * Setup Instructions:
 * 1. Sign up at https://cloudinary.com (Free account)
 * 2. Get your credentials from Dashboard
 * 3. Add to .env file:
 *    VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *    VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
 */

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_FOLDER = 'sah-one-menu'; // Folder name in Cloudinary

/**
 * Upload image to Cloudinary
 * @param {File} file - Image file to upload
 * @param {Function} onProgress - Progress callback (percentage)
 * @returns {Promise<string>} - Cloudinary image URL
 */
export const uploadImageToCloudinary = async (file, onProgress = null) => {
  try {
    // Validate file
    if (!file || !file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file');
    }

    // Check file size (max 5MB recommended)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('Image size should be less than 5MB');
    }

    // Check if Cloudinary is configured
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Cloudinary is not configured. Please check your .env file');
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', CLOUDINARY_FOLDER);

    // Upload to Cloudinary
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentage = Math.round((e.loaded / e.total) * 100);
            onProgress(percentage);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url);
        } else {
          // Better error message
          let errorMessage = 'Upload failed';
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            errorMessage = errorResponse.error?.message || errorMessage;
          } catch (e) {
            // Response wasn't JSON
          }
          console.error('Cloudinary error:', xhr.status, xhr.responseText);
          reject(new Error(errorMessage));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.open('POST', uploadUrl);
      xhr.send(formData);
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Delete image from Cloudinary (requires backend implementation)
 * Note: Direct deletion from frontend is not recommended for security
 * This should be done from your backend using Cloudinary Admin API
 */
export const deleteImageFromCloudinary = async (publicId) => {
  console.warn('Delete operation should be handled by backend for security');
  // Backend implementation needed
};

/**
 * Get optimized image URL with transformations
 * @param {string} url - Original Cloudinary URL
 * @param {Object} options - Transformation options
 * @returns {string} - Transformed image URL
 */
export const getOptimizedImageUrl = (url, options = {}) => {
  const {
    width = 400,
    height = 400,
    quality = 'auto:good',
    crop = 'limit'
  } = options;

  if (!url || !url.includes('cloudinary.com')) {
    return url; // Return original if not Cloudinary URL
  }

  // Insert transformation before '/upload/'
  const transformation = `w_${width},h_${height},c_${crop},q_${quality}`;
  return url.replace('/upload/', `/upload/${transformation}/`);
};

/**
 * Validate Cloudinary configuration
 * @returns {boolean} - True if configured correctly
 */
export const isCloudinaryConfigured = () => {
  return !!(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET);
};

export default {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
  getOptimizedImageUrl,
  isCloudinaryConfigured
};
