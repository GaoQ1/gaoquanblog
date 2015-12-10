var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = require('./models');
mongoose.connect('mongodb://123.57.143.189:27017/gaoquanblog');
mongoose.model('User',new Schema(models.User));
mongoose.model('Article',new Schema(models.Article));
global.Model = function(type){
    return mongoose.model(type);
}
