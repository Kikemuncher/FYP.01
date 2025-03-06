import React, { useEffect, useState, useRef } from "react";
import fetchVideos from "../utils/fetchVideos";
import { motion, useMotionValue, animate } from "framer-motion";

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);
  const y = useMotionValue(0);
  const isScrolling = useRef(false);
  const videoHeight = typeof window !== "undefined" ? window.innerHeight : 800; // Dynamically adjust height

  useEffect(() => {
    async function loadVideos() {
      const urls = await fetchVideos();
      setVideos(urls);
    }
    loadVideos();
  }, []);

  useEffect(() => {
    if (videoRefs.current[currentIndex]) {
      videoRefs.current[currentIndex].play();
    }
  }, [currentIndex]);

  // ✅ Smooth scrolling with mouse wheel
  const handleScroll = (event) => {
    if (isScrolling.current) return;
    isScrolling.current = true;

    if (event.deltaY > 0) {
      nextVideo();
    } else if (event.deltaY < 0) {
      prevVideo();
    }

    setTimeout(() => (isScrolling.current = false), 700);
  };

  // ✅ Smooth scrolling with Arrow Keys
  const handleKeyDown = (event) => {
    if (isScrolling.current) return;
    isScrolling.current = true;

    if (event.key === "ArrowDown") {
      nextVideo();
    } else if (event.key === "ArrowUp") {
      prevVideo();
    }

    setTimeout(() => (isScrolling.current = false), 700);
  };

  // ✅ Move to next video
  const nextVideo = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      animate(y, -videoHeight * (currentIndex + 1), {
        type: "spring",
        stiffness: 90,
        damping: 20,
      });
    }
  };

  // ✅ Move to previous video
  const prevVideo = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      animate(y, -videoHeight * (currentIndex - 1), {
        type: "spring",
        stiffness: 90,
        damping: 20,
      });
    }
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black"
      onWheel={handleScroll}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{ height: "100vh" }} // ✅ Prevents page scrolling issues
    >
      {/* ✅ FYP Header */}
      <div className="absolute top-0 w-full flex justify-center items-center py-4 bg-black/50 text-white text-lg font-bold z-10">
        <div className="flex space-x-6">
          <p className="cursor-pointer border-b-2 border-white pb-1">For You</p>
          <p className="cursor-pointer opacity-50">Following</p>
          <p className="cursor-pointer opacity-50">Explore</p>
        </div>
      </div>

      {/* ✅ Video Feed - Scroll tied directly to video movement */}
      <motion.div
        className="absolute w-full h-full flex flex-col"
        style={{ y: y }}
      >
        {videos.map((videoUrl, index) => (
          <motion.div
            key={index}
            className="absolute w-full h-screen flex justify-center items-center"
            style={{ top: `${index * 100}%` }} // ✅ Makes videos stack on top of each other
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={videoUrl}
              className="w-auto h-full max-w-[500px] object-cover rounded-lg shadow-lg cursor-pointer"
              loop
              autoPlay
              muted
              playsInline
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default VideoFeed;
