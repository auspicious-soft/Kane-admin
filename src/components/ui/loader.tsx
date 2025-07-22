import React from "react";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  color?: string;
  className?: string;
}

interface FullPageLoaderProps {
  className?: string;
}

export function Loader({ 
  size = "medium", 
  color = "#E4BC84", 
  className = "" 
}: LoaderProps) {
  const sizeMap = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${sizeMap[size]} animate-spin rounded-full border-2 border-t-transparent`}
        style={{ borderColor: `${color} transparent transparent transparent` }}
        role="status"
        aria-label="loading"
      />
    </div>
  );
}

export function FullPageLoader({ className = "" }: FullPageLoaderProps) {
  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[9999] ${className}`}>
      <div className="bg-[#182226] p-6 rounded-lg shadow-lg flex flex-col items-center">
        <Loader size="large" />
        <p className="mt-4 text-[#E4BC84]">Loading...</p>
      </div>
    </div>
  );
}

export function ButtonLoader({ color = "#0a0e11" }: { color?: string }) {
  return <Loader size="small" color={color} className="mr-2" />;
}