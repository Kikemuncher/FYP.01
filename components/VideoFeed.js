import React, { useEffect, useState, useRef } from "react";
import fetchVideos from "../utils/fetchVideos";
import { motion, AnimatePresence } from "framer-motion";

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const [playing, setPlaying] = useState(true);

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
        video.currentTime = 0;
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

    setTimeout(() => setIsScrolling(false), 500); // ✅ Reduced scroll delay for better control
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
      className="relative w-full h-screen flex justify-center items-center bg-transparent pointer-events-auto"
      onWheel={handleScroll} // ✅ Ensures scrolling works smoothly
    >
      <AnimatePresence mode="wait">
        {videos.length > 0 && (
          <motion.div
            key={currentIndex}
            initial={{ y: "100%" }} // ✅ Next video slides up from bottom
            animate={{ y: "0%" }} // ✅ Active video stays in place
            exit={{ y: "-100%" }} // ✅ Past videos exit from top
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="absolute w-full flex justify-center items-center pointer-events-auto"
          >
            <video
              ref={(el) => (videoRefs.current[currentIndex] = el)}
              src={videos[currentIndex]}
              className="w-auto h-[80vh] max-w-[500px] object-contain rounded-lg shadow-lg pointer-events-auto" // ✅ Fixed overlay issues
              loop
              autoPlay
              muted
              playsInline
              onClick={togglePlayPause}
            />
            {!playing && (
              <div
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-black/50 text-white text-5xl rounded-full w-16 h-16 pointer-events-auto"
                onClick={togglePlayPause}
              >
                ▶
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Sidebar UI is now fully visible */}
      <div className="absolute left-0 top-0 w-[60px] h-full bg-gray-800 text-white flex flex-col justify-center items-center">
        <p className="mb-4 cursor-pointer">FYP</p>
        <p className="mb-4 cursor-pointer">Following</p>
        <p className="cursor-pointer">Explore</p>
      </div>
    </div>
  );
};

export default VideoFeed;
