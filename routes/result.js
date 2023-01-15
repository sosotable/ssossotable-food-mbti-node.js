/** 결과 화면 **/
const express = require('express');
const router = express.Router();

router.route('/')
    .get((req, res)=>{
        res.writeHead('202')
        res.redirect('/')
    })
    .post((req, res) => {
        req.cookies.id === undefined ? res.redirect('/') :  res.render('result', { title: '소소식탁 - 결과' });
    })

module.exports = router;
