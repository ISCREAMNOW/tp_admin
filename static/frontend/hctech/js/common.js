$().ready(function() {
    try {
        var bar_l = $('.logo-right ul li').length;
        $('.logo-right .num span').mouseover(function(){
            $(this).addClass('on').siblings().removeClass('on');
            $('.logo-right ul li').eq($(this).index()).stop().show().siblings().hide();
            num=$(this).index();
        });
        $('.logo-right').hover(function(){
            clearInterval(mytime);
        },function(){
            mytime=setInterval(autoplay,6000);
        });
        var num=0;
        function autoplay(){
            num++;
            if(num>(bar_l-1)){
                num=0;
            }
            $('.logo-right ul li').eq(num).stop().show().siblings().hide();
            $('.logo-right .num span').eq(num).addClass('on').siblings().removeClass('on');
        }
        var mytime=setInterval(autoplay,5000);
    } catch (e) {
    }
    try {
        $(".up-icon").hover(function() {
            $(this).find(".nav-show-div").show();
            $(this).find(".nav-show-div").stop().animate({
                height: '225px',
                opacity: 1
            }, 400);
        }, function() {
            $(this).find(".nav-show-div").hide();
            $(this).find(".nav-show-div").stop().animate({
                height: 0,
                opacity: 0
            }, 400);
            $(this).find(".nav-show-div").hide();
        });
    } catch (e) {
    }
    try {
        //side客服QQ和电话
        $(".sidebar ul li").hover(function(){
            $(this).find(".sidebar-qq").stop().animate({"width":"150px"},200)
            $(this).find(".sidebar-phone").stop().animate({"width":"150px"},200)
        },function(){
            $(this).find(".sidebar-qq").stop().animate({"width":"50px"},200)
            $(this).find(".sidebar-phone").stop().animate({"width":"50px"},200)
        });
        //微信图显示隐藏
        $(".sidebar-wx").hover(function(){
            $(".weixin").toggle();
        });
    } catch (e) {
    }
    try {
        // 底部获取客户信息
        $('.userinfo-close').click(function(){
            $(this).parents('.get-userinfo').hide();
        });
    } catch (e) {
    }
});
//回到顶部
function goTop(){
    $('html,body').animate({'scrollTop':0},600);
}
// banner 轮播
function slider(wrap,hd,bd,curr){
    var bl = $(hd).length;
    $(bd).mouseover(function(){
        $(this).addClass(curr).siblings().removeClass(curr);
        $(hd).eq($(this).index()).addClass(curr).fadeIn(500).siblings().removeClass(curr).fadeOut(500);
        num=$(this).index();
        clearInterval(bannerTime);
    });
    var num = 0;
    function bannerPlay(){
        num++;
        if(num>bl-1){
            num=0;
        }
        $(bd).eq(num).addClass(curr).siblings().removeClass(curr);
        $(hd).eq(num).addClass(curr).fadeIn(500).siblings().removeClass(curr).fadeOut(500);
    }
    var bannerTime = setInterval(bannerPlay,6000);
    $(wrap).hover(function(){
        clearInterval(bannerTime);
    },function(){
        bannerTime = setInterval(bannerPlay,6000);
    })
}
//注册来源
document.write("<script language='javascript' src='../../js/register_from.js'> </script>"); 