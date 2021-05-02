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
    <div className="bio">
      <StaticImage
        alt="Profile picture"
        src="../assets/images/profile-pic.jpg"
        className="bio-avatar"
        width={50}
        height={50}
        quality={95}
      />
      <p>
        {author?.summary || ``}
        <br />
        <OutboundLink
          href={`https://twitter.com/${social?.twitter || ``}`}
          target="_blank"
        >
          {author?.name}
        </OutboundLink>
      </p>
    </div>
  );
};

export default Bio;
