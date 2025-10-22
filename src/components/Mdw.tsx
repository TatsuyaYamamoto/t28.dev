import { createComponent } from "@lit/react";
import { MdFilledButton as _MdFilledButton } from "@material/web/button/filled-button";
import { MdOutlinedButton as _MdOutlinedButton } from "@material/web/button/outlined-button";
import { MdDialog as _MdDialog } from "@material/web/dialog/dialog";
import React from "react";

export const MdFilledButton = createComponent({
  tagName: "md-filled-button",
  elementClass: _MdFilledButton,
  react: React,
  events: {
    onClick: "click",
  },
});

export const MdOutlinedButton = createComponent({
  tagName: "md-outlined-button",
  elementClass: _MdOutlinedButton,
  react: React,
  events: {
    onClick: "click",
  },
});

export const MdDialog = createComponent({
  tagName: "md-dialog",
  elementClass: _MdDialog,
  react: React,
  events: {
    onClick: "click",
  },
});
