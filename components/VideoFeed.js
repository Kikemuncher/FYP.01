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

    setTimeout(() => setIsScrolling(false), 600); // ✅ Prevents multiple scrolls at once
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
      className="relative w-full h-screen overflow-hidden bg-black flex justify-center items-center"
      onWheel={handleScroll} // ✅ Enables smooth scrolling
    >
      <AnimatePresence mode="popLayout">
        {videos.length > 0 && (
          <motion.div
            key={currentIndex}
            initial={{ y: "100%" }} // ✅ Video starts below
            animate={{ y: "0%" }} // ✅ Moves up smoothly
            exit={{ y: "-100%" }} // ✅ Slides up
            transition={{ type: "spring", stiffness: 100, damping: 20 }} // ✅ Natural feel
            className="absolute w-full h-full flex justify-center items-center"
          >
            <video
              ref={(el) => (videoRefs.current[currentIndex] = el)}
              src={videos[currentIndex]}
              className="w-full h-full object-cover" // ✅ Fix video zoom & fit issue
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
