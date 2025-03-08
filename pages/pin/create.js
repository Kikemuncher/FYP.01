import Head from "next/head";
import React from "react";

import CreateVideo from "../../components/CreateVideo"; // ✅ Removed Header import

const CreatePage = () => {
  return (
    <div>
      <Head>
        <title>Create Video - TikTok Clone</title>
        <meta name="description" content="Upload your video on TikTok Clone" />
        <link
          rel="icon"
          href="https://th.bing.com/th/id/R.67bc88bb600a54112e8a669a30121273?rik=vsc22vMfmcSGfg&pid=ImgRaw&r=0"
        />
      </Head>
      <CreateVideo />
    </div>
  );
};

export default CreatePage;
