export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Smart image URL resolver:
// - Cloudinary images start with "https://" → return as-is
// - Legacy local paths like "/uploads/..." → prepend API_URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath; // Cloudinary or external URL
  }
  return `${API_URL}${imagePath}`; // Legacy local path
};
