var express = require('express');
var router = express.Router();
var auth = require('../middle/auth');
var markdown = require('markdown').markdown;
var async = require('async');
router.get('/list/:pageNum/:pageSize', function(req, res) {
  var pageNum = req.params.pageNum&&req.params.pageNum>0?parseInt(req.params.pageNum):1;
  var pageSize = req.params.pageSize&&req.params.pageSize>0?parseInt(req.params.pageSize):2;
  var query = {};
  var keyword = req.query.keyword;
  var searchBtn = req.query.searchBtn;
  if(searchBtn){
    req.session.keyword = keyword;
  }
  if(req.session.keyword){
    query['title'] = new RegExp(req.session.keyword,"i");
  }

  Model('Article').count(query,function(err,count){
    Model('Article').find(query).sort({createAt:-1}).skip((pageNum-1)*pageSize).limit(pageSize).populate('user').exec(function(err,articles){
      res.render('index',{
        title:'主页',
        pageNum:pageNum,
        pageSize:pageSize,
        keyword:req.session.keyword,
        totalPage:Math.ceil(count/pageSize),
        articles:articles
      })
    });
  });
});

router.get('/add', function(req, res) {
  res.render('article/add', { title:'发表文章',article:{}});
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

router.get('/detail/:_id',function(req,res){
  async.parallel([function(callback){
    Model('Article').findOne({_id:req.params._id}).populate('user').populate('comments.user').exec(function(err,article){
      article.content = markdown.toHTML(article.content);
      callback(err,article);
    });
  },function(callback){
    Model('Article').update({_id:req.params._id},{$inc:{pv:1}},callback);
  }],function(err,result){
    if(err){
      req.flash('error',err);
      res.redirect('back');
    }
    res.render('article/detail',{title:'查看文章',article:result[0]});
  });
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
    delete article._id;
    console.log(article);
    new Model('Article')(article).save(function(err,article){
      if(err){
        req.flash('error',err.message);
        return res.redirect('/articles/add');
      }
      req.flash('success','发表文章成功');
      res.redirect('/');
    })
  }
});

router.post('/comment',auth.checkLogin,function(req,res){
  var user = req.session.user;
  Model('Article').update({_id:req.body._id},{$push:{comments:{user:user._id,content:req.body.content}}},function(err,result){
    if(err){
      req.flash('error',err);
      return res.redirect('back');
    }else{
      req.flash('success','评价成功！');
      res.redirect('back');
    }
  })
})

module.exports = router;