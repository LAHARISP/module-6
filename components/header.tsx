// components/Header.tsx
import Image from "next/image";
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-white from-25% via-blue-500 to-purple-600 flex flex-col gap-y-2 sm:flex-row items-center justify-between px-4 py-2">
      <Image
        src="/aitlogo.png"
        alt="College Logo"
        width={450}
        height={250}
        className="object-contain"
      />
    </header>
  );
};

export default Header;
