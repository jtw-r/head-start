import { Abort, Error, Line } from "./cmd_utils";
import { Answer } from "./classes/Answer";

/*
 * You know, I'm not actually sure if a lot of functions will be added to this file, but I'll put any repetitive
 *  ones that are used often here!
 */

/**
 * Handles any errors from a `child_process.exec()` function call.
 *
 * Typically, this function will be passed as an argument to a `cmd_utils.Run()` call to the console. Example:
 * ```
 * import { Run } from "./cmd_utils";
 * import { cb__handle_run_default } from "./callbacks";
 * Run("your command", cb__handle_run_default);
 * ```
 * Please note that this function is also the DEFAULT value for the callback argument in the `cmd_utils.Run()` call,
 * so normally you will not need to reference this often.
 * @param error
 * @param stdout
 * @param stderr
 */
export function cb__handle_run_default(error, stdout, stderr) {
  if (error) {
    Error(`Error occurred while executing command`);
  } else if (stdout) {
    Line(stdout);
  }
}

/**
 *
 * @param {any} _question_promise
 * @returns {Promise<Answer>}
 */
export async function handle_questions(_question_promise: any): Promise<Answer> {
  return await _question_promise.then(
    (_resp, _interrupt) => {
      if (typeof _resp.value === "undefined" || _interrupt) {
        Abort("Empty value passed. Aborting!");
      } else {
        return typeof _resp.value === "object"
          ? new Answer(_question_promise.prompt, _resp) // If the response is an array, return it unchanged
          : new Answer(_question_promise.prompt_type, [_resp]); // If it's anything else, wrap it in an array
      }
    },
    (reason) => {
      Error(reason);
    }
  );
}
