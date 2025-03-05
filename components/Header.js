import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { motion } from "framer-motion";
import { BsFillKeyboardFill } from "react-icons/bs";
import { auth } from "../firebase/firebase";

const Header = ({ isShow }) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [dropMenu, setDropMenu] = useState(false);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <nav className="flex items-center justify-between px-4 py-2 h-[60px] max-w-screen-xl mx-auto">
        
        {/* ✅ Logo (Left Side) */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <img
            className="w-24 h-auto cursor-pointer"
            src="/logo.png"
            alt="New Logo"
            onClick={() => router.push("/")}
          />
        </motion.div>

        {/* ✅ Search Bar (Middle) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="hidden md:flex flex-grow justify-center"
        >
          <input
            type="text"
            className="border rounded-full px-3 py-1 w-64"
            placeholder="Search accounts and videos"
          />
        </motion.div>

        {/* ✅ Right Side (Upload, Profile, Login) */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center space-x-4">
          {isShow && user && (
            <button
              onClick={() => router.push("/pin/create")}
              className="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm"
            >
              Upload
            </button>
          )}
          {user ? (
            <img
              src={user?.photoURL}
              className="rounded-full w-8 h-8 cursor-pointer"
              alt="Avatar"
            />
          ) : (
            <button className="bg-gray-200 px-3 py-1 rounded-lg text-sm" onClick={() => router.push("/auth/signin")}>
              Log in
            </button>
          )}
        </motion.div>
      </nav>
    </header>
  );
};

export default Header;
