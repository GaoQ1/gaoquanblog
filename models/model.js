var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = require('./models');
mongoose.connect('mongodb://127.0.0.1:27017/gaoquanblog');
mongoose.model('User',new Schema(models.User));
mongoose.model('Article',new Schema(models.Article));
global.Model = function(type){
    return mongoose.model(type);
}
