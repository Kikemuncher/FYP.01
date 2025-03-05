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

    setTimeout(() => setIsScrolling(false), 700); // ✅ Ensures smooth one scroll per video
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
    <div className="relative w-full h-screen flex flex-col items-center bg-black overflow-hidden" onWheel={handleScroll}>
      
      {/* ✅ FYP Header */}
      <div className="absolute top-0 w-full flex justify-center items-center py-4 bg-black/50 text-white text-lg font-bold z-10">
        <div className="flex space-x-6">
          <p className="cursor-pointer border-b-2 border-white pb-1">For You</p>
          <p className="cursor-pointer opacity-50">Following</p>
          <p className="cursor-pointer opacity-50">Explore</p>
        </div>
      </div>

      {/* ✅ Video Feed */}
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {videos.length > 0 && (
            <motion.div
              key={currentIndex}
              initial={{ y: "100%" }} // ✅ Next video comes from below
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }} // ✅ Previous video exits from top
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className="absolute w-full h-full flex justify-center items-center"
            >
              <video
                ref={(el) => (videoRefs.current[currentIndex] = el)}
                src={videos[currentIndex]}
                className="w-auto h-[90vh] max-w-[500px] object-cover rounded-lg shadow-lg"
                loop
                autoPlay
                muted
                playsInline
                onClick={togglePlayPause}
              />
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
    </div>
  );
};

export default VideoFeed;
