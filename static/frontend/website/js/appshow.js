function appShowPage(){
	var _mainbox = $(".appall_box");
	var _winwidth = $(window).width();
	var _winheight = $(window).height() - 138;
	var _next = $(".appall_next");
	var _last = $(".appall_last");
	var _index = 0;
	var _arrpage = $("#appmove section");
	var _length = _mainbox.length;
	var _footer = $("#appfooternav a");
	var _allbg = $(".appall_bg");
	
	//窗口变动时重新定义宽高
	var winresize = function(){
		_mainbox = $(".appall_box");
	    _winwidth = $(window).width();
		if(_winwidth < 1080){_winwidth = 1080;}
	    _winheight = $(window).height() - 138;
		if(_winheight < 800){_winheight = 800;}
		_mainbox.width(_winwidth);
		_mainbox.height(_winheight);
		$(".appall").height(_winheight);
		
		if(_winwidth > 1800){
			_allbg.width(_winwidth);
			}else {
				_allbg.width(1843);
				}
	};
	winresize();//定义宽高
	window.onresize = function(){winresize();};//定义宽高
	
	//1号页面事件
	var onepage = function(){
		enterWin("appone_sp01",-900,-800,0,0,"left","bottom",500);
		enterWin("appone_a1",-300,-300,294,304,"right","bottom",600);
		enterWin("appone_a2",-300,-300,152,304,"right","bottom",700);
		enterWin("appone_a3",-300,-300,10,304,"right","bottom",800);
		enterWin("appone_sp1",-300,-300,294,20,"right","bottom",900);
		enterWin("appone_sp2",-300,-300,10,162,"right","bottom",1000);
		enterWin("appone_a5",-300,-300,152,20,"right","bottom",1100);
		enterWin("appone_a4",-300,-300,10,20,"right","bottom",1200);
		_footer.removeClass("sel");
	};
	onepage();
	
	//2号页面事件
	var twopage = function(){
		enterWin("apptwo_sp01",-600,-600,0,0,"right","bottom",500);
		_footer.eq(0).addClass("sel").siblings().removeClass("sel");
	};
	
	//3号页面事件
	var threepage = function(){
		enterWin("appthree_sp01",-300,0,0,0,"right","top",500);
		enterWin("appthree_p01",-600,0,0,0,"left","top",600);
		enterWin("appthree_p02",-600,0,0,0,"left","top",700);
		enterWin("appthree_p03",-600,0,0,0,"left","top",800);
		enterWin("appthree_p04",-600,0,0,0,"left","top",900);
		_footer.eq(1).addClass("sel").siblings().removeClass("sel");
	};
	
	//4号页面事件
	var fourpage = function(){
		enterWin("appfour_sp01",0,-600,0,0,"left","top",500);
		enterWin("appfour_p01",0,600,0,0,"left","top",600);
		enterWin("appfour_p02",0,600,0,0,"left","top",700);
		enterWin("appfour_p03",0,600,0,0,"left","top",800);
		enterWin("appfour_p04",0,600,0,0,"left","top",900);
		_footer.eq(2).addClass("sel").siblings().removeClass("sel");
	};
	
	//5号页面事件
	var fivepage = function(){
		$(".appfive_sp01").css("display","none");
		$(".appfive_sp01").fadeIn(500);
		enterWin("appfive_p01",0,600,0,0,"left","top",600);
		enterWin("appfive_p02",-600,0,0,0,"right","top",700);
		var fivearr = $("#appfive_list li");
		var five = 0;
		var fivetime = 200;
		fivearr.css("width","0px");
		while(five < fivearr.length){
			fivearr.eq(five).animate({width:"110px"},fivetime);
			fivetime += 200;
			five++;
			}
		
		_footer.eq(3).addClass("sel").siblings().removeClass("sel");
	};
	
	//6号页面事件
	var sixpage = function(){
		enterWin("appsix_p01",-1080,0,0,0,"left","top",500);
		enterWin("appsix_p02",-1080,0,0,0,"left","top",600);
		enterWin("appsix_p03",-1080,0,0,0,"right","top",700);
		var sixarr = $("#appsix_sum").find("p");
		sixarr.css({"opacity":"0","top":"-100px"});
		var six = 0;
		var sixtime = 0;
		while(six < sixarr.length){
			sixarr.eq(six).animate({"opacity":"1",top:"0px"},sixtime);
			sixtime += 100;
			six++;
			}
		
		_footer.eq(4).addClass("sel").siblings().removeClass("sel");
	};
	
	
	//切换至下一页
	var nextapp = function(){
		if(_index < _length-1){
			_arrpage.eq(_index).siblings().children().css("display","none");
			_allbg.css("display","block");
			_index++;
			_arrpage.eq(_index-1).animate({width:0+"px"},500,function(){
				_arrpage.children().fadeIn(200);
				switch(_index){
					case 1:
					twopage();
					break;
					case 2:
					threepage();
					break;
					case 3:
					fourpage();
					break;
					case 4:
					fivepage();
					break;
					case 5:
					sixpage();
					break;
					}
				
			});//移动事件
		}
	};
	//切换至上一页
	var lastapp = function(){
		if(_index > 0){
			_arrpage.eq(_index).siblings().children().css("display","none");
			_allbg.css("display","block");
			_index--;
			_arrpage.eq(_index).animate({width:_winwidth+"px"},500,function(){
				_arrpage.children().fadeIn(200);
				switch(_index){
					case 0:
					onepage();
					break;
					case 1:
					twopage();
					break;
					case 2:
					threepage();
					break;
					case 3:
					fourpage();
					break;
					case 4:
					fivepage();
					break;
					}
				
			});//移动事件
		}
	};
	
	_next.click(function(){
		nextapp();
	});
	_last.click(function(){
		lastapp();
	});
	
	//footer
	var _gopagenum = function(_nownum){

		if(_nownum != _index){
			_arrpage.eq(_index).siblings().children().css("display","none");
			_allbg.css("display","block");
			
			if(_nownum > _index){
			   _index = _nownum;
			   for(var i=0;i<=_index-2;i++){
				  _arrpage.eq(i).animate({width:0+"px"},500);
				}
				_arrpage.eq(_index-1).animate({width:0+"px"},500,function(){
					_arrpage.children().fadeIn(200);
				switch(_index){
					case 1:
					twopage();
					break;
					case 2:
					threepage();
					break;
					case 3:
					fourpage();
					break;
					case 4:
					fivepage();
					break;
					case 5:
					sixpage();
					break;
					}
					});
			}//ADD
			
			if(_nownum < _index){
				var _footl = _footer.length;
			   _index = _nownum;
			   for(var i=_footl;i>_index;i--){
				  _arrpage.eq(i).animate({width:_winwidth+"px"},500);
				}
				_arrpage.eq(_index).animate({width:_winwidth+"px"},500,function(){
					_arrpage.children().fadeIn(200);
				switch(_index){
					case 1:
					twopage();
					break;
					case 2:
					threepage();
					break;
					case 3:
					fourpage();
					break;
					case 4:
					fivepage();
					break;
					case 5:
					sixpage();
					break;
					}
					});
			}//ADD
			
		}
		
	};
	
	_footer.click(function(){
		var clicknum = $(this).index() + 1;
		_gopagenum(clicknum);
	});
	
	$(".appone_div01").find("a").click(function(){
		var clicknum = $(this).index() + 1;
		_gopagenum(clicknum);
	});
	
	
	
	
	$('body').bind('mousewheel',function(event, delta){  
      if(delta < 0){
		 nextapp();
		  }else {
			lastapp();
			  }   
    });//滚轮判断
	
}//END

//进入窗口方式
function enterWin(_name,_sx,_sy,_ex,_ey,_x,_y,_speed){
	var _obj = $("."+_name);
	_obj.css("opacity","0");
	_obj.css(_x,_sx+"px");
	_obj.css(_y,_sy+"px");
	eval("_obj.animate({"+_x+":"+_ex+"+'px',"+_y+":"+_ey+"+'px','opacity':'1'},_speed);");	
}


//禁止滚轮影响滚动条
function disabledMouseWheel() {  
    if (document.addEventListener) {  
        document.addEventListener('DOMMouseScroll', scrollFunc, false);  
    }  
    window.onmousewheel = document.onmousewheel = scrollFunc;  
}  
function scrollFunc(evt) {  
    evt = evt || window.event;  
    if (evt.preventDefault) {  
        evt.preventDefault();  
        evt.stopPropagation();  
    }  
    else {  
        evt.cancelBubble = true;  
        evt.returnValue = false;  
    }  
    return false;  
}  
window.onload=disabledMouseWheel;