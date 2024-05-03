import type { FC, PropsWithChildren } from "react";
import { css } from "@styled-system/css";
import { VStack, styled } from "@styled-system/jsx";

import { formatDisplayDate } from "../../helpers/utils";

interface Props {
  posts: {
    url: string;
    title: string;
    description: string;
    date: Date;
    heroImage: { src: string };
  }[];
}

const AchievementSection: FC<PropsWithChildren<Props>> = ({ posts }) => {
  return (
    <styled.section
      backgroundColor="var(--color-s-works)"
      paddingX="[15px]" // TODO use token
      paddingY="var(--spacing-8)"
    >
      <styled.div
        maxWidth="[800px]" // TODO use token
        marginX="auto"
      >
        <styled.h2
          color="var(--colors-white)"
          fontSize={{ base: "var(--spacing-10)", md: "var(--spacing-20)" }}
          fontFamily="[sans-serif]" // TODO use token
          fontWeight="var(--fontWeight-semibold)"
        >
          {`Achievements`}
        </styled.h2>
        <div
          className={css({
            "& a:not(:first-child)": {
              marginTop: "var(--spacing-8)",
            },
          })}
        >
          {posts.map(({ url, title, date, description, heroImage }) => (
            <styled.a
              key={url}
              href={url}
              display="flex"
              color="var(--color-black)"
              backgroundColor="var(--colors-white)"
              textDecoration="none"
              flexDirection={{ base: "column", md: "row" }}
            >
              <VStack
                padding="var(--spacing-5)"
                gap="var(--spacing-4)"
                flex="1"
                alignItems="unset"
              >
                <styled.h3
                  margin="var(--spacing-0)"
                  fontSize="var(--spacing-5)"
                >
                  {title}
                </styled.h3>
                <p>{formatDisplayDate(date)}</p>
                <p>{description}</p>
              </VStack>
              <styled.div
                width="full"
                md={{ maxWidth: "[300px]" /* TODO use token */ }}
              >
                <img
                  alt={""}
                  src={heroImage.src}
                  className={css({ objectFit: "cover", height: "full" })}
                />
              </styled.div>
            </styled.a>
          ))}
        </div>
      </styled.div>
    </styled.section>
  );
};

export default AchievementSection;
