// MARK: tastes 결과 처리

import Result from "./interface/Result";

const contentModels = require("../model/content");

export default class TastesResult extends Result {
  friendResult:
    | {
        image: string;
        title: string;
        desc: string;
      }
    | undefined;
  constructor(
    _answerResult: {
      [type: string]: number | string;
      [score: number]: number | string;
    }[],
    _friendResult: { image: string; title: string; desc: string } | undefined
  ) {
    super(_answerResult);
    if (_friendResult !== undefined) {
      this.friendResult = _friendResult;
    } else {
      this.friendResult = undefined;
    }
  }
  setTitle() {
    for (let i = 0; i < this.answerResult.length; i++) {
      this.resultTitle[i] = contentModels.tastes[i].q;
    }
  }
  setDesc() {
    if (this.friendResult !== undefined) {
      for (let i = 0; i < this.answerResult.length; i++) {
        let score = Number(this.answerResult[i].score) - 1;
        this.resultDescBuffer[i] = contentModels.tastes[i].a[score].answer;
        if (
          contentModels.tastes[i].a[score].answer === this.friendResult.desc[i]
        ) {
          this.resultDesc[
            i
          ] = `맞았어요! 친구도 ${contentModels.tastes[i].a[score].answer}를 선택했네요!`;
        } else {
          this.resultDesc[
            i
          ] = `틀렸어요...! 친구는 ${contentModels.tastes[i].a[score].answer}를 선택했어요...!`;
        }
      }
    } else {
      for (let i = 0; i < this.answerResult.length; i++) {
        let score = Number(this.answerResult[i].score) - 1;
        this.resultDesc[i] = contentModels.tastes[i].a[score].answer;
      }
    }
  }
  setDescBuffer() {
    for (let i = 0; i < this.answerResult.length; i++) {
      let score = Number(this.answerResult[i].score) - 1;
      this.resultDescBuffer[i] = contentModels.tastes[i].a[score].answer;
    }
  }
  factory() {
    this.setTitle();
    this.setDesc();
    this.setDescBuffer();
  }
}
