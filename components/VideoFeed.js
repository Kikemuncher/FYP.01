import React, { useEffect, useState, useRef } from "react";
import fetchVideos from "../utils/fetchVideos";
import { motion, AnimatePresence } from "framer-motion";

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);
  const [isScrolling, setIsScrolling] = useState(false);

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

    videoRefs.current.forEach((video, index) => {
      if (index !== currentIndex && video) {
        video.pause();
        video.currentTime = 0; // ✅ Reset video when switching
      }
    });
  }, [currentIndex]);

  const handleScroll = (event) => {
    if (isScrolling) return;

    setIsScrolling(true);

    if (event.deltaY > 0) {
      nextVideo();
    } else if (event.deltaY < 0) {
      prevVideo();
    }

    setTimeout(() => setIsScrolling(false), 800); // ✅ Prevents skipping multiple videos
  };

  const nextVideo = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevVideo = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div
      className="relative w-full h-[calc(100vh-60px)] overflow-hidden bg-black flex justify-center items-center"
      onWheel={handleScroll} // ✅ Enable smooth scrolling
    >
      <AnimatePresence mode="popLayout">
        {videos.length > 0 && (
          <motion.div
            key={currentIndex}
            initial={{ y: "100%" }} // ✅ Video starts below
            animate={{ y: "0%" }} // ✅ Moves up smoothly
            exit={{ y: "-100%" }} // ✅ Slides up
            transition={{ type: "spring", stiffness: 100, damping: 20 }} // ✅ Smooth natural motion
            className="absolute w-full h-full flex justify-center items-center"
          >
            <video
              ref={(el) => (videoRefs.current[currentIndex] = el)}
              src={videos[currentIndex]}
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg" // ✅ FIXES CROPPING & OVERSIZED ISSUE
              loop
              autoPlay
              muted
              playsInline
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoFeed;
