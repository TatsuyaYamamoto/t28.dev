import React, { FC } from "react";
import Popover from "@material-ui/core/Popover";

import * as styles from "./MobileToc.module.scss";
import Toc from "./Toc";

export interface MobileTocProps {
  el: HTMLElement | null;
  headings: { id: string; value: string; depth: number }[];
  tableOfContents: string;
  onSelect: (id: string | null) => void;
}

const MobileToc: FC<MobileTocProps> = (props) => {
  const { el, headings, onSelect, tableOfContents } = props;
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
        <Toc
          headings={headings}
          tableOfContents={tableOfContents}
          onClick={onClickToc}
        />
      </div>
    </Popover>
  );
};

export default MobileToc;
