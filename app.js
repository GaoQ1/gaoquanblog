var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var routes = require('./routes/index');
var users = require('./routes/users');
var articles = require('./routes/articles');

require('./utils');
require('./models/model');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html',require('ejs').__express);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

/*//正常日志
var accessLog = fs.createWriteStream('access.log',{flag:'a'});
app.use(logger('dev'),{stream:accessLog});

//错误日志
var errorLog = fs.createWriteStream('error.log',{flag:'a'});
app.use(function(err,req,res,next){
    var meta = '[' + new Date() + ']' + req.url +'\n';
    errorLog.write(meta + err.stack + '\n');
    next();
});*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//执行完此中间件之后,req.session
app.use(session({
    secret:'gaoquansecret', //密钥,用来防止session被篡改
    key:'gaoquankey', //cookie name 的名字
    cookie:{maxAge:1000*60*24*30},//设置过期时间
    resave:true,
        saveUninitialized:true,
    store:new MongoStore({
        db:'gaoquanblog',
        host:'123.57.143.189',
        port:'27017'
    })
}));
app.use(flash());
app.use(function(req,res,next){
    res.locals.user = req.session.user;
    res.locals.keyword = req.session.keyword;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});
app.use('/', routes);
app.use('/users', users);
app.use('/articles', articles);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.render("404");
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
