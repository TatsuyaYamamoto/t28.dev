import type { FC } from "react";

import { styled } from "@styled-system/jsx";

interface Props {
  posts: {
    slug: string;
    title: string;
  }[];
}

const RoundupList: FC<Props> = (props) => {
  const { posts } = props;

  return (
    <styled.ol listStyle="none" padding="0">
      {posts.map((post) => {
        return (
          <li key={post.slug}>
            <styled.article
              marginY="8"
              itemScope
              itemType="http://schema.org/Article"
            >
              <styled.header marginBottom="4">
                <styled.h2
                  fontSize="3xl"
                  color="var(--color-primary)"
                  marginBottom="2"
                  marginTop="0"
                >
                  <a href={post.slug} itemProp="url">
                    <span itemProp="headline">{post.title}</span>
                  </a>
                </styled.h2>
              </styled.header>
            </styled.article>
          </li>
        );
      })}
    </styled.ol>
  );
};

export default RoundupList;
