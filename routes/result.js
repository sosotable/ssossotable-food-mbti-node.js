/** 결과 화면 **/
const express = require('express');
const router = express.Router();

router.route('/')
    .get((req, res)=>{
        res.redirect(202, '/')
    })
    .post((req, res) => {
        req.session.id === undefined ? res.redirect('/') :  res.render('result', { title: '소소식탁 - 결과' });
    })

module.exports = router;
