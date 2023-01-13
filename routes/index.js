const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    title: '소소식탁',
    contents: [
      {
        title: '나의 음식 MBTI',
        desc: '음식으로 알아보는 나의 성격유형',
        link: '/mbti'
      },
      {
        title: '음식 취향',
        desc: '나의 음식 취향을 기록하고 공유해보세요',
        link: '/taste'
      },
      {
        title: '평균',
        desc: '나의 음식 성향을 대한민국 평균과 비교해보세요',
        link: '/average'
      },
    ]});
});

module.exports = router;
