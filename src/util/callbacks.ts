import { Error, Line } from "./cmd_utils";

export function cb__handle_run_default(error, stdout, stderr) {
  if (error) {
    Error(`Error occurred while executing command`);
  } else if (stdout) {
    Line(stdout);
  }
}
