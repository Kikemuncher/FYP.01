import React from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

const Header = () => {
  const router = useRouter();

  return (
    <div className="w-full flex justify-center py-2 bg-transparent absolute top-2 z-50">
      {/* ✅ Logo - Centered at the Top */}
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-32 h-auto cursor-pointer"
        src="/logo.png"
        alt="New Logo"
        onClick={() => router.push("/")}
      />
    </div>
  );
};

export default Header;
