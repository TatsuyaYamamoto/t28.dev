import type { FC, PropsWithChildren } from "react";
import { css } from "../../styled-system/css";

const root = css({
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "var(--color-accent)",
  borderRadius: "[10px]", // TODO use token
  boxShadow: "[0 2px 4px rgb(67 133 187 / 7%)]", // TODO use token
  padding: "var(--spacing-10)",
  backgroundColor: "var(--color-post-background)",

  "& header": {
    marginBottom: "var(--spacing-10)",

    "& h1": {
      margin: "0",
      marginBottom: "var(--spacing-4)",
      fontSize: "var(--fontSize-5)",
    },
    "& div": {
      color: "var(--color-text-light)",
    },
  },

  "& footer": {
    marginTop: "var(--spacing-10)",
  },
});

export interface Props {
  title: string;
}

const RoundupPost: FC<PropsWithChildren<Props>> = (props) => {
  const { title, children } = props;

  return (
    <article className={root} itemScope itemType="http://schema.org/Article">
      <header>
        <h1 itemProp="headline">{title}</h1>
      </header>
      {children}
    </article>
  );
};

export default RoundupPost;
