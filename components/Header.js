import React from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

const Header = () => {
  const router = useRouter();

  return (
    <div className="absolute top-0 left-0 w-full flex justify-center z-50 pointer-events-none">
      {/* ✅ Logo - Small padding at the top, centered, does NOT affect scrolling */}
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-28 h-auto cursor-pointer mt-2 pointer-events-auto"
        src="/logo.png"
        alt="New Logo"
        onClick={() => router.push("/")}
      />
    </div>
  );
};

export default Header;
