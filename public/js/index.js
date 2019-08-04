/**
 * Created by candice on 2017/6/18.
 */

$(function () {

    var $login = $('.login');
    var $modal1 = $('#Modal1');
    var $modal2 = $('#Modal2');
    var $modal = $('.modal');

    var $username = $modal.find('[name="username"]');
    var $password = $modal.find('[name="password"]');
    var $repassword = $modal.find('[name="repassword"]');

    //禁用提交按钮
    $modal.find('.submit').attr('disabled','disabled');

    $modal1.find('[name="username"]').on('change',function () {
        var $this = $(this);
        $.ajax({
            url:'/api/user/username',
            type:'post',
            data:{username:$this.val()},
            dataType:'json',
            success:function (data) {
                if(data.code==1){
                    $this.next().html(data.message);
                    $this.next().show();
                }else {
                    $this.next().hide();
                }
            }
        })
    })

    $username.on('blur',oBlur_1);
    $password.on('blur',function () {
        var $this = $(this);
        var content = $this.val();
        var password = $(this).parent().parent().find('[name="repassword"]').val();
        oBlur_2($this,content,password);
    });
    $repassword.on('blur',function () {
        var $this = $(this);
        var content = $this.val();
        var password = $(this).parent().parent().find('[name="password"]').val();
        oBlur_2($this,content,password);
    });

    $username.on('focus',oFocus);
    $password.on('focus',oFocus);
    $repassword.on('focus',oFocus);

    //用户框失去焦点后验证value值
    function oBlur_1() {
        var content = $(this).val();
        $(this).next().show();
        $(this).parent().parent().find('.submit').attr('disabled','disabled');
        if (!content) {
            $(this).next().html("请输入用户名！") ;
        } else if(!content.match(/^[a-zA-Z0-9_]+$/)){
            $(this).next().html("用户名只能由字母、数字和下划线组成！");
        } else {
            $(this).next().hide();
            $(this).parent().parent().find('.submit').removeAttr('disabled');
        }
    }

    //密码框失去焦点后验证value值
    function oBlur_2($that,content,password) {
        $that.next().show();
        $that.parent().parent().find('.submit').attr('disabled','disabled');
        if (!content) {
            $that.next().html( "请输入密码！");
        } else if(password && content!==password){
            $that.next().html("两次输入不一致");
        }else if(content.length<6){
            $that.next().html("请输入大于6位的密码");
        } else if(content.length>20){
            $that.next().html("请输入小于20位的密码");
        } else {
            $that.next().hide();
            $that.parent().parent().find('.submit').removeAttr('disabled');
        }
    }

    //获得焦点的隐藏提醒
    function oFocus() {
        $(this).next().hide();
        $(this).next().innerHTML = "";
    }

    //用户注册
    $modal1.find('.submit').on('click',function () {
        $.ajax({
            url:'/api/user/register',
            type:'post',
            data:{
                username:$modal1.find('[name="username"]').val(),
                password:$modal1.find('[name="password"]').val(),
                repassword:$modal1.find('[name="repassword"]').val()
            },
            dataType:'json',
            success:function (data) {
                if(data.code==2){
                    confirm(data.message);
                    $modal1.modal('hide');
                    //页面重载
                    window.location.reload();
                    return;
                }
                if(data.code==3){
                    confirm(data.message);
                    return;
                }
            }
        })
    })

    //登录
    $modal2.find('.submit').on('click',function () {
        $.ajax({
            url:'/api/user/login',
            type:'post',
            data:{
                username:$modal2.find('[name="username"]').val(),
                password:$modal2.find('[name="password"]').val(),
            },
            dataType:'json',
            success:function (data) {
                if(data.code==1){
                    // confirm(data.message);
                    $modal2.modal('hide');
                    //页面重载
                    window.location.reload();
                    return;
                }
                if(data.code==2){
                    confirm(data.message);
                    return;
                }
            }
        })
    })

    //退出登录
    $('.logoutBtn').on('click',function () {
        $.ajax({
            url:'/api/user/logout',
            success:function (result) {
                if(!result.code){
                    //页面重载
                    window.location.reload();
                }
            }
        })
    })

})