import React, { useEffect, useState, useRef } from "react";
import fetchVideos from "../utils/fetchVideos"; // Function to get video URLs

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef(new Map()); // Store video elements dynamically
  const observer = useRef(null); // Intersection Observer

  useEffect(() => {
    async function loadVideos() {
      const urls = await fetchVideos();
      setVideos(urls);
    }
    loadVideos();
  }, []);

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect(); // Reset observer
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            if (video.dataset.wasPlaying === "true") {
              video.play();
            }
          } else {
            if (!video.paused) {
              video.dataset.wasPlaying = "true"; // Store play state
            } else {
              video.dataset.wasPlaying = "false";
            }
            video.pause();
          }
        });
      },
      { threshold: 0.75 } // Video must be at least 75% visible
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.current.observe(video);
    });

    return () => {
      observer.current.disconnect();
    };
  }, [videos]);

  // Function to toggle play/pause
  const togglePlayPause = (index) => {
    const video = videoRefs.current.get(index);

    if (!video) return;

    if (video.paused) {
      // Pause all other videos
      videoRefs.current.forEach((vid, i) => {
        if (vid && i !== index) {
          vid.pause();
          vid.dataset.wasPlaying = "false";
        }
      });

      video.play();
      video.dataset.wasPlaying = "true";
    } else {
      video.pause();
      video.dataset.wasPlaying = "false";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {videos.length > 0 ? (
        videos.map((videoUrl, index) => (
          <div key={index} className="video-container">
            <video
              ref={(el) => {
                if (el) videoRefs.current.set(index, el);
              }}
              className="w-full h-auto rounded-lg"
              loop
              playsInline
              muted={false}
              data-index={index}
              data-was-playing="false"
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
