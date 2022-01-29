export interface Dependency {
  name: string;
  version: string;
  type: "framework" | "other";
  options: { [key: string]: string | number | boolean };
}
