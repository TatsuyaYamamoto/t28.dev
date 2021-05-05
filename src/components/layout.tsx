import React from "react";
import { graphql, Link, PageProps, useStaticQuery } from "gatsby";
import { OutboundLink } from "gatsby-plugin-google-gtag";

import * as styles from "./layout.module.scss";

interface Props {
  title: string;
  location: PageProps["location"];
}

const Layout: React.FC<Props> = ({ location, title, children }) => {
  const data = useStaticQuery<GatsbyTypes.LayoutQueryQuery>(graphql`
    query LayoutQuery {
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

  // @ts-ignore
  const rootPath = `${__PATH_PREFIX__}/`;
  const isRootPath = location.pathname === rootPath;
  const socialName = data.site?.siteMetadata?.author?.name;
  const socialScreenName = data.site?.siteMetadata?.social?.twitter;
  const socialAccountUrl = `https://twitter.com/${socialScreenName}`;

  return (
    <div data-is-root-path={isRootPath}>
      <header className={styles.appHeader}>
        <div className={styles.headerInner}>
          {isRootPath ? (
            <h1 className={styles.mainHeading}>
              <Link to="/">{title}</Link>
            </h1>
          ) : (
            <Link className={styles.headerLinkHome} to="/">
              {title}
            </Link>
          )}
        </div>
      </header>
      <main>{children}</main>
      <footer className={styles.appFooter}>
        <div className={styles.footerInner}>
          <div className={styles.footerCopyRight}>
            {`© ${new Date().getFullYear()} `}
            <OutboundLink href={socialAccountUrl} target="_blank">
              {socialName}
            </OutboundLink>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
