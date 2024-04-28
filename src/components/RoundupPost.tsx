import type { FC, PropsWithChildren } from "react";
import { css } from "../../styled-system/css";

const root = css({
  border: "1px solid var(--color-accent)",
  borderRadius: "10px",
  boxShadow: "0 2px 4px rgb(67 133 187 / 7%)",
  padding: "var(--spacing-10)",
  backgroundColor: "rgb(252, 252, 252)",

  "& header": {
    marginBottom: "var(--spacing-10)",

    "& h1": {
      margin: "0 0 var(--spacing-4)",
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
