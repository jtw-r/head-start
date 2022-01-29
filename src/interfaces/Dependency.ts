import { Dependency_Types } from "../enums/Dependency_Types";

export interface Dependency {
  name: string;
  version: string;
  type: Dependency_Types;
  options: { [key: string]: string | number | boolean };
}
