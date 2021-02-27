import React from "react";
import { Link, PageProps } from "gatsby";
import { OutboundLink } from "gatsby-plugin-google-gtag";

interface Props {
  title: string;
  location: PageProps["location"];
}

const Layout: React.FC<Props> = ({ location, title, children }) => {
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

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <OutboundLink href="https://www.gatsbyjs.com">Gatsby</OutboundLink>
      </footer>
    </div>
  );
};

export default Layout;
