var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.redirect('/articles/list/1/2');
});

/*router.get('/', function(req, res) {
  Model('Article').find({}).populate('user').exec(function(err,articles){
    res.render('index', {title: '主页',article:articles});
  });
 });*/

module.exports = router;
