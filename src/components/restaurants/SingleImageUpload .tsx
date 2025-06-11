import React, { useState, useRef } from 'react';
import { Upload, Edit3, X } from 'lucide-react';
import Image from 'next/image';

type SingleImageUploadProps = {
  onImageSelect?: (file: File) => void;
  onImageRemove?: () => void;
  className?: string;
  placeholder?: string;
};

const SingleImageUpload: React.FC<SingleImageUploadProps> = ({ 
  onImageSelect,
  onImageRemove,
  className = '',
  placeholder = "Click to upload image"
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Remove setSelectedImage (not defined)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

if (file.size > 500 * 1024) {
      alert('File size must be less than 500KB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Call parent callback
    if (onImageSelect) {
      onImageSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageRemove) {
      onImageRemove();
    }
  };

  // Add handleEditClick to trigger file input
  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="relative">
        {!preview ? (
          // Upload Box
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center flex-col justify-center border-2 h-60 border-dashed border-[#0a0e11] transition-colors rounded-lg p-6 text-center cursor-pointer bg-[#182226] hover:bg-[#232e36] group"
          >
            <Upload className="w-12 h-12 text-white  mx-auto mb-4 transition-colors" />
            <p className="text-white font-medium transition-colors">
              {placeholder}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              PNG, JPG up to 500KB
            </p>
          </div>
        ) : (
          // Preview Box with Same Dimensions
          <div className="relative w-full h-60 border-2 border-[#0a0e11] rounded-lg overflow-hidden bg-white">
            <div className=" w-full h-full relative">
              <Image
                src={preview} 
                alt="Selected"
                className="w-full h-full object-cover"
                fill
              />
              
              {/* Overlay with buttons */}
              <div className="absolute inset-0 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    onClick={handleEditClick}
                    className="cursor-pointer text-white bg-black p-2 rounded-full transition-colors"
                    title="Change image"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button> 
                  <button
                    onClick={handleRemoveImage}
                    className="cursor-pointer bg-[#B40000] hover:bg-[#B40000] text-white p-2 rounded-full transition-colors"
                    title="Remove image"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            

          </div>
        )}
      </div>
    </div>
  );
};

export default SingleImageUpload;