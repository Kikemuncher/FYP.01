import React from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

const Header = () => {
  const router = useRouter();

  return (
    <div className="w-full flex justify-center py-2 bg-transparent fixed top-2 left-0 z-50 pointer-events-none">
      {/* ✅ Logo - Always Visible, No Interference */}
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-32 h-auto cursor-pointer pointer-events-auto"
        src="/logo.png"
        alt="New Logo"
        onClick={() => router.push("/")}
      />
    </div>
  );
};

export default Header;
