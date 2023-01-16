/** 로그인 화면 **/
const express = require('express');
const router = express.Router();

router.route('/')
    .get((req, res)=>{
        console.log(req.session.user_id)
        req.session.id === undefined ? res.render('index', { title: '소소식탁 - 닉네임 입력' }) : res.redirect('/main')
    })

module.exports = router;
