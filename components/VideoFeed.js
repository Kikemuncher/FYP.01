import React, { useEffect, useState, useRef } from "react";
import fetchVideos from "../utils/fetchVideos"; // Import function to fetch video URLs

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef([]);

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
            console.log("🔵 Video is visible:", video.src); // Debugging log
            if (video.dataset.wasPlaying === "true") {
              video.play();
            }
          } else {
            console.log("🟠 Video out of view:", video.src); // Debugging log
            if (!video.paused) {
              video.dataset.wasPlaying = "true"; // Remember state
            } else {
              video.dataset.wasPlaying = "false";
            }
            video.pause();
          }
        });
      },
      { threshold: 0.75 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      observer.disconnect();
    };
  }, [videos]);

  const togglePlayPause = (index) => {
    const video = videoRefs.current[index];

    if (!video) return;

    console.log("🟢 Clicked video:", video.src); // Debugging log

    if (video.paused) {
      video.play();
      video.dataset.wasPlaying = "true";
      console.log("▶ Video playing");
    } else {
      video.pause();
      video.dataset.wasPlaying = "false";
      console.log("⏸ Video paused");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {videos.length > 0 ? (
        videos.map((videoUrl, index) => (
          <div key={index} className="video-container">
            <video
              ref={(el) => {
                if (el) videoRefs.current[index] = el;
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
