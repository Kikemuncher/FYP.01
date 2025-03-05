import React, { useEffect, useState, useRef } from "react";
import fetchVideos from "../utils/fetchVideos";
import { useSwipeable } from "react-swipeable";
import { HiArrowUp, HiArrowDown } from "react-icons/hi";

const FYP = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);

  useEffect(() => {
    async function loadVideos() {
      const urls = await fetchVideos();
      setVideos(urls);
    }
    loadVideos();
  }, []);

  useEffect(() => {
    // Autoplay the current video
    if (videoRefs.current[currentIndex]) {
      videoRefs.current[currentIndex].play();
    }

    // Pause all other videos
    videoRefs.current.forEach((video, index) => {
      if (index !== currentIndex && video) {
        video.pause();
      }
    });
  }, [currentIndex]);

  const handleNextVideo = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevVideo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Swipe controls
  const handlers = useSwipeable({
    onSwipedUp: handleNextVideo,
    onSwipedDown: handlePrevVideo,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div
      className="relative w-full h-screen flex flex-col items-center justify-center bg-black"
      {...handlers}
    >
      {videos.length > 0 && (
        <>
          <video
            ref={(el) => (videoRefs.current[currentIndex] = el)}
            src={videos[currentIndex]}
            className="w-full h-full object-cover"
            loop
            autoPlay
            muted
            playsInline
          />

          {/* Navigation Buttons */}
          <div className="absolute right-5 top-1/2 transform -translate-y-1/2 flex flex-col gap-6">
            <button
              onClick={handlePrevVideo}
              className={`text-white bg-gray-800 p-3 rounded-full shadow-lg ${
                currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
              }`}
              disabled={currentIndex === 0}
            >
              <HiArrowUp size={30} />
            </button>

            <button
              onClick={handleNextVideo}
              className={`text-white bg-gray-800 p-3 rounded-full shadow-lg ${
                currentIndex === videos.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
              }`}
              disabled={currentIndex === videos.length - 1}
            >
              <HiArrowDown size={30} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FYP;
