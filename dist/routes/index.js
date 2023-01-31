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
        if (req.query.path === undefined && req.query.user_id === undefined) {
            res.render("pages/index", {
                title: "소소식탁 - 닉네임 입력",
                path: "",
                friend_id: "",
            });
        }
        else { // MARK: 처음 입장이고 쿼리스트링이 존재하는 경우 타인에게 입장 url을 건내받은 경우임
            res.render("pages/index", {
                title: "소소식탁 - 닉네임 입력",
                // MARK: 전달받은 테스트 종류(path), 전달해준 친구의 아이디(friend_id)를 index view에 전달함
                path: req.query.path,
                friend_id: req.query.user_id,
            });
        }
    }
    else {
        res.redirect("/main");
    }
});
module.exports = router;
