import type { FC, PropsWithChildren } from "react";
import { styled } from "@styled-system/jsx";

export interface Props {
  title: string;
}

const RoundupPost: FC<PropsWithChildren<Props>> = (props) => {
  const { title, children } = props;

  return (
    <styled.article
      border="var(--border-solid-accent)"
      borderRadius="[10px]" // TODO use token
      boxShadow="[0 2px 4px rgb(67 133 187 / 7%)]" // TODO use token
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
      </styled.header>
      {children}
    </styled.article>
  );
};

export default RoundupPost;
