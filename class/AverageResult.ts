import Result from "./interface/Result";

const contentModels = require("../model/content");

export default class AverageResult extends Result {
  constructor(
    _answerResult: {
      [type: string]: number | string;
      [score: number]: number | string;
    }[]
  ) {
    super(_answerResult);
  }

  setTitle() {
    for (let i = 0; i < this.answerResult.length; i++) {
      this.resultTitle[i] = contentModels.average[i].q;
    }
  }

  setDesc() {
    for (let i = 0; i < this.answerResult.length; i++) {
      let score = Number(this.answerResult[i].score);
      if (contentModels.average[i].a == undefined) {
        this.resultDesc[i] = score + "";
      } else {
        this.resultDesc[i] = contentModels.average[i].a[score].answer;
      }
    }
  }

  setDescBuffer() {
    for (let i = 0; i < this.answerResult.length; i++) {
      let score = Number(this.answerResult[i].score);
      if (contentModels.average[i].a == undefined) {
        this.resultDesc[i] = score + "";
      } else {
        this.resultDesc[i] = contentModels.average[i].a[score].answer;
      }
    }
  }

  factory() {
    this.setTitle();
    this.setDesc();
    this.setDescBuffer();
  }
}
