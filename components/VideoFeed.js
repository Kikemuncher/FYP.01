import React, { useEffect, useState, useRef } from "react";
import fetchVideos from "../utils/fetchVideos";
import { motion, AnimatePresence } from "framer-motion";

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);

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
      }
    });
  }, [currentIndex]);

  const handleScroll = (event) => {
    if (event.deltaY > 0) {
      nextVideo();
    } else if (event.deltaY < 0) {
      prevVideo();
    }
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
      className="relative w-full h-screen overflow-hidden bg-black"
      onWheel={handleScroll} // ✅ Enable mouse wheel navigation
    >
      <AnimatePresence>
        {videos.length > 0 && (
          <motion.div
            key={currentIndex}
            initial={{ y: "100%" }} // ✅ Start below
            animate={{ y: "0%" }} // ✅ Slide up into place
            exit={{ y: "-100%" }} // ✅ Slide out up
            transition={{ type: "spring", stiffness: 100, damping: 15 }} // ✅ Smooth effect
            className="absolute w-full h-full flex justify-center items-center"
          >
            <video
              ref={(el) => (videoRefs.current[currentIndex] = el)}
              src={videos[currentIndex]}
              className="w-full h-full object-contain" // ✅ Fixes zoom issue
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
