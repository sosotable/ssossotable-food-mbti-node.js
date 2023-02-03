"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const MBTIResult_1 = __importDefault(require("../class/MBTIResult"));
const TastesResult_1 = __importDefault(require("../class/TastesResult"));
/** 결과 화면 **/
// @ts-ignore
const express = require("express");
// @ts-ignore
const router = express.Router();
const DAO = require("../libs/dao/DAO");
let result;
let friendResult = "";
router
  .route("/:path")
  .get((req, res) => {
    res.redirect(202, "/");
  })
  .post((req, res) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const path = req.params.path;
      const resultBody = JSON.parse(req.body.result.replace("'", ""));
      if (req.session.user_id === undefined) {
        res.redirect("/");
      }
      if (Boolean(req.query.shared) === true) {
        try {
          const friendJSON = JSON.parse(
            (yield DAO.select(
              "*",
              path,
              `user_id='${req.session.friend_id}'`
            ))[0].result
          );
          friendResult = {
            image: friendJSON.image,
            title: friendJSON.title,
            desc: friendJSON.desc,
          };
          console.log(friendResult);
          // MARK: 결과값 파싱
          switch (path) {
            case "mbti":
              result = new MBTIResult_1.default(resultBody);
              if (result instanceof MBTIResult_1.default) {
                result.factory();
              }
            case "tastes":
              result = new TastesResult_1.default(resultBody, friendResult);
              if (result instanceof TastesResult_1.default) {
                result.factory();
              }
              break;
            //TODO: need to imple
            case "average":
              break;
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        try {
          // MARK: 결과값 파싱
          switch (path) {
            case "mbti":
              result = new MBTIResult_1.default(resultBody);
              if (result instanceof MBTIResult_1.default) {
                result.factory();
              }
              break;
            case "tastes":
              result = new TastesResult_1.default(resultBody, undefined);
              if (result instanceof TastesResult_1.default) {
                result.factory();
              }
              break;
            //TODO: need to imple
            case "average":
              break;
          }
        } catch (e) {
          console.error(e);
        }
      }
      // MARK: 이전에 평가한 기록이 있는지 확인함
      const beforeTest = yield DAO.select(
        "*",
        path,
        `user_id = '${req.session.user_id}'`
      );
      // MARK: 있는 경우 update로 새 기록을 씀
      if (beforeTest.length > 0) {
        yield DAO.update(
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
        yield DAO.insert(
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
    })
  );
module.exports = router;
