// MARK: mbti 결과 처리

import Result from "./interface/Result";

const resultModels = require("../model/result");

export default class MBTIResult extends Result {
  MBTIPOINT: {
    [key: string]: number | string;
  } = {
    ESTJ: 0,
    ISTJ: 1,
    ENTJ: 2,
    INTJ: 3,
    ESFJ: 4,
    ISFJ: 5,
    ENFJ: 6,
    INFJ: 7,
    ESTP: 8,
    ISTP: 9,
    ENTP: 10,
    INTP: 11,
    ESFP: 12,
    ISFP: 13,
    ENFP: 14,
    INFP: 15,
  };
  mbti: number | string | null = "";
  constructor(
    _answerResult: {
      [type: string]: number | string;
      [score: number]: number | string;
    }[]
  ) {
    super(_answerResult);
  }

  defPoint(eipoint: number, snpoint: number, ftpoint: number, pjpoint: number) {
    return (
      (eipoint < 5 ? "E" : "I") +
      (snpoint < 5 ? "S" : "N") +
      (ftpoint < 5 ? "F" : "T") +
      (pjpoint < 5 ? "P" : "J")
    );
  }
  calcMBTI(result: { [key: string]: number | string }[]) {
    for (let i = 0; i < result.length; i++) {
      let returnValue: [
        eipoint: number,
        snpoint: number,
        ftpoint: number,
        pjpoint: number
      ] = [0, 0, 0, 0];
      for (let i = 0; i < result.length; i++) {
        switch (result[i].type) {
          case "EI":
            returnValue[0] += <number>result[i].score;
            break;
          case "SN":
            returnValue[1] += <number>result[i].score;
            break;
          case "FT":
            returnValue[2] += <number>result[i].score;
            break;
          case "PJ":
            returnValue[3] += <number>result[i].score;
            break;
        }
      }
      return returnValue;
    }
  }
  getResult() {
    let calcMBTIResult:
      | string
      | String
      | [eipoint: number, snpoint: number, ftpoint: number, pjpoint: number]
      | undefined = this.calcMBTI(this.answerResult);
    if (calcMBTIResult !== undefined) {
      const point = this.defPoint(
        calcMBTIResult[0], // eipoint
        calcMBTIResult[1], // snpoint
        calcMBTIResult[2], // ftpoin
        calcMBTIResult[3]
      ); // pjpoint
      const result: number | string = this.MBTIPOINT[point];
      return result;
    } else {
      return null;
    }
  }

  setMBTI() {
    this.mbti = this.getResult();
  }
  setTitle() {
    if (this.mbti !== undefined && this.mbti !== null) {
      this.resultTitle[0] = resultModels.mbtiRestList[this.mbti].name;
    }
  }
  setDescBuffer() {
    if (this.mbti !== undefined && this.mbti !== null) {
      this.resultDesc[0] = resultModels.mbtiRestList[this.mbti].desc;
    }
  }
  factory() {
    this.setMBTI();
    this.setTitle();
    this.setDescBuffer();
  }
}
