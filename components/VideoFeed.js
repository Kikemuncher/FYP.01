import React, { useEffect, useState, useRef } from "react";
import fetchVideos from "../utils/fetchVideos";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const y = useMotionValue(0); // ✅ Scroll position tied to video movement
  const smoothY = useSpring(y, { stiffness: 100, damping: 15 }); // ✅ Smooth transition effect
  const containerRef = useRef(null);
  const videoHeight = useRef(0);

  useEffect(() => {
    async function loadVideos() {
      const urls = await fetchVideos();
      setVideos(urls);
    }
    loadVideos();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      videoHeight.current = containerRef.current.clientHeight;
    }
  }, [videos]);

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
    y.set(y.get() + event.deltaY * 0.8); // ✅ Moves based on scroll intensity

    let videoIndex = Math.round(y.get() / -videoHeight.current);

    if (videoIndex !== currentIndex) {
      if (videoIndex < 0) videoIndex = 0;
      if (videoIndex >= videos.length) videoIndex = videos.length - 1;

      setCurrentIndex(videoIndex);
      y.set(videoIndex * -videoHeight.current); // ✅ Locks to the nearest video
    }
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      onWheel={handleScroll}
      ref={containerRef}
    >
      {/* ✅ FYP Header */}
      <div className="absolute top-0 w-full flex justify-center items-center py-4 bg-black/50 text-white text-lg font-bold z-10">
        <div className="flex space-x-6">
          <p className="cursor-pointer border-b-2 border-white pb-1">For You</p>
          <p className="cursor-pointer opacity-50">Following</p>
          <p className="cursor-pointer opacity-50">Explore</p>
        </div>
      </div>

      {/* ✅ Video Feed - Scroll is fully tied to video movement */}
      <motion.div
        className="absolute w-full h-full flex flex-col items-center justify-center"
        style={{ y: smoothY }} // ✅ Smooth movement tied to scroll
      >
        {videos.map((videoUrl, index) => (
          <motion.div
            key={index}
            className="absolute w-full h-full flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentIndex ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={videoUrl}
              className="w-auto h-[90vh] max-w-[500px] object-cover rounded-lg shadow-lg"
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
