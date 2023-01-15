/** 로그인 화면 **/
const express = require('express');
const router = express.Router();

router.route('/')
    .get((req, res)=>{
        req.cookies.id === undefined ? res.render('index', { title: '소소식탁 - 닉네임 입력' }) : res.redirect('/main')
    })

module.exports = router;
