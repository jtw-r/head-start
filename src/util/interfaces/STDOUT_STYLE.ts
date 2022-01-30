import { BG_COLOURS, FG_COLOURS, STDOUT_MODIFIERS } from "../enums/STDOUT";

export interface STDOUT_STYLE {
  modifier?: STDOUT_MODIFIERS;
  foreground_colour?: FG_COLOURS;
  background_colour?: BG_COLOURS;
}
