import { NextFunction, Response } from "express";
import { RequestExtension } from "../interface/RequestExtension"

// @ts-ignore
const express = require('express');
// @ts-ignore
const router = express.Router();

const contentModels = require('../model/content')
const contentHeaders = require('../model/contentHeader')
router.get('/:content', (req: RequestExtension, res: Response, next: NextFunction) => {
    const contentName = req.params.content
    const contentModel = contentModels[contentName]
    const contentHeader = contentHeaders[contentName]
    const title = contentName === 'mbti' ? '소소식탁 - 내 음식 mbti' : ( contentName === 'taste' ? '소소식탁 - 취향 맞추기' : '소소식탁 - 평균 기록하기' )
    const renderParams = {
        title: title,
        contentName: contentName,
        content: JSON.stringify(contentModel),
        contentHeaderImage: contentHeader.contentHeaderImage,
        contentHeaderTitle: contentHeader.contentHeaderTitle,
        contentHeaderDesc: contentHeader.contentHeaderDesc
    }
    req.session.user_id === undefined ? res.redirect(202, '/') :  res.render('content', renderParams );
});

module.exports = router;
