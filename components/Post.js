import { faker } from "@faker-js/faker";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast, { Toaster } from "react-hot-toast";

import { GoVerified } from "react-icons/go";
import { HiVolumeOff, HiVolumeUp } from "react-icons/hi";

import { auth, firestore } from "../firebase/firebase";
import Comments from "./Comments";

const Post = ({
  caption,
  company,
  video,
  profileImage,
  topic,
  timestamp,
  username,
  userId,
  songName,
  id,
}) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [playing, setPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const videoRef = useRef(null);
  const [wasPlaying, setWasPlaying] = useState(false); // ✅ Track play state before scrolling out

  // ✅ Click anywhere on the video to toggle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setPlaying(true);
      } else {
        videoRef.current.pause();
        setPlaying(false);
      }
    }
  };

  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current.muted = isVideoMuted;
    }
  }, [isVideoMuted]);

  // ✅ Auto-pause when scrolling out & auto-resume if it was playing
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (wasPlaying) {
              videoRef.current.play(); // ✅ Resume if it was playing before
              setPlaying(true);
            }
          } else {
            if (!videoRef.current.paused) {
              setWasPlaying(true); // ✅ Remember that it was playing
            } else {
              setWasPlaying(false);
            }
            videoRef.current.pause();
            setPlaying(false);
          }
        });
      },
      { threshold: 0.75 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, [wasPlaying]);

  return (
    <>
      <Toaster />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex flex-col border-b-2 border-gray-200 pb-6"
      >
        <div>
          <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded">
            <div className="md:w-16 md:h-16 w-10 h-10" onClick={() => router.push(`/user/${userId}`)}>
              <img className="rounded-full w-14" src={profileImage} alt="user-profile" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="flex gap-2 items-center md:text-md font-bold text-primary">
                  {username}
                  <GoVerified className="text-blue-400 text-md" />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Full-screen vertical video format (no cropping or white bars) */}
        <div className="relative flex justify-center items-center w-full">
          <video
            ref={videoRef}
            src={video}
            className="w-full h-screen object-contain aspect-[9/16]" // ✅ Keeps correct TikTok format
            loop
            playsInline
            onClick={togglePlayPause} // ✅ Click anywhere to play/pause
          />

          {/* ✅ Play button now perfectly centered */}
          {!playing && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full w-16 h-16 text-white text-5xl"
              onClick={togglePlayPause} // ✅ Clicking the play icon also plays the video
            >
              ▶
            </div>
          )}

          {/* ✅ Volume button now in correct position */}
          <div className="absolute bottom-6 right-6">
            {isVideoMuted ? (
              <button onClick={() => setIsVideoMuted(false)}>
                <HiVolumeOff className="text-white text-3xl" />
              </button>
            ) : (
              <button onClick={() => setIsVideoMuted(true)}>
                <HiVolumeUp className="text-white text-3xl" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Post;
