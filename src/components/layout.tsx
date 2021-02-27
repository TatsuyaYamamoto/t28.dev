import React from "react";
import { graphql, Link, PageProps, useStaticQuery } from "gatsby";
import { OutboundLink } from "gatsby-plugin-google-gtag";

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
  let header;

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    );
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    );
  }
  const socialName = data.site?.siteMetadata?.author?.name;
  const socialScreenName = data.site?.siteMetadata?.social?.twitter;
  const socialAccountUrl = `https://twitter.com/${socialScreenName}`;

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        {`© ${new Date().getFullYear()} `}
        <OutboundLink href={socialAccountUrl} target="_blank">
          {socialName}
        </OutboundLink>
      </footer>
    </div>
  );
};

export default Layout;
