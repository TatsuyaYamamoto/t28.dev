import { Flex, styled } from "@styled-system/jsx";
import type { FC } from "react";

import { formatDisplayDate } from "../helpers/utils";
import Chip from "./Chip";

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
              marginY="8"
              itemScope
              itemType="http://schema.org/Article"
            >
              <styled.header marginBottom="4">
                <styled.h2
                  fontSize="var(--fontSize-4)"
                  color="var(--color-primary)"
                  marginBottom="2"
                  marginTop="0"
                >
                  <a href={post.url} itemProp="url">
                    <span itemProp="headline">{post.title}</span>
                  </a>
                </styled.h2>
                <Flex alignItems="center">
                  <styled.span marginRight="2">
                    {formatDisplayDate(post.date)}
                  </styled.span>
                  <Chip>{post.category}</Chip>
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
