/**
 * Created by candice on 2017/6/14.
 */

var express = require('express');

var User = require('../models/User');

var Content = require('../models/Content');

var router = express.Router();

//统一返回格式
var responseData;
router.use(function (req,res,next) {
    responseData = {
        code:0,
        message:''
    };
    next();
})

// 监听用户名是否被注册
router.post('/user/username',function (req,res,next) {
    var username = req.body.username;
    User.findOne({
        username: username
    }).then(function (userInfo) {
        // console.log(userInfo);
        if(userInfo){
            responseData.code = 1;
            responseData.message='该用户名已被注册!';
            res.json(responseData);
        }else {
            res.json(responseData);
        }
    })
})
/*
// 添加管理员
var user =  new User({
    username:'admin',
    password:'admin123',
    isAdmin:true
});
user.save().then(function (newUserInfo) {
    console.log(newUserInfo);
})
*/
// 用户注册
router.post('/user/register',function (req,res,next) {
    var username = req.body.username;
    var password = req.body.password;
    var user = new User({
        username:username,
        password:password
    });
    user.save().then(function (newUserInfo) {
        // console.log(newUserInfo);
        if(newUserInfo){
            responseData.message='注册成功!';
            responseData.code = 2;
            req.cookies.set('userInfo',JSON.stringify({
                _id:newUserInfo._id,
                username:newUserInfo.username
            }));
            res.json(responseData);
            return;
        }
        responseData.code = 3;
        responseData.message='注册失败!';
        res.json(responseData);
        return;

    })

});

// 用户登录
router.post('/user/login',function (req,res,next) {
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({
        username: username,
        password:password
    }).then(function (userInfo) {
        // console.log(userInfo);
        if(!userInfo){
            responseData.code = 2;
            responseData.message='用户名或密码错误!';
            res.json(responseData);
            return;
        }
        responseData.code = 1;
        responseData.message='登录成功!';
        responseData.userInfo={
            _id:userInfo._id,
            username:userInfo.username
        };
        req.cookies.set('userInfo',JSON.stringify({
            _id:userInfo._id,
            username:userInfo.username
        }));
        res.json(responseData);
        return;
    })
});

//退出登录
router.get('/user/logout',function (req,res,next){
    req.cookies.set('userInfo',null);
    responseData.message = '退出成功！';
    res.json(responseData);
})


router.get('/comment',function (req,res,next) {
    var contentId = req.query.contentId||'';

    Content.findOne({
        _id:contentId
    }).then(function (content) {
        responseData.comments = content.comments;
        responseData.message = "评论成功";
        res.json(responseData);
    })
})

// 提交评论
router.post('/comment/post',function (req,res,next) {
    var postData = {
        username:req.userInfo.username,
        postTime:new Date(),
        content:req.body.content
    };
    var contentId = req.body.contentId||'';

    Content.findOne({
        _id:contentId
    }).then(function (content) {
        content.comments.push(postData);
        return content.save();
    }).then(function (newContent) {
        responseData.comments = newContent.comments;
        responseData.message = "评论成功";
        res.json(responseData);
    })
})

module.exports = router;