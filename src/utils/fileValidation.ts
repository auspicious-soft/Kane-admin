/**
 * File validation utilities for image uploads
 */

/**
 * Text input validation utilities
 */

/**
 * Sanitizes text input by preventing leading spaces and consecutive spaces
 * @param value - The input value to sanitize
 * @returns Sanitized string with no leading spaces and single spaces only
 */
export const sanitizeTextInput = (value: string): string => {
  if (!value) return value;

  // Remove leading spaces and replace consecutive spaces with single space
  return value.replace(/^\s+/, '').replace(/\s{2,}/g, ' ');
};

/**
 * Creates an onChange handler that sanitizes text input
 * @param originalOnChange - The original onChange handler
 * @returns Enhanced onChange handler with text sanitization
 */
export const createSanitizedInputHandler = (
  originalOnChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
) => {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const sanitizedValue = sanitizeTextInput(e.target.value);

    // Create a new event with sanitized value
    const sanitizedEvent = {
      ...e,
      target: {
        ...e.target,
        value: sanitizedValue,
      },
    };

    originalOnChange(sanitizedEvent);
  };
};

// Allowed image extensions and their corresponding MIME types
export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.tif', '.tiff', '.bmp', '.pdf', '.eps', '.webp'];

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/tiff',
  'image/tif',
  'image/bmp',
  'image/webp',
  'application/pdf',
  'application/postscript', // for .eps files
  'image/x-eps' // alternative MIME type for .eps files
];

/**
 * Validates if a file has an allowed image extension
 * @param file - The file to validate
 * @returns boolean - true if valid, false otherwise
 */
export const isValidImageFile = (file: File): boolean => {
  if (!file) return false;

  // Check MIME type
  const isValidMimeType = ALLOWED_IMAGE_MIME_TYPES.includes(file.type.toLowerCase());

  // Check file extension as fallback
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_IMAGE_EXTENSIONS.some(ext =>
    fileName.endsWith(ext.toLowerCase())
  );

  return isValidMimeType || hasValidExtension;
};

/**
 * Gets the file extension from a filename
 * @param filename - The filename to extract extension from
 * @returns string - The file extension including the dot
 */
export const getFileExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex !== -1 ? filename.substring(lastDotIndex).toLowerCase() : '';
};

/**
 * Validates file size
 * @param file - The file to validate
 * @param maxSizeInMB - Maximum allowed size in MB (default: 5MB)
 * @returns boolean - true if valid, false otherwise
 */
export const isValidFileSize = (file: File, maxSizeInMB: number = 5): boolean => {
  if (!file) return false;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

/**
 * Comprehensive file validation for images
 * @param file - The file to validate
 * @param maxSizeInMB - Maximum allowed size in MB (default: 5MB)
 * @returns object with validation result and error message
 */
export const validateImageFile = (file: File, maxSizeInMB: number = 5): { isValid: boolean; error?: string } => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  // Check file type/extension
  if (!isValidImageFile(file)) {
    const allowedExtensionsStr = ALLOWED_IMAGE_EXTENSIONS.join(', ');
    return {
      isValid: false,
      error: `Invalid file type. Only ${allowedExtensionsStr} files are allowed.`
    };
  }

  // Check file size
  if (!isValidFileSize(file, maxSizeInMB)) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeInMB}MB`
    };
  }

  return { isValid: true };
};

/**
 * Yup validation test function for image files
 * @param maxSizeInMB - Maximum allowed size in MB (default: 5MB)
 * @returns Yup test function
 */
export const createImageFileValidation = (maxSizeInMB: number = 5) => {
  return {
    fileType: {
      name: 'fileType',
      message: `Invalid file type. Only ${ALLOWED_IMAGE_EXTENSIONS.join(', ')} files are allowed.`,
      test: (value: any) => {
        if (!value) return true; // Let required validation handle empty values

        if (value instanceof File) {
          return isValidImageFile(value);
        }

        if (value instanceof FileList) {
          return Array.from(value).every((file: File) => isValidImageFile(file));
        }

        return false;
      }
    },
    fileSize: {
      name: 'fileSize',
      message: `File size must be less than ${maxSizeInMB}MB`,
      test: (value: any) => {
        if (!value) return true; // Let required validation handle empty values

        if (value instanceof File) {
          return isValidFileSize(value, maxSizeInMB);
        }

        if (value instanceof FileList) {
          return Array.from(value).every((file: File) => isValidFileSize(file, maxSizeInMB));
        }

        return false;
      }
    }
  };
};
