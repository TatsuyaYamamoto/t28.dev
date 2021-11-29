import React, { FC } from "react";
import Popover from "@material-ui/core/Popover";

import * as styles from "./MobileToc.module.scss";
import Toc, { TableOfContents } from "./Toc";

export interface MobileTocProps {
  el: HTMLElement | null;
  tableOfContents: TableOfContents;
  onSelect: (id: string | null) => void;
}

const MobileToc: FC<MobileTocProps> = (props) => {
  const { el, onSelect, tableOfContents } = props;
  const open = Boolean(el);

  const onClose = () => {
    onSelect(null);
  };

  const onClickToc = (id: string) => {
    onSelect(id);
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
      <div className={styles.root}>
        <Toc tableOfContents={tableOfContents} onClick={onClickToc} />
      </div>
    </Popover>
  );
};

export default MobileToc;
