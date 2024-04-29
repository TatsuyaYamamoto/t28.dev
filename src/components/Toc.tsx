import type { FC, MouseEvent } from "react";
import { useRef, useState, useEffect, useMemo } from "react";
import { css } from "../../styled-system/css";

import { isHTMLAnchorElement } from "../helpers/type-gurad";

const toc = css({
  fontSize: "var(--fontSize-0)",

  "& > ul": {
    paddingLeft: "0",
  },

  "& li": {
    position: "relative",
    listStyleType: "none",

    "& > ul": {
      paddingLeft: "var(--spacing-4)",
    },
  },

  "& a": {
    textDecoration: "none",
    color: "[#989898]", // TODO use token
    "&[data-toc-active]": {
      color: "var(--color-text)",
    },
  },
});

const empty = css({
  textAlign: "center",
});

const parseUrlAsId = (tocItems: TocItems): string[] => {
  return tocItems.reduce<string[]>((prev, current) => {
    const id = current.url.replace("#", "");
    prev.push(id);

    if (current.children) {
      prev.push(...parseUrlAsId(current.children));
    }

    return prev;
  }, []);
};

export interface TocItem {
  url: string;
  title: string;
  depth: number;
  children: TocItem[];
}

export type TocItems = TocItem[];

interface Props {
  items: TocItem[];
}

const Toc: FC<Props> = ({ items }) => {
  const tocElRef = useRef<HTMLDivElement>(null);
  const [activeHeadingId, setActiveHeadingId] = useState<string | undefined>();
  const ids = useMemo(() => {
    return parseUrlAsId(items);
  }, [items]);

  const getAboveId = (inputId: string) => {
    const inputHeadingIndex = ids.findIndex(
      (candidateId) => candidateId === inputId,
    );
    const aboveIdIndex = inputHeadingIndex - 1;

    return ids[0 < aboveIdIndex ? aboveIdIndex : 0];
  };

  const onLeave = (id: string, direction: "upward" | "downward") => {
    if (direction === "upward") {
      setActiveHeadingId(id);
    }
    if (direction === "downward") {
      setActiveHeadingId(getAboveId(id));
    }
  };

  const onIntersect: IntersectionObserverCallback = (entries) => {
    if (/* first callback */ entries.length === ids.length) {
      let minDiff = Number.MAX_VALUE;
      let minDiffId: string | null = null;

      for (const entry of entries) {
        const id = entry.target.id;
        const rootBoundsTop = entry.rootBounds?.top || 0;
        const boundingTop = entry.boundingClientRect.top;
        const diff = Math.abs(rootBoundsTop - boundingTop);

        if (diff < minDiff) {
          minDiff = diff;
          minDiffId = id;
        }
      }

      if (minDiffId) {
        setActiveHeadingId(minDiffId);
      }

      return;
    }

    entries.forEach((entry) => {
      if (!entry.rootBounds) {
        return;
      }

      const { id } = entry.target;

      const { top: rootTop, bottom: rootBottom } = entry.rootBounds;
      const { top: boundingTop, bottom: boundingBottom } =
        entry.boundingClientRect;

      if (!entry.isIntersecting) {
        if (rootBottom < boundingTop) {
          onLeave(id, "downward");
        }

        if (boundingBottom < rootTop) {
          onLeave(id, "upward");
        }
      }
    });
  };

  const onClickAnchor = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (!isHTMLAnchorElement(e.target)) {
      return;
    }
    const encodedId = e.target.href.split("#")[1];
    if (!encodedId) {
      return;
    }

    const id = decodeURIComponent(encodedId);
    document.getElementById(id)?.scrollIntoView();
  };

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, {
      rootMargin: "-10% 0px -80%",
    });

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [ids]);

  useEffect(() => {
    if (!activeHeadingId) {
      return;
    }

    const linkEls = tocElRef.current?.querySelectorAll("a") ?? [];
    const encodedId = encodeURIComponent(activeHeadingId);

    for (const el of linkEls) {
      if (el.href.endsWith(encodedId)) {
        el.setAttribute("data-toc-active", "");
      } else {
        el.removeAttribute("data-toc-active");
      }
    }
  }, [activeHeadingId]);

  const renderList = (items: TocItems) => {
    return (
      <ul>
        {items.map(({ url, title, children }) => (
          <li key={url}>
            <a href={url} onClick={onClickAnchor}>
              {title}
            </a>
            {renderList(children)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div ref={tocElRef} className={toc}>
      {items.length === 0 ? (
        <div className={empty}>-- EMPTY --</div>
      ) : (
        renderList(items)
      )}
    </div>
  );
};

export default Toc;
