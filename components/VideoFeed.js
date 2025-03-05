import React, { useEffect, useState, useRef } from "react";
import fetchVideos from "../utils/fetchVideos"; // Import the function

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef([]); // Store video elements
  const playingIndex = useRef(null); // Track currently playing video index

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
            // Only play if it was playing before scrolling out
            if (playingIndex.current === video.dataset.index) {
              video.play();
            }
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 } // Play when 50% visible
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [videos]);

  // Click anywhere on the video to toggle play/pause
  const togglePlayPause = (index) => {
    const video = videoRefs.current[index];

    if (video.paused) {
      // Pause all other videos
      videoRefs.current.forEach((vid, i) => {
        if (vid && i !== index) {
          vid.pause();
        }
      });

      video.play();
      playingIndex.current = index; // Store the playing video's index
    } else {
      video.pause();
      playingIndex.current = null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {videos.length > 0 ? (
        videos.map((videoUrl, index) => (
          <div key={index} className="video-container">
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              className="w-full h-auto rounded-lg"
              loop
              playsInline
              data-index={index} // Store index for tracking play state
              onClick={() => togglePlayPause(index)} // Tap anywhere to play/pause
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
