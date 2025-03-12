import React from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

const Header = () => {
  const router = useRouter();

  return (
    <motion.img
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-28 h-auto cursor-pointer"
      src="/logo.png"
      alt="New Logo"
      onClick={() => router.push("/")}
    />
  );
};

export default Header;
