import React from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

const Header = () => {
  const router = useRouter();

  return (
    <div className="absolute top-0 left-0 w-full flex justify-center z-50 bg-transparent pointer-events-none">
      {/* ✅ Centered Logo - Properly aligned & doesn't block scrolling */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-teal-700 px-6 py-2 rounded-b-lg shadow-lg pointer-events-auto"
      >
        <img
          className="w-28 h-auto cursor-pointer"
          src="/logo.png"
          alt="New Logo"
          onClick={() => router.push("/")}
        />
      </motion.div>
    </div>
  );
};

export default Header;
