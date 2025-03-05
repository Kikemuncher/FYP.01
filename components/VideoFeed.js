import React, { useEffect, useState, useRef } from "react";
import fetchVideos from "../utils/fetchVideos";
import { motion, useMotionValue, useDragControls } from "framer-motion";

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);
  const dragControls = useDragControls();
  const y = useMotionValue(0); // ✅ Controls smooth scrolling effect

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

    if (offset < -200 || velocity < -500) {
      // ✅ Scroll Up - Move to next video
      if (currentIndex < videos.length - 1) {
        setCurrentIndex(currentIndex + 1);
        y.set(0); // ✅ Reset position after swipe
      }
    } else if (offset > 200 || velocity > 500) {
      // ✅ Scroll Down - Move to previous video
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        y.set(0); // ✅ Reset position after swipe
      }
    } else {
      // ✅ If not swiped enough, snap back to current video
      y.set(0);
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

      {/* ✅ Video Feed - Videos move as a chain */}
      <motion.div
        className="absolute w-full h-full flex flex-col"
        drag="y"
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={handleDragEnd} // ✅ Detects swipe release
        style={{ y }}
      >
        {videos.map((videoUrl, index) => (
          <motion.div
            key={index}
            className="absolute w-full h-full flex justify-center items-center"
            style={{ top: `${index * 100}%` }} // ✅ Makes videos stack on top of each other
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
