
import {RequestExtension} from "../interface/RequestExtension";
import {NextFunction, Response} from "express";
// @ts-ignore
const express = require('express');
// @ts-ignore
const router = express.Router();

const contents = require('../model/main').contents
// @ts-ignore
const crypto = require('crypto')

// MARK: route 메소드 사용하여 RESTful api에 대한 간결화된 응답 구현
router.route('/')
    // MARK: GET 요청일 시 index에서 라우팅되는 자동로그인
    .get( (req: RequestExtension, res: Response, ) => {
        req.session.user_id === undefined ? res.redirect('/') : res.render('main', { title: '소소식탁', contents: contents })
    })
    // MARK: POST 요청일 시 로그인 정보를 담은 최초 로그인을 의미함
    .post((req: RequestExtension, res: Response, next: NextFunction) => {
        req.session.user_id = crypto.createHash('sha512').update(req.body.id).digest('base64')
        res.end('response 200')
    });

module.exports = router;
