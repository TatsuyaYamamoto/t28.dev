/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { OutboundLink } from "gatsby-plugin-google-gtag";

import * as styles from "./bio.module.scss";

const Bio: React.FC = () => {
  const data = useStaticQuery<GatsbyTypes.BioQueryQuery>(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
          }
        }
      }
    }
  `);

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site?.siteMetadata?.author;
  const social = data.site?.siteMetadata?.social;

  const avatar = data?.avatar?.childImageSharp?.fixed;

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
        {author?.summary || ``}
        <br />
        <OutboundLink
          href={`https://twitter.com/${social?.twitter || ``}`}
          target="_blank"
        >
          {author?.name}
        </OutboundLink>
      </div>
    </div>
  );
};

export default Bio;
