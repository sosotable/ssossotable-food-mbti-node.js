const startPage = document.querySelector("#start-page");
const qnaPage = document.querySelector("#qna-page");
const progressBar = document.querySelector(".progress-bar");

const a = document.querySelector(".aBox");
const q = document.querySelector(".qBox");

const backBtn = document.querySelector("#back-btn");

let contentType;

// MARK: qIdx 전역 지정에 따라 전역 범위에서 backBtn 이벤트 리스너 지정
backBtn.addEventListener("click", () => {
  let children = document.querySelectorAll(".answerList");
  for (let i = 0; i < children.length; i++) {
    children[i].disabled = true;
    children[i].style.display = "none";
  }
  result.pop();
  goNext(--qIdx);
});

// MARK: 결과 post 요청을 보낼 body
let result = [];

qnaPage.style.display = "none";

/** REFACTOR:
 * - 페이지별 대응받기 위해 인자로 입력받도록 함
 * - 함수 스코프 문제로 에러 발생, 전역으로 지정
 * */
let endPoint = Number;
let qIdx = 0;
function addAnswer(aIdx) {
  const answer = qnaList[qIdx].a[aIdx];
  const answerText = answer.answer;
  let answerBtn = document.createElement("button");

  answerBtn.classList.add("answerList", "btn");
  a.appendChild(answerBtn);
  answerBtn.innerHTML = answerText;

  answerBtn.addEventListener(
    "click",
    () => {
      let children = document.querySelectorAll(".answerList");
      for (let i = 0; i < children.length; i++) {
        children[i].disabled = true;
        children[i].style.display = "none";
      }
      // MARK: 요청 body 정보 저장
      result.push({
        score: answer.score,
        type: qnaList[qIdx].type,
      });
      goNext(++qIdx);
    },
    false
  );
}

/** ADDED: 주관식 답변이 요구되는 경우 input form을 제작하여 사용
 */
function askAnswer() {
  const askForm = document.createElement("div");
  const inputForm = document.createElement("input");
  const buttonDiv = document.createElement("div");
  const button = document.createElement("button");
  askForm.className = "input-group mb-3 answerList";
  inputForm.type = "text";
  inputForm.className = "form-control";
  inputForm.placeholder = "입력";
  buttonDiv.className = "input-group-append";
  button.className = "btn";
  button.innerText = "다음";
  buttonDiv.appendChild(button);
  askForm.appendChild(inputForm);
  askForm.appendChild(buttonDiv);
  button.addEventListener(
    "click",
    () => {
      let children = document.querySelectorAll(".answerList");
      for (let i = 0; i < children.length; i++) {
        children[i].disabled = true;
        children[i].style.display = "none";
      }
      // MARK: 전송 객체 정보 저장
      result.push({
        score: inputForm.value,
      });
      goNext(++qIdx);
    },
    false
  );
  a.appendChild(askForm);
}

function start(point, type) {
  contentType = type;
  endPoint = parseInt(point);
  startPage.style.display = "none";
  qnaPage.style.display = "block";
  goNext();
}

function goNext() {
  if (qIdx === endPoint) {
    goResult();
  } else {
    q.innerHTML = qnaList[qIdx].q;
    if (qnaList[qIdx].a === undefined) {
      /** MARK:
       * 주관식 답변이 요구되는 경우
       * */
      askAnswer();
    } else {
      /** MARK:
       * 객관식 답변이 요구되는 경우
       * */
      for (let i in qnaList[qIdx].a) {
        addAnswer(i);
      }
    }
    // MAKR: 진행도 계산
    progressBar.style.width = (100 / endPoint) * (qIdx + 1) + "%";
  }
}

/**
 * MARK:
 * 결과 창 넘어가는 함수
 * 하나의 페이지에서 결과를 처리하지 않고
 * 데이터를 서버로 보낸 후 서버사이드에서 처리하도록 해요
 */
function goResult() {
  let query = "";
  if (Boolean(shared)) {
    query = "?shared=true";
  }
  const form = document.createElement("form");
  const input_value = document.createElement("input");
  // MARK: result 페이지로 result json을 담은 post요청을 보낼 것
  form.action = `/result/${contentType}${query}`;
  form.method = "post";
  input_value.type = "hidden";
  input_value.name = "result";
  input_value.value = JSON.stringify(result);
  form.appendChild(input_value);

  document.querySelector("main").appendChild(form);
  form.submit();

  /**
   * ADDED:
   * result를 비워주지 않으면 test 두 개 이상 했을 시
   * 결과 값 저장에 오류가 생겨서 추가함
   */
  result = [];
}
