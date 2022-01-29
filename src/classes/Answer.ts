import { Error, QuestionTypes } from "../functions/util/cmd_utils";

export class Answer {
  type: QuestionTypes;
  responses: {
    index: number;
    value: string | number | boolean;
  }[];

  constructor(_type, _responses = []) {
    this.type = _type;
    this.responses = _responses;
  }

  getValue(): string | number | boolean {
    if (this.responses?.length >= 1) {
      return this.responses[0].value;
    } else {
      Error("Trying to get the value of an undefined response");
    }
  }

  getValues() {
    let _v = [];
    this.responses.forEach((value, index) => _v.push(value));
    return _v;
  }

  addResponse(_value, _section_id = 0) {
    this.responses.push({ index: _section_id, value: _value });
  }
}
