import React, { useEffect, useState, useRef } from "react";
import fetchVideos from "../utils/fetchVideos";
import { motion, useMotionValue, useDragControls } from "framer-motion";

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const y = useMotionValue(0); // ✅ Directly controls video movement
  const dragControls = useDragControls(); // ✅ Enables full swipe control
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
  }, [currentIndex]);

  const handleDragEnd = (event, info) => {
    const offset = info.offset.y;
    const velocity = info.velocity.y;

    // ✅ Swipe Down (Go to Previous Video)
    if (offset > 100 || velocity > 500) {
      if (currentIndex > 0) {
        setCurrentIndex((prevIndex) => prevIndex - 1);
      }
    }
    // ✅ Swipe Up (Go to Next Video)
    else if (offset < -100 || velocity < -500) {
      if (currentIndex < videos.length - 1) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      
      {/* ✅ FYP Header */}
      <div className="absolute top-0 w-full flex justify-center items-center py-4 bg-black/50 text-white text-lg font-bold z-10">
        <div className="flex space-x-6">
          <p className="cursor-pointer border-b-2 border-white pb-1">For You</p>
          <p className="cursor-pointer opacity-50">Following</p>
          <p className="cursor-pointer opacity-50">Explore</p>
        </div>
      </div>

      {/* ✅ Video Stack (Each Video Moves Up/Down on Scroll) */}
      <div className="relative w-full h-full">
        {videos.map((videoUrl, index) => (
          <motion.div
            key={index}
            className="absolute w-full h-full flex justify-center items-center"
            style={{
              y: y,
              zIndex: videos.length - index, // ✅ Keeps videos stacked properly
            }}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd} // ✅ Detects swipe direction
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
      </div>
    </div>
  );
};

export default VideoFeed;
