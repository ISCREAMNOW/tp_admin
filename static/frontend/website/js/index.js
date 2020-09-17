/* 导航栏 */
function cartoonNav(navid,selid,_width,_start){
	
	var _navbox = $("#"+navid);
	var _sel = $("#"+selid);
	var _arr = $("#"+navid+"> a");
	var _sw = _start * _width;
	_sel.css("right",_sw+"px");
	
	_arr.hover(function(){
	  var _index = $(this).index();
	  var _now = _index * _width;
	  if(_sel.is(":animated")){
		  _sel.stop(true,true);
		  }
	  _sel.animate({right:_now+"px"},200);
	  $(this).addClass("sel").siblings().removeClass("sel");	
	});
	
	_navbox.bind("mouseleave",function(){
		if(_sel.is(":animated")){
		  _sel.stop(true,true);
		  }
		_sel.animate({right:_sw+"px"},200);
		_arr.eq(_start).addClass("sel").siblings().removeClass("sel");
		});
	
}
/* 首页banner图 */
function indexBanner(boxid,sumid,_name,_speed,_part,lastid,nextid){
	var _box = $("#"+boxid);
	var _sum = $("#"+sumid);
	var _arr = _sum.find("."+_name);
	var _length = _arr.length;
	var _index = 0;
	
	
	var _goNext = function(){
		_arr.eq(_index).animate({left:"-1580px"},_speed);//第一个幻灯片走人
		
	  	_index++;//这里是下一个幻灯片
		if(_index == _length){
			_index = 0;
			}
		
		var _nowad = _arr.eq(_index);
		var _nowarr = _nowad.find("span");

		_box.css("background",_nowad.css("background"));
		_nowad.css("left","1580px");
		_nowad.animate({left:"0px"},_speed);
		
		var leftarr = new Array();
		var _gogo = _speed;
		var _wi = 0;
		while(_wi < _nowarr.length){
			leftarr.push(_nowarr.eq(_wi).css("left"));
			_nowarr.eq(_wi).css("left","1580px");
			_wi++;
			};
		_wi = 0;
		while(_wi < _nowarr.length){
			_gogo = _gogo + _speed;
			_nowarr.eq(_wi).animate({left:leftarr[_wi]},_gogo);
			_wi++;
			};
		
	};//主方法
	
	
	var _goLast = function(){
		_arr.eq(_index).animate({left:"1580px"},_speed);//第一个幻灯片走人
		
	  	_index--;//这里是下一个幻灯片
		if(_index == -1){
			_index = _length - 1;
			}
		
		var _nowad = _arr.eq(_index);
		var _nowarr = _nowad.find("span");

		_box.css("background",_nowad.css("background"));
		_nowad.css("left","-1580px");
		_nowad.animate({left:"0px"},_speed);
		
		var leftarr = new Array();
		var _gogo = _speed;
		var _wi = 0;
		while(_wi < _nowarr.length){
			leftarr.push(_nowarr.eq(_wi).css("left"));
			_nowarr.eq(_wi).css("left","-1580px");
			_wi++;
			};
		_wi = 0;
		while(_wi < _nowarr.length){
			_gogo = _gogo + _speed;
			_nowarr.eq(_wi).animate({left:leftarr[_wi]},_gogo);
			_wi++;
			};
		
	};//主方法
	
	
	var _cartoon = setInterval(_goNext,_part);
	_box.hover(function(){
		clearInterval(_cartoon);
		},function(){
			_cartoon = setInterval(_goNext,_part);
			});
	
	var _last = $("#"+lastid);
    var _next = $("#"+nextid);
	_next.click(function(){
		_goNext();
		});
	_last.click(function(){
		_goLast();
	});
	
}

/* 顶部导航滚动 */
function navScroll(navid){
	var _nav = $("#"+navid);
	_nav.addClass("logo_topbg");
	$(window).scroll(function(){
	  	var _now = $(window).scrollTop();
		if(_now > 38){
			_nav.removeClass("logo_topbg");
			_nav.css({"position":"fixed","top":"0px"});
			}
		if(_now < 38){
			_nav.css({"position":"absolute","top":"38px"});
			_nav.addClass("logo_topbg");
			}
	});
}

/* 全局section框 */
function indexPartGo(_name,_bgname){
	var _arr = $("."+_name);
	var _bgarr = $("."+_bgname);
	var _height = 300;//滚动条减去至
		
	var _obj = _arr.eq(0);
	var _hh = _obj.height()+50;
	_obj.find("."+_bgname).height(_hh);
	_obj.find("."+_bgname).fadeIn(200);
	
	var cartoon;
	var arrowGo = function(theimg){
		theimg.animate({left:"30px"},500,function(){
			theimg.animate({left:"0px"},500);
			});
		cartoon = setInterval(function(){
			theimg.animate({left:"30px"},500,function(){
			theimg.animate({left:"0px"},500);
			});
			},1000);
	};
	var firstarrow = _arr.eq(0).find(".arrow_p").find("img");
	arrowGo(firstarrow);
	
	$(window).scroll(function(){
	  	var _now = $(window).scrollTop();
		var _i = 0;
		var _sh = 520;
		var _first = _arr.eq(0).height() + _sh - _height;
		var _last = 520;
		
		if(_now < _first){
			var _one = _arr.eq(0);
			var _oneb = _arr.eq(0).find("."+_bgname).css("display");
			if(_oneb == "none"){
				clearInterval(cartoon);
					var arrow = _arr.eq(0).find(".arrow_p").find("img");
					$(".arrow_p").css("display","none");
					_arr.eq(0).find(".arrow_p").css("display","block");
				    arrowGo(arrow);
					
					$(".index_tit").css("color","#666");
					_arr.eq(0).find(".index_tit").css("color","#fff");
					
				_bgarr.css("display","none");
				_one.find("."+_bgname).height(_one.height()+50);
			    _one.find("."+_bgname).fadeIn(300);
				}
		}
		
		while(_i<_arr.length-2){
			_obj = _arr.eq(_i);
			_sh = _sh + _obj.height()+50;
			var _min = _sh - _height;
			var _max = _sh + _arr.eq(_i+1).height() + 50 - _height;
			
			if(_now>=_min && _now<_max){
				var _next =  _arr.eq(_i+1);
				var _bb = _next.find("."+_bgname).css("display");
				if(_bb == "none"){
					clearInterval(cartoon);
					$(".arrow_p").css("display","none");
					_arr.eq(_i+1).find(".arrow_p").css("display","block");
					var arrow = _arr.eq(_i+1).find(".arrow_p").find("img");
				    arrowGo(arrow);
					
					$(".index_tit").css("color","#666");
					_arr.eq(_i+1).find(".index_tit").css("color","#fff");
					
					_bgarr.css("display","none");
				  	_next.find("."+_bgname).height(_next.height()+50);
					_next.find("."+_bgname).fadeIn(300);
				}
			}
			
			if(_i == _arr.length-3){
				_last = _max;
				}
		    _i++;
		};//循环结束,抛出第一个和最后一个
		
		if(_now >= _last){
			var _one = _arr.eq(_arr.length-1);
			var _oneb = _arr.eq(_arr.length-1).find("."+_bgname).css("display");
			if(_oneb == "none"){
				clearInterval(cartoon);
					var arrow = _one.find(".arrow_p").find("img");
				    arrowGo(arrow);
					$(".arrow_p").css("display","none");
					_one.find(".arrow_p").css("display","block");
					
					$(".index_tit").css("color","#666");
					_one.find(".index_tit").css("color","#fff");
					
				_bgarr.css("display","none");
				_one.find("."+_bgname).height(_one.height()+50);
			    _one.find("."+_bgname).fadeIn(300);
				}
		}
		
		
	});
}


/* hover动画 */
function hoverCartoon(_name,_width,_speed){
	var _arr = $("."+_name);
	_arr.hover(function(){
		var _go = $(this).children();
		_go.css("left",_width+"px");
		_go.animate({left:"0px"},_speed);
	},function(){
		var _go = $(this).children();
		_go.css("left","0px");
		});
}

function moreCartoon(_name,_width,_speed){
	var _arr = $("."+_name);
	var cartoon;
	var arrowGo = function(theimg){
		theimg.animate({right:"50px"},400,function(){
			theimg.animate({right:"20px"},400);
			});
		cartoon = setInterval(function(){
			theimg.animate({right:"50px"},400,function(){
			theimg.animate({right:"20px"},400);
			});
			},800);
	};
	
	_arr.hover(function(){
		var _go = $(this).find("span");
		arrowGo(_go);
	},function(){
		clearInterval(cartoon);
		});
}

function lastCartoon(_name){
	var _arr = $("."+_name);
	var cartoon;
	var arrowGo = function(theimg){
		theimg.animate({left:"50px"},400,function(){
			theimg.animate({left:"20px"},400);
			});
		cartoon = setInterval(function(){
			theimg.animate({left:"50px"},400,function(){
			theimg.animate({left:"20px"},400);
			});
			},800);
	};
	
	_arr.hover(function(){
		var _go = $(this).find("span");
		arrowGo(_go);
	},function(){
		clearInterval(cartoon);
		});
}

function listBackCartoon(_name){
	var _arr = $("."+_name);
	var cartoon;
	var arrowGo = function(theimg){
		theimg.animate({left:"20px"},400,function(){
			theimg.animate({left:"0px"},400);
			});
		cartoon = setInterval(function(){
			theimg.animate({left:"20px"},400,function(){
			theimg.animate({left:"0px"},400);
			});
			},800);
	};
	
	_arr.hover(function(){
		var _go = $(this).find("span");
		arrowGo(_go);
	},function(){
		clearInterval(cartoon);
		});
}

function imgShowName(_name,_width,_speed){
	var _arr = $("."+_name);
	_arr.hover(function(){
		var _bgn = $(this).find("span");
		_bgn.css("left",_width+"px");
		_bgn.animate({left:"0px"},_speed)
		},function(){
			var _bgn = $(this).find("span");
			_bgn.css("left","0px");
			});
}

function caseShowName(_name,_width,_speed){
	var _arr = $("."+_name);
	_arr.hover(function(){
		var _bgn = $(this).find("span");
		_bgn.animate({bottom:"0px"},_speed)
		},function(){
			var _bgn = $(this).find("span");
			_bgn.animate({bottom:_width+"px"},_speed)
			});
}

/* 招聘列表 */
function workersShow(){
	var _arr = $(".workers_right .workers_a");
	var _sum = $(".workers_sum li");
	_arr.hover(function(){
		_arr.removeClass("sel");
		$(this).addClass("sel");
		var _index = $(this).index();
		if(_index >= 5){
			_index--;
			}
		_sum.css("display","none");
		_sum.eq(_index).css("display","block");
	});
}
/* 管理层 */
function manageShow(){
	var _arr = $("#manage_check a");
	var _sum = $("#manage_sum li");
	
	_arr.hover(function(){
		$(this).addClass("sel").siblings().removeClass("sel");
		var _index = $(this).index();
		var _d = _sum.eq(_index).css("display");
		if(_d != "none"){}else{
			_sum.css("display","none");
		    _sum.eq(_index).fadeIn(200);
			}
		
	});
}

//搜索框部分
function searchTextClear(_name,_text){
	var _obj = $("."+_name);
	_obj.val(_text);
	_obj.click(function(){
		var _now = _obj.val();
		if(_now == _text){
			_obj.val("");
			_obj.css("color","#555");
		}
	});
	_obj.blur(function(){
		var _now = _obj.val();
		if(_now == ""){
			_obj.val(_text);
			_obj.css("color","#999");
		}
	});
}

//登录等弹出部分
function loginWinOpen(winid,_name,_settop){
	var _win = $("#"+winid);
	var _obj = _win.find("."+_name);
	//必要的变量
	var _speed = 0;
	var _acc = 5;//弹跳速度，振幅调整
	var _top = parseInt(_obj.css("top"));
	var _cartoon;
	
	var _timego = function(){
		_top = parseInt(_obj.css("top"));
		_speed += _acc;
		_top += _speed;
		if(_top >= _settop){
			_speed *= -0.7;
			if(Math.abs(_speed)<=_acc){
				clearInterval(_cartoon);
				_cartoon = null;
			}
			
			_top = _settop;
		}
		_obj.css("top",_top+"px");
	};
	
	$(".allwin").css("display","none");
	$(".myselfbox").css("top","-300px");
	
	_win.fadeIn(200);
    _cartoon = setInterval(_timego,20);
}
function closeLogin(winid,_name){
	var _win = $("#"+winid);
	var _obj = _win.find("."+_name);
	_obj.animate({"top":"-300px"},200,function(){
		_win.fadeOut(200);
		});
}
function domainDown(thisid,objid,_speed){
	var _this = $("#"+thisid);
	var _obj = $("#"+objid);
	var _arr = $("#"+objid+" a")
	var _display = _obj.css("display");
	if(_display == "none"){
		_obj.slideDown(_speed);
	}else {
		_obj.slideUp(_speed);
		}
	_arr.click(function(){
		var _str = $(this).html();
		_this.html(_str);
		$('#suffix').val(_str);
		_obj.slideUp(_speed);
		});
	
}
function domainMore(){
	var _box = $("#domain_morebox");
	var _hidden = $("#domain_check");
	var _display = _box.css("display");
	if(_display == "none"){
		_box.slideDown(200);
	    _hidden.css("display","none");
	}else{
		_box.slideUp(200);
	    _hidden.css("display","block");
		}
	
}

//浮动导航栏应用
function buildFloat(_obj,_top,_bot,_name){
	$(window).scroll(function(){
		var _now = $(window).scrollTop();
		if(_now>=_top && _now<_bot){
		  _obj.addClass(_name).siblings().removeClass(_name);
		}
	});
}
function buildFloatClick(_top){
	//$(window).scrollTop(_top);
	$("html,body").animate({scrollTop:_top},500);
}
//弹出窗
function openVideo(boxid){
	$("#"+boxid).fadeIn(200);
}
function closeVideo(_name){
	$("."+_name).fadeOut(200);
}





