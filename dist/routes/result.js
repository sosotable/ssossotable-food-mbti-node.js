"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const DAO = require("../libs/dao/DAO");
let friendResult = [];
router
    .route("/:path")
    .get((req, res) => {
    res.redirect(202, "/");
})
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const path = req.params.path;
    const result = JSON.parse(req.body.result.replace("'", ""));
    if (req.session.user_id === undefined) {
        res.redirect("/");
    }
    else {
        // MARK: dao insert 예외처리
        try {
            // MARK: 결과값 파싱
            switch (path) {
                case "mbti":
                    for (let i = 0; i < result.length; i++) {
                        switch (result[i].type) {
                            case "EI":
                                eipoint += result[i].score;
                                break;
                            case "SN":
                                snpoint += result[i].score;
                                break;
                            case "FT":
                                ftpoint += result[i].score;
                                break;
                            case "PJ":
                                pjpoint += result[i].score;
                                break;
                        }
                    }
                    point = defpoint();
                    mbti = sortResult(point);
                    resultTitle[0] = resultModels.mbtiRestList[mbti].name;
                    resultDesc[0] = resultModels.mbtiRestList[mbti].desc;
                    break;
                case "tastes":
                    for (let i = 0; i < result.length; i++) {
                        score = result[i].score - 1;
                        resultTitle[i] = contentModels.tastes[i].q;
                        resultDesc[i] = contentModels.tastes[i].a[score].answer;
                    }
                    break;
                //TODO: need to imple
                case "average":
                    break;
            }
            // MARK: 이전에 평가한 기록이 있는지 확인함
            const beforeTest = yield DAO.select('*', path, `user_id = '${req.session.user_id}'`);
            // MARK: 있는 경우 update로 새 기록을 씀
            if (beforeTest.length > 0) {
                yield DAO.update(path, `result = '${JSON.stringify({
                    image: resultDesc,
                    title: resultTitle,
                    desc: resultDesc,
                })}'`, `user_id = '${req.session.user_id}'`);
            }
            else {
                // MARK: 없는 경우 DB에 결과값 insert
                yield DAO.insert(path, "user_id, result", `'${req.session.user_id}','${JSON.stringify({
                    image: resultDesc,
                    title: resultTitle,
                    desc: resultDesc,
                })}'`);
            }
            // MARK: 친구 정보가 있는 경우 해당 데이터를 DB에서 받아옴
            if (req.session.friend_id !== undefined) {
                const friendJSON = JSON.parse((yield DAO.select("*", path, `user_id='${req.session.friend_id}'`))[0].result);
                friendResult = {
                    image: friendJSON.image,
                    title: friendJSON.title,
                    desc: friendJSON.desc,
                };
                res.render("pages/result", {
                    title: "소소식탁 - 결과",
                    path: path,
                    user_id: req.session.user_id,
                    result: { image: resultDesc, title: resultTitle, desc: resultDesc },
                    // MARK: 친구 정보가 있는 경우 해당 데이터까지 view에 전송
                    friendResult: friendResult,
                });
            }
            else {
                res.render("pages/result", {
                    title: "소소식탁 - 결과",
                    path: path,
                    user_id: req.session.user_id,
                    result: { image: resultDesc, title: resultTitle, desc: resultDesc },
                    friendResult: "",
                });
            }
        }
        catch (e) {
            console.error(e);
        }
    }
}));
function defpoint() {
    let EI;
    if (eipoint < 5)
        EI = "E";
    else
        EI = "I";
    let SN;
    if (snpoint < 5)
        SN = "S";
    else
        SN = "N";
    let FT;
    if (ftpoint < 5)
        FT = "F";
    else
        FT = "T";
    let PJ;
    if (pjpoint < 5)
        PJ = "P";
    else
        PJ = "J";
    return EI + SN + FT + PJ;
}
function sortResult(point) {
    let num = 0;
    if (point == "ESTJ") {
        num = 0;
    }
    else if (point == "ISTJ") {
        num = 1;
    }
    else if (point == "ENTJ") {
        num = 2;
    }
    else if (point == "INTJ") {
        num = 3;
    }
    else if (point == "ESFJ") {
        num = 4;
    }
    else if (point == "ISFJ") {
        num = 5;
    }
    else if (point == "ENFJ") {
        num = 6;
    }
    else if (point == "INFJ") {
        num = 7;
    }
    else if (point == "ESTP") {
        num = 8;
    }
    else if (point == "ISTP") {
        num = 9;
    }
    else if (point == "ENTP") {
        num = 10;
    }
    else if (point == "INTP") {
        num = 11;
    }
    else if (point == "ESFP") {
        num = 12;
    }
    else if (point == "ISFP") {
        num = 13;
    }
    else if (point == "ENFP") {
        num = 14;
    }
    else if (point == "INFP") {
        num = 15;
    }
    //console.log(num)
    return num;
}
module.exports = router;
