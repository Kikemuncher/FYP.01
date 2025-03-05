import React, { useEffect, useState, useRef } from "react";
import fetchVideos from "../utils/fetchVideos";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef([]);
  const scrollY = useMotionValue(0); // ✅ Directly ties scroll movement to video position
  const [currentIndex, setCurrentIndex] = useState(0);
  const isAnimating = useRef(false); // ✅ Prevents multiple actions at once

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

  const handleWheel = (event) => {
    if (isAnimating.current) return; // ✅ Stops multiple actions at once

    let deltaY = event.deltaY;
    let direction = deltaY > 0 ? 1 : -1;

    if (Math.abs(deltaY) > 30) {
      // ✅ Detect if the scroll is intentional (prevents accidental movements)
      isAnimating.current = true;

      let newIndex = currentIndex + direction;
      if (newIndex >= 0 && newIndex < videos.length) {
        animate(scrollY, newIndex * -window.innerHeight, {
          type: "spring",
          stiffness: 120,
          damping: 20,
          onComplete: () => {
            setCurrentIndex(newIndex);
            isAnimating.current = false;
          },
        });
      } else {
        isAnimating.current = false;
      }
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden" onWheel={handleWheel}>
      
      {/* ✅ FYP Header */}
      <div className="absolute top-0 w-full flex justify-center items-center py-4 bg-black/50 text-white text-lg font-bold z-10">
        <div className="flex space-x-6">
          <p className="cursor-pointer border-b-2 border-white pb-1">For You</p>
          <p className="cursor-pointer opacity-50">Following</p>
          <p className="cursor-pointer opacity-50">Explore</p>
        </div>
      </div>

      {/* ✅ Video Feed (Scroll directly moves the videos smoothly) */}
      <motion.div
        className="absolute w-full h-full flex flex-col items-center justify-center"
        style={{ y: scrollY }}
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
