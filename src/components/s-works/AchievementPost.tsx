import type { FC, PropsWithChildren } from "react";
import { Flex, styled } from "@styled-system/jsx";

import AchievementRelatedLinkButton from "./AchievementRelatedLinkButton";
import { formatDisplayDate } from "../../helpers/utils";

const Article = styled("article", {
  base: {
    "& a": {
      textDecoration: "underline",
      fontWeight: "var(--fontWeight-semibold)",
      color: "orange.400",
    },

    "& p": {
      marginBottom: "var(--spacing-8)",
    },

    "& img": {
      height: "auto",
      boxShadow: "md",
    },
  },
});

interface Props {
  title: string;
  date: Date;
  links: {
    href: string;
    type: "twitter" | "external";
    label: string;
  }[];
}

const AchievementPost: FC<PropsWithChildren<Props>> = ({
  children,
  title,
  date,
  links,
}) => {
  return (
    <div>
      <header>
        <styled.h1
          marginTop="var(--spacing-8)"
          marginBottom="0"
          fontSize="var(--font-sizes-3xl)"
          lineHeight="snug"
        >
          {title}
        </styled.h1>
        <styled.div marginTop="var(--spacing-3)">
          <time>{formatDisplayDate(date)}</time>
        </styled.div>
        <Flex
          flexWrap="wrap"
          marginTop="var(--spacing-4)"
          gap="var(--spacing-2)"
        >
          {links.map(({ href, label, type }, i) => (
            <AchievementRelatedLinkButton
              key={i}
              href={href}
              type={type}
              label={label}
            />
          ))}
        </Flex>
      </header>
      <styled.hr
        marginY="var(--spacing-8)"
        // @ts-expect-error
        border={0}
        borderTop="[1px solid token(colors.slate.200)]"
      />
      <Article>{children}</Article>
    </div>
  );
};

export default AchievementPost;
