import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { motion } from "framer-motion";
import { auth } from "../firebase/firebase";

const Header = ({ isShow }) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [dropMenu, setDropMenu] = useState(false);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-teal-700 shadow-md z-50">
      <nav className="flex items-center justify-between px-6 py-3 h-[65px] max-w-screen-xl mx-auto text-white">
        
        {/* ✅ Logo (Left Side) */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <img
            className="w-36 h-auto cursor-pointer"
            src="/logo.png"
            alt="New Logo"
            onClick={() => router.push("/")}
          />
        </motion.div>

        {/* ✅ Right Side (Upload Button & Profile Image) */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center space-x-5">
          {isShow && user && (
            <button
              onClick={() => router.push("/pin/create")}
              className="bg-white text-teal-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
            >
              Upload
            </button>
          )}
          {user && (
            <img
              src={user?.photoURL}
              className="rounded-full w-10 h-10 cursor-pointer border border-white"
              alt="Avatar"
            />
          )}
        </motion.div>
      </nav>
    </header>
  );
};

export default Header;
