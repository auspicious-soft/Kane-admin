import Image from "next/image";
import React from "react";

const AuthImage = () => {
  return (
    <div className="relative hidden md:block h-screen min-h-full">
      <Image
        src="/images/auth-image.jpg"
        alt="Authentication Background" 
        fill
        className="object-cover"
      />
    </div>
  );
};

export default AuthImage;
