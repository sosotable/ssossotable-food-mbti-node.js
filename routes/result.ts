import { RequestExtension } from "../interface/RequestExtension";
import { Response } from "express";
import { resourceUsage } from "process";

import MBTIResult from "../class/MBTIResult";
import TastesResult from "../class/TastesResult";
import AverageResult from "../class/AverageResult";

/** 결과 화면 **/
// @ts-ignore
const express = require("express");
// @ts-ignore
const router = express.Router();

const DAO = require("../libs/dao/DAO");

// MARK: 다형성에 따라 result 객체 지정
let result: MBTIResult | TastesResult | AverageResult;

let friendResult:
  | {
      image: string;
      title: string;
      desc: string;
    }
  | string = "";
router
  .route("/:path")
  .get((req: RequestExtension, res: Response) => {
    res.redirect(202, "/");
  })
  .post(async (req: RequestExtension, res: Response) => {
    const path = req.params.path;
    const resultBody = JSON.parse(req.body.result.replace("'", ""));
    if (req.session.user_id === undefined) {
      res.redirect("/");
    }
    // MARK: shared 쿼리스트링이 존재하는 경우 => 공유받아서 들어온 상태
    if (Boolean(req.query.shared) === true) {
      try {
        const friendJSON = JSON.parse(
          (await DAO.select("*", path, `user_id='${req.session.friend_id}'`))[0]
            .result
        );
        friendResult = {
          image: friendJSON.image,
          title: friendJSON.title,
          desc: friendJSON.desc,
        };
        // MARK: 결과값 파싱
        switch (path) {
          /** MARK: path 값(mbti, tastes, average)에 따라 result 객체를 지정
           *  Factory 패턴 사용하여 코드 간소화
           * */
          case "mbti":
            result = new MBTIResult(resultBody);
            if (result instanceof MBTIResult) {
              result.factory();
            }
          case "tastes":
            result = new TastesResult(resultBody, friendResult);
            if (result instanceof TastesResult) {
              result.factory();
            }
            break;
          //ADDED
          case "average":
            result = new AverageResult(resultBody);
            if (result instanceof AverageResult) {
              result.factory();
            }
            break;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // MARK: shared 쿼리스트링이 없는 경우 => 일반 접근
    else {
      try {
        // MARK: 결과값 파싱
        switch (path) {
          /** MARK: path 값(mbti, tastes, average)에 따라 result 객체를 지정
           *  Factory 패턴 사용하여 코드 간소화
           * */
          case "mbti":
            result = new MBTIResult(resultBody);
            if (result instanceof MBTIResult) {
              result.factory();
            }
            break;
          case "tastes":
            result = new TastesResult(resultBody, undefined);
            if (result instanceof TastesResult) {
              result.factory();
            }
            break;
          //ADDED
          case "average":
            result = new AverageResult(resultBody);
            if (result instanceof AverageResult) {
              result.factory();
            }
            break;
        }
      } catch (e) {
        console.error(e);
      }
    }

    /** MARK: 데이터 파싱 이후 DAO와 연동하여 DB작업 수행
     * 결과값이 DB에 존재하는 경우 UPDATE / 존재하지 않는 경우 INSERT 수행
     * */
    // MARK: 이전에 평가한 기록이 있는지 확인함
    const beforeTest = await DAO.select(
      "*",
      path,
      `user_id = '${req.session.user_id}'`
    );
    // MARK: 있는 경우 update로 새 기록을 씀
    if (beforeTest.length > 0) {
      await DAO.update(
        path,
        `result = '${JSON.stringify({
          image: result.resultDesc,
          title: result.resultTitle,
          desc: result.resultDescBuffer,
        })}'`,
        `user_id = '${req.session.user_id}'`
      );
    } else {
      // MARK: 없는 경우 DB에 결과값 insert
      await DAO.insert(
        path,
        "user_id, result",
        `'${req.session.user_id}','${JSON.stringify({
          image: result.resultDesc,
          title: result.resultTitle,
          desc: result.resultDescBuffer,
        })}'`
      );
    }
    // MARK: view에서 friendResult 사용 가능하도록 빈 문자열로 변환
    friendResult === undefined ? (friendResult = "") : true;
    res.render("pages/result", {
      title: "소소식탁 - 결과",
      path: path,
      user_id: req.session.user_id,
      result: {
        image: result.resultDesc,
        title: result.resultTitle,
        desc: result.resultDesc,
      },
      // MARK: 친구 정보가 있는 경우 해당 데이터까지 view에 전송
      friendResult: friendResult,
    });
  });

module.exports = router;
