import React, { FC, useEffect, useRef, useState } from "react";
import { isHTMLAnchorElement } from "../helpers/type-gurad";

import * as styles from "./Toc.module.scss";

export interface TocProps {
  headings: { id: string; value: string; depth: number }[];
  tableOfContents: string;
  onClick: (id: string) => void;
}

const Toc: FC<TocProps> = (props) => {
  const { headings, tableOfContents, onClick } = props;
  const tocElRef = useRef<HTMLDivElement>(null);
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);

  const getAboveId = (inputId: string) => {
    const inputHeadingIndex = headings.findIndex(
      (candidate) => candidate.id === inputId
    );
    const aboveIdIndex = inputHeadingIndex - 1;

    return headings[0 < aboveIdIndex ? aboveIdIndex : 0].id;
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
    if (/* first callback */ entries.length === headings.length) {
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
      const {
        top: boundingTop,
        bottom: boundingBottom,
      } = entry.boundingClientRect;

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

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      e.preventDefault();

      if (!isHTMLAnchorElement(e.target)) {
        return;
      }

      const id = decodeURIComponent(e.target.href.split("#")[1]);
      onClick(id);
    };

    tocElRef.current?.addEventListener("click", clickHandler);
    return () => {
      tocElRef.current?.removeEventListener("click", clickHandler);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, {
      rootMargin: "-10% 0px -80%",
    });

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [headings]);

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
    <div
      ref={tocElRef}
      className={styles.toc}
      dangerouslySetInnerHTML={{ __html: tableOfContents }}
    />
  );
};

export default Toc;
