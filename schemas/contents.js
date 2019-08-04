/**
 * Created by candice on 2017/6/14.
 */

var mongoose = require('mongoose');

//用户表结构
module.exports = new mongoose.Schema({
    //关联字段-分类id
    category:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'Category'
    },
    //内容标题
    title:String,
    //关联字段—用户id
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    //添加时间
    addTime:{
        type:Date,
        default: new Date()
    },
    //阅读数
    views:{
        type:Number,
        default:0
    },

    description:{
        type:String,
        default:''
    },
    content:{
        type:String,
        default:''
    },
    comments:{
        type: Array,
        default:[]
    }
});




