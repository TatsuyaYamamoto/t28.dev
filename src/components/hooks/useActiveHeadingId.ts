import { useEffect, useState } from "react";

const useActiveHeadingId = (headingIds: string[]) => {
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);

  const getAboveId = (id: string) => {
    const inputIdIndex = headingIds.findIndex(
      (candidateId) => candidateId === id
    );
    const aboveIdIndex = inputIdIndex - 1;

    return headingIds[0 < aboveIdIndex ? aboveIdIndex : 0];
  };

  const onLeave = (id: string, direction: "upward" | "downward") => {
    if (direction === "upward") {
      console.log(id, "上方向へ出た");
      setActiveHeadingId(id);
    }
    if (direction === "downward") {
      console.log(id, "下方向へ出た");
      setActiveHeadingId(getAboveId(id));
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (/* first callback */ entries.length === headingIds.length) {
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
          const {
            top: rootBoundsTop,
            bottom: rootBoundsBottom,
          } = entry.rootBounds;
          const {
            top: boundingClientRectTop,
            bottom: boundingClientRectBottom,
          } = entry.boundingClientRect;

          if (!entry.isIntersecting) {
            if (rootBoundsBottom < boundingClientRectTop) {
              onLeave(id, "downward");
            }

            if (boundingClientRectBottom < rootBoundsTop) {
              onLeave(id, "upward");
            }
          }
        });
      },
      {
        rootMargin: "-30% 0px -60%",
      }
    );

    headingIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [headingIds]);

  return activeHeadingId;
};

export default useActiveHeadingId;
