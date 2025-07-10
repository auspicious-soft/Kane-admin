import React, { useState, useRef } from 'react';
import { Upload, Edit3, X } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { validateImageFile } from '@/utils/fileValidation';
import { deleteFileFromS3, generateSignedUrlForRestaurantOffers } from '@/actions';

type SingleImageUploadOffersProps = {
  onImageUploaded?: (key: string) => void;
  className?: string;
  placeholder?: string;
};

const SingleImageUploadOffers: React.FC<SingleImageUploadOffersProps> = ({
  onImageUploaded,
  className = '',
  placeholder = "Click to upload image"
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageKey, setImageKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadImageToS3 = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;

      const { signedUrl, key } = await generateSignedUrlForRestaurantOffers(
        fileName,
        file.type
      );

      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image to S3");
      }

      return key;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file, 5);
    if (!validation.isValid) {
      toast.error(validation.error);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      if (imageKey) {
        try {
          await deleteFileFromS3(imageKey);
        } catch (deleteError) {
          console.error("Failed to delete previous image:", deleteError);
        }
      }

      const newImageKey = await uploadImageToS3(file);
      setImageKey(newImageKey);
      if (onImageUploaded) {
        onImageUploaded(newImageKey);
      }
    } catch (error) {
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async () => {
    if (imageKey) {
      try {
        await deleteFileFromS3(imageKey);
      } catch (deleteError) {
        console.error("Failed to delete image:", deleteError);
      }
    }
    setPreview(null);
    setImageKey(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageUploaded) {
      onImageUploaded('');
    }
  };

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
      disabled={isUploading}
    />

      <div className="relative">
        {!preview ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center flex-col justify-center border-2 h-60 border-dashed border-[#0a0e11] transition-colors rounded-lg p-6 text-center cursor-pointer bg-[#182226] hover:bg-[#232e36] group"
          >
            <Upload className="w-12 h-12 text-white mx-auto mb-4 transition-colors" />
            <p className="text-white font-medium transition-colors">
              {isUploading ? "Uploading..." : placeholder}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              PNG, JPG up to 5MB
            </p>
          </div>
        ) : (
          <div className="relative w-full h-60 border-2 border-[#0a0e11] rounded-lg overflow-hidden bg-white">
            <div className="w-full h-full relative">
              <Image
                src={preview}
                alt="Selected"
                className="w-full h-full object-cover"
                fill
              />
              <div className="absolute inset-0 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    onClick={handleEditClick}
                    className="cursor-pointer text-white bg-black p-2 rounded-full transition-colors"
                    title="Change image"
                    disabled={isUploading}
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleRemoveImage}
                    className="cursor-pointer bg-[#B40000] hover:bg-[#B40000] text-white p-2 rounded-full transition-colors"
                    title="Remove image"
                    disabled={isUploading}
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


export default SingleImageUploadOffers;