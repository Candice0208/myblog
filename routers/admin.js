/**
 * Created by candice on 2017/6/14.
 */

var express = require('express');

var User = require('../models/User');

var Category = require('../models/Category');

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
});

router.use(function (req,res,next) {
    if(!req.userInfo.isAdmin){
        res.send('对不起，您没有权限，请联系管理员');
        return;
    }
    next();
});

//首页
router.get('/',function (req,res,next) {
    res.render('admin/index',{userInfo:req.userInfo});
});

//用户管理
router.get('/user',function (req,res,next) {

    //limit  限制数据显示的条数
    //skip  忽略数据的条数：（当前页-1）*limit；
    //count 总记录数

    var page = Number(req.query.page||1),
        limit = req.query.limit||2,
        pages = 0;

    User.count().then(function (count) {
        // 计算总页数
        pages = Math.ceil(count/limit);
        //page取值不能超过总页数
        page = Math.min(page,pages);
        //page取值不能小于1
        page = Math.max(page,1);
        var skip = (page-1)*limit;
        User.find().limit(limit).skip(skip).then(function (users) {
            // console.log(users)
            res.render('admin/user_index',{
                userInfo:req.userInfo,
                users:users,
                count:count,
                pages:pages,
                page:page,
                limit:limit,
                uri:'/admin/user?'
            });
        })
    });
})

//分类首页
router.get('/category',function (req,res) {
    var page = Number(req.query.page||1),
        limit = req.query.limit||5,
        pages = 0;

    Category.count().then(function (count) {
        // 计算总页数
        pages = Math.ceil(count/limit);
        //page取值不能超过总页数
        page = Math.min(page,pages);
        //page取值不能小于1
        page = Math.max(page,1);
        var skip = (page-1)*limit;

        //sort排序：1升序、-1降序

        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function (categories) {
            // console.log(users)
            res.render('admin/category_index',{
                userInfo:req.userInfo,
                categories:categories,
                count:count,
                pages:pages,
                page:page,
                limit:limit,
                uri:'/admin/category?'
            });
        })
    });
})

//分类添加
router.get('/category/add',function (req,res) {
    res.render('admin/category_add',{
        userInfo:req.userInfo
    })
})

//分类的保存
router.post('/category/add',function (req,res) {
    var name =  req.body.name||'';
    if(name==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'名称不能为空!',
        });
        return;
    }
    Category.findOne({
        name:name
    }).then(function (rs) {
        if(rs){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类已经存在!',
            });
            return Promise.reject();
        }else {
            return new Category({
                name:name
            }).save();
        }
    }).then(function (newCategory) {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'分类保存成功!',
            url:'/admin/category'
        });
    })
})

//分类修改
router.get('/category/edit',function (req,res) {
    var id = req.query.id||'';

    Category.findOne({
        _id:id
    }).then(function (category) {
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在'
            })
        }else{
            res.render('admin/category_edit',{
                userInfo:req.userInfo,
                category:category
            })
        }
    })
})

//分类修改保存
router.post('/category/edit',function (req,res) {
    var id = req.query.id||'';
    var name = req.body.name||'';

    Category.findOne({
        _id:id
    }).then(function (category) {
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在'
            })
        }else{
            //判断用户是否修改了分类
            if(name==category.name){
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message:'修改成功',
                    url:'/admin/category'
                })
                return Promise.reject();
            }else{
                //要修改的名称分类是否已经在数据库中存
                //查询不等于当前id的id,但名称相同
                return Category.findOne({
                    _id:{$ne:id},
                    name:name
                })
            }
        }
    }).then(function (sameCategory) {
        if(sameCategory){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'数据库中已经存在同名分类'
            })
            return Promise.reject();
        }else{
            return Category.update({
                _id:id
            },{
                name:name
            })
        }
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'修改成功',
            url:'/admin/category'
        })
    })
})


//分类删除
router.get('/category/delete',function (req,res) {
    var id = req.query.id||'';

    Category.findOne({
        _id:id
    }).then(function (category) {
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在'
            })
        }else{
            Category.remove({
                _id:id
            }).then(function () {
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message:'分类删除成功',
                    url:'/admin/category'
                })
            })
        }
    })
})

//内容首页
router.get('/content',function (req,res) {
    var page = Number(req.query.page||1),
        limit = req.query.limit||5,
        pages = 0;

    Content.count().then(function (count) {
        // 计算总页数
        pages = Math.ceil(count / limit);
        //page取值不能超过总页数
        page = Math.min(page, pages);
        //page取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;

        //sort排序：1升序、-1降序
        //populate 查询关联的内容

        Content.find().sort({_id: -1}).limit(limit).skip(skip).populate(['category','user']).then(function (contents) {
            // console.log(contents)
            res.render('admin/content_index', {
                userInfo: req.userInfo,
                contents: contents,
                count: count,
                pages: pages,
                page: page,
                limit: limit,
                uri:'/admin/content?'
            });
        })
    })
})

//内容增加
router.get('/content/add',function (req,res) {
    Category.find().sort({_id:-1}).then(function (categories) {
        res.render('admin/content_add',{
            userInfo:req.userInfo,
            categories:categories
        })
    })
})

//内容保存
router.post('/content/add',function (req,res) {
    // console.log(req.body);
    if(!req.body.category){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'分类不能为空'
        })
    }
    if(!req.body.title){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'标题不能为空'
        })
    }
    new Content({
        category:req.body.category,
        title:req.body.title,
        user:req.userInfo._id.toString(),
        description:req.body.description,
        content:req.body.content,
        addTime:new Date()
    }).save().then(function (rs) {
        // res.render('admin/success',{
        //     userInfo:req.userInfo,
        //     message:'内容保存成功',
        //     url:'/admin/content'
        // })
        responseData.message = "上传成功！";
        res.json(responseData);
    })
})

//内容修改
router.get('/content/edit',function (req,res) {
    var id = req.query.id||'';
    var categories = [];

    Category.find().sort({_id:-1}).then(function (rs) {
        categories = rs;
        return Content.findOne({
            _id:id
        })
    }).then(function (content) {
        if(!content){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'指定内容不存在'
            })
        }else{
            res.render('admin/content_edit',{
                userInfo:req.userInfo,
                categories:categories,
                content:content
            })
        }
    })
})


//内容修改保存
router.post('/content/edit',function (req,res) {
    // var id = req.query.id||'';
    // console.log(id);
    // console.log(req.body);
    if(!req.body.category){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'分类不能为空'
        })
    }
    if(!req.body.title){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'标题不能为空'
        })
    }
    Content.update({
        // _id:id;
        _id: req.body.contentId
    },{
        category:req.body.category,
        title:req.body.title,
        user:req.userInfo._id.toString(),
        description:req.body.description,
        content:req.body.content
    }).then(function (rs) {
        // res.render('admin/success',{
        //     userInfo:req.userInfo,
        //     message:'内容保存成功',
        //     url:'/admin/content'
        // })
        responseData.message = "修改成功！";
        res.json(responseData);
    })
})

//内容删除
router.get('/content/delete',function (req,res) {
    var id = req.query.id||'';
    // console.log(req.body);
    Content.remove({
        _id:id
    }).then(function (rs) {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'内容保存成功',
            url:'/admin/content'
        })
    })
})


module.exports = router;