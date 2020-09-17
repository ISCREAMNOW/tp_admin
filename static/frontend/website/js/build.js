function buildBoxSix(){
	var _box = $("#build_one");
	var _arr = $("#build_one a");
	var _length = 6;
	var _top = 356;
	var _bot = 1056;
	
	var _arrx = new Array();
	for(var i=0;i<_length;i++){
		var _fen = _arr.eq(i).css("left");
		_fen = parseInt(_fen);
		_fen = _fen/_top;
		_arrx.push(_fen);
	}
	
	var _arry = new Array();
	for(var i=0;i<_length;i++){
		var _fen = _arr.eq(i).css("left");
		_fen = parseInt(_fen);
		_arry.push(_fen);
	}
	
	$(window).scroll(function(){
		var _now = $(window).scrollTop();

		if(_now < _bot){
			
			for(var i=0;i<_length;i++){
				var _move = _arrx[i] * _now;
				_move = _arry[i] - _move;
				if(_arr.eq(i).is(":animated")){
					_arr.eq(i).stop(true,true);
					}
				if(_move > 0){
					_arr.eq(i).animate({left:"0px"},500);
					}else{
						_arr.eq(i).animate({left:_move+"px"},500);
						}
			}//循环并执行动画
			
		}//小于高度时候
		
		
	});
}

function buildBoxTwo(){
	var _sum = $("#build_two");
	var _arr = $("#build_two li");
	var _length = _arr.length;
	
	var _hoverbuild = function(_num){
		var _sp01 = _arr.eq(_num).find("span");
		var _sp02 = _arr.eq(_num+1).find("span");
		if(_sp01.is(":animated")){
			_sp01.stop(true,false);
			}
		if(_sp02.is(":animated")){
			_sp02.stop(true,false);
			}
		
		if(_arr.eq(_num).hasClass("text")){
			_arr.eq(_num).find("span").animate({bottom:"0px"},300);
			_arr.eq(_num+1).find("span").animate({"font-size":"80px"},300);
			}else{
				_arr.eq(_num+1).find("span").animate({bottom:"0px"},300);
			    _arr.eq(_num).find("span").animate({"font-size":"80px"},300);
				}
	};
	
	var _movebuild = function(_num){
		if(_arr.eq(_num).hasClass("text")){
			_arr.eq(_num).find("span").animate({bottom:"-215px"},300);
			_arr.eq(_num+1).find("span").animate({"font-size":"60px"},300);
			}else{
				_arr.eq(_num+1).find("span").animate({bottom:"-215px"},300);
			    _arr.eq(_num).find("span").animate({"font-size":"60px"},300);
				}
	};
	
	_arr.hover(function(){
		var _n = $(this).index() + 1;
		_n = Math.ceil(_n/2);
		_n = _n * 2 - 2;
		_hoverbuild(_n);
	},function(){
		var _n = $(this).index() + 1;
		_n = Math.ceil(_n/2);
		_n = _n * 2 - 2;
		_movebuild(_n);
		});
	
}

function buildBoxThree(){
	var _sum = $("#build_three");
	var _arr = $("#build_three li");
	var _text = $("#build_threesum dd")
	_arr.hover(function(){
		var _be = _sum.find(".sel");
		var _index = $(this).index();
		_text.eq(_index).css("display","block").siblings().css("display","none");
		
		if(_be.is(":animated")){
			_be.stop(true,true);
			}
		_be.animate({height:"0px",top:"0px"},500);
		_be.removeClass("sel");
		
		var _obj = $(this).find("img");
		if(_obj.is(":animated")){
			_obj.stop(true,true);
			}
		_obj.animate({height:"232px",top:"-116px"},500);
		_obj.addClass("sel");
	},function(){
		var _img = _sum.find("img");
		if(_img.is(":animated")){
			_img.stop(true,true);
			}
		});
}

function buildBoxFive(){
	var _sum = $("#build_five");
	var _arr = $("#build_five span");
	var _length = 6;
	var _top = 2500;
	var _scroll_h = 400;
	var _befor = 434;
	
	var _arrx = new Array();
	for(var i=0;i<_length;i++){
		var _fen = _arr.eq(i).css("left");
		_fen = parseInt(_fen);
		_fen = Math.abs(_fen-_befor);
		_fen = _fen/_scroll_h;
		_arrx.push(_fen);
	}
	
	var _arry = new Array();
	for(var i=0;i<_length;i++){
		var _fen = _arr.eq(i).css("left");
		_fen = parseInt(_fen);
		_arry.push(_fen);
	}
	
	var _arrz = new Array();
	_arr.css("left",_befor+"px");
	
	$(window).scroll(function(){
		
		var _now = $(window).scrollTop();
		if(_now >= _top){
			_now = _now - _top;
			for(var i=0;i<3;i++){
				var _move = _arrx[i] * _now;
				_move = _befor - _move;
				if(_move < _arry[i]){
				  _move = _arry[i];
				}
				if(_arr.eq(i).is(":animated")){
					_arr.eq(i).stop(true,true);
				}
				_arr.eq(i).animate({left:_move+"px"},500);
			}//前3个
			
			for(var i=3;i<6;i++){
				var _move = _arrx[i] * _now;
				_move =_move + _befor;
				if(_move > _arry[i]){
				  _move = _arry[i];
				}
				if(_arr.eq(i).is(":animated")){
					_arr.eq(i).stop(true,true);
				}
				_arr.eq(i).animate({left:_move+"px"},500);
			}//后3个
			
		}//判断滚动条
		
	});
}

function buildBoxOne(){
	var _box = $("#build_one");
	var _arr = $("#build_one a");
	var _length = 6;
	var _top = 400;
	var _bot = 700;
	
	var _arrx = new Array();
	for(var i=0;i<_length;i++){
		var _fen = _arr.eq(i).css("left");
		_fen = parseInt(_fen);
		_fen = _fen/_top;
		_arrx.push(_fen);
	}
	
	var _arry = new Array();
	for(var i=0;i<_length;i++){
		var _fen = _arr.eq(i).css("left");
		_fen = parseInt(_fen);
		_arry.push(_fen);
	}
	
	_arr.css("left","0px");
	
	$(window).scroll(function(){
		var _now = $(window).scrollTop();

		if(_now >= _bot){
			_now = _now - _bot;
			for(var i=0;i<_length;i++){
				var _move = _arrx[i] * _now;
				//_move = _arry[i] - _move;
				
				if(_arr.eq(i).is(":animated")){
					_arr.eq(i).stop(true,true);
					}
				if(_move > 0){
					_arr.eq(i).animate({left:"0px"},500);
					}else{
						_arr.eq(i).animate({left:_move+"px"},500);
						}
			}//循环并执行动画
			
		}else{
			for(var i=0;i<_length;i++){
				if(_arr.eq(i).is(":animated")){
					_arr.eq(i).stop(true,true);
					}
				_arr.eq(i).animate({left:"0px"},500);
				}
			}//小于高度时候
		
		
	});
}

$(function(){//alert($(window).scrollTop());
	var _floatsum = $("#build_float a");
	buildFloat(_floatsum.eq(0),0,956,"sel");
	buildFloat(_floatsum.eq(1),956,1601,"sel");
	buildFloat(_floatsum.eq(2),1601,2245,"sel");
	buildFloat(_floatsum.eq(3),2245,2895,"sel");
	buildFloat(_floatsum.eq(4),2895,4056,"sel");
});
