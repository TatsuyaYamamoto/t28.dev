import type { FC } from "react";

import { TWITTER_NAME, TWITTER_URL, AUTHOR_SUMMARY } from "../constants";

import styles from "./Bio.module.scss";
import profilePic from "../assets/images/profile-pic.jpg";

const Bio: FC = () => {
  return (
    <div className={styles.bio}>
      <div className="bio-left">
        <img
          alt=""
          src={profilePic}
          width={50}
          height={50}
          style={{
            borderRadius: `50px`,
          }}
        />
      </div>
      <div className={styles.bioRight}>
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
