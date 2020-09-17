/*banner轮播*/
try {

} catch (t){
}
/*切换二维码*/
try {
    $('.case-group .case-item').each(function(){
        $(this).find('.code-tab span').mouseover(function(){
            $(this).addClass('active').siblings().removeClass('active').parents('li').find('.code-box img').eq($(this).index()).show().siblings().hide();
        });
    });
} catch (t){
}
// /*客户案例*/
// try {
//     $('.case-category li').click(function(){
//         // $(this).addClass('active').siblings().removeClass('active');
//         $('.case-category h2').removeClass('active');
//         $('html,body').animate({scrollTop:$('.case-group-box').eq($(this).index()).offset().top},500);
//     });
//     $('.case-category h2').click(function(){
//         $(this).addClass('active').siblings('ul').find('li').removeClass('active');
//         $('html,body').animate({scrollTop:$('.content-wrap').offset().top},500);
//     })
// } catch (t){
// }
// banner 轮播
slider('case-slider', '.slider-pic li', '.slider-dot .dot-group .dot', 'current');
