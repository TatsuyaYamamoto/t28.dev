import React, { FC, MouseEvent } from "react";
import Popover from "@material-ui/core/Popover";

import * as styles from "./MobileToc.module.scss";

export interface MobileTocProps {
  el: HTMLElement | null;
  tableOfContents: string;
  onClose: () => void;
}

const MobileToc: FC<MobileTocProps> = (props) => {
  const { el, tableOfContents, onClose } = props;
  const open = Boolean(el);

  const onClickToc = (e: MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).tagName === "A") {
      onClose();
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={el}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      onClose={onClose}
    >
      <div
        dangerouslySetInnerHTML={{ __html: tableOfContents }}
        className={styles.toc}
        onClick={onClickToc}
      />
    </Popover>
  );
};

export default MobileToc;
