"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** 로그인 화면 **/
// @ts-ignore
const express = require("express");
// @ts-ignore
const router = express.Router();
router.route("/").get((req, res) => {
  // MARK: 소소테스트에 처음 입장하는 경우: 세션 user_id가 존재하지 않음
  if (req.session.user_id === undefined) {
    // MARK: 처음 입장 공유받아서 온 경우
    if (Boolean(req.query.shared) === true) {
      req.session.friend_id = req.query.user_id;
      res.render("pages/index", {
        title: "소소식탁 - 닉네임 입력",
        // MARK: 전달받은 테스트 종류(path), 전달해준 친구의 아이디(friend_id)를 index view에 전달함
        path: req.query.path,
        friend_id: req.query.user_id,
      });
    }
    // MARK: 처음 입장 그냥 들어온 경우
    else {
      res.render("pages/index", {
        title: "소소식탁 - 닉네임 입력",
        path: "",
        friend_id: "",
      });
    }
  } else {
    // MARK: 처음 입장 아님 공유받아서 온 경우
    if (Boolean(req.query.shared) === true) {
      req.session.friend_id = req.query.user_id;
      res.redirect(`/content/${req.query.path}?shared=true`);
    }
    // MARK: 처음 입장 아님 그냥 들어온 경우
    else {
      res.redirect("/main");
    }
  }
});
module.exports = router;
