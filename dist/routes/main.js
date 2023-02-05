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
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const express = require("express");
// @ts-ignore
const router = express.Router();
const contents = require("../model/main").contents;
// @ts-ignore
const crypto = require("crypto");
const DAO = require("../libs/dao/DAO");
// MARK: route 메소드 사용하여 RESTful api에 대한 간결화된 응답 구현
router
  .route("/")
  // MARK: GET 요청일 시 index에서 라우팅되는 자동로그인
  .get((req, res) => {
    req.session.user_id === undefined
      ? res.redirect("/")
      : res.render("pages/main", { title: "소소식탁", contents: contents });
  })
  // MARK: POST 요청일 시 로그인 정보를 담은 최초 로그인을 의미함
  .post((req, res, next) =>
    __awaiter(void 0, void 0, void 0, function* () {
      try {
        // FIXED: 쿼리값 전송시 오류 발생해서 sha256 hex방식 해싱으로 변경
        const hashedID = crypto
          .createHash("sha256")
          .update(req.body.id)
          .digest("hex");
        req.session.user_id = hashedID;
        yield DAO.insert("user", "user_id", `'${hashedID}'`);
        res.end("response 200");
      } catch (e) {
        console.error(e);
      }
    })
  );
module.exports = router;
