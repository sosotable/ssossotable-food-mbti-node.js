import {RequestExtension} from "../interface/RequestExtension";
import {Response} from "express";

/** 결과 화면 **/
// @ts-ignore
const express = require('express');
// @ts-ignore
const router = express.Router();

router.route('/')
    .get((req: RequestExtension, res: Response)=>{
        res.redirect(202, '/')
    })
    .post((req: RequestExtension, res: Response) => {
        req.session.user_id === undefined ? res.redirect('/') :  res.render('result', { title: '소소식탁 - 결과' });
    })

module.exports = router;
