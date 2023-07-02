import { ButtonPositionEnum } from "../enum/button-position-enum";

export interface Actions {
  name: string;
  icon: string;
  tooltip: string;
  position: ButtonPositionEnum
  label?: string;
  conditional?: Function;
  iconSet?: string;
}
