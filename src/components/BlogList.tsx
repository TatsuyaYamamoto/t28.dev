import type { FC } from "react";

import { formatDisplayDate } from "../helpers/utils";
import Chip from "./Chip";

interface Props {
  posts: {
    url: string;
    title: string;
    description: string;
    publishedDate: Date;
    category: string;
  }[];
}

const BlogList: FC<Props> = (props) => {
  const { posts } = props;

  return (
    <ol className="p-0" role="list">
      {posts.map((post) => {
        return (
          <li key={post.url}>
            <article className="my-8">
              <header className="mb-4">
                <h2 className="mt-0 mb-2 text-(length:--fontSize-4) text-(--color-primary)">
                  <a href={post.url}>
                    <span>{post.title}</span>
                  </a>
                </h2>
                <div className="flex">
                  <span className="mr-2">
                    {formatDisplayDate(post.publishedDate)}
                  </span>
                  <Chip>{post.category}</Chip>
                </div>
              </header>
              <section>
                <p>{post.description}</p>
              </section>
            </article>
          </li>
        );
      })}
    </ol>
  );
};

export default BlogList;
