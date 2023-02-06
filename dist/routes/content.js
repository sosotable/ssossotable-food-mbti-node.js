"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const express = require("express");
// @ts-ignore
const router = express.Router();
const contentModels = require("../model/content");
const contentHeaders = require("../model/contentHeader");
router.get("/:content", (req, res, next) => {
  if (req.session.user_id === undefined) {
    res.redirect(202, "/");
  } else {
    const contentName = req.params.content;
    const contentModel = contentModels[contentName];
    const contentHeader = contentHeaders[contentName];
    let title;
    switch (contentName) {
      case "mbti":
        title = "소소식탁 - 내 음식 mbti";
        break;
      case "tastes":
        title = "소소식탁 - 취향 맞추기";
        break;
      case "average":
        title = "소소식탁 - 평균 기록하기";
        break;
    }
    const renderParams = {
      title: title,
      contentName: contentName,
      content: JSON.stringify(contentModel),
      contentHeaderImage: contentHeader.contentHeaderImage,
      contentHeaderTitle: contentHeader.contentHeaderTitle,
      contentHeaderDesc: contentHeader.contentHeaderDesc,
      shared: req.query.shared,
    };
    res.render("pages/content", renderParams);
  }
});
module.exports = router;
