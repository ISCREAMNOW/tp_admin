function back_time(outer, contenter) {
	var self = this;
	self.$outer = outer;
	self.$contenter = contenter;
	self.time_number = 60; 
	self.endtime = (new Date()).getTime() + 60 * 1000;
	function init() {
		self.timer = setInterval(function() {
			set_time();
		}, 1000);
	}
	function set_time() {
		self.back_date = (new Date()).getTime();
		self.time_number = Math.round((self.endtime - self.back_date) / 1000);
		if (self.time_number <= 0) {
			self.time_number = 0;
			self.$outer.attr('has_click', 'no');
			if (self.$outer[0].id == 'email_yanzheng') {
				self.$outer.hide();
				self.$outer.prev().show();
			}
			else {
				self.$outer.text('获取验证码'); 
			}
			clearTimeout(self.timer);
			self.timer = null;
		}
		else {
			self.$contenter.text(self.time_number);
		}
	}
	init();
}
var Jumei = {};
Jumei.str_trim = function(str) {
	var str = str || '';
	return str.replace(/(^\s+)|(\s+$)/g, '');
};
Jumei.show_ajax = function() {
	if ($('#ajax-loading').length == 0) {
		$('.warper').append('<div class="ajax-loading" id="ajax-loading"><img src="/static_passport/images/ajax-loader.gif" alt=""></div>');
	}
	$('#ajax-loading').show();
};
Jumei.hide_ajax = function() {
	$('#ajax-loading').hide();
};
Jumei.ajax = function(url, param, method, callback) {
	Jumei.show_ajax();
	var post_data = param ? param : '';
	var type = typeof(method) == null ? 'post' : method;
	$.ajax({
		'url':url,
		'success':function(data) {
			Jumei.hide_ajax();
			if (typeof(callback) == 'function') {callback(data);}
		},
		'error':function() {
			Jumei.hide_ajax();
			alert('网络故障，请再试一次');
		},
		'timeout':60000,
		'type':type,
		'data':post_data,
		'dataType':'json'
	});
};
var email_arr = ['qq.com', 'foxmail.com', '163.com', 'gmail.com', 'yahoo.com'];
function search_input_change() {
	var input_val = $(this).val();
	var $contenter = $(this).prev();
	if (input_val.length == 0) {
		$contenter.hide();
		return;
	}
	$contenter.show();
	$contenter.find('.email_copy').text(input_val);
	if (input_val.indexOf('@') == -1) {
		$contenter.hide();
		$contenter.find('.notice_span').val('');
		return;
	}
	else {
		var input_str = input_val.slice(input_val.indexOf('@') + 1, input_val.length);
	}
	var exg_arr = [];
	exg_arr[0] = /\D/g, exg_arr[1] = /@$/g;
	if (!exg_arr[0].test(input_val.replace('@', '')) && exg_arr[1].test(input_val)) {
		$contenter.find('.notice_span').val('qq.com').addClass('show_notice');
		return;
	} else if (input_str.length == 0) {
		$contenter.hide();
		$contenter.find('.notice_span').val('');
	}
	if (input_str.length != 0) {
		for (var i = 0;i < email_arr.length;i++) {
			if (email_arr[i].indexOf(input_str) == 0 && input_str != email_arr[i]) {
				var leave_str = email_arr[i].slice(input_str.length, email_arr[i].length);
				$contenter.find('.notice_span').val(leave_str).addClass('show_notice');
				break;
			}
			else if (input_str == email_arr[i]) {
				$contenter.hide();
				$contenter.find('.notice_span').val('');
				break;
			}
			else if (i == email_arr.length - 1) {
				$contenter.hide();
				$contenter.find('.notice_span').val('');
				break;
			}
		} 
	}
}
