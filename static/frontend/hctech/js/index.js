$().ready(function() {
    try {
        // 顶部广告关闭
        $(".btn-close").click(function () {
            $('.advbox').hide();
        });
    } catch (e) {
    }
    try {
        // 导航效果
        $(window).scroll(function(){
            if($(window).scrollTop()>2950){
                $('.header').addClass('header-fixed');
            }else{
                $('.header').removeClass('header-fixed');
            }
        });
    } catch (e) {
    }
    try {
        // banner效果
        $('.slide-nav ul li').mouseover(function(){
            $('.slide-nav ul li').removeClass('active');
            $(this).addClass('active');
            $('.banner .slides li').eq($(this).attr('data-num')).stop().show().siblings().hide();
        })
    } catch (e) {
    }
    try {
        // 运营服务
        $('.operate-box .icon-aright').click(function(){
            $(this).addClass('disabled').siblings().removeClass('disabled');
            $('.operate-box ul').animate({'left': -310});
        })
        $('.operate-box .icon-aleft').click(function(){
            $(this).addClass('disabled').siblings().removeClass('disabled');
            $('.operate-box ul').animate({'left': 0});
        })
    } catch (e){
    }
    try {
        // 产品展示
        $('.product-list li').mouseover(function(){
            $(this).addClass('active').siblings().removeClass('active');
        })
    } catch (e){
    }
    try {
        // 客户案例
        $('.case li .disc-img').hover(function() {
            $('.case-disc', this).stop(true, false).animate({
                height: '100%'
            });
            $('.case-disc p', this).stop(true, false).animate({
                height: '50px'
            });
        }, function() {
            $('.case-disc', this).stop(true, false).animate({
                height: 0
            });
            $('.case-disc p', this).stop(true, false).animate({
                height: 0
            });
        });
    } catch (e) {
    }
	try {
    	// 视频下载
        function rewrite_href(id, href) {
            var mb = myBrowser();
            if (mb == "IE" || mb == "Chrome" || mb == "Opera") {
                var ele = document.getElementById(id);
                ele.href = href;
            }

            return true;
        }
        function myBrowser() {
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isOpera = userAgent.indexOf("Opera") > -1;
            if (isOpera) {
                return "Opera"
            } //判断是否Opera浏览器
            if (userAgent.indexOf("Firefox") > -1) {
                return "FF";
            } //判断是否Firefox浏览器
            if (userAgent.indexOf("Chrome") > -1) {
                return "Chrome";
            }
            if (userAgent.indexOf("Safari") > -1) {
                return "Safari";
            } //判断是否Safari浏览器
            if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
                return "IE";
            } //判断是否IE浏览器
        }
        rewrite_href("video-index", "http://7qnbf2.com1.z0.glb.clouddn.com/68mall_FLA.mp4");
	} catch (e) {
	}
	try {
        $('#floor1-list li').mouseover(function(){
            $(this).stop().animate({width: '467'},500,function(){
                $(this).addClass('bor-red').removeClass('bor-g').find(".floor1-div-fr").show().next(".floor1-btn-blue").fadeIn();
            });
            $(this).siblings().stop().animate({width: '210'},500).removeClass('bor-red').addClass('bor-g').find(".floor1-div-fr").hide().next().fadeOut();
        });
        $('.floor1-btn .btn-prev').mouseover(function() {
            $('#floor1-list').animate({
                left: 0
            }, 500);
            $(this).addClass('btn-disabled').siblings().removeClass('btn-disabled');
        });
        $('.floor1-btn .btn-next').mouseover(function() {
            $('#floor1-list').animate({
                left: '-634px'
            }, 500);
            $(this).addClass('btn-disabled').siblings().removeClass('btn-disabled');
        })
	} catch (e) {
	}
	try {
        function news_slider(wrap,hd,bd,curr,arrow,left,right){
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
            $(wrap).hover(function(){
                clearInterval(mytime);
                $(arrow).show();
            },function(){
                mytime=setInterval(autoplay,6000);
                $(arrow).hide();
            });
            $(right).click(function(){
                num++;
                if(num>(bl-1)){
                    num=0;
                }
                $(hd).eq(num).stop().css('z-index',1).fadeIn(1000).siblings().css('z-index',0).fadeOut();
                $(bd).eq(num).addClass(curr).siblings().removeClass(curr);
            });
            $(left).click(function(){
                num--;
                if(num<0){
                    num=bl-1;
                }
                $(hd).eq(num).stop().css('z-index',1).fadeIn(1000).siblings().css('z-index',0).fadeOut();
                $(bd).eq(num).addClass(curr).siblings().removeClass(curr);
            });
            var bannerTime = setInterval(bannerPlay,6000);
            $(wrap).hover(function(){
                clearInterval(bannerTime);
            },function(){
                bannerTime = setInterval(bannerPlay,6000);
            })
        }
        news_slider('.news-scroll','.news-scroll ul li','.news-scroll .news-control span','active','.news-scroll .news-scroll-btn','.news-scroll .btn-left','.news-scroll .btn-right');
    } catch (e) {
    }
});