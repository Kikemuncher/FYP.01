import React, { useEffect, useState, useRef } from "react";
import fetchVideos from "../utils/fetchVideos"; // Import the function

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef([]); // Store refs for all videos

  useEffect(() => {
    async function loadVideos() {
      const urls = await fetchVideos();
      setVideos(urls);
    }
    loadVideos();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 } // Play video when at least 50% visible
    );

    // Observe each video
    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [videos]); // Re-run when videos are loaded

  // Handle manual play/pause when clicking the video
  const togglePlayPause = (index) => {
    const video = videoRefs.current[index];
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {videos.length > 0 ? (
        videos.map((videoUrl, index) => (
          <div key={index} className="video-container">
            <video
              ref={(el) => (videoRefs.current[index] = el)} // Store ref
              className="w-full h-auto rounded-lg"
              loop
              muted={false} // Enable sound if required
              onClick={() => togglePlayPause(index)} // Click to play/pause
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))
      ) : (
        <p>Loading videos...</p>
      )}
    </div>
  );
};

export default VideoFeed;
