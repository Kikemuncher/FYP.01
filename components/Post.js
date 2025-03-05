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
    // ✅ Ensure the first video plays on page load
    if (index === 0 && videoRef.current) {
      const firstVideo = videoRef.current;
      firstVideo.muted = true; // ✅ Required for autoplay
      setTimeout(() => {
        firstVideo.play().catch((error) => console.error("Autoplay blocked:", error));
      }, 500); // ✅ Small delay improves autoplay success
    }
  }, [index]);

  useEffect(() => {
    // ✅ Autoplay videos when they enter the viewport, pause when they leave
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              videoRef.current.play();
              setPlaying(true);
            } else {
              videoRef.current.pause();
              setPlaying(false);
            }
          }
        });
      },
      { threshold: 0.75 } // ✅ Video plays when 75% visible
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  return (
    <div className="relative flex justify-center items-center w-full h-screen">
      <video
        ref={videoRef}
        src={video}
        className="w-full h-full object-contain aspect-[9/16]"
        loop
        playsInline
        muted
        autoPlay={index === 0} // ✅ Forces first video to autoplay
        onClick={togglePlayPause} // ✅ Click anywhere to play/pause
      />

      {/* ✅ Play Button - Now Correctly Centered */}
      {!playing && (
        <div
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-black/50 text-white text-5xl rounded-full w-16 h-16"
          onClick={togglePlayPause}
        >
          ▶
        </div>
      )}
    </div>
  );
};

export default Post;
