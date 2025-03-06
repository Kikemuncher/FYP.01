import React from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

const Header = () => {
  const router = useRouter();

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center bg-transparent pointer-events-none">
      {/* ✅ Logo - Stays at the top, no interference with scrolling */}
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-24 h-auto cursor-pointer mt-3 pointer-events-auto"
        src="/logo.png"
        alt="New Logo"
        onClick={() => router.push("/")}
      />
    </div>
  );
};

export default Header;
