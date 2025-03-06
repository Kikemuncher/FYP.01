import React, { useEffect, useState, useRef } from "react";
import fetchVideos from "../utils/fetchVideos";
import { motion, useMotionValue, useAnimation } from "framer-motion";

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // ✅ Track Play/Pause State
  const videoRefs = useRef([]);
  const y = useMotionValue(0);
  const controls = useAnimation();
  const videoHeight = typeof window !== "undefined" ? window.innerHeight : 800;
  const scrollThreshold = videoHeight * 0.35; // ✅ 35% Scroll Required Before Switching Video
  const isScrolling = useRef(false); // ✅ Prevents multiple rapid actions

  useEffect(() => {
    async function loadVideos() {
      const urls = await fetchVideos();
      setVideos(urls);
    }
    loadVideos();
  }, []);

  useEffect(() => {
    // ✅ Ensure only the current video plays, others are paused
    videoRefs.current.forEach((video, index) => {
      if (index === currentIndex && video) {
        if (!isPaused) {
          video.play();
        }
      } else if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentIndex, isPaused]);

  // ✅ Scroll Moves Video Position Smoothly
  const handleScroll = (event) => {
    if (isScrolling.current) return;
    y.set(y.get() - event.deltaY * 0.8); // ✅ Correct Scroll Direction
  };

  // ✅ Lock Onto Next Video If Threshold is Passed
  const snapVideoIntoPlace = () => {
    if (isScrolling.current) return;
    isScrolling.current = true; // ✅ Prevent Multiple Rapid Scrolls

    const offset = y.get();
    let newIndex = currentIndex;

    if (offset < -scrollThreshold) {
      newIndex = Math.min(currentIndex + 1, videos.length - 1); // ✅ Scroll Down to Next Video
    } else if (offset > scrollThreshold) {
      newIndex = Math.max(currentIndex - 1, 0); // ✅ Scroll Up to Previous Video
    }

    setCurrentIndex(newIndex);

    // ✅ Animate Smoothly to Lock on Video
    controls.start({
      y: -videoHeight * newIndex,
      transition: { type: "spring", stiffness: 120, damping: 20 },
    });

    setTimeout(() => {
      isScrolling.current = false;
      // ✅ Play only the snapped video AFTER snapping is done
      if (videoRefs.current[newIndex] && !isPaused) {
        videoRefs.current[newIndex].play();
      }
    }, 500); // ✅ Wait for animation to finish before playing video
  };

  // ✅ Toggle Play/Pause on Click (Fixed No Skipping)
  const togglePlayPause = (event) => {
    event.stopPropagation(); // ✅ Prevents accidental triggering other functions
    const video = videoRefs.current[currentIndex];

    if (!video) return; // Prevent errors if video is undefined

    if (video.paused) {
      video.play();
      setIsPaused(false); // ✅ Keep Video Playing Until Clicked Again
    } else {
      video.pause();
      setIsPaused(true); // ✅ Keep Video Paused Until Clicked Again
    }
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black"
      onWheel={handleScroll}
      onMouseUp={snapVideoIntoPlace} // ✅ Lock Video After Scroll Ends
      onKeyUp={snapVideoIntoPlace} // ✅ Also Works for Arrow Keys
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

      {/* ✅ Video Feed - True TikTok Scrolling with Correct Direction */}
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
              muted
              playsInline
              onClick={togglePlayPause} // ✅ Click only pauses/plays the video (Fixed No Skipping)
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default VideoFeed;
