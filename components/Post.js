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
import { IoIosShareAlt } from "react-icons/io";

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
  const [likes, setLikes] = useState([]);
  const [hasLikes, setHasLikes] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isComOpen, setIsComOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Tap anywhere on video to play/pause
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

  // ✅ Automatically Pause when scrolling out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
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
  }, []);

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
          <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded ">
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

        {/* ✅ Clicking the entire video area now toggles play/pause */}
        <div className="lg:ml-20 flex gap-4 relative">
          <div className="rounded-3xl w-full h-auto">
            <video
              ref={videoRef}
              src={video}
              className="lg:w-[600px] h-[300px] md:h-[400px] lg:h-[528px] w-[200px] rounded-2xl cursor-pointer bg-gray-100"
              loop
              playsInline
              onClick={togglePlayPause} // ✅ Click anywhere to play/pause
            />

            {/* Play icon when video is paused */}
            {!playing && (
              <div className="absolute inset-0 flex items-center justify-center text-white text-5xl">
                ▶
              </div>
            )}
          </div>

          {/* ✅ Volume Control */}
          <div className="absolute bottom-6 left-4 md:left-8">
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

        {/* ✅ Comments Section */}
        {isComOpen && (
          <div className="items-center pr-36 pt-4">
            <Comments comment={comment} setComment={setComment} comments={comments} />
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Post;
