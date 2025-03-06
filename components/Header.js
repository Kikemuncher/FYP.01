import React from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

const Header = () => {
  const router = useRouter();

  return (
    <div className="w-full flex justify-center py-2">
      {/* ✅ Keep only the logo */}
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        src="/logo.png"
        alt="New Logo"
        className="w-36 h-auto cursor-pointer"
        onClick={() => router.push("/")}
      />
    </div>
  );
};

export default Header;
