import React, { useEffect, useState, useRef } from "react";
import fetchVideos from "../utils/fetchVideos";
import Post from "./Post"; // Import the Post component

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
            video.play();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.75 } // ✅ Plays when at least 75% of the video is visible
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      observer.disconnect();
    };
  }, [videos]);

  // ✅ Force First Video to Play on Page Load
  useEffect(() => {
    const playFirstVideo = () => {
      if (videoRefs.current[0]) {
        const firstVideo = videoRefs.current[0];

        // Ensure video is allowed to play
        firstVideo.muted = true; // Some browsers block autoplay unless muted
        firstVideo.play().catch((error) => {
          console.error("Autoplay blocked:", error);
        });
      }
    };

    // Wait a bit before trying to play (fixes browser autoplay policies)
    setTimeout(playFirstVideo, 500);
  }, [videos]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {videos.length > 0 ? (
        videos.map((videoUrl, index) => (
          <Post
            key={index}
            video={videoUrl}
            ref={(el) => (videoRefs.current[index] = el)}
          />
        ))
      ) : (
        <p>Loading videos...</p>
      )}
    </div>
  );
};

export default VideoFeed;
