import React, { useEffect, useState } from "react";
import { listAll, ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase";
import Post from "./Post";
import Skeleton from "./Skeleton/Skeleton";

const RightHandSide = () => {
  const [videos, setVideos] = useState([]);
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      const videosRef = ref(storage, "videos/"); // Change to your storage folder
      const result = await listAll(videosRef);
      
      const videoURLs = await Promise.all(
        result.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return {
            id: item.name, // Use file name as ID
            video: url,
            username: "Unknown User", // Dummy data since Firestore isn't used
            profileImage: "https://via.placeholder.com/50", // Placeholder profile pic
            caption: "No caption available", // Placeholder caption
            topic: "General", // Default topic
            timestamp: new Date(), // Default timestamp
            userId: "unknown", // Dummy user ID
            songName: "Original Sound", // Placeholder song name
          };
        })
      );

      setVideos(videoURLs);
      setIsShow(true);
    };

    fetchVideos();
  }, []);

  return (
    <div className="right mt-4">
      {isShow ? (
        <>
          {videos.map((video) => (
            <Post
              key={video.id}
              caption={video.caption}
              company="Unknown"
              video={video.video} // Storage URL
              profileImage={video.profileImage}
              topic={video.topic}
              timestamp={video.timestamp}
              username={video.username}
              userId={video.userId}
              songName={video.songName}
              id={video.id}
            />
          ))}
        </>
      ) : (
        <Skeleton />
      )}
    </div>
  );
};

export default RightHandSide;
