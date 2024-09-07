import type { FC, PropsWithChildren } from "react";
import { Flex, styled } from "@styled-system/jsx";
import { css } from "@styled-system/css";

import Bio from "./Bio";
import Chip from "./Chip";

import { formatDisplayDate } from "../helpers/utils";

const frameStyle = css({
  padding: "10",
  border: "var(--border-solid-accent)",
  borderRadius: "lg",
  boxShadow: "xs",
  backgroundColor: "var(--color-post-background)",
});

export interface Props {
  title: string;
  date: Date;
  category: string;
}

const BlogPost: FC<PropsWithChildren<Props>> = ({
  title,
  date,
  category,
  children,
}) => {
  return (
    <styled.article
      itemScope
      itemType="http://schema.org/Article"
      display="flex"
      flexDirection="column"
      gap="3"
    >
      <styled.header className={frameStyle}>
        <styled.h1
          itemProp="headline"
          margin="0"
          marginBottom="4"
          fontSize="var(--fontSize-5)"
        >
          {title}
        </styled.h1>
        <Flex alignItems="center">
          <styled.span marginRight="2">{formatDisplayDate(date)}</styled.span>
          <Chip>{category}</Chip>
        </Flex>
      </styled.header>
      {children}
      <styled.footer className={frameStyle}>
        <Bio />
      </styled.footer>
    </styled.article>
  );
};

export default BlogPost;
