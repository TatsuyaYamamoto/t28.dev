import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { OutboundLink } from "gatsby-plugin-google-gtag";

import * as styles from "./bio.module.scss";

const Bio: React.FC = () => {
  const data = useStaticQuery<GatsbyTypes.BioQuery>(graphql`
    query Bio {
      site {
        siteMetadata {
          author {
            name
            summary
            twitterUrl
          }
        }
      }
    }
  `);

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const authorName = data.site?.siteMetadata?.author?.name;
  const authorSummary = data.site?.siteMetadata?.author?.summary;
  const twitterUrl = data.site?.siteMetadata?.author?.twitterUrl;

  return (
    <div className={styles.bio}>
      <div className="bio-left">
        <StaticImage
          alt="Profile picture"
          src="../assets/images/profile-pic.jpg"
          width={50}
          height={50}
          aspectRatio={1}
          quality={95}
          imgStyle={{
            borderRadius: `50px`,
          }}
        />
      </div>
      <div className={styles.bioRight}>
        {authorSummary}
        <br />
        <OutboundLink href={twitterUrl} target="_blank">
          {authorName}
        </OutboundLink>
      </div>
    </div>
  );
};

export default Bio;
