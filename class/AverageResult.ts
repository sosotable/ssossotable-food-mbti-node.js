import Result from "./interface/Result";

export default class AverageResult extends Result {
  constructor(
    _answerResult: {
      [type: string]: number | string;
      [score: number]: number | string;
    }[]
  ) {
    super(_answerResult);
  }
}
