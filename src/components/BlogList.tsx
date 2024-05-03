import type { FC } from "react";
import { css } from "@styled-system/css";
import { Flex, styled } from "@styled-system/jsx";

import Chip from "./Chip";
import { formatDisplayDate } from "../helpers/utils";

interface Props {
  posts: {
    url: string;
    title: string;
    description: string;
    date: Date;
    category: string;
  }[];
}

const BlogList: FC<Props> = (props) => {
  const { posts } = props;

  return (
    <styled.ol listStyle="none" padding="0">
      {posts.map((post) => {
        return (
          <li key={post.url}>
            <styled.article
              marginY="var(--spacing-8)"
              itemScope
              itemType="http://schema.org/Article"
            >
              <styled.header marginBottom="var(--spacing-4)">
                <styled.h2
                  fontSize="var(--fontSize-4)"
                  color="var(--color-primary)"
                  marginBottom="var(--spacing-2)"
                  marginTop="var(--spacing-0)"
                >
                  <a href={post.url} itemProp="url">
                    <span itemProp="headline">{post.title}</span>
                  </a>
                </styled.h2>
                <Flex alignItems="center">
                  <span>{formatDisplayDate(post.date)}</span>
                  <Chip className={css({ marginLeft: "[5px]" })}>
                    {post.category}
                  </Chip>
                </Flex>
              </styled.header>
              <section>
                <p itemProp="description">{post.description}</p>
              </section>
            </styled.article>
          </li>
        );
      })}
    </styled.ol>
  );
};

export default BlogList;
