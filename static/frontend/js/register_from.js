//var url = document.URL;
var fromurl = document.referrer;
//console.log(url);
//console.log(fromurl);
//console.log(reg.exec(fromurl)[2]);
if(fromurl && typeof(fromurl) != "undefined"){
	var reg = /^http(s)?:\/\/(.*?)\//;
	var area_referrer = reg.exec(fromurl)[2];
	var curr_url = reg.exec(document.URL)[2];
	//console.log(area_referrer);
	//console.log(curr_url);
	if(area_referrer && typeof(area_referrer) != "undefined" && area_referrer != curr_url){
		setCookie('fromurl',area_referrer,null);
	}
}

function setCookie(c_name,value,exdays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString()) + "; path=/";
	document.cookie=c_name + "=" + c_value;
}