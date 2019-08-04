/**
 * Created by candice on 2017/6/14.
 */

var express = require('express');

var Category = require('../models/Category');

var Content = require('../models/Content');

var router = express.Router();

var data = {};

//中间件的方法处理通用的数据
router.use(function (req,res,next) {
    data = {
        userInfo:req.userInfo,
        categories:[]
    };
    Category.find().then(function (categories) {
        data.categories = categories;
        next();
    })
});

//首页
router.get('/',function (req,res,next) {

    data.categoryId = req.query.categoryId;
    data.count = 0;
    data.page = Number(req.query.page || 1);
    data.limit = req.query.limit || 5;
    data.pages = 0;
    data.contents = [];
    if(data.categoryId){
        data.uri = '?categoryId='+data.categoryId+'&'
    }else {
        data.uri = '?';
    }


    var where ={};
    if(data.categoryId){
        where.category =  data.categoryId;
    }

    Content.where(where).count().then(function (count) {
        data.count = count;
        data.pages = Math.ceil(data.count / data.limit);
        //page取值不能超过总页数
        data.page = Math.min(data.page, data.pages);
        //page取值不能小于1
        data.page = Math.max(data.page, 1);
        var skip = (data.page - 1) * data.limit;

        return Content.where(where).find().sort({addTime: -1}).limit(data.limit).skip(skip).populate(['category','user']);

    }).then(function (contents) {
        data.contents = contents;
        // console.log(data);
        res.render('main/index',data)
    })
});

router.get('/view',function (req,res) {
    var contentId = req.query.contentId||'';
    Content.findOne({
        _id:contentId
    }).then(function (content) {
        data.content = content;

        content.views++;
        content.save();

        res.render('main/view',data)
    })
});
module.exports = router;