/**
 * 常用操作插件
 * 
 * 版权所有 2008-2015 秦皇岛商之翼网络科技有限公司，并保留所有权利。
 * 
 * @author: niqingyang
 * @version 1.0
 * @date 2015-12-18
 * @link http://www.68ecshop.com
 */

(function($) {

	if (layer) {
		layer.config({
			moveType: 1,
			scrollbar: true,
			shadeClose: false,
			// 控制出场动画：0-6
			shift: 0,
			tips: [2, '#FF9900'],
			// 触发拖动的元素，false表示不允许拖动
			move: '.layui-layer-title',
		// extend: 'extend/layer.ext.js'
		// 可以控制标题栏是否显示
		// title: false
		});
	}

	// 可以统一控制是否全屏显示
	if (top.layer) {
		// layer = top.layer;
	}

	$.closeDialog = function(index) {
		if (layer) {
			layer.close(index);
		}
	}
	// layer.closeAll(); //疯狂模式，关闭所有层
	// layer.closeAll('dialog'); //关闭信息框
	// layer.closeAll('page'); //关闭所有页面层
	// layer.closeAll('iframe'); //关闭所有的iframe层
	// layer.closeAll('loading'); //关闭加载层
	// layer.closeAll('tips'); //关闭所有的tips层
	$.closeAll = function(type) {
		if (layer) {
			layer.closeAll(type);
		}
	}

	/**
	 * 打开一个模式窗口
	 */
	$.open = function(options) {

		if (!options.area) {
			if (options.width != undefined && options.height != undefined) {
				options.area = [options.width, options.height];
			} else if (options.width != undefined) {
				options.area = options.width;
			}
		}

		if (options.ajax) {

			var ajax_default = {
				method: "GET",
				data: {},
				dataType: "JSON",
				async: true,
			};

			options.ajax = $.extend({}, ajax_default, options.ajax);

			return $.ajax({
				url: options.ajax.url,
				type: options.ajax.method,
				async: options.ajax.async,
				dataType: options.ajax.dataType,
				data: options.ajax.data
			}).done(function(result) {
				if (result.code == 0) {
					options.content = result.data;
					if (layer) {
						var index = layer.open(options);
					}
				} else {
					$.msg(result.message, {
						time: 5000
					});
				}
			});
		} else {
			if (layer) {
				layer.open(options);
			}
		}
	}

	/**
	 * 信息提示
	 * 
	 * @param message
	 *            提示消息
	 * @param options
	 *            提示消息
	 * @param end
	 *            无论是确认还是取消，只要层被销毁了，end都会执行，不携带任何参数。
	 */
	$.msg = function(content, options, end) {
		if (layer) {

			if ($.isFunction(options)) {
				end = options;
				options = {};
			}

			options = $.extend({
				time: 2000
			}, options);

			layer.msg(content, options, function() {
				if ($.isFunction(end)) {
					end.call(layer);
				}
			});

		} else {
			alert("缺少组件：" + content);
		}
	};

	/**
	 * 信息提示
	 * 
	 * @param message
	 *            提示消息
	 * @param options
	 *            提示消息
	 * @param yes
	 *            点击确定按钮的回调函数
	 */
	$.alert = function(content, options, yes) {
		if (layer) {
			var type = $.isFunction(options);
			if (type) {
				yes = options;
			}

			if ($.isFunction(options)) {
				yes = options;
				options = {};
			}

			options = $.extend({
				// 隐藏滚动条
				scrollbar: true
			}, options);

			return layer.alert(content, options, function(index) {
				if (yes == undefined || !$.isFunction(yes)) {
					layer.close(index);
				} else if ($.isFunction(yes) && yes.call(layer, index) != false) {
					layer.close(index);
				}
			});
		} else {
			alert("缺少组件：" + content);
		}
	}

	$.confirm = function(content, options, yes, cancel) {
		if (layer) {
			var type = $.isFunction(options);
			if (type) {
				cancel = yes;
				yes = options;
				options = {};
			}

			options = $.extend({
				// 隐藏滚动条
				scrollbar: true
			}, options);

			return layer.confirm(content, options, function(index) {
				if ($.isFunction(yes) && yes.call(layer, index) != false) {
					layer.close(index);
				}
			}, function(index) {
				if ($.isFunction(cancel) && cancel.call(layer, index) != false) {
					layer.close(index);
				}
			});

		} else {
			return confirm("缺少组件：" + content);
		}
	}

	/**
	 * 提示
	 */
	$.tips = function(content, follow, options) {
		if (layer) {
			if (options.tips) {
				if (!$.isArray(options.tips)) {
					options.tips = [options.tips, '#FF8800'];
				}
			} else {
				options.tips = [2, '#FF8800'];
			}
			return layer.tips(content, follow, options);
		} else {
			return alert("缺少组件");
		}
	};

	/**
	 * 改变标题
	 */
	$.title = function(title, index) {
		if (layer) {
			layer.title(title, index);
		}
	};

	function loopWindows(win, callback) {
		if (win) {
			if (callback(win) == true) {
				if (win.parent !== win) {
					return loopWindows(win.parent, callback);
				}
			}
		}
		return true;
	}

	/**
	 * 加载
	 */
	$.loading = {
		// 开始加载
		start: function() {
			// var result = loopWindows(window, function(win) {
			// if (win.loading && $.isFunction(win.loading.start)) {
			// win.loading.start();
			// return false;
			// }
			// return true;
			// });

			if ($("meta[name='frontend-mobile']").length > 0 && $("meta[name='frontend-mobile']").attr('content') == 'yes') {
				layer.load(2, {
					shade: [0.2, '#FFFFFF']
				});
			} else {
				layer.load(0, {
					shade: [0.2, '#F3F3F3']
				});
			}
		},
		// 停止加载
		stop: function() {
			// var result = loopWindows(window, function(win) {
			// if (win.loading && $.isFunction(win.loading.stop)) {
			// win.loading.stop();
			// return false;
			// }
			// return true;
			// });
			// if (!result) {
			layer.closeAll("loading");
			// }
		}
	};

	$.prompt = function(options, yes) {
		if (layer) {

			if ($.isFunction(options)) {
				yes = options;
				options = {};
			}

			layer.ready(function() {
				layer.prompt(options, function(value, index, element) {
					if ($.isFunction(yes) && yes.call(layer, value, index, element)) {
						layer.close(index);
					}
				});
			});
		} else {
			return alert("缺少组件");
		}
	}

	$.tabDialog = function(options) {
		if (layer) {
			layer.ready(function() {
				layer.tab(options);
			});
		}
	}

	var lastUuid = 0;

	$.uuid = function() {
		return (new Date()).getTime() * 1000 + (lastUuid++) % 1000;
	}

	$.word_limit = function(words, length, suffix) {
		if (words) {
			if (words.length > length) {
				words = words.substring(0, length);

				if (suffix) {
					words = words + suffix;
				}
			}
		}
		return words;
	}

	String.prototype.startWith = function(str) {
		var reg = new RegExp("^" + str);
		return reg.test(this);
	}

	String.prototype.endWith = function(str) {
		var reg = new RegExp(str + "$");
		return reg.test(this);
	}

	$.fn.reverse = function() {
		return $($.makeArray(this).reverse());
	}

	// 合并赋值
	function mergeSetValue(object, name, value, merge) {
		// 相同的name不进行替换，而是进行合并，合并成为一个数组
		if (merge == false) {
			object[name] = value;
		} else {
			// 相同的name不进行替换，而是进行合并，合并成为一个数组
			if (object[name]) {
				if ($.isArray(object[name])) {
					object[name].push(value);
				} else {
					object[name] = [object[name], value];
				}
			} else {
				object[name] = value;
			}
		}
	}

	// 解析变量
	function resolveVarName(object, name, value, merge) {
		// 识别是否符合格式：A[A][]、A[A]、A[A][A]、A[]
		// 不符合则当成字符串，符合则解析成对象
		if (new RegExp("^[a-zA-Z_][a-zA-Z0-9_]+(\\[\\])?((\\[[a-zA-Z0-9_]+\\]))*(\\[\\])?$").test(name)) {
			// 识别出[A]部分
			var subNames = name.match(new RegExp("\\[[a-zA-Z0-9_]+\\]", "g"));

			// 如果不包含“[”则直接赋值返回
			if (name.indexOf("[") < 0) {
				// 相同的name不进行替换，而是进行合并，合并成为一个数组
				mergeSetValue(object, name, value, merge);
				return object;
			}

			// 识别出变量名
			var var_name = name.substring(0, name.indexOf("["));

			if (object[var_name] == undefined) {
				object[var_name] = {};
			}

			// 设置临时变量
			var temp = object[var_name];

			for (i in subNames) {

				// 非数字跳过，否则IE8下会有错误
				if (isNaN(i)) {
					continue;
				}

				var subName = subNames[i];

				subName = subName.substring(1, subName.length - 1);

				if (i == subNames.length - 1) {
					// 如果是以[]结尾则代表为数组
					if (new RegExp("\\[\\]$").test(name)) {
						if ($.isArray(temp[subName]) == false) {
							temp[subName] = [];
						}
						temp[subName].push(value);
					} else {
						if (temp[subName] == undefined) {
							temp[subName] = {};
						}
						// 相同的name不进行替换，而是进行合并，合并成为一个数组
						mergeSetValue(temp, subName, value, merge);
					}

				} else {
					if (temp[subName] == undefined) {
						temp[subName] = {};
					}
				}
				temp = temp[subName];
			}

			if (subNames == null || subNames.length == 0) {
				// 如果是以[]结尾则代表为数组
				if (new RegExp("\\[\\]$").test(name)) {
					if ($.isArray(object[var_name]) == false) {
						object[var_name] = [];
					}
					object[var_name].push(value);
				} else {
					if (object[var_name] == undefined) {
						object[var_name] = {};
					}
					// 相同的name不进行替换，而是进行合并，合并成为一个数组
					mergeSetValue(object, var_name, value, merge);
				}
			}

			return object;
		} else {
			// 相同的name不进行替换，而是进行合并，合并成为一个数组
			mergeSetValue(object, name, value, merge);
			return object;
		}
	}

	/**
	 * 将表单序列号为JSON对象
	 * 
	 * @param merge
	 *            相同name的元素是否进行合并，默认不进行合并，true-进行合并 false-不进行合并
	 */
	$.fn.serializeJson = function(merge) {

		if (merge == undefined || merge == null) {
			merge = false;
		}

		var serializeObj = {};
		var array = [];

		// 判断当前元素是否为input元素
		if ($(this).is(":input")) {
			array = $(this).serializeArray();
		} else {
			array = $(this).find(":input").serializeArray();
		}

		$(array).each(function() {
			resolveVarName(serializeObj, this.name, this.value, merge);
		});
		return serializeObj;
	};

	// ---------------------------------------------------------------------------------------------------

	/**
	 * @return string|undefined the CSRF parameter name. Undefined is returned
	 *         if CSRF validation is not enabled.
	 */
	$.getCsrfParam = function() {
		return $('meta[name=csrf-param]').attr('content');
	}

	/**
	 * @return string|undefined the CSRF token. Undefined is returned if CSRF
	 *         validation is not enabled.
	 */
	$.getCsrfToken = function() {
		return $('meta[name=csrf-token]').attr('content');
	}

	/**
	 * 重写post提交，自动补充csrf参数
	 */
	var _post = $.post;
	$.post = function(url, data, callback, type) {
		// 绑定csrf参数
		if (data && data[$.getCsrfParam()] == undefined) {
			data[$.getCsrfParam()] = $.getCsrfToken();
		}

		if (type == undefined) {
			type = "string";
		}

		return _post(url, data, callback, type);
	};

	// 备份jquery的ajax方法
	var _ajax = $.ajax;

	// 重写jquery的ajax方法
	$.ajax = function(opt) {
		// 备份opt中error和success方法
		var fn = {
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				if (XMLHttpRequest.status != 0) {
					try {
						var result = $.parseJSON($.trim(XMLHttpRequest.responseText));
						if (result && result.message) {
							$.msg(result.message);
						}
					} catch (e) {
						console.info(e);
						alert("失败" + XMLHttpRequest.status);
					}
				}
			},
			success: function(data, textStatus) {
			}
		}
		if (opt.error) {
			fn.error = opt.error;
		}
		if (opt.success) {
			fn.success = opt.success;
		}
		// 扩展增强处理
		var _opt = $.extend(opt, {
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				// 错误方法增强处理
				fn.error(XMLHttpRequest, textStatus, errorThrown);
			},
			success: function(data, textStatus) {
				if (data && data.code == 99 && $.login && $.isFunction($.login.show)) {
					// 打开登录窗口
					$.login.show(function() {
						$.ajax(opt);
					});
				} else {
					// 成功回调方法增强处理
					fn.success(data, textStatus);
				}
			}
		});

		if (opt.data == undefined) {
			opt.data = {};
		}

		if (opt.type == undefined) {
			opt.type = "GET";
		}

		var type = opt.type.toLowerCase();

		// 绑定csrf参数
		if (type == 'post' && opt.data[$.getCsrfParam()] == undefined) {
			opt.data[$.getCsrfParam()] = $.getCsrfToken();
		}

		if (type == undefined) {
			type = "string";
		}

		return _ajax(_opt).always(function() {
			$.loading.stop();
		});
	};

	/**
	 * Sets the CSRF token in the meta elements. This method is provided so that
	 * you can update the CSRF token with the latest one you obtain from the
	 * server.
	 * 
	 * @param name
	 *            the CSRF token name
	 * @param value
	 *            the CSRF token value
	 */
	$.setCsrfToken = function(name, value) {
		$('meta[name=csrf-param]').attr('content', name);
		$('meta[name=csrf-token]').attr('content', value)
	}

	/**
	 * Updates all form CSRF input fields with the latest CSRF token. This
	 * method is provided to avoid cached forms containing outdated CSRF tokens.
	 */
	$.refreshCsrfToken = function() {
		var token = $.getCsrfToken();
		if (token) {
			$('form input[name="' + $.getCsrfParam() + '"]').val(token);
		}
	}

	var clickableSelector = 'a, button, input[type="submit"], input[type="button"], input[type="reset"], input[type="image"]';
	var changeableSelector = 'select, input, textarea';

	function initDataMethods() {
		var handler = function(event) {
			var $this = $(this), method = $this.data('method'), message = $this.data('confirm');

			if (method === undefined && message === undefined) {
				return true;
			}

			if (message !== undefined) {
				$.confirm(message, {}, function() {
					handleAction($this);
				});
			} else {
				handleAction($this);
			}
			event.stopImmediatePropagation();
			return false;
		};
		// handle data-confirm and data-method for clickable and changeable
		// elements
		$(document).on('click', clickableSelector, handler).on('change', changeableSelector, handler);
	}

	function handleAction(obj) {
		var method = $(obj).data('method'), $form = $(obj).closest('form'), action = obj.attr('href'), params = obj.data('params');

		if (method === undefined) {
			if (action && action != '#') {
				window.location = action;
			} else if ($(obj).is(':submit') && $form.length) {
				$form.trigger('submit');
			}
			return;
		}

		var newForm = !$form.length;
		if (newForm) {
			if (!action) {
				action = window.location.href;
			}
			$form = $('<form method="' + method + '"></form>');
			$form.attr('action', action);
			var target = $(obj).attr('target');
			if (target) {
				$form.attr('target', target);
			}
			if (!method.match(/(get|post)/i)) {
				$form.append('<input name="_method" value="' + method + '" type="hidden">');
				method = 'POST';
			}
			if (!method.match(/(get|head|options)/i)) {
				var csrfParam = $.getCsrfParam();
				if (csrfParam) {
					$form.append('<input name="' + csrfParam + '" value="' + $.getCsrfToken() + '" type="hidden">');
				}
			}
			$form.hide().appendTo('body');
		}

		var activeFormData = $form.data('yiiActiveForm');
		if (activeFormData) {
			// remember who triggers the form submission. This is used by
			// yii.activeForm.js
			activeFormData.submitObject = $(obj);
		}

		// temporarily add hidden inputs according to data-params
		if (params && $.isPlainObject(params)) {
			$.each(params, function(idx, obj) {
				$form.append('<input name="' + idx + '" value="' + $(obj) + '" type="hidden">');
			});
		}

		var oldMethod = $form.attr('method');
		$form.attr('method', method);
		var oldAction = null;
		if (action && action != '#') {
			oldAction = $form.attr('action');
			$form.attr('action', action);
		}

		$form.trigger('submit');

		if (oldAction != null) {
			$form.attr('action', oldAction);
		}
		$form.attr('method', oldMethod);

		// remove the temporarily added hidden inputs
		if (params && $.isPlainObject(params)) {
			$.each(params, function(idx, obj) {
				$('input[name="' + idx + '"]', $form).remove();
			});
		}

		if (newForm) {
			$form.remove();
		}
	}

	$().ready(function() {
		initDataMethods();
	});

	// 记录当前滚动条位置
	$.fixedScorll = {
		write: function(key, element) {

			if (!key) {
				alert("固定滚动条必须输入一个COOKIE名称");
				return;
			}

			var scrollPos;
			if (typeof window.pageYOffset != 'undefined') {
				scrollPos = window.pageYOffset;
			} else if (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
				scrollPos = document.documentElement.scrollTop;
			} else if (typeof document.body != 'undefined') {
				scrollPos = document.body.scrollTop;
			}
			// 存储滚动条位置到cookies中
			document.cookie = "SZY_GOODS_SCROLLTOP=" + scrollPos;
		},
		read: function(key, clear) {
			if (!key) {
				alert("固定滚动条必须输入一个COOKIE名称");
				return;
			}
			// cookies中不为空，则读取滚动条位置
			var arr = document.cookie.match(/SZY_GOODS_SCROLLTOP=([^;]+)(;|$)/);
			if (arr) {
				document.documentElement.scrollTop = parseInt(arr[1]);
				document.body.scrollTop = parseInt(arr[1]);
			}
			if (clear != false) {
				// 读完Cookie就立即删除掉
				document.cookie = "SZY_GOODS_SCROLLTOP=0";
			}

		}
	};

	// 如果登录模块已存在则不覆盖
	if ($.login == undefined) {
		// 登录模块
		$.login = {
			// 打开登录对话框
			show: function(params, callback) {

				$.loading.start();

				var data = {};

				if ($.isFunction(params)) {
					callback = params;
					params = {};
				}

				if (params) {
					data = $.extend(true, data, params);
				}

				if ($.isFunction(callback)) {
					$.login.success = callback;
				}

				$.open({
					id: "SZY_LOGIN_LAYER_DIALOG",
					type: 1,
					title: '您尚未登录',
					ajax: {
						url: '/login.html',
						data: data,
						success: function(result) {
							$("body").append(result.data);
						}
					}
				}).done(function() {
					$.loading.stop();
				});
			},
			// 关闭登录对话框
			// @param boolean destroy 是否销毁登录窗口
			close: function(destroy) {
				var index = $("#SZY_LOGIN_LAYER_DIALOG").parents(".layui-layer").attr("times");
				$.closeDialog(index);
			},
			// 登录成功处理函数
			success: function() {
				$.go(window.location.href);
			}
		};
	}

	/**
	 * 跳转页面
	 * 
	 * @param url
	 *            跳转的链接，为空则刷新当前页面
	 */
	$.go = function(url, target) {

		if (url == undefined) {
			url = window.location.href;
		}

		// 开启缓载效果
		$.loading.start();

		var id = $.uuid();
		var element = $("<a id='" + id + "' style='display: none;'></a>");
		$(element).attr("href", url);
		if (target) {
			$(element).attr("target", target);
			// 停止缓载效果
			$.loading.stop();
		}
		$("body").append(element);
		document.getElementById(id).click();
	};

})(jQuery);

(function($) {
	/**
	 * 求集合的笛卡尔之积
	 * 
	 * @param list
	 *            必须为数组，否则返回空数组
	 * @return 结果集
	 */
	$.toDkezj = function(list) {

		if ($.isArray(list) == false || list.length == 0) {
			return [];
		}

		if (list.length == 1) {

			var temp_list = [];

			for (var i = 0; i < list[0].length; i++) {
				temp_list.push([list[0][i]]);
			}

			return temp_list;
		}

		var result = new Array();// 结果保存到这个数组
		function dkezj(index, temp_result) {
			if (index >= list.length) {
				result.push(temp_result);
				return;
			}
			var temp_array = list[index];
			if (!temp_result) {
				temp_result = new Array();
			}
			for (var i = 0; i < temp_array.length; i++) {
				var cur_result = temp_result.slice(0, temp_result.length);
				cur_result.push(temp_array[i]);
				dkezj(index + 1, cur_result);
			}
		}

		dkezj(0);

		return result;
	};

	/**
	 * 求数组内的全排序
	 */
	$.toPermute = function(input) {
		var permArr = [], usedChars = [];
		function main(input) {
			var i, ch;
			for (i = 0; i < input.length; i++) {
				ch = input.splice(i, 1)[0];
				usedChars.push(ch);
				if (input.length == 0) {
					permArr.push(usedChars.slice());
				}
				main(input);
				input.splice(i, 0, ch);
				usedChars.pop();
			}
			return permArr
		}
		return main(input);
	};
})(jQuery);

(function($) {
	/**
	 * jQuery.toJSON Converts the given argument into a JSON representation.
	 * 
	 * @param o
	 *            {Mixed} The json-serializable *thing* to be converted
	 * 
	 * If an object has a toJSON prototype, that will be used to get the
	 * representation. Non-integer/string keys are skipped in the object, as are
	 * keys that point to a function.
	 * 
	 */
	$.toJSON = typeof JSON === 'object' && JSON.stringify ? JSON.stringify : function(o) {
		if (o === null) {
			return 'null';
		}

		var pairs, k, name, val, type = $.type(o);

		if (type === 'undefined') {
			return undefined;
		}

		// Also covers instantiated Number and Boolean objects,
		// which are typeof 'object' but thanks to $.type, we
		// catch them here. I don't know whether it is right
		// or wrong that instantiated primitives are not
		// exported to JSON as an {"object":..}.
		// We choose this path because that's what the browsers did.
		if (type === 'number' || type === 'boolean') {
			return String(o);
		}
		if (type === 'string') {
			return $.quoteString(o);
		}
		if (typeof o.toJSON === 'function') {
			return $.toJSON(o.toJSON());
		}
		if (type === 'date') {
			var month = o.getUTCMonth() + 1, day = o.getUTCDate(), year = o.getUTCFullYear(), hours = o.getUTCHours(), minutes = o.getUTCMinutes(), seconds = o.getUTCSeconds(), milli = o.getUTCMilliseconds();

			if (month < 10) {
				month = '0' + month;
			}
			if (day < 10) {
				day = '0' + day;
			}
			if (hours < 10) {
				hours = '0' + hours;
			}
			if (minutes < 10) {
				minutes = '0' + minutes;
			}
			if (seconds < 10) {
				seconds = '0' + seconds;
			}
			if (milli < 100) {
				milli = '0' + milli;
			}
			if (milli < 10) {
				milli = '0' + milli;
			}
			return '"' + year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + '.' + milli + 'Z"';
		}

		pairs = [];

		if ($.isArray(o)) {
			for (k = 0; k < o.length; k++) {
				pairs.push($.toJSON(o[k]) || 'null');
			}
			return '[' + pairs.join(',') + ']';
		}

		// Any other object (plain object, RegExp, ..)
		// Need to do typeof instead of $.type, because we also
		// want to catch non-plain objects.
		if (typeof o === 'object') {
			for (k in o) {
				// Only include own properties,
				// Filter out inherited prototypes
				if (hasOwn.call(o, k)) {
					// Keys must be numerical or string. Skip others
					type = typeof k;
					if (type === 'number') {
						name = '"' + k + '"';
					} else if (type === 'string') {
						name = $.quoteString(k);
					} else {
						continue;
					}
					type = typeof o[k];

					// Invalid values like these return undefined
					// from toJSON, however those object members
					// shouldn't be included in the JSON string at all.
					if (type !== 'function' && type !== 'undefined') {
						val = $.toJSON(o[k]);
						pairs.push(name + ':' + val);
					}
				}
			}
			return '{' + pairs.join(',') + '}';
		}
	};
})(jQuery);
