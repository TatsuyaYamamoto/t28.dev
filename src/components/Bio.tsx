import type { FC } from "react";
import { css } from "../../styled-system/css";
import { TWITTER_NAME, TWITTER_URL, AUTHOR_SUMMARY } from "../constants";

import profilePic from "../assets/images/profile-pic.jpg";

const bio = css({
  display: "flex",
});

const bioRight = css({
  marginLeft: "var(--spacing-4)",
});

const Bio: FC = () => {
  return (
    <div className={bio}>
      <div>
        <img
          alt=""
          src={profilePic.src}
          width={50}
          height={50}
          style={{
            borderRadius: `50px`,
          }}
        />
      </div>
      <div className={bioRight}>
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
