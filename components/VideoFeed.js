import React, { useEffect, useState, useRef } from "react";
import fetchVideos from "../utils/fetchVideos";
import { FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
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
        video.muted = isMuted; // ✅ Apply mute state to video
      } else {
        video?.pause();
        video.currentTime = 0;
      }
    });
  }, [currentIndex, isPaused, isMuted]);

  useEffect(() => {
    // ✅ Autoplay first video when page loads
    if (videos.length > 0 && videoRefs.current[0]) {
      videoRefs.current[0].play();
    }
  }, [videos]);

  // ✅ Detect scroll and snap to the closest video
  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, clientHeight } = containerRef.current;
    const newIndex = Math.round(scrollTop / clientHeight);

    setCurrentIndex(newIndex);
  };

  // ✅ Toggle Play/Pause on Click (No Skipping)
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

  // ✅ Toggle Mute/Unmute
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-y-auto bg-teal-700 snap-y snap-mandatory"
      onScroll={handleScroll}
      style={{ scrollSnapType: "y mandatory", scrollBehavior: "smooth" }} // ✅ Forces Snap-to-Video Behavior
    >
      {/* ✅ Video Feed - Full Snap Effect */}
      <div className="relative w-full h-full flex flex-col gap-5 py-4"> {/* ✅ Adds Space Between Videos */}
        {videos.map((videoUrl, index) => (
          <div
            key={index}
            className="relative w-full h-screen flex justify-center items-center snap-center"
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={videoUrl}
              className="w-auto h-full max-w-[500px] object-cover rounded-lg shadow-lg cursor-pointer"
              loop
              playsInline
              muted={isMuted}
              onClick={togglePlayPause}
            />

            {/* ✅ Play Button Overlay (Small Circle in Center) */}
            {isPaused && currentIndex === index && (
              <div
                className="absolute inset-0 flex justify-center items-center"
                onClick={togglePlayPause}
              >
                <div className="w-16 h-16 bg-black/60 rounded-full flex justify-center items-center">
                  <FaPlay className="text-white text-3xl" />
                </div>
              </div>
            )}

            {/* ✅ Mute/Unmute Button (Inside Video, Bottom Right) */}
            {currentIndex === index && (
              <button
                className="absolute bottom-10 right-10 bg-black/50 text-white p-3 rounded-full shadow-md hover:bg-black/70 transition"
                onClick={toggleMute}
              >
                {isMuted ? <FaVolumeMute className="text-xl" /> : <FaVolumeUp className="text-xl" />}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoFeed;
