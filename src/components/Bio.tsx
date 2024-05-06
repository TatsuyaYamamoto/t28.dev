import type { FC } from "react";
import { css } from "@styled-system/css";
import { Flex, styled } from "@styled-system/jsx";

import { TWITTER_NAME, TWITTER_URL, AUTHOR_SUMMARY } from "../constants";

import profilePic from "../assets/images/profile-pic.jpg";

const Bio: FC = () => {
  return (
    <Flex>
      <img
        alt=""
        src={profilePic.src}
        width={50}
        height={50}
        className={css({
          borderRadius: "full",
        })}
      />
      <styled.div marginLeft="4">
        {AUTHOR_SUMMARY}
        <br />
        <a href={TWITTER_URL} target="_blank">
          {TWITTER_NAME}
        </a>
      </styled.div>
    </Flex>
  );
};

export default Bio;
