"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** 결과 화면 **/
// @ts-ignore
const express = require("express");
// @ts-ignore
const router = express.Router();
const resultModels = require("../model/result");
const contentModels = require("../model/content");
let eipoint = 0;
let snpoint = 0;
let ftpoint = 0;
let pjpoint = 0;
let mbti;
let point;
let resultTitle = [];
let resultDesc = [];
let score;
router
  .route("/:path")
  .get((req, res) => {
    res.redirect(202, "/");
  })
  .post((req, res) => {
    const path = req.params.path;
    const result = JSON.parse(req.body.result.replace("'", ""));
    for (let i = 0; i < result.length; i++) {
      if (result[i].type == "EI") {
        eipoint += result[i].score;
      } else if (result[i].type == "SN") {
        snpoint += result[i].score;
      } else if (result[i].type == "FT") {
        ftpoint += result[i].score;
      } else if (result[i].type == "PJ") {
        pjpoint += result[i].score;
      }
    }
    // mbti 결과 값
    if (eipoint && snpoint && ftpoint && pjpoint) {
      point = defpoint();
      mbti = sortResult(point);
      resultTitle[0] = resultModels.mbtiRestList[mbti].name;
      resultDesc[0] = resultModels.mbtiRestList[mbti].desc;
    }
    // taste 결과 값
    /**
     * ???: error
     * Cannot read properties of undefined (reading 'answer')
     */
    else {
      for (let i = 0; i < result.length; i++) {
        score = result[i].score;
        resultTitle[i] = contentModels.taste[i].q;
        resultDesc[i] = contentModels.taste[i].a[score].answer;
      }
    }
    req.session.user_id === undefined
      ? res.redirect("/")
      : res.render("result", {
          title: "소소식탁 - 결과",
          path: path,
          result: { image: resultDesc, title: resultTitle, desc: resultDesc },
        });
  });
function defpoint() {
  let EI;
  if (eipoint < 5) EI = "E";
  else EI = "I";
  let SN;
  if (snpoint < 5) SN = "S";
  else SN = "N";
  let FT;
  if (ftpoint < 5) FT = "F";
  else FT = "T";
  let PJ;
  if (pjpoint < 5) PJ = "P";
  else PJ = "J";
  return EI + SN + FT + PJ;
}
function sortResult(point) {
  let num = 0;
  if (point == "ESTJ") {
    num = 0;
  } else if (point == "ISTJ") {
    num = 1;
  } else if (point == "ENTJ") {
    num = 2;
  } else if (point == "INTJ") {
    num = 3;
  } else if (point == "ESFJ") {
    num = 4;
  } else if (point == "ISFJ") {
    num = 5;
  } else if (point == "ENFJ") {
    num = 6;
  } else if (point == "INFJ") {
    num = 7;
  } else if (point == "ESTP") {
    num = 8;
  } else if (point == "ISTP") {
    num = 9;
  } else if (point == "ENTP") {
    num = 10;
  } else if (point == "INTP") {
    num = 11;
  } else if (point == "ESFP") {
    num = 12;
  } else if (point == "ISFP") {
    num = 13;
  } else if (point == "ENFP") {
    num = 14;
  } else if (point == "INFP") {
    num = 15;
  }
  //console.log(num)
  return num;
}
module.exports = router;
