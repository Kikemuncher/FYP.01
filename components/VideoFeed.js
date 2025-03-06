import React, { useEffect, useState, useRef } from "react";
import fetchVideos from "../utils/fetchVideos";

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const videoRefs = useRef([]);

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
      if (index === currentIndex) {
        if (!isPaused) {
          video?.play();
        }
      } else {
        video?.pause();
        video.currentTime = 0;
      }
    });
  }, [currentIndex, isPaused]);

  // ✅ Detect scroll and snap to the closest video
  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, clientHeight } = containerRef.current;
    const newIndex = Math.round(scrollTop / clientHeight);

    setCurrentIndex(newIndex);
  };

  // ✅ Toggle Play/Pause on Click (Now Truly Fixed)
  const togglePlayPause = () => {
    const video = videoRefs.current[currentIndex];

    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-y-auto bg-black snap-y snap-mandatory"
      onScroll={handleScroll}
      style={{ scrollSnapType: "y mandatory" }} // ✅ Forces Snap-to-Video Behavior
    >
      {/* ✅ FYP Header */}
      <div className="absolute top-0 w-full flex justify-center items-center py-4 bg-black/50 text-white text-lg font-bold z-10">
        <div className="flex space-x-6">
          <p className="cursor-pointer border-b-2 border-white pb-1">For You</p>
          <p className="cursor-pointer opacity-50">Following</p>
          <p className="cursor-pointer opacity-50">Explore</p>
        </div>
      </div>

      {/* ✅ Video Feed - Full Snap Effect */}
      <div className="relative w-full h-full flex flex-col">
        {videos.map((videoUrl, index) => (
          <div
            key={index}
            className="w-full h-screen flex justify-center items-center snap-center"
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={videoUrl}
              className="w-auto h-full max-w-[500px] object-cover rounded-lg shadow-lg cursor-pointer"
              loop
              muted
              playsInline
              onClick={togglePlayPause}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoFeed;
