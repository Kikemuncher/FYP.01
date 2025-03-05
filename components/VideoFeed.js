import React, { useEffect, useState, useRef } from "react";
import fetchVideos from "../utils/fetchVideos";
import { motion, useMotionValue, useTransform } from "framer-motion";

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);
  const yScroll = useMotionValue(0); // ✅ Directly ties scroll to video movement
  const yPosition = useTransform(yScroll, (value) => -value); // ✅ Smooth video transitions

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
    event.preventDefault();
    const deltaY = event.deltaY;

    if (deltaY > 0 && currentIndex < videos.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else if (deltaY < 0 && currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
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

      {/* ✅ Video Feed (Scroll is now tied directly to videos) */}
      <motion.div
        className="absolute w-full h-full flex flex-col items-center justify-center"
        style={{ y: yPosition }} // ✅ Scroll directly moves the video position
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
