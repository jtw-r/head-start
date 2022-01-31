import { Question_Types } from "../enums/Question_Types";

export interface Question_Options {
  prompt: string;
  prompt_type: Question_Types;
  prompt_options?: {};
  default_value?: any;
  allow_multiline?: boolean;
  min_select_amount?: number;
  max_select_amount?: number;
  list_separator?: string;
}
