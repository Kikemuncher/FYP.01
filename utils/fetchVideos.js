import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

// Initialize Firebase Storage
const storage = getStorage();

// Fetch all video files from Firebase Storage
async function fetchVideos() {
  const videoFolderRef = ref(storage, "videos/"); // Change "videos/" to your folder name

  try {
    const result = await listAll(videoFolderRef);
    const videoUrls = await Promise.all(
      result.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return url;
      })
    );

    console.log("Fetched Video URLs:", videoUrls);
    return videoUrls; // Return the list of video URLs
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}

export default fetchVideos;
