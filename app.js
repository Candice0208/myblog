/**
 * Created by candice on 2017/6/14.
 * 应用程序的启动（入口）文件
 */

//加载express模块
var express = require('express');

//加载模板处理模块
var swig = require('swig');

//加载数据库模块
var mongoose = require('mongoose');

//处理post提交过来的数据
var bodyParser = require('body-parser');

var User = require('./models/User');

//加载cookies模块
var cookies = require('cookies');

//创建app应用 ==> NodeJs   http.createServer();
var app = express();

//设置静态文件托管
//当用户访问的url以／public开始，那么直接返回对应的__dirname+'/public'下的文件
app.use('/public',express.static(__dirname+'/public'));

//配置应用模板
//定义当前应用所使用的模板引擎
//第一个参数：模板引擎名称，同时也是模板文件的后缀；第二个参数表示解析处理模板内容的方法
app.engine('html',swig.renderFile);

// 设置文件存放目录
app.set('views','./views');

//注册所使用的模板引擎，第一个固定为'view engine'；第二个是app.engine中定一个模板引擎的名称一致
app.set('view engine','html');

//在开发过程中需要取消模板缓存
swig.setDefaults({cache:false});

//bodyParser设置
app.use(bodyParser.urlencoded({extended:true}));

//设置cookies
app.use(function (req,res,next) {
    req.cookies = new cookies(req,res);

    //解析登录用户的信息
    req.userInfo = {};
    if(req.cookies.get('userInfo')){
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            User.findById(req.userInfo._id).then(function (userInfo) {
                if (userInfo){
                    // console.log(userInfo);
                    req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                    next();
                }
            })
        }catch(e) {
            next();
        }
    }else {
        next();
    }
});

//根据不同的功能划分模块
app.use('/',require('./routers/main'));
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));


//监听http请求
mongoose.connect('mongodb://localhost:27017/blog',function (err) {
    if(err){
        console.log(err);
        console.log('数据库连接失败')
    }else{
        console.log('数据库连接成功');
        app.listen(8080);
    }
});



//首页
// req request对象
// res response对象
// next函数

// app.get('/',function (req,res,next) {
//     // res.send('<h1>欢迎光临我的博客！</h1>')
//
//     // 读取views目录下的指定文件，解析并返回给客户端
//     // 第一个参数：表示模板的文件，相对于views目录
//     // 第二个参数：传递给模板使用的数据
//     res.render('index');
// })

