"use client"; // ✅ Ensures this is a client component

import React, { useState, useEffect, useRef } from "react";
import { MdDelete } from "react-icons/md";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useRouter } from "next/navigation"; // ✅ Fix Next.js routing
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

import { topics } from "../utils/constants";
import useSelectFile from "../hooks/useSelectFile";
import { auth, firestore, storage } from "../firebase/firebase";
import UploadeSkeleton from "./Skeleton/UploadeSkeleton";

const CreateVideo = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [topic, setTopic] = useState(topics[0].name);
  const [loading, setLoading] = useState(false);
  const [songName, setSongName] = useState("");
  const [hashTags, setHashTags] = useState("");
  const [tagShow, setTagShow] = useState(false);
  const [tagError, setTagError] = useState("");

  const { selectedFile, setSelectedFile, onSelectedFile } = useSelectFile();
  const selectedFileRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !user) {
      router.push("/");
    }
  }, [user, router]);

  const handlePost = async () => {
    if (!caption || !topic || !selectedFile || !hashTags.includes("#")) {
      toast.error("Please complete all fields before posting.", {
        duration: 3000,
        position: "bottom-right",
      });
      return;
    }

    setLoading(true);
    try {
      const docRef = await addDoc(collection(firestore, "posts"), {
        userId: user?.uid,
        username: user?.displayName,
        topic: topic === "Other" ? hashTags : topic,
        songName: songName || `original sound - ${user?.displayName}`,
        caption,
        profileImage: user?.photoURL,
        company: user?.email,
        timestamp: serverTimestamp(),
      });

      const videoRef = ref(storage, `posts/${docRef.id}/video`);
      await uploadString(videoRef, selectedFile, "data_url").then(
        async () => {
          const downloadUrl = await getDownloadURL(videoRef);
          await updateDoc(doc(firestore, "posts", docRef.id), {
            video: downloadUrl,
          });
        }
      );

      setCaption("");
      setTopic(topics[0].name);
      setSelectedFile("");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed. Try again later.");
    }
    setLoading(false);
  };

  return (
    <div className="flex w-full h-full absolute left-0 top-[60px] lg:top-[70px] justify-center">
      <Toaster />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg xl:h-[80vh] flex flex-col items-center p-8"
      >
        <p className="text-2xl font-bold">Upload Video</p>
        <p className="text-md text-gray-400 mt-1">
          Post a video to your account
        </p>

        {/* Upload Box */}
        <div className="border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center outline-none mt-10 w-[260px] h-[400px] cursor-pointer hover:border-red-300 hover:bg-gray-100">
          {loading ? (
            <>
              <UploadeSkeleton />
              <p className="text-xl font-semibold text-pink-500 mt-4 animate-pulse">
                Uploading...
              </p>
            </>
          ) : !selectedFile ? (
            <label className="cursor-pointer flex flex-col items-center">
              <p className="text-xl font-semibold">Select video to upload</p>
              <input
                type="file"
                ref={selectedFileRef}
                className="hidden"
                accept="video/mp4,video/webm,video/ogg"
                onChange={onSelectedFile}
              />
              <p className="text-gray-400 text-sm mt-4">
                MP4 or WebM <br /> Up to 10 min <br /> Less than 2GB
              </p>
              <p className="bg-gradient-to-br from-pink-500 to-orange-400 text-white rounded-lg px-5 py-2 mt-4">
                Select file
              </p>
            </label>
          ) : (
            <div className="flex flex-col gap-4 items-center">
              <video className="rounded-xl h-[350px] bg-black" controls loop src={selectedFile} />
              <button
                className="bg-gray-200 text-red-400 p-2 rounded-full"
                onClick={() => setSelectedFile("")}
              >
                <MdDelete />
              </button>
            </div>
          )}
        </div>

        {/* Form Inputs */}
        <div className="flex flex-col gap-3 mt-6">
          <label className="text-md font-medium">Caption</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="border-2 p-2 rounded"
          />
          <label className="text-md font-medium">Song Name</label>
          <input
            type="text"
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
            className="border-2 p-2 rounded"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 mt-6">
          <button onClick={() => setSelectedFile("")} className="border-2 px-4 py-2 rounded">
            Discard
          </button>
          <button onClick={handlePost} className="bg-purple-500 text-white px-4 py-2 rounded">
            Post
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateVideo;
