import React, { useEffect, useState, useRef } from "react";
import fetchVideos from "../utils/fetchVideos"; // Fetch video URLs

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
            if (video.dataset.wasPlaying === "true") {
              video.play();
            }
          } else {
            if (!video.paused) {
              video.dataset.wasPlaying = "true";
            } else {
              video.dataset.wasPlaying = "false";
            }
            video.pause();
          }
        });
      },
      { threshold: 0.75 } // Video must be 75% visible to play
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      observer.disconnect();
    };
  }, [videos]);

  // Function to play/pause when clicking anywhere on video
  const togglePlayPause = (index, event) => {
    event.preventDefault(); // Stop redirection
    event.stopPropagation(); // Stop bubbling

    const video = videoRefs.current[index];

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
          <div key={index} className="video-container" onClick={(e) => togglePlayPause(index, e)}>
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
