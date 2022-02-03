import { Error } from "../cmd_utils";
import { Question_Types } from "../enums/Question_Types";

export class Answer {
  type: Question_Types;
  responses: any[];

  constructor(_type, _responses = []) {
    this.type = _type;
    this.responses = _responses;
  }

  getValue(): any {
    if (this.responses?.length >= 1) {
      return this.responses[0];
    } else {
      Error("Trying to get the value of an undefined response");
    }
  }

  getValues(): any[] {
    return this.responses;
  }

  addResponse(_value) {
    this.responses.push(_value);
  }
}
