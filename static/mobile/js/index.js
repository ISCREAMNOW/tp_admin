$(function() {
	// 首页banner
	var swiper = new Swiper('.swiper-banner', {
		pagination: '.swiper-pagination',
		paginationClickable: true,
		autoplay: 3000,
		autoplayDisableOnInteraction: false
	});
	$('.swiper-banner .swiper-wrapper .swiper-slide a img').width($(window).width());
	// 一行广告
	var swiper = new Swiper('.one-ad-container', {
		pagination: '.one-ad-pagination',
		paginationClickable: true,
		autoplay: 5000,
		autoplayDisableOnInteraction: false
	})
	// 商城热点
	function comments_scroll() {
		var liLen = $('.hot ul li').length;
		var num3 = 0;
		$('.hot ul').append($('.hot ul').html());
		function autoplay() {
			if (num3 > liLen) {
				num3 = 1;
				$('.hot ul').css('top', 0);
			}
			$('.hot ul').stop().animate({
				'top': -60 * num3
			}, 500);
			num3++;
		}
		var mytime = setInterval(autoplay, 5000)
	}
	comments_scroll();
	// 推荐店铺
	var mySwiper = new Swiper('.shop-container', {
		// loop : true,
		slidesPerView: 'auto',
		loopedSlides: 8,
		touchRatio: 1,
	})
	// 推荐商品
	var goodsPromotion = new Swiper('.goods-promotion', {
		pagination: '.pagination',
		paginationClickable: true,
		preloadImages: true,
		lazyLoading : true,
		updateOnImagesReady:true,
		onSlideChangeEnd: function(swiper) {
			$.imgloading.loading();
		}
	// autoplay : 5000,//可选选项，自动滑动
	// loop : true,//可选选项，开启循
	});
});
