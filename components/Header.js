import React from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

const Header = () => {
  const router = useRouter();

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      {/* ✅ Centered Logo - Does NOT interfere with scrolling */}
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
