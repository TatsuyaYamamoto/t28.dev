import React, { FC } from "react";
import Fab from "@material-ui/core/Fab";
import ListIcon from "@material-ui/icons/List";

export interface MobileFabProps {
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}
const MobileFab: FC<MobileFabProps> = (props) => {
  const { onClick } = props;

  return (
    <Fab color="primary" onClick={onClick}>
      <ListIcon />
    </Fab>
  );
};

export default MobileFab;
