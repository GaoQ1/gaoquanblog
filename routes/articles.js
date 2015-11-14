var express = require('express');
var router = express.Router();
var auth = require('../middle/auth');
var markdown = require('markdown').markdown;
router.get('/list/:pageNum/:pageSize', function(req, res) {
  var pageNum = req.params.pageNum&&req.params.pageNum>0?parseInt(req.params.pageNum):1;
  var pageSize = req.params.pageSize&&req.params.pageSize>0?parseInt(req.params.pageSize):2;
  Model('Article').count({},function(err,count){
    Model('Article').find({}).sort({createAt:-1}).skip((pageNum-1)*pageSize).limit(pageSize).populate('user').exec(function(err,articles){
      res.render('index',{
        title:'主页',
        pageNum:pageNum,
        pageSize:pageSize,
        totalPage:Math.ceil(count/pageSize),
        articles:articles
      })
    });
  });
});

router.get('/add', function(req, res) {
  res.render('article/add', { title:'发表文章',article:{}});
});

router.get('/detail/:_id', function(req, res) {
  Model('Article').findOne({_id:req.params._id},function(err,article){
    article.content = markdown.toHTML(article.content);
    res.render('article/detail', { title:'查看文章',article:article});
  })
});

router.get('/edit/:_id', function(req, res) {
  Model('Article').findOne({_id:req.params._id},function(err,article){
    res.render('article/add', { title:'编辑文章',article:article});
  })
});

router.get('/delete/:_id', function(req, res) {
  Model('Article').remove({_id:req.params._id},function(err,article){
    if(err){
      req.flash('error',err);
      return res.redirect('back');
    }
    req.flash('success','删除文章成功');
    res.redirect('/');
  })
});

router.post('/add',auth.checkLogin,function(req,res){
  var article = req.body;
  var _id = article._id;
  if(_id){
    Model('Article').update({_id:_id},{$set:{title:article.title,content:article.content}},function(err,result){
      if(err){
        req.flash('error',err);
        return res.redirect('back');
      }
      req.flash('success','修改文章成功');
      res.redirect('/');
    });
  }else{
    article.user = req.session.user._id;
    new Model('Article')(article).save(function(err,article){
      if(err){
        req.flash('error',err);
        return res.redirect('/article/add');
      }
      req.flash('success','发表文章成功');
      res.redirect('/');
    })
  }


});

module.exports = router;
