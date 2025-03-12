import Head from "next/head";
import VideoFeed from "../components/VideoFeed";
import LogoOnly from "../components/LogoOnly"; // Use the new component

export default function Home() {
  return (
    <div className="w-full h-screen overflow-hidden flex flex-col">
      <Head>
        <title>TikTok Clone</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="https://th.bing.com/th/id/R.67bc88bb600a54112e8a669a30121273?rik=vsc22vMfmcSGfg&pid=ImgRaw&r=0" />
      </Head>

      {/* Use the new LogoOnly component */}
      <LogoOnly />
      
      {/* VideoFeed takes full screen */}
      <VideoFeed />
    </div>
  );
}
