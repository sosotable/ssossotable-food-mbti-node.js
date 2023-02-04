// MARK: 결과 처리하는 상위클래스
export default class Result {
  /** MARK: 공통 field 기술
   * */
  answerResult: { [p: string]: number | string }[];
  resultImage: string[] = [];
  resultTitle: string[] = [];
  resultDesc: string[] = [];
  resultDescBuffer: string[] = [];
  constructor(
    _answerResult: {
      [key: string]: number | string;
    }[]
  ) {
    this.answerResult = _answerResult;
  }
  /** MARK: 공통 method 기술
   * */
  getResult() {}
  setTitle() {}
  setDesc() {}
  setDescBuffer() {}
  factory() {}
}
