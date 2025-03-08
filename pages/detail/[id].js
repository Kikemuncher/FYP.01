import Head from "next/head";
import React from "react";

import UserProfile from "../../components/UserProfile"; // ✅ Removed Header import

const UserPage = () => {
  return (
    <div>
      <Head>
        <title>User Profile - TikTok Clone</title>
        <meta name="description" content="User profile page" />
        <link
          rel="icon"
          href="https://th.bing.com/th/id/R.67bc88bb600a54112e8a669a30121273?rik=vsc22vMfmcSGfg&pid=ImgRaw&r=0"
        />
      </Head>
      <UserProfile />
    </div>
  );
};

export default UserPage;
