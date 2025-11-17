import type { FC } from "react";

import { AUTHOR_SUMMARY, TWITTER_NAME, TWITTER_URL } from "../constants";

import profilePic from "../assets/images/profile-pic.jpg";

const Bio: FC = () => {
  return (
    <div className="flex">
      <img
        alt=""
        src={profilePic.src}
        width={50}
        height={50}
        className="rounded-full"
      />
      <div className="ml-4">
        {AUTHOR_SUMMARY}
        <br />
        <a href={TWITTER_URL} target="_blank">
          {TWITTER_NAME}
        </a>
      </div>
    </div>
  );
};

export default Bio;
