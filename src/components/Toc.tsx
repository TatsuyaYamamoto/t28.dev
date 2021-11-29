import React, {
  FC,
  MouseEvent,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";

import { isHTMLAnchorElement } from "../helpers/type-gurad";

import * as styles from "./Toc.module.scss";

export interface TableOfContents {
  items: TableOfContentsItem[];
}

export interface TableOfContentsItem {
  url: string;
  title: string;
  items?: TableOfContentsItem[];
}

export interface TocProps {
  tableOfContents: TableOfContents;
  onClick: (id: string) => void;
}

const Toc: FC<TocProps> = (props) => {
  const { tableOfContents, onClick } = props;
  const tocElRef = useRef<HTMLDivElement>(null);
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const ids = useMemo(() => {
    const parseUrlAsId = (items: TableOfContentsItem[]): string[] => {
      return items.reduce<string[]>((prev, current) => {
        const id = current.url.replace("#", "");
        prev.push(id);

        if (current.items) {
          prev.push(...parseUrlAsId(current.items));
        }

        return prev;
      }, []);
    };

    return parseUrlAsId(tableOfContents.items);
  }, [tableOfContents.items]);

  const getAboveId = (inputId: string) => {
    const inputHeadingIndex = ids.findIndex(
      (candidateId) => candidateId === inputId
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
      let minDiffId = null;

      entries.forEach((entry) => {
        const id = entry.target.id;
        const rootBoundsTop = entry.rootBounds?.top || 0;
        const boundingTop = entry.boundingClientRect.top;
        const diff = Math.abs(rootBoundsTop - boundingTop);

        if (diff < minDiff) {
          minDiff = diff;
          minDiffId = id;
        }
      });

      setActiveHeadingId(minDiffId);
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

    const id = decodeURIComponent(e.target.href.split("#")[1]);
    onClick(id);
  };

  const renderList = (items: TableOfContentsItem[]) => {
    return (
      <ul>
        {items.map(({ url, title, items }) => (
          <li key={url}>
            <a href={url} onClick={onClickAnchor}>
              {title}
            </a>
            {items && renderList(items)}
          </li>
        ))}
      </ul>
    );
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

  return (
    <div ref={tocElRef} className={styles.toc}>
      {renderList(tableOfContents.items)}
    </div>
  );
};

export default Toc;
