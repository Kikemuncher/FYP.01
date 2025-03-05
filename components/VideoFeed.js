import React, { useEffect, useState, useRef } from "react";
import fetchVideos from "../utils/fetchVideos";
import { motion, AnimatePresence } from "framer-motion";

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const [playing, setPlaying] = useState(true); // ✅ Track play/pause state

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

    setTimeout(() => setIsScrolling(false), 900); // ✅ Slower transition delay
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

  const togglePlayPause = () => {
    const video = videoRefs.current[currentIndex];
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <div
      className="relative w-full h-[calc(100vh-60px)] overflow-hidden flex justify-center items-center bg-gray-900"
      onWheel={handleScroll} // ✅ Enable smooth scrolling
    >
      <AnimatePresence mode="popLayout">
        {videos.length > 0 && (
          <motion.div
            key={currentIndex}
            initial={{ y: "100%" }} // ✅ Start from below
            animate={{ y: "0%" }} // ✅ Slide up into place
            exit={{ y: "-100%" }} // ✅ Moves up (fixes last video issue)
            transition={{ type: "spring", stiffness: 90, damping: 25 }} // ✅ Slower transition
            className="absolute w-full h-full flex justify-center items-center"
          >
            <video
              ref={(el) => (videoRefs.current[currentIndex] = el)}
              src={videos[currentIndex]}
              className="max-w-[90vw] max-h-[80vh] object-cover rounded-lg shadow-lg cursor-pointer" // ✅ Fixes size issue, no more black screen
              loop
              autoPlay
              muted
              playsInline
              onClick={togglePlayPause} // ✅ Click anywhere to play/pause
            />
            {/* ✅ Play/Pause Button (Shows when Paused) */}
            {!playing && (
              <div
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-black/50 text-white text-5xl rounded-full w-16 h-16"
                onClick={togglePlayPause}
              >
                ▶
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoFeed;
