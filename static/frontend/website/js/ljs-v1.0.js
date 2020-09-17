//滚动系列 ↓↓
jQuery.ljs_gundong = {
//左右单张滚动
	oneLeft:function(_obj){
		var _box = $("#"+_obj.boxid);
		var _sum = $("#"+_obj.sumid); 
		var _style = _obj.stylename;
		var _width = _obj.boxwidth;
		var _height = _obj.boxheight;
		var _speed = _obj.speed;
		var _left = $("#"+_obj.leftid);
		var _right = $("#"+_obj.rightid);
		var _owidth = _obj.objwidth;
		var _oheight = _obj.objheight;
		var _arr = _box.find("."+_style);
		var _length = _arr.length;
	    //设定必要样式
		_box.css({"width":_width+"px","height":_height+"px","position":"relative","overflow":"hidden"});
		_arr.css({"float":"left","display":"block","position":"relative","width":_owidth+"px","height":_oheight+"px"});
		_sum.css({"width":"99999px","position":"absolute","top":"0px","left":"0px"});
		_sum.append(_sum.html());
		var _index = 0;
		var _go = 300;
		//动画
		var goCartoon = function(){
			if(_index >= _length){
				_sum.css("left","0px");
				_index = 0;
			}
			_sum.animate({left:"-="+_owidth+"px"},_go);
			_index++;
		};
		//动画执行
		var _cartoon = setInterval(goCartoon,_speed);
		_box.hover(function(){
			clearInterval(_cartoon);
			},function(){
				_cartoon = setInterval(goCartoon,_speed);
				});
		//箭头事件
		_right.click(function(){
			if(_index >= _length){
				_sum.css("left","0px");
				_index = 0;
			}
			_sum.animate({left:"-="+_owidth+"px"},_go);
			_index++;
		});
		_left.click(function(){
			var _l = _sum.css("left");
			var _w = -_length * _owidth;
			if(_l == "0px"){
				_sum.css("left",_w+"px");
				_index = _length + 1;
			}
			_sum.animate({left:"+="+_owidth+"px"},_go);
			_index--;
		});
	    
	},//左右单张滚动 END
	
//左右连续滚动↓↓↓
    allLeft:function(_obj){
		var _out = document.getElementById(_obj.boxid);
		var _box = $("#"+_obj.boxid);
		var _sum = $("#"+_obj.sumid); 
		var _style = _obj.stylename;
		var _width = _obj.boxwidth;
		var _height = _obj.boxheight;
		var _speed = _obj.speed;
		var _arr = _box.find("."+_style);
		var _length = _arr.length;
		
		var _maxl = 0;
		for(var i=0;i<_length;i++){
			_maxl += _arr.eq(i).width();	
		}
		
		_box.css({"width":_width+"px","height":_height+"px","position":"relative","overflow":"hidden"});
		_arr.css({"float":"left","position":"relative"});
		_sum.css({"width":"99999px","position":"absolute","top":"0px","left":"0px"});
		_sum.append(_sum.html());
		
		var _cartoon = setInterval(function(){
			if(_out.scrollLeft >= _maxl){
			_out.scrollLeft = 0;
			}
		    _out.scrollLeft++;
		},_speed);
		
		_box.hover(function(){
		    clearInterval(_cartoon);
		},function(){
			_cartoon = setInterval(function(){
		if(_out.scrollLeft >= _maxl){
			_out.scrollLeft = 0;
			}
		_out.scrollLeft++;
		},_speed);
			});
		
}//左右滚动 END


	
};
//滚动系列 ↑↑ END

//鼠标悬停系列 ↓↓
jQuery.ljs_mouhover = {
	//黑色蒙版
	darkMask:function(_obj){
		
	}//黑色蒙版 END
	
};
//鼠标悬停系列 ↑↑ END



//幻灯片系列 ↓↓
jQuery.ljs_adcartoon = {
	//左右滚动
	arrowNum:function(_obj){
		var _box = $("#"+_obj.boxid);
		var _sum = $("#"+_obj.sumid); 
		var _li01 = $("#"+_obj.li01);
		var _li02 = $("#"+_obj.li02);
		var _width = _obj.boxwidth;
		var _height = _obj.boxheight;
		var _speed = _obj.speed;
		var _go = _obj.gospeed;
		var _pre = $("#"+_obj.preid);
		var _next = $("#"+_obj.nextid);
		var _style = _obj.stylename;
		var _arr = _li01.find("."+_style);
		
		_box.css({"width":_width+"px","height":_height+"px","position":"relative","overflow":"hidden"});
		_sum.css({"width":"99999px","position":"absolute","top":"0px","left":"0px"});
		_li01.css("float","left");
		_li02.css("float","left");
		_arr.css({"float":"left","position":"relative"});
		
		
		//插入右下角数值
	 var _numstr = "<div id='"+_obj.numid+"'>";//注意div的id
	 for(var i=1;i<=_arr.length;i++){
	 	_numstr += "<a href='javascript:;'>"+i+"</a>";
	 	}
	 _numstr += "</div>";
	 _box.append(_numstr);
	 var _numarr = $("#"+_obj.numid+" > a");//获取数字组
	 var _index = 0;//索引值
	 _numarr.eq(0).addClass("sel");
	 var _num = $("#"+_obj.numid);
	 _li02.html(_li01.html());//复制同组图片
	 
	 //动画方法定义
	 var _left = -(_arr.length * _width) + "px";//计算左边位置
	 
	 var leftGo = function(){
		 var ls = _sum.css("left");
	 	  if(ls == _left){
	 	  	_sum.css("left","0px");
	 	  	}
	 	  	
	 	  _numarr.removeClass("sel");
	 	  if(_index < _arr.length-1){//判断索引变化
	 	  	_index++;
	 	  	_numarr.eq(_index).addClass("sel");
	 	  	}else{
	 	  	  _numarr.eq(0).addClass("sel");
	 	  	  _index = 0;
	 	  		}
	 	  		
	 	  _sum.animate({left:"-="+_width+"px"},_go);//此处速度需小于滚动间隔时间

	};
	
	var rightGo = function(){
		var ls = _sum.css("left");
	 	  var mm = "0px";
	 	  if(ls == mm){
	 	  	_sum.css("left",_left);
	 	  	}
	 	  	
	 	  _numarr.removeClass("sel");
	 	  if(_index >= 1){//判断索引变化
	 	  	_index--;
	 	  	_numarr.eq(_index).addClass("sel");
	 	  	}else{
	 	  	  _numarr.eq(_arr.length-1).addClass("sel");
	 	  	  _index = _arr.length-1;
	 	  		}
	 	  		
	 	  _sum.animate({left:"+="+_width+"px"},_go);
	};
	
	var cartoon;
	if(_obj.gocartoon){
		cartoon = setInterval(leftGo,_speed);
		_box.hover(function(){
		 clearInterval(cartoon);
		 },function(){
			 cartoon = setInterval(leftGo,_speed);
			 });
		}

	   _numarr.bind("mouseenter",function(){
	 	  _index = _numarr.index(this);
	 	  $(this).addClass('sel').siblings().removeClass('sel');
	 	  var _numsel =-(_index * _width) + "px";
	 	  _sum.animate({left:_numsel},_go);
	 	});
		
		_pre.bind("mousedown",function(){//注意ID
	 	  rightGo();
	 	});
	   _next.bind("mousedown",function(){//注意ID
		  leftGo();
	 	});

	}//左右滚动 END
	
};
//幻灯片系列 ↑↑ END