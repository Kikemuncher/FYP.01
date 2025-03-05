import React, { useEffect, useRef, useState } from "react";

const Post = ({ video, index }) => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  // ✅ Click anywhere on the video to toggle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setPlaying(true);
      } else {
        videoRef.current.pause();
        setPlaying(false);
      }
    }
  };

  useEffect(() => {
    // ✅ Force the first video to play on page load
    if (index === 0 && videoRef.current) {
      const firstVideo = videoRef.current;
      firstVideo.muted = true; // ✅ Some browsers require muted autoplay
      firstVideo.play().catch((error) => console.error("Autoplay blocked:", error));
    }
  }, [index]);

  return (
    <div className="relative flex justify-center items-center w-full h-screen">
      <video
        ref={videoRef}
        src={video}
        className="w-full h-full object-contain aspect-[9/16]"
        loop
        playsInline
        onClick={togglePlayPause} // ✅ Click anywhere to play/pause
      />

      {!playing && (
        <div
          className="absolute inset-0 flex items-center justify-center text-white text-5xl bg-black/40 rounded-full w-16 h-16"
          onClick={togglePlayPause}
        >
          ▶
        </div>
      )}
    </div>
  );
};

export default Post;
