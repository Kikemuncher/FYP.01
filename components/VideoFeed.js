import React, { useEffect, useState, useRef } from "react";
import fetchVideos from "../utils/fetchVideos";
import { motion, useMotionValue, useSpring, useAnimation } from "framer-motion";

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);
  const y = useMotionValue(0); // ✅ Directly ties scroll movement to video movement
  const controls = useAnimation();
  const videoHeight = typeof window !== "undefined" ? window.innerHeight : 800;
  const scrollThreshold = videoHeight * 0.25; // ✅ Scroll must pass 25% before switching videos

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

  // ✅ Handle scroll with smooth movement
  const handleScroll = (event) => {
    y.set(y.get() + event.deltaY * 0.8); // ✅ Scroll speed is controlled
  };

  // ✅ Handle scroll release & determine video switch
  const handleScrollEnd = () => {
    const offset = y.get();
    const newIndex =
      offset > scrollThreshold
        ? Math.min(currentIndex + 1, videos.length - 1) // ✅ Scroll down
        : offset < -scrollThreshold
        ? Math.max(currentIndex - 1, 0) // ✅ Scroll up
        : currentIndex; // ✅ Stay on current video

    setCurrentIndex(newIndex);

    // ✅ Animate back to the correct position (either current video or next/prev)
    controls.start({ y: -videoHeight * newIndex, transition: { type: "spring", stiffness: 90, damping: 20 } });
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black"
      onWheel={handleScroll}
      onMouseUp={handleScrollEnd} // ✅ Stops mid-scroll if needed
      onKeyUp={handleScrollEnd} // ✅ Also applies for arrow keys
      tabIndex={0}
      style={{ height: "100vh" }}
    >
      {/* ✅ FYP Header */}
      <div className="absolute top-0 w-full flex justify-center items-center py-4 bg-black/50 text-white text-lg font-bold z-10">
        <div className="flex space-x-6">
          <p className="cursor-pointer border-b-2 border-white pb-1">For You</p>
          <p className="cursor-pointer opacity-50">Following</p>
          <p className="cursor-pointer opacity-50">Explore</p>
        </div>
      </div>

      {/* ✅ Video Feed - True TikTok-style scrolling */}
      <motion.div
        className="absolute w-full h-full flex flex-col"
        animate={controls}
        style={{ y: y }}
      >
        {videos.map((videoUrl, index) => (
          <motion.div
            key={index}
            className="absolute w-full h-screen flex justify-center items-center"
            style={{ top: `${index * 100}%` }}
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={videoUrl}
              className="w-auto h-full max-w-[500px] object-cover rounded-lg shadow-lg cursor-pointer"
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
