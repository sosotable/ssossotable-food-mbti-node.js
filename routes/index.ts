// @ts-ignore
import {RequestExtension} from "../interface/RequestExtension";
import {Response} from "express";

/** 로그인 화면 **/
// @ts-ignore
const express = require('express');
// @ts-ignore
const router = express.Router();

router.route('/')
    .get((req: RequestExtension, res: Response)=>{
        req.session.user_id === undefined ? res.render('index', { title: '소소식탁 - 닉네임 입력' }) : res.redirect('/main')
    })

module.exports = router;
