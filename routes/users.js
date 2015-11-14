var express = require('express');
var router = express.Router();
var auth = require('../middle/auth');
/**
 * 用户注册
 */
router.get('/reg',auth.checkNotLogin,function(req,res){
  /*var error = req.session.error;
  delete req.session.error;*/
  res.render('user/reg',{title:'注册'});
});

/**
 * 当填写用户注册信息提交时处理
 */
router.post('/reg',auth.checkNotLogin,function(req,res){
  var user = req.body;
  if(user.password != user.repassword){
    //req.session.error = '两次输入的密码不一致!';
    req.flash('error','两次输入的密码不一致!');
    return res.redirect('/users/reg');
  }
  delete user.repassword;
  user.password = md5(user.password);
  user.avatar = "https://secure.gravatar.com/avatar/"+md5(user.email)+"?s=48";
  new Model('User')(req.body).save(function(err,user){
    if(err){
      req.flash('error','保存数据库出错!');
      return res.redirect('/users/reg');
    }
    req.flash('success','恭喜你注册成功!');
    req.session.user = user;
    res.redirect('/');
  })
});

/**
 * 显示用户登录表单
 */
router.get('/login',auth.checkNotLogin,function(req,res){
  res.render('user/login',{title:'登录'})
});

/**
 * 当填写用户登录信息提交时的处理
 */
router.post('/login',auth.checkNotLogin,function(req,res){
  var user = req.body;
  user.password = md5(user.password);
  Model('User').findOne(user,function(err,user){
    if(err){
      req.flash('error','登录失败!');
      return res.redirect('/users/login');
    }
    if(user){
      req.session.user = user;
      req.flash('success','登录成功');
      res.redirect('/');
    }else{
      req.flash('error','用户或密码不正确');
      res.redirect('/users/login');
    }
  })
});

router.get('/logout',auth.checkLogin,function(req,res){
  req.session.user = null;
  return res.redirect('/users/login');
});
module.exports = router;