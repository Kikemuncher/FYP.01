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
    <header className="fixed top-0 left-0 w-full bg-teal-700 shadow-md z-50">
      <nav className="flex items-center justify-between px-4 py-2 h-[55px] max-w-screen-xl mx-auto text-white">
        
        {/* ✅ Logo (Left Side) */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <img
            className="w-32 h-auto cursor-pointer"
            src="/logo.png"
            alt="New Logo"
            onClick={() => router.push("/")}
          />
        </motion.div>

        {/* ✅ Search Bar (Middle - Looks the Same as Before) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="hidden md:flex flex-grow justify-center"
        >
          <div className="relative">
            <input
              type="text"
              className="border border-white rounded-full px-3 py-1 w-64 bg-teal-800 text-white placeholder-white outline-none"
              placeholder="Search accounts and videos"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* ✅ Right Side (Upload, Profile, Login) */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center space-x-4">
          {isShow && user && (
            <button
              onClick={() => router.push("/pin/create")}
              className="bg-white text-teal-700 px-4 py-1 rounded-lg text-sm font-semibold"
            >
              Upload
            </button>
          )}
          {user ? (
            <img
              src={user?.photoURL}
              className="rounded-full w-8 h-8 cursor-pointer border border-white"
              alt="Avatar"
            />
          ) : (
            <button className="bg-white text-teal-700 px-3 py-1 rounded-lg text-sm font-semibold" onClick={() => router.push("/auth/signin")}>
              Log in
            </button>
          )}
        </motion.div>
      </nav>
    </header>
  );
};

export default Header;
