import Image from "next/image";
import React from "react";
import Logo from "../../../public/images/auth-image.jpg"
const AuthImage = () => {
  return (
    <div className="relative hidden md:block h-screen min-h-full">
      <Image
        src={Logo}
        alt="Authentication Background" 
        fill
        className="object-cover"
      />
    </div>
  );
};

export default AuthImage;
