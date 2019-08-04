/**
 * Created by candice on 2017/6/14.
 */

var mongoose = require('mongoose');

//用户表结构
module.exports = new mongoose.Schema({
    username:String,
    password:String,
    //是否是管理员
    isAdmin:{
        type:Boolean,
        default:false
    }
});




