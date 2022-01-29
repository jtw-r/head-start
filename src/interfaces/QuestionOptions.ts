import { QuestionTypes } from "../util/cmd_utils";

export interface QuestionOptions {
  prompt: string;
  prompt_type: QuestionTypes;
  prompt_options?: {};
  default_value?: any;
  allow_multiline?: boolean;
}
