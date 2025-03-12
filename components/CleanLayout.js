// components/CleanLayout.js
import React from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const CleanLayout = ({ children }) => {
  const router = useRouter();
  
  return (
    <div className="w-full h-screen bg-[#007070] overflow-hidden">
      {/* Logo Only */}
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999]"
        style={{ width: '112px', height: 'auto' }}
        src="/logo.png"
        alt="New Logo"
        onClick={() => router.push('/')}
      />
      
      {/* Content */}
      {children}
    </div>
  );
};

export default CleanLayout;
