"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const AppLogo = () => {
  return (
    <div className="inline-block group-data-[collapsible=icon]:opacity-0">
      <Link href="/dashboard" className="w-max block">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={0}
          height={0}
          sizes="100vw"
          className="h-14 w-auto"
        />
      </Link>
    </div>
  );
};

export default AppLogo;
