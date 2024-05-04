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
      padding="var(--spacing-10)"
      backgroundColor="var(--color-post-background)"
      itemScope
      itemType="http://schema.org/Article"
    >
      <styled.header marginBottom="var(--spacing-10)">
        <styled.h1
          itemProp="headline"
          margin="0"
          marginBottom="var(--spacing-4)"
          fontSize="var(--fontSize-5)"
        >
          {title}
        </styled.h1>
        <Flex alignItems="center">
          <styled.span marginRight="var(--spacing-2)">
            {formatDisplayDate(date)}
          </styled.span>
          <Chip>{category}</Chip>
        </Flex>
        {roundup && (
          <div>
            {`Rounded-up in: `} <a href={roundup.slug}>{roundup.title}</a>
          </div>
        )}
      </styled.header>
      {children}
      <styled.footer marginTop="var(--spacing-10)">
        <Bio />
      </styled.footer>
    </styled.article>
  );
};

export default BlogPost;
