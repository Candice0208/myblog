/**
 * Created by candice on 2017/7/7.
 */

var prepage = 5; //每页显示的条数；
var page = 1;
var pages = 0;
var comments = [];

$.ajax({
    url:'/api/comment',
    data:{
        contentId:$("#contentId").val(),
    },
    success:function (res) {
        comments = res.comments.reverse();
        renderComment();
    }
})


//提交评论
$('#messggeBtn').on('click',function () {
    $.ajax({
        type:'POST',
        url:'/api/comment/post',
        data:{
            contentId:$("#contentId").val(),
            content:$('#commentContent').val(),
        },
        success:function (res) {
            $('#commentContent').val('');
            if(res.message){
                alert(res.message);
                comments = res.comments.reverse();
                renderComment();
            }
        }
    })
});

//事件委托的方式
$('.pager').delegate('a','click',function () {
    if($(this).parent().hasClass('previous')){
        page--;
    }else {
        page++;
    }
    renderComment();
})

function renderComment() {
    if(comments.length<=0){
        $('#commentList').html('<div class="messageBox"><p>还没有评论</p></div>');
        return;
    }

    $('.commentCount').html(comments.length);
    pages = Math.max(Math.ceil(comments.length/prepage),1);
    var start = Math.max((page-1)*prepage,0);
    var end = Math.min(start + prepage,comments.length);

    var $lis = $('.pager li');
    $lis.eq(1).html(page+'/'+pages);

    if(page<=1){
        page = 1;
        $lis.eq(0).html('<span>没有上一页了</span>')
    }else {
        $lis.eq(0).html('<a href="javascript:;">上一页</a>')
    }
    if(page>=pages){
        page = pages;
        $lis.eq(2).html('<span>没有下一页了</span>')
    }else {
        $lis.eq(2).html('<a href="javascript:;">下一页</a>')
    }

    var html = '';
    for(var i=start; i<end;i++){
        html += `<p style="margin:10px 0 0;">
                     <span class="commentUsername" >`+comments[i].username+`</span>
                     <span class="postTime pull-right">`+formatDate(comments[i].postTime)+`</span>
                  </p>
                   <div class="commentContent"  style="border: 1px solid gainsboro; padding: 10px;">`+comments[i].content+`</div>
                `;
    }
    $('#commentList').html(html);
}

//时间格式转换
function   formatDate(d)   {
    var   now= new Date(d);
    var   year=now.getFullYear();
    var   month=now.getMonth()+1;
    var   date=now.getDate();
    var   hour=now.getHours();
    var   minute=now.getMinutes();
    var   second=now.getSeconds();
    return   year+"-"+fixZero(month,2)+"-"+fixZero(date,2)+" "+fixZero(hour,2)+":"+fixZero(minute,2)+":"+fixZero(second,2);
    // return   year+"/"+fixZero(month,2)+"/"+fixZero(date,2)+" "+fixZero(hour,2)+":"+fixZero(minute,2);
}
//时间如果为单位数补0
function fixZero(num,length){
    var str=""+num;
    var len=str.length;
    var s="";
    for(var i=length;i-->len;){
        s+="0";
    }
    return s+str;
}