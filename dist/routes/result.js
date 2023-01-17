"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** 결과 화면 **/
// @ts-ignore
const express = require('express');
// @ts-ignore
const router = express.Router();
router.route('/')
    .get((req, res) => {
    res.redirect(202, '/');
})
    .post((req, res) => {
    req.session.user_id === undefined ? res.redirect('/') : res.render('result', { title: '소소식탁 - 결과' });
});
module.exports = router;
