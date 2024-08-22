import type { FC, PropsWithChildren } from "react";
import { Flex, styled } from "@styled-system/jsx";

import Bio from "./Bio";
import Chip from "./Chip";

import { formatDisplayDate } from "../helpers/utils";

export interface Props {
  title: string;
  date: Date;
  category: string;
  roundup?: {
    slug: string;
    title: string;
  };
}

const BlogPost: FC<PropsWithChildren<Props>> = ({
  title,
  date,
  category,
  roundup,
  children,
}) => {
  return (
    <styled.article
      border="var(--border-solid-accent)"
      borderRadius="lg"
      boxShadow="xs"
      padding="10"
      backgroundColor="var(--color-post-background)"
      itemScope
      itemType="http://schema.org/Article"
    >
      <styled.header marginBottom="10">
        <styled.h1
          itemProp="headline"
          margin="0"
          marginBottom="4"
          fontSize="4xl"
        >
          {title}
        </styled.h1>
        <Flex alignItems="center">
          <styled.span marginRight="2">{formatDisplayDate(date)}</styled.span>
          <Chip>{category}</Chip>
        </Flex>
        {roundup && (
          <div>
            {`Rounded-up in: `} <a href={roundup.slug}>{roundup.title}</a>
          </div>
        )}
      </styled.header>
      {children}
      <styled.footer marginTop="10">
        <Bio />
      </styled.footer>
    </styled.article>
  );
};

export default BlogPost;
