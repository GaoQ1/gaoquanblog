var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
module.exports = {
    User:{ //设置User的数据模型
        username:{type:String,required:true},
        password:{type:String,required:true},
        email:{type:String,required:true},
        avatar:{type:String,required:true}
    },
    Article:{//设置文章的数据模型
        user:{type:ObjectId,ref:'User'},
        title:String,
        content:String,
        createAt:{type:Date,default:Date.now}
    }
}