/**
 * AJAX后台、卖家中心公共组件
 * 
 * ============================================================================ 版权所有 2008-2015 秦皇岛商之翼网络科技有限公司，并保留所有权利。 ============================================================================
 * 
 * @author: niqingyang
 * @version 1.0
 * @date 2015-11-19
 * @link http://www.68ecshop.com
 */

(function($) {

	var lastUuid = 0;

	function uuid() {
		return (new Date()).getTime() * 1000 + (lastUuid++) % 1000;
	}

	function format_size(size) {
		var units = ['字节', 'KB', 'MB', 'GB', 'TB'];

		size = new Number(size);

		for (var i = 0; size >= 1024 && i < 4; i++) {
			size /= 1024;
		}

		size = size.toFixed(2);
		unit = units[i];

		return size + unit;
	}

	$.upload = {
		defaults: {

		},
		setDefaults: function(settings) {
			this.defaults = $.extend(this.defaults, settings);
		}
	};

	var deferredArray = function() {
		var array = [];
		array.add = function(callback) {
			this.push(new $.Deferred(callback));
		};
		return array;
	};

	$.validateFiles = function(files, options, deferreds) {

		if (!deferreds) {
			deferreds = deferredArray();
		}

		if (!files || !options) {
			return deferreds;
		}

		options = $.extend(true, {
			message: '请上传一个文件。',
			uploadRequired: '文件上传失败。',
			tooMany: '您最多上传{limit}个文件。',
			tooBig: '文件"{file}"太大。它的大小不能超过{limit}。',
			tooSmall: '该文件"{file}"太小。它的大小不得小于{limit}。',
			wrongExtension: '只允许使用以下文件扩展名的文件：{extensions}。',
			wrongMimeType: '只允许上传以下MIME类型的文件：{mimeTypes}。',
		}, options);

		if (options.maxFiles && options.maxFiles < files.length) {
			var message = options.tooMany.replace(/\{limit\}/g, options.maxFiles);
			var def = $.Deferred();
			def.resolve(false, message);
			deferreds.push(def);
		} else {
			$.each(files, function(i, file) {

				var def = $.Deferred();

				if (options.extensions && options.extensions.length > 0) {
					var index, ext;

					index = file.name.lastIndexOf('.');

					if (!~index) {
						ext = '';
					} else {
						ext = file.name.substr(index + 1, file.name.length).toLowerCase();
					}

					if (!~options.extensions.indexOf(ext)) {
						var message = options.wrongExtension.replace(/\{file\}/g, file.name);
						message = message.replace(/\{extensions\}/g, options.extensions);
						def.resolve(false, message);
						deferreds.push(def);
						return false;
					}
				}

				if (options.mimeTypes && options.mimeTypes.length > 0) {
					if (!~options.mimeTypes.indexOf(file.type)) {
						var message = options.wrongMimeType.replace(/\{file\}/g, file.name);
						message = message.replace(/\{mimeTypes\}/g, options.mimeTypes);
						def.resolve(false, message);
						deferreds.push(def);
						return false;
					}
				}

				if (options.maxSize && options.maxSize < file.size) {
					var message = options.tooBig.replace(/\{file\}/g, file.name);
					message = message.replace(/\{limit\}/g, format_size(options.maxSize));
					def.resolve(false, message);
					deferreds.push(def);
					return false;
				}

				if (options.minSize && options.minSize > file.size) {
					var message = options.tooSmall.replace(/\{file\}/g, file.name);
					message = message.replace(/\{limit\}/g, format_size(options.minSize));
					def.resolve(false, message);
					deferreds.push(def);
					return false;
				}
				
				// 成功
				def.resolve(true, null);

				return true;
			});
		}

		return deferreds;
	};

	$.validateImages = function(files, options, deferreds) {

		if (!deferreds) {
			deferreds = deferredArray();
		}

		if (!files || !options) {
			return deferreds;
		}

		options = $.extend(true, {
			message: '图片上传失败。',
			uploadRequired: '请上传一张图片。',
			notImage: '文件 "{file}" 不是一个图像文件。',
			underWidth: '图像"{file}"太小。他的宽度不得小于{limit}像素。',
			overWidth: '图像"{file}"太大。他的宽度不得超过{limit}像素。',
			underHeight: '图像"{file}"太小。他的高度不得小于{limit}像素。',
			overHeight: '图像"{file}"太大。他的高度不得超过{limit}像素。',
		}, options);

		// 验证文件
		deferreds = $.validateFiles(files, options, deferreds);

		if (deferreds.length == 0) {
			// 验证图片
			$.each(files, function(i, file) {
				// Skip image validation if FileReader API is not available
				if (typeof FileReader === "undefined") {
					return true;
				}

				var def = $.Deferred(), fr = new FileReader(), img = new Image();

				img.onload = function() {
					if (options.minWidth && this.width < options.minWidth) {
						var message = options.underWidth.replace(/\{file\}/g, file.name);
						message = message.replace(/\{limit\}/g, options.minWidth);
						def.resolve(false, message);
						return;
					}

					if (options.maxWidth && this.width > options.maxWidth) {
						var message = options.overWidth.replace(/\{file\}/g, file.name);
						message = message.replace(/\{limit\}/g, options.maxWidth);
						def.resolve(false, message);
						return;
					}

					if (options.minHeight && this.height < options.minHeight) {
						var message = options.underHeight.replace(/\{file\}/g, file.name);
						message = message.replace(/\{limit\}/g, options.minHeight);
						def.resolve(false, message);
						return;
					}

					if (options.maxHeight && this.height > options.maxHeight) {
						var message = options.overHeight.replace(/\{file\}/g, file.name);
						message = message.replace(/\{limit\}/g, options.maxHeight);
						def.resolve(false, message);
						return;
					}
					// 成功
					def.resolve(true, null);
				};

				img.onerror = function() {
					var message = options.notImage.replace(/\{file\}/g, file.name);
					def.resolve(false, message);
				};

				fr.onload = function() {
					img.src = fr.result;
				};

				// Resolve deferred if there was error while reading data
				fr.onerror = function() {
					def.resolve(false, options.message);
				};

				fr.readAsDataURL(file);

				deferreds.push(def);

			});
		}

		return deferreds;
	}

	$.validateVideos = function(files, options, deferreds) {

		if (!deferreds) {
			deferreds = deferredArray();
		}

		if (!files || !options) {
			return deferreds;
		}

		options = $.extend(true, {
			message: '视频上传失败。',
			uploadRequired: '请上传一个视频。',
			notVideo: '文件 "{file}" 不是一个视频文件。',
			underWidth: '视频"{file}"太小。他的宽度不得小于{limit}像素。',
			overWidth: '视频"{file}"太大。他的宽度不得超过{limit}像素。',
			underHeight: '视频"{file}"太小。他的高度不得小于{limit}像素。',
			overHeight: '视频"{file}"太大。他的高度不得超过{limit}像素。',
			underDuration: '视频"{file}"时间太短。他的时长不得小于{limit}秒。',
			overDuration: '视频"{file}"时间太长。他的时长不得超过{limit}秒。',
			invalidRatio: '视频"{file}"显示比例无效。他的显示比例必须为“{limit}”。',
		}, options);

		// 验证文件
		deferreds = $.validateFiles(files, options, deferreds);

		if (deferreds.length == 0) {
			// 验证图片
			$.each(files, function(i, file) {
				// Skip image validation if FileReader API is not available
				if (typeof FileReader === "undefined") {
					return true;
				}

				var def = $.Deferred(), video = document.createElement("VIDEO");

				var windowURL = window.URL || window.webkitURL;

				var url = windowURL.createObjectURL(file);

				video.src = url;

				$(video).on("loadedmetadata", function() {

					windowURL.revokeObjectURL(url);

					if (options.minDuration && this.duration < options.minDuration) {
						var message = options.underDuration.replace(/\{file\}/g, file.name);
						message = message.replace(/\{limit\}/g, options.minDuration);
						def.resolve(false, message);
						return;
					}

					if (options.maxDuration && this.duration > options.maxDuration) {
						var message = options.overDuration.replace(/\{file\}/g, file.name);
						message = message.replace(/\{limit\}/g, options.maxDuration);
						def.resolve(false, message);
						return;
					}

					if (options.minWidth && this.videoWidth < options.minWidth) {
						var message = options.underWidth.replace(/\{file\}/g, file.name);
						message = message.replace(/\{limit\}/g, options.minWidth);
						def.resolve(false, message);
						return;
					}

					if (options.maxWidth && this.videoWidth > options.maxWidth) {
						var message = options.overWidth.replace(/\{file\}/g, file.name);
						message = message.replace(/\{limit\}/g, options.maxWidth);
						def.resolve(false, message);
						return;
					}

					if (options.minHeight && this.videoHeight < options.minHeight) {
						var message = options.underHeight.replace(/\{file\}/g, file.name);
						message = message.replace(/\{limit\}/g, options.minHeight);
						def.resolve(false, message);
						return;
					}

					if (options.maxHeight && this.videoHeight > options.maxHeight) {
						var message = options.overHeight.replace(/\{file\}/g, file.name);
						message = message.replace(/\{limit\}/g, options.maxHeight);
						def.resolve(false, message);
						return;
					}
					
					if(options.ratio){
						
						if ($.isArray(options.ratio) == false) {
							options.ratio = [options.ratio];
						}
	
						function maxDivisor(m, n) {
							m = parseInt(m);
							n = parseInt(n);
	
							if (m == 0 && n == 0) {
								return false;
							}
							var min = Math.min(m, n);
							while (min >= 1) {
								if (m % min == 0) {
									if (n % min == 0) {
										return min;
									}
								}
								min -= 1;
							}
							return min;
						}
						
						// 计算显示比例
						var divisor = maxDivisor(this.videoWidth, this.videoHeight);
						var ratio = (this.videoWidth / divisor) + ":" + (this.videoHeight / divisor);
	
						if (options.ratio && $.inArray(ratio, options.ratio) == -1) {
							var message = options.invalidRatio.replace(/\{file\}/g, file.name);
							message = message.replace(/\{limit\}/g, options.ratio.join("、"));
							def.resolve(false, message);
							return;
						}
					
					}

					// 成功
					def.resolve(true, null);
				});

				$(video).on("error", function() {
					var message = options.notVideo.replace(/\{file\}/g, file.name);
					def.resolve(false, message);
				});

				deferreds.push(def);

			});
		}

		return deferreds;
	}

	/**
	 * 文件上传
	 * 
	 * @author niqingyang <niqy@qq.com>
	 */
	$.fileupload = function(settings) {

		var defaults = {
			url: '/site/upload-file.html',
			file: null,
			// 允许上传的文件类型
			accept: "*",
			// 文件类型，支持：*,image,video
			type: "*",
			// 是否允许上传多个文件
			multiple: false,
			// 验证规则
			options: null,
			// 提交的数据
			data: {},
			// 上传后的回调函数
			// @params result 返回的数据
			callback: null,
			// 验证文件
			// @param files 文件列表
			// @param options 验证参数
			// @return deferreds
			validateFiles: function(files, options) {
				return $.validateFiles(files, options);
			}
		};

		settings = $.extend(true, defaults, settings);

		if (settings.options) {
			if ($.isPlainObject(settings.options)) {

				if (settings.options.extensions) {

					var extensions = [];

					if (typeof settings.options.extensions == 'string') {
						extensions = settings.options.extensions.split(",");
					}

					for (var i = 0; i < extensions.length; i++) {
						if (settings.type == "image") {
							accept += "image/" + extensions[i] + ",";
						} else if (settings.type == "video") {
							accept += "video/" + extensions[i] + ",";
						} else {
							accept += "*." + extensions[i] + ",";
						}

					}
				}

				settings.data.options = settings.options;
				settings.data.options = $.toJSON(settings.data.options);
			} else {
				console.error("fileupload的opions必须为一个JS对象！");
			}
		}

		var fileElementId = "ajaxFileUpload_file_" + new Date().getTime();

		if (settings.file == null) {

			var element = null;

			if (settings.multiple == true) {
				element = $("<div style='display: none;'><input type='file' id='" + fileElementId + "' name='" + fileElementId + "[]' multiple='multiple' accept='" + settings.accept + "'/></div>");
			} else {
				element = $("<div style='display: none;'><input type='file' id='" + fileElementId + "' name='" + fileElementId + "' accept='" + settings.accept + "'/></div>");
			}

			$("body").append(element);
			$(element).find("#" + fileElementId).click();
		} else {
			if ($(settings.file).attr("id")) {
				$(settings.file).attr("id", fileElementId);
			} else {
				fileElementId = $(settings.file).attr("id");
			}
		}

		$("body").on("change", "#" + fileElementId, function() {
			var files = this.files;
			var options = settings.options;

			// 验证上传文件
			var deferreds = settings.validateFiles(files, options);

			$.when.apply(this, deferreds).always(function(valid, message) {

				var list = null;

				if (arguments.length == 0) {
					list = [];
					list.push([true, null]);
				} else if (deferreds.length == 1) {
					list = [];
					list.push([valid, message]);
				} else {
					list = arguments;
				}

				$.each(list, function(i, object) {
					if (object) {
						valid = object[0];
						message = object[1];
						if (!valid) {
							return false;
						}
					}
				});

				if (valid) {
					// 加载
					$.loading.start();
					// 上传文件
					$.ajaxFileUpload({
						url: settings.url,
						fileElementId: fileElementId,
						dataType: 'json',
						data: settings.data,
						success: function(result, status) {
							if (settings.file == null) {
								$(element).remove();
							}
							if ($.isFunction(settings.callback)) {
								settings.callback.call(settings, result);
							}
						}
					}).always(function() {
						// 停止加载
						$.loading.stop();
					});
				} else {
					// 抛出错误
					if ($.isFunction(settings.callback)) {
						settings.callback.call(settings, {
							code: "-1",
							data: null,
							message: message
						});
					}
				}
			});

		});
	};

	/**
	 * 图片上传
	 * 
	 * @author niqingyang <niqy@qq.com>
	 */
	$.imageupload = function(settings) {
		var defaults = {
			url: '/site/upload-image',
			file: null,
			// 允许上传的文件类型
			accept: "image/jpg,image/jpeg,image/png,image/gif",
			// 文件类型，支持：*,image,video
			type: "image",
			// 是否允许上传多个图片
			multiple: false,
			// 验证规则
			options: null,
			// 提交的数据
			data: {},
			// 上传后的回调函数
			// @params result 返回的数据
			callback: null,
			// 验证文件
			// @param files 文件列表
			// @param options 验证参数
			// @return deferreds
			validateFiles: function(files, options) {
				return $.validateImages(files, options);
			}
		};

		settings = $.extend(true, defaults, settings);

		$.fileupload(settings);
	};

	/**
	 * 视频上传
	 * 
	 * @author niqingyang <niqy@qq.com>
	 */
	$.videoupload = function(settings) {
		var defaults = {
			url: '/site/upload-video.html',
			file: null,
			// 允许上传的文件类型
			accept: "video/mp4,video/webm,video/ogg",
			// 文件类型，支持：*,image,video
			type: "image",
			// 是否允许上传多个图片
			multiple: false,
			// 验证规则
			options: null,
			// 提交的数据
			data: {},
			// 上传后的回调函数
			// @params result 返回的数据
			callback: null,
			// 验证文件
			// @param files 文件列表
			// @param options 验证参数
			// @return deferreds
			validateFiles: function(files, options) {
				return $.validateVideos(files, options);
			}
		};

		settings = $.extend(true, defaults, settings);

		$.fileupload(settings);
	};

	// 手机端上传图片 不能兼容iphone 次方法废弃掉 手机上传请使用 localResizeIMG
	$.mobileimageupload = function(settings) {
		var defaults = {
			url: "/site/upload-image",
			file: null,
			// 提交的数据
			data: {},
			// 上传后的回调函数
			// @params result 返回的数据
			callback: null,
			width: 400,
			quality: 1,
		};

		settings = $.extend(true, defaults, settings);

		var fileElementId = "ajaxFileUpload_file_" + new Date().getTime();

		if (settings.file == null) {
			// var element = $("<div style='display: none;'><input type='file' id='" + fileElementId + "' name='" + fileElementId + "' accept='image/*' capture='camera'/></div>");
			var element = $("<div style='display: none;'><input type='file' id='" + fileElementId + "' name='" + fileElementId + "' accept='image/*'/></div>");
			$("body").append(element);

			$("#" + fileElementId).localResizeIMG({
				width: settings.width,
				quality: settings.quality,
				success: function(result) {
					var submitData = {
						img_base64: result.clearBase64,
					};
					$.ajax({
						type: "POST",
						url: settings.url,
						data: submitData,
						dataType: "json",
						// 图片上传效果
						beforeSend: function() {
							$.loading.start();
						},
						success: function(result) {
							if ($.isFunction(settings.callback)) {
								settings.callback.call(settings, result);
								$.loading.stop();
							}
						},
						complete: function(XMLHttpRequest, textStatus) {
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) { // 上传失败
							$.msg(XMLHttpRequest.status);
							$.msg(XMLHttpRequest.readyState);
							$.msg(textStatus);
						}
					});
				},
			});

			$(element).find("#" + fileElementId).click();
		} else {
			if ($(settings.file).attr("id")) {
				$(settings.file).attr("id", fileElementId);
			} else {
				fileElementId = $(settings.file).attr("id");
			}
		}
	};

	// 手机端上传图片_localResizeIMG4
	$.localResizeIMG = function(settings) {
		var defaults = {
			url: "/site/upload-image",
			file: null,
			// 提交的数据
			data: {},
			// 上传后的回调函数
			// @params result 返回的数据
			callback: null,
			width: 400,
			quality: 1,
		};

		settings = $.extend(true, defaults, settings);

		var fileElementId = "ajaxFileUpload_file_" + new Date().getTime();

		if (settings.file == null) {
			// var element = $("<div style='display: none;'><input type='file' id='" + fileElementId + "' name='" + fileElementId + "' accept='image/*' capture='camera'/></div>");
			var element = $("<div style='display: none;'><input type='file' id='" + fileElementId + "' name='" + fileElementId + "' accept='image/*'/></div>");
			$("body").append(element);

			$("#" + fileElementId).change(function() {
				var that = this;
				lrz(that.files[0],{width:settings.width}).then(function(rst) {
					settings.data = {
						img_base64: rst.base64.split(",")[1],
					};
					$.ajax({
						type: "POST",
						url: settings.url,
						data: settings.data,
						dataType: "json",
						// 图片上传效果
						beforeSend: function() {
							$.loading.start();
						},
						success: function(result) {
							if ($.isFunction(settings.callback)) {
								settings.callback.call(settings, result);
								$.loading.stop();
							}
						},
						complete: function(XMLHttpRequest, textStatus) {
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) { // 上传失败
							$.msg(XMLHttpRequest.status);
							$.msg(XMLHttpRequest.readyState);
							$.msg(textStatus);
						}
					});
				});

			});

			$(element).find("#" + fileElementId).click();
		} else {
			if ($(settings.file).attr("id")) {
				$(settings.file).attr("id", fileElementId);
			} else {
				fileElementId = $(settings.file).attr("id");
			}
		}
	};

	/**
	 * 根据分页ID获取图片选择器对象
	 * 
	 * @param page_id
	 *            不为空则获取指定的控件对象，为空则获取全部的控件数组
	 * @return 控件或者undefined
	 * @author niqingyang <niqy@qq.com>
	 */
	$.imagegallerys = function(page_id) {
		if ($("body").data("imagegallerys") && page_id != undefined) {
			return $("body").data("imagegallerys")[page_id];
		}
		return $("body").data("imagegallerys");
	}

	/**
	 * 获取图片空间对象
	 */
	$.imagegallery = function(target) {
		if (target instanceof jQuery) {
			if ($(target).hasClass("szy-imagegallery")) {
				return $(target).data('szy.imagegallery');
			} else if ($(target).parents(".szy-imagegallery").size() > 0) {
				return $(target).parents(".szy-imagegallery").data('szy.imagegallery');
			} else {
				return $(target).data('szy.imagegallery');
			}
		}
		return null;
	}

	/**
	 * 图片空间
	 */
	$.fn.imagegallery = function(settings) {

		var defaults = {
			url: '/site/image-gallery',
			// 图片库展示的容器
			container: null,
			// 点击图片事件函数
			click: null,
			// Ajax提交参数
			data: {
				output: true,
				page: {
					// 分页的Id
					page_id: "ImageGalleryPage_" + uuid(),
					cur_page: 1,
					page_size: 12
				}
			},
			// 是否显示上传按钮
			open_upload: true,
			// 上传的回调函数
			callback: null
		}

		settings.container = $(this).first();
		settings = $.extend(true, defaults, settings);
		settings.data.url = settings.url;
		settings.data.open_upload = settings.open_upload ? 1 : 0;

		var container = $(settings.container);

		$.loading.start();

		$.ajax({
			url: settings.url,
			type: "GET",
			async: true,
			data: settings.data,
			dataType: "json",
			error: function(data) {
				// Ajax请求结束
				is_ajax_loading = false;

				if (top.loading) {
					// 停止显示加载进度条
					top.loading.stop();
				}

				alert("失败" + data.status);
			},
			success: function(result) {

				$.loading.stop();

				if (result.code == 0) {
					$(container).html(result.data);
				} else if (result.message) {

				}
			}
		});

		// 为图片绑定点击事件
		$(container).on("click", ".image-item", function() {
			$(container).find(".list li").removeClass("active");
			settings.click.call(settings, this, $(this).data("path"), $(this).data("url"));
			$(this).parents("li:first").addClass("active");
		});

		// 刷新
		if (!$("body").data("imagegallerys")) {
			$("body").data("imagegallerys", {});
		}
		
		var data = $("body").data("imagegallerys");
		data[settings.data.page.page_id] = this;
		$("body").data("imagegallerys", data);

		$(container).addClass("szy-imagegallery");
		$(container).data("szy.imagegallery", settings);

		return settings;
	}
	
	/**
	 * 根据分页ID获取图片选择器对象
	 * 
	 * @param page_id
	 *            不为空则获取指定的控件对象，为空则获取全部的控件数组
	 * @return 控件或者undefined
	 * @author niqingyang <niqy@qq.com>
	 */
	$.imagegallerys = function(page_id) {
		if ($("body").data("videogallerys") && page_id != undefined) {
			return $("body").data("videogallerys")[page_id];
		}
		return $("body").data("videogallerys");
	}
	
	/**
	 * 获取视频空间对象
	 */
	$.videogallery = function(target) {
		if (target instanceof jQuery) {
			if ($(target).hasClass("szy-videogallery")) {
				return $(target).data('szy.videogallery');
			} else if ($(target).parents(".szy-videogallery").size() > 0) {
				return $(target).parents(".szy-videogallery").data('szy.videogallery');
			} else {
				return $(target).data('szy.videogallery');
			}
		}
		return null;
	}
	
	/**
	 * 视频空间
	 */
	$.fn.videogallery = function(settings) {

		var defaults = {
			url: '/site/video-gallery',
			// 图片库展示的容器
			container: null,
			// 点击图片事件函数
			click: null,
			// Ajax提交参数
			data: {
				output: true,
				page: {
					// 分页的Id
					page_id: "VideoGalleryPage_" + uuid(),
					cur_page: 1,
					page_size: 12
				}
			},
			// 是否显示上传按钮
			open_upload: true,
			// 上传的回调函数
			callback: null
		}

		settings.container = $(this).first();
		settings = $.extend(true, defaults, settings);
		settings.data.url = settings.url;
		settings.data.open_upload = settings.open_upload ? 1 : 0;

		var container = $(settings.container);

		$.loading.start();

		$.ajax({
			url: settings.url,
			type: "GET",
			async: true,
			data: settings.data,
			dataType: "json",
			error: function(data) {
				// Ajax请求结束
				is_ajax_loading = false;

				if (top.loading) {
					// 停止显示加载进度条
					top.loading.stop();
				}

				alert("失败" + data.status);
			},
			success: function(result) {

				$.loading.stop();

				if (result.code == 0) {
					$(container).html(result.data);
				} else if (result.message) {

				}
			}
		});

		// 为图片绑定点击事件
		$(container).on("click", ".image-item", function() {
			$(container).find(".list li").removeClass("active");
			settings.click.call(settings, this, $(this).data("path"), $(this).data("url"));
			$(this).parents("li:first").addClass("active");
		});

		// 刷新
		if (!$("body").data("videogallerys")) {
			$("body").data("videogallerys", {});
		}
		$("body").data("videogallerys")[settings.data.page.page_id] = this;

		$(container).addClass("szy-videogallery");
		$(container).data("szy.videogallery", settings);

		return settings;
	}

	/**
	 * 根据分页ID获取商品选择器对象
	 * 
	 * @param page_id
	 *            不为空则获取指定的控件对象，为空则获取全部的空间数组
	 * @return 控件或者undefined
	 */
	$.goodspickers = function(page_id) {
		if ($("body").data("goodspickers") && page_id != undefined) {
			return $("body").data("goodspickers")[page_id];
		}
		return $("body").data("goodspickers");
	}

	/**
	 * 获取商品选择器对象
	 */
	$.goodspicker = function(target) {
		if (target instanceof jQuery) {
			if ($(target).hasClass("szy-goodspicker")) {
				return $(target).data('szy.goodspicker');
			} else if ($(target).parents(".szy-goodspicker").size() > 0) {
				return $(target).parents(".szy-goodspicker").data('szy.goodspicker');
			} else {
				return $(target).data('szy.goodspicker');
			}
		}
		return null;
	}

	/**
	 * 商品选择器
	 * 
	 * @author niqingyang <niqy@qq.com>
	 */
	$.fn.goodspicker = function(settings) {

		var defaults = {
			url: '/goods/default/picker',
			// 选择器的容器
			container: null,
			// 是否是SKU商品
			is_sku: 1,
			// 选择商品和未选择商品的按钮单击事件
			// @param selected 点击是否选中
			// @param sku 选中的SKU对象或者SPU对象
			// @return 返回false代表
			click: null,
			// 全部取消
			removeAll: null,
			// 组件AJAX加载完成后的回调函数
			callback: null,
			// Ajax提交参数
			data: {
				// 第一次显示

				// 排除的SKU编号
				except_sku_ids: undefined,
				output: true,
				left: 'col-sm-0',
				right: 'col-sm-12',
				page: {
					// 分页ID
					page_id: "GoodsPickerPage_" + uuid(),
					// 默认当前页
					cur_page: 1,
					// 每页显示的记录数
					page_size: 5,
					// 每页显示的下拉列表
					page_size_list: [5, 10, 15, 20]
				},
				// 默认为出售中的商品
				goods_status: 1,
				// 是否为SKU商品
				is_sku: 1,
				// 是否为批发商
				is_supply: 0,
				// 是否显示仓库
				show_store: 1,

			},
			// 被选中的商品、SKU列表<goods_id-sku_id>
			values: [],
			sku_ids: [],
			goods_ids: [],
			// 刷新被选中的数据
			refreshSelectedData: function() {

				var hashSet = [];

				var sku_ids = [];

				var values = [];

				for (key in this.values) {
					var sku_id = this.values[key].sku_id + "";
					var goods_id = this.values[key].goods_id + "";
					if (this.is_sku == 1) {
						values[goods_id + "-" + sku_id] = {
							goods_id: goods_id,
							sku_id: sku_id
						};
					} else {
						values[goods_id] = {
							goods_id: goods_id,
							sku_id: sku_id
						};
					}
				}

				this.values = values;

				for (key in this.values) {
					var value = this.values[key];
					if (value != undefined && hashSet["sku_" + value.sku_id] == undefined) {
						sku_ids.push(value.sku_id);
						hashSet["sku_" + value.sku_id] = true;
					}
				}

				this.sku_ids = sku_ids;

				hashSet = []

				var goods_ids = [];
				for (key in this.values) {
					var value = this.values[key];
					if (value != undefined && hashSet["goods_" + value.goods_id] == undefined) {
						goods_ids.push(value.goods_id);
						hashSet["goods_" + value.goods_id] = true;
					}
				}

				this.goods_ids = goods_ids;

				if (this.is_sku == 1) {
					// 设置被选中的数量
					$(this.container).find(".selected_number").html(this.sku_ids.length);
				} else {
					// 设置被选中的数量
					$(this.container).find(".selected_number").html(this.goods_ids.length);
				}

				$(this.container).addClass("szy-goodspicker");
				$(this.container).data("szy.goodspicker", this);

				// 刷新
				if (!$("body").data("goodspickers")) {
					$("body").data("goodspickers", {});
				}
				$("body").data("goodspickers")[this.data.page.page_id] = this;
			},
			// 取消选择指定的SKU商品
			remove: function(goods_id, sku_id) {

				goods_id = goods_id + "";
				sku_id = sku_id + "";

				// 删除数据
				if (this.is_sku == 1) {
					delete this.values[goods_id + "-" + sku_id];
				} else {
					delete this.values[goods_id];
				}

				// 刷新选择的数据
				this.refreshSelectedData();

				// 渲染页面
				this.render(false, goods_id, sku_id);
			},
			add: function(goods_id, sku_id) {

				goods_id = goods_id + "";
				sku_id = sku_id + "";

				// 添加数据
				if (this.is_sku == 1) {
					this.values[goods_id + "-" + sku_id] = {
						goods_id: goods_id,
						sku_id: sku_id,
					};
				} else {
					this.values[goods_id] = {
						goods_id: goods_id,
						sku_id: sku_id,
					};
				}

				// 刷新选择的数据
				this.refreshSelectedData();

				// 渲染页面
				this.render(true, goods_id, sku_id);

			},
			// 渲染页面
			render: function(selected, goods_id, sku_id) {
				var target = $(this.container).find(".btn-goodspicker[data-sku-id='" + sku_id + "']").filter(".btn-goodspicker[data-goods-id='" + goods_id + "']");

				if (target.size() > 0) {

					var html = null;

					if (selected == true) {
						html = $(container).find("#btn_checked_template").html();
					} else {
						html = $(container).find("#btn_unchecked_template").html();
					}

					var element = $($.parseHTML(html));
					$(element).attr("data-sku-id", sku_id);
					$(element).attr("data-goods-id", goods_id);

					$(target).replaceWith(element);

				}
			}

		}

		settings.container = $(this).first();
		settings = $.extend(true, defaults, settings);
		settings.data.url = settings.url;

		var is_sku = settings.data.is_sku == 1 ? 1 : 0;
		settings.is_sku = is_sku;

		// 刷新数据
		settings.refreshSelectedData();

		// 设置已选择的数据
		if (settings.sku_ids.length > 0) {
			settings.data.sku_ids = settings.sku_ids;
		}
		if (settings.goods_ids.length > 0) {
			settings.data.goods_ids = settings.goods_ids;
		}

		var container = $(settings.container);

		$(container).addClass("szy-goodspicker");
		$(container).data("szy.goodspicker", settings);

		if (!$("body").data("goodspickers")) {
			$("body").data("goodspickers", {});
		}
		$("body").data("goodspickers")[settings.data.page.page_id] = settings;

		$.loading.start();

		$.ajax({
			url: settings.url,
			type: "GET",
			async: true,
			data: settings.data,
			dataType: "json",
			error: function(data) {

				$.loading.stop();

				// Ajax请求结束
				is_ajax_loading = false;

				if (top.loading) {
					// 停止显示加载进度条
					top.loading.stop();
				}

				alert("失败" + data.status);
			},
			success: function(result) {

				$.loading.stop();

				if (result.code == 0) {
					$(container).html(result.data);
				} else if (result.message) {
					if ($.isFunction($.msg)) {
						$.msg(result.message, {
							time: 5000
						});
					} else {
						alert(result.message);
					}
				}

				// 刷新数据
				settings.refreshSelectedData();

				if ($.isFunction(settings.callback)) {
					settings.callback.call(settings);
				}
			}
		});

		// 单击选择、已选择按钮的事件
		$(container).on("click", ".btn-goodspicker", function() {

			// 获取数据
			var sku_id = $(this).data("sku-id");
			var goods_id = $(this).data("goods-id");
			var selected = $(this).data("selected") == true ? false : true;

			// 必须放在这里否则有问题
			var sku = $(this).parents(".sku-item").serializeJson();

			if (selected == true) {
				if (is_sku && sku.sku_open == 1) {

					$.loading.start();

					$.open({
						type: 1,
						title: "选择SKU商品",
						width: "500px",
						ajax: {
							url: "/goods/default/picker.html?sku_picker=1&goods_id=" + goods_id,
						},
						btn: ['确定', '取消'],
						yes: function(index, object) {
							
							var getSkuInfo = $(object).data("getSkuInfo");
							
							var sku = getSkuInfo();
							
							sku.sku_open = 1;

							// 添加数据
							settings.add(goods_id, sku.sku_id);

							// 关闭
							$.closeDialog(index);

							if ($.isFunction(settings.click)) {

								var result = settings.click.call(settings, selected, sku);

								if (result != undefined && result == false) {
									// 删除数据
									settings.remove(goods_id, sku_id);
								}
							}
						}
					}).always(function() {
						$.loading.stop();
					});
				} else {
					// 添加数据
					settings.add(goods_id, sku_id);

					if ($.isFunction(settings.click)) {

						var result = settings.click.call(settings, selected, sku);

						if (result != undefined && result == false) {
							// 删除数据
							settings.remove(goods_id, sku_id);
						}
					}
				}
			} else {
				// 删除数据
				settings.remove(goods_id, sku_id);

				if ($.isFunction(settings.click)) {

					var result = settings.click.call(settings, selected, sku);

					if (result != undefined && result == false) {
						// 删除数据
						settings.remove(goods_id, sku_id);
					}
				}
			}
		});

		// 刷新数据
		settings.refreshSelectedData();

		return settings;
	};

	/**
	 * 数量步进器
	 * 
	 * @author niqingyang <niqy@qq.com>
	 */
	$.fn.amount = function(options) {

		var objects = [];

		$(this).each(function() {

			var defaults = {
				target: null,
				value: 1,
				min: 1,
				step: 1,
				max: null,
				id: null,
				// 支持：integer-整数（默认）,number-数字
				// type: 'integer',
				// value改变事件
				// @param element 元素
				change: null,
				// 解析
				parseValue: function(value) {
					return parseInt(value);
				}
			};

			var target = $(this);

			var settings = $.extend(true, {}, defaults, options);

			settings.target = target;

			if (!isNaN($(target).data("amount-min"))) {
				settings.min = $(target).data("amount-min");
			}
			if (!isNaN($(target).data("amount-max"))) {
				settings.max = $(target).data("amount-max");
			}
			if (!isNaN($(target).data("id"))) {
				settings.id = $(target).data("id");
			}

			if (!isNaN(settings.max)) {
				settings.max = 999999999;
			}

			if (!isNaN(settings.min)) {
				settings.max = 1;
			}

			if (!isNaN(settings.max) && settings.value > settings.max) {
				settings.value = settings.max;
				target.val(settings.value).change();
			} else if (!isNaN(settings.min) && settings.value < settings.min) {
				settings.value = settings.min;
				target.val(settings.value).change();
			}

			// 加
			$(target).parents(".amount").find(".amount-plus").click(function() {

				if (!isNaN($(target).data("amount-min"))) {
					settings.min = $(target).data("amount-min");
				}
				if (!isNaN($(target).data("amount-max"))) {
					settings.max = $(target).data("amount-max");
				}

				var value = parseInt(target.val()) + settings.step;

				if (isNaN(value)) {
					return;
				}

				if (isNaN(settings.parseValue(settings.max)) || value <= settings.max) {
					var result = true;
					if ($.isFunction(settings.change)) {
						result = settings.change.call(settings, target, value);
					}

					if (result == true || result == undefined) {
						target.val(value);
						settings.value = value;
						target.change();
					}
				}

			});

			// 减
			$(target).parents(".amount").find(".amount-minus").click(function() {

				if (!isNaN($(target).data("amount-min"))) {
					settings.min = $(target).data("amount-min");
				}
				if (!isNaN($(target).data("amount-max"))) {
					settings.max = $(target).data("amount-max");
				}

				var value = settings.parseValue(target.val()) - settings.step;
				if (isNaN(value)) {
					return;
				}
				if (isNaN(settings.parseValue(settings.min)) || value >= settings.min) {
					var result = true;

					if ($.isFunction(settings.change)) {
						result = settings.change.call(settings, target, value);
					}

					if (result == true || result == undefined) {
						target.val(value);
						settings.value = value;
						target.change();
					}
				}
			});

			// 键盘事件
			$(target).keyup(function(event) {

				if (!isNaN($(target).data("amount-min"))) {
					settings.min = $(target).data("amount-min");
				}
				if (!isNaN($(target).data("amount-max"))) {
					settings.max = $(target).data("amount-max");
				}

				if ($.trim(target.val()) == '') {
					target.val('');
					return;
				}

				var value = settings.value;

				// 190 - 小数点
				// 46 - delete
				// 8 - backspace
				// 37、39 - 左右光标
				var usable = true;
				if (event.keyCode != 46 && event.keyCode != 8 && event.keyCode != 37 && event.keyCode != 39) {
					if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105))) {
						usable = false;
					}
				}

				if (usable) {
					value = settings.parseValue(target.val());
				}

				if (isNaN(value)) {
					value = settings.value;
				} else {
					if (!isNaN(settings.parseValue(settings.max)) && value >= settings.max) {
						value = settings.max;
					}

					if (!isNaN(settings.parseValue(settings.min)) && value <= settings.min) {
						value = settings.min;
					}
				}

				var result = true;
				if ($.isFunction(settings.change)) {
					result = settings.change.call(settings, $(this), value);
				}

				if (result == true || result == undefined) {
					target.val(value);
					settings.value = value;
					target.change();
				}

			}).focus(function() {
				// 禁用输入法
				this.style.imeMode = 'disabled';
			}).blur(function() {

				if (!isNaN($(target).data("amount-min"))) {
					settings.min = $(target).data("amount-min");
				}
				if (!isNaN($(target).data("amount-max"))) {
					settings.max = $(target).data("amount-max");
				}

				if ($.trim(target.val()) == '') {
					target.val(settings.min);
					settings.value = settings.min;
				}
			});

			objects.push(settings);
		});

		if ($(this).size() == 1) {
			return options;
		}

		return objects;
	}

	/**
	 * 视频上传控
	 */
	$.fn.videogroup = function(settings) {
		var defaults = {
			url: '/site/upload-video.html',
			gallery: true,
			bgclass: "image-group-bg-video",
			// 语言包
			messages: {
				"delete file": "删除视频",
				"click preview": "点击预览视频",
				"click upload file": "点击上传视频",
				"click and select upload files": "点击并选择上传的视频文件",
				"upload up to {limit} files at most": "最多上传{limit}个视频",
			},
			// 图片数据预处理，返回数据必须包含：src、value、url
			renderData: function(data) {

				var src = data.path;

				if (data.poster) {
					src = data.poster;
				} else if (data.url) {
					src = data.url + "!poster.png";
				} else {
					src = this.host + "/" + data.path + "!poster.png";
				}

				while (src.indexOf("//") != -1) {
					src = src.replace("//", "/");
				}

				src = src.replace("http:/", "http://");
				src = src.replace("https:/", "https://");
				
				if (src.indexOf("?") == -1) {
					src += "?k=" + new Date().getTime();
				} else if(src.indexOf("&k=") == -1){
					src += "&k=" + new Date().getTime();
				}
				
				data.src = src;
				
				if(data.url == undefined || data.url == null){
					data.url = this.host + "/" + data.path;
				}
				
				while (data.url.indexOf("//") != -1) {
					data.url = data.url.replace("//", "/");
				}

				data.url = data.url.replace("http:/", "http://");
				data.url = data.url.replace("https:/", "https://");
				
				return data;
			},
			// 获取视频封面图
			// @param boolean skipOnEmpty 图片为空是否跳过
			// @return array
			getPosters: function(skipOnEmpty) {
				
				if(skipOnEmpty == undefined || skipOnEmpty == null){
					skipOnEmpty = false;
				}
				
				var posters = [];

				if (this.mode == 0) {
					$(container).find("li:visible").find("img").each(function() {
						posters.push($(this).attr("src"));
					});
				} else {
					$(container).find("li:visible").each(function() {
						if ($(this).find("img").size() > 0) {
							posters.push($(this).find("img").attr("src"));
						} else if(skipOnEmpty == false){
							posters.push("");
						}
					});
				}

				return posters;
			},
			// 渲染完成后初始化JS事件
			init: function() {

				settings = this;
				container = this.container;

				$(container).find(".image-group-button").click(function() {

					var values = settings.getValues(true);
					
					if (values.length >= settings.size) {
						$.msg('最多上传' + settings.size + '个视频');
						return;
					}

					var target = this;

					var i = $(target).data("label-index");

					var options = null;

					if ($.isArray(settings.options) && settings.options[i]) {
						options = settings.options[i];
					} else if ($.isPlainObject(settings.options)) {
						options = settings.options;
					}

					if (settings.gallery == true) {
						$.open({
							title: "选择视频",
							width: "700px",
							height: "560px",
							resize: false,
							ajax: {
								url: "/site/video-selector",
								method: "POST",
								data: {
									size: settings.size,
									values: settings.getValues(),
									posters: settings.getPosters(),
								}
							},
							btn: ['确定', '取消'],
							success: function(obj, index){
								$(obj).find(".image-selector-container").data("options", options);
							},
							yes: function(index, obj) {
								var object = $(obj).find(".image-selector-container").data("object");

								var list = object.values();
								
								for(var i = 0; i < list.length; i++){
									
									if(i > settings.size){
										break;
									}
									
									var image = $(container).find("li[data-label-index='" + i + "']").not(".image-group-button").find("img");

									// 如果路径不变则不进行处理
									if ($.isPlainObject(list[i]) && $(image).data("url") == list[i].url) {
										continue;
									}

									// 移除旧项
									settings.removeItem(i);
									
									// 判断数据是否存在
									if ($.isPlainObject(list[i])) {
										// 添加新项
										settings.addItem(i, list[i]);
									}
								}

								// 关闭窗口
								$.closeDialog(index);
							}
						});
					} else {
						$.videoupload({
							url: settings.url,
							options: options,
							data: settings.data,
							callback: function(result) {
								if (result.code == 0) {
									// 添加项
									settings.addItem(i, result.data);
								} else {
									$.msg(result.message, {
										time: 5000
									});
								}
							}
						});
					}

				});

				// 移除
				$(container).on("click", ".image-group-remove", function() {
					var i = $(this).parents("li:first").data("label-index");
					settings.removeItem(i);
				});

				// 预览
				$(container).on("click", "a", function() {

					var poster = $(this).find("img").attr("src");
					var url = $(this).data("url");

					if ($.isFunction($.open)) {
						var max_width = $(window).width() - 50;
						var max_height = $(window).height() - 50 - 42;

						var video = document.createElement("VIDEO");

						video.src = url;
						
						$(video).on("loadedmetadata", function() {

							var width = this.videoWidth;
							var height = this.videoHeight;
	
							var ratio = width / height;
	
							if (width > max_width) {
								width = max_width;
								height = max_width / ratio;
							}
							
							if (height > max_height) {
								height = max_height;
								width = max_height * ratio;
							}
	
							var dir = $("script[src*='/assets/']:first").attr("src");
							dir = dir.substring(0, dir.indexOf("/js/"));
	
							var uuid = (new Date()).getTime() * 1000 + Math.ceil(Math.random() * 10000);
	
							var content_html = "<div id='" + uuid + "'>"
							content_html += "<link rel='stylesheet' href='" + dir + "/js/video/video-js.css'/>";
							content_html += "<style type='text/css'>.video{width:100%;height:100%}.video .video-js{display:block;vertical-align:top;font-size:14px;overflow:hidden;position:absolute;top:0;left:0;padding:0;line-height:1;color:#fff;background-color:#000;width:100%;height:100%}.video-js .vjs-tech,.video-js.vjs-fill{width:100%;height:100%}</style>";
							content_html += '<div class="video">';
							content_html += '<div class="J-v-player">';
							content_html += '<div class="video-js">';
							content_html += '<video id="video_' + uuid + '" class="video-js vjs-sublime-skin" controls preload="auto" poster="' + poster + '">';
							content_html += '<source src="' + url + '"></source>';
							content_html += '</video>';
							content_html += '</div>';
							content_html += '</div>';
							content_html += '</div>';
							content_html += "<script type='text/javascript' src='" + dir + "/js/video/video.min.js'></script>";
							content_html += '<script type="text/javascript">var player = videojs("video_' + uuid + '")</script>';
							content_html += '</div>';
	
							top.$.open({
								type: 1,
								title: "预览视频 [" + this.videoWidth + "x" + this.videoHeight + "]",
								scrollbar: true,
								closeBtn: 1,
								area: [width + "px", (height + 42) + "px"],
								skin: 'layui-layer-nobg', // 没有背景色
								shadeClose: true,
								content: content_html,
							});
						});

						$(video).on("error", function() {
							$.msg("加载视频发生错误，预览失败！");
						});
					} else {
						window.open(url);
					}

					return false;
				});
			}
		};

		settings = $.extend(true, defaults, settings);

		return $(this).imagegroup(settings);
	};

	/**
	 * 图片组上传控件
	 */
	$.fn.imagegroup = function(settings) {

		var defaults = {
			host: null,
			url: '/site/upload-image',
			bgclass: "image-group-bg",
			typename: "图片",
			values: [],
			labels: [],
			// 验证器
			options: null,
			// 图片数量
			size: 1,
			// 显示模式：0-一个一个上传 1-上传多个并且允许中间有空的图片
			mode: 0,
			// 图片库展示的容器
			container: null,
			// Ajax提交参数
			data: {},
			// 上传
			callback: null,
			// 是否默认从空间中选择
			gallery: false,
			// 移除的回调函数
			// @param value 移除的值
			// @param values 移除后的值
			remove: null,
			messages: {
				"delete file": "删除图片",
				"click preview": "点击预览图片",
				"click and select upload files": "点击并选择上传的图片",
				"upload up to {limit} files at most": "最多上传{limit}张图片",
			},
			// @param boolean skipOnEmpty 图片为空是否跳过
			// @return array
			getValues: function(skipOnEmpty) {
				
				if(skipOnEmpty == undefined || skipOnEmpty == null){
					skipOnEmpty = false;
				}
				
				var values = [];

				if (this.mode == 0) {
					$(container).find("li:visible").find("img").each(function() {
						values.push($(this).data("value"));
					});
				} else {
					$(container).find("li:visible").each(function() {
						if ($(this).find("img").size() > 0) {
							values.push($(this).find("img").data("value"));
						} else if(skipOnEmpty == false){
							values.push("");
						}
					});
				}

				this.values = values;

				return this.values;
			},
			// 图片数据预处理，返回数据必须包含：src、value、url
			renderData: function(data) {

				var src = data.path;

				if (data.url) {
					src = data.url
				} else {
					if (src.indexOf("http://") == 0 || src.indexOf("https://") == 0) {
						src = data.path;
					} else {
						src = this.host + "/" + data.path;

						while (src.indexOf("//") != -1) {
							src = src.replace("//", "/");
						}

						src = src.replace("http:/", "http://");
						src = src.replace("https:/", "https://");
					}

					data.url = src;
				}

				if (src.indexOf("?") == -1) {
					src += "?k=" + new Date().getTime();
				} else {
					src += "&k=" + new Date().getTime();
				}

				data.src = src;

				return data;
			},
			render: function() {
				var html = "<ul class='image-group'>";

				if (!$.isArray(this.values)) {
					this.values = [];
				}

				var count = 0;

				for (var i = 0; i < this.values.length; i++) {

					var value = this.values[i];

					if (value == undefined || value == null || $.trim(value) == '' || $.trim(value) == settings.host || $.trim(value) == settings.host + "/") {
						continue;
					}

					var data = this.renderData({
						path: value
					});

					var src = data.src;
					var url = data.url;
					value = data.path;

					html += "<li data-label-index='" + i + "' title='"+this.messages['click preview']+"'>";
					html += "<span title='" + this.messages['delete file'] + "' class='image-group-remove'>" + this.messages['delete file'] + "</span>";
					html += "<a href='javascript:void(0);' data-value='" + value + "' data-url='" + url + "'>";
					html += "<img src='" + src + "' data-value='" + value + "' data-url='" + url + "'>";
					html += "</a>";
					html += "</li>";

					count++;

					if (count >= this.size) {
						break;
					}
				}

				html += "<li class='image-group-button' data-label-index='0' title='"+this.messages['click and select upload files']+"'>";
				html += "<div class='" + settings.bgclass + "'></div>";
				html += "</li>";

				html += "</ul>";

				var element = $($.parseHTML(html));

				$(this.container).html(element);

				if (count >= this.size) {
					$(this.container).find(".image-group-button").hide();
				}
			},
			renderList: function() {
				var html = "<ul class='image-group'>";

				if (!$.isArray(this.values)) {
					this.values = [];
				}

				for (var i = 0; i < this.size; i++) {

					var value = this.values[i];

					if (value == undefined || value == null || $.trim(value) == '' || $.trim(value) == settings.host || $.trim(value) == settings.host + "/") {
						value = "";
					}

					var image = this.renderData({
						path: value
					});

					if (value != "") {

						if (this.labels[i]) {
							html += "<li class='m-b-20' data-label-index='" + i + "' title='"+this.messages['click preview']+"'>";
						} else {
							html += "<li data-label-index='" + i + "' title='"+this.messages['click preview']+"'>";
						}

						html += "<span title='" + this.messages['delete file'] + "' class='image-group-remove'>" + this.messages['delete file'] + "</span>";
						html += "<a href='javascript:void(0);' data-value='" + image.path + "' data-url='" + image.url + "'>";
						html += "<img src='" + image.src + "' data-value='" + image.path + "' data-url='" + image.url + "'>";
						html += "</a>";

						if (this.labels[i]) {
							html += "<span class='image-group-label'>" + this.labels[i] + "</span>";
						}

						html += "</li>";

						if (this.labels[i]) {
							html += "<li class='image-group-button m-b-20' data-label-index='" + i + "' title='"+this.messages['click and select upload files']+"' style='display: none;'>";
						} else {
							html += "<li class='image-group-button' data-label-index='" + i + "' title='"+this.messages['click and select upload files']+"' style='display: none;'>";
						}

						html += "<div class='" + settings.bgclass + "'></div>";

						if (this.labels[i]) {
							html += "<span class='image-group-label'>" + this.labels[i] + "</span>";
						}

						html += "</li>";

					} else {

						if (this.labels[i]) {
							html += "<li class='image-group-button m-b-20' data-label-index='" + i + "' title='"+this.messages['click and select upload files']+"'>";
						} else {
							html += "<li class='image-group-button' data-label-index='" + i + "' title='"+this.messages['click and select upload files']+"'>";
						}

						html += "<div class='" + settings.bgclass + "'></div>";

						if (this.labels[i]) {
							html += "<span class='image-group-label'>" + this.labels[i] + "</span>";
						}

						html += "</li>";

					}
				}

				html += "</ul>";

				var element = $($.parseHTML(html));

				$(this.container).html(element);
			},
			// @param i 顺序编号
			// @param image 图片对象，必须包含属性：url,path
			addItem: function(i, image) {

				var settings = this;
				var container = settings.container;

				if ($(container).find("li").not(".image-group-button").size() >= settings.size) {
					$.msg(this.messages['upload up to {limit} files at most'].replace(/{limit}/, settings.size));
					return;
				}
				
				var target = null;
				
				if(settings.mode == 1){
					target = $(container).find("li").filter(".image-group-button[data-label-index='" + i + "']");
				}else{
					target = $(container).find("li").filter(".image-group-button[data-label-index='0']");
				}
				
				image = this.renderData(image);

				var html = "";

				if (settings.labels[i]) {
					html += "<li class='m-b-20' data-label-index='" + i + "' title='"+this.messages['click preview']+"'>";
				} else {
					html += "<li data-label-index='" + i + "' title='"+this.messages['click preview']+"'>";
				}

				html += "<span title='" + this.messages['delete file'] + "' class='image-group-remove'>" + this.messages['delete file'] + "</span>";
				html += "<a href='javascript:void(0);' data-value='" + image.path + "' data-url='" + image.url + "'>";
				html += "<img src='" + image.src + "' data-value='" + image.path + "' data-url='" + image.url + "'>";
				html += "</a>";

				if (settings.labels[i]) {
					html += "<span class='image-group-label'>" + settings.labels[i] + "</span>";
				}

				html += "</li>";

				var element = $($.parseHTML(html));
				$(target).before(element);

				if (settings.mode == 1 || $(container).find("li").not(".image-group-button").size() >= settings.size) {
					$(target).hide();
				}

				settings.values = settings.getValues();

				if ($.isFunction(settings.callback)) {
					settings.callback.call(settings, image);
				}
			},
			// @param i 顺序编号
			// @param image 图片对象，必须包含属性：url,path
			removeItem: function(i) {

				var settings = this;
				var container = settings.container;

				var target = null;
				
				if(settings.mode == 1){
					target = $(container).find("li").filter(".image-group-button[data-label-index='" + i + "']");
				}else{
					target = $(container).find("li").filter(".image-group-button[data-label-index='0']");
				}
				
				var image_object = $(container).find("li[data-label-index='" + i + "']").not(".image-group-button");

				var value = $(image_object).find("img").data("value");

				$(target).show();
				$(image_object).remove();

				settings.values = settings.getValues();

				if ($.isFunction(settings.remove)) {
					settings.remove.call(settings, value, settings.values);
				}
				
				if(settings.mode == 0){
					var list = $(container).find("li").not(".image-group-button");
					// 重建索引
					for(var i = 0; i < $(list).size(); i++){
						$(list).eq(i).attr("data-label-index", i).data("label-index", i);
					}
				}
			},
			// 渲染完成后初始化JS事件
			init: function() {

				settings = this;
				container = this.container;

				$(container).find(".image-group-button").click(function() {

					var values = settings.getValues(true);
					
					if (values.length >= settings.size) {
						$.msg('最多上传' + settings.size + '张图片');
						return;
					}

					var target = this;
					
					var i = 0;
					
					if(settings.mode == 1){
						i = $(target).data("label-index");
					}else{
						i = $(container).find("li").not(".image-group-button").last().data("label-index");
						i++;
					}

					var options = null;

					if ($.isArray(settings.options) && settings.options[i]) {
						options = settings.options[i];
					} else if ($.isPlainObject(settings.options)) {
						options = settings.options;
					}

					if (settings.gallery == true) {
						$.open({
							title: "选择图片",
							width: "700px",
							height: "560px",
							resize: false,
							ajax: {
								url: "/site/image-selector",
								method: "POST",
								data: {
									size: settings.size,
									values: settings.getValues()
								}
							},
							btn: ['确定', '取消'],
							success: function(obj, index){
								$(obj).find(".image-selector-container").data("options", options);
							},
							yes: function(index, obj) {
								var object = $(obj).find(".image-selector-container").data("object");

								var list = object.values();
								
								for(var i = 0; i < list.length; i++){
									
									if(i > settings.size){
										break;
									}
									
									var image = $(container).find("li[data-label-index='" + i + "']").not(".image-group-button").find("img");

									// 如果路径不变则不进行处理
									if ($.isPlainObject(list[i]) && $(image).data("url") == list[i].url) {
										continue;
									}

									// 移除旧项
									settings.removeItem(i);
									
									// 判断数据是否存在
									if ($.isPlainObject(list[i])) {
										// 添加新项
										settings.addItem(i, list[i]);
									}
								}

								// 关闭窗口
								$.closeDialog(index);
							}
						});
					} else {
						$.imageupload({
							url: settings.url,
							options: options,
							data: settings.data,
							callback: function(result) {
								if (result.code == 0) {
									// 添加项
									settings.addItem(i, result.data);
								} else {
									$.msg(result.message, {
										time: 5000
									});
								}
							}
						});
					}

				});

				// 移除
				$(container).on("click", ".image-group-remove", function() {
					var i = $(this).parents("li:first").data("label-index");
					settings.removeItem(i);
				});

				// 预览
				$(container).on("click", "a", function() {

					var url = $(this).find("img").attr("src");

					if ($.isFunction($.open)) {

						var max_width = $(window).width() - 50;
						var max_height = $(window).height() - 50;
						
						var image = new Image();
						
						image.src = url;
						
						$(image).on("load", function(){
							var content_html = "<p style='background: #FFF; padding: 3px; border: solid 1px #DDD;'><img id='imgpreview_handle' src='" + url + "' style='max-width: " + max_width + "px;max-height: " + max_height + "px;'/></p>";
							top.$.open({
								type: 1,
								title: false,
								resize: false,
								move: "#imgpreview_handle",
								scrollbar: true,
								closeBtn: 1,
								area: [max_width, max_height],
								skin: 'layui-layer-nobg', // 没有背景色
								shadeClose: true,
								content: content_html
							});
						});
					} else {
						window.open(url);
					}

					return false;
				});
			}
		}

		settings.container = $(this).first();
		settings = $.extend(true, defaults, settings);

		if (!$.isArray(this.labels)) {
			this.labels = [];
		}

		if (this.labels.length > 0) {
			this.mode = 1;
		}

		var container = $(settings.container);

		if (settings.mode == 1) {
			// 模式二：直接显示图片列表
			settings.renderList();
		} else {
			// 模式一：默认
			settings.mode = 0;
			settings.render();
		}
		// 初始化
		settings.init();
		// 返回
		return settings;
	};

	$.fn.goodsgallery = function(settings) {
		var defaults = {
			container: $(this),
			host: null,
			// 当前图片： 0-缩略图 1-大图 2-原图
			current: [],
			// 图片列表，每个图片都包含三张图片： 0-缩略图 1-大图 2-原图
			images: [],
			// 主图视频
			video: null,
			init: function() {

				var uuid = (new Date()).getTime() * 1000 + Math.ceil(Math.random() * 10000);
				
				$(this.container).addClass("goodsgallery");

				// 获取当前第一个
				this.current = this.images[0];

				if (!this.current) {
					this.current = [];
				}

				var html = '<div class="gg-current-img">';
				html += '<a href="' + this.current[2] + '" class="MagicZoom" id="gg-zoom" rel="zoom-position: right;">';
				html += '<img src="' + this.current[1] + '" class="gg-image" width="400" height="400" /></a>';
				// ----如果能获取到时间，给下面的a标签追加class,'video-time-icon'-----
				html += '<a class="video-icon"></a>';
				html += '</div>';
				
				// ----主图视频 start-----
				
				if(this.video != undefined && this.video != null && $.trim(this.video) != ""){
					var dir = $("script[src*='/assets/']:first").attr("src");
					dir = dir.substring(0, dir.indexOf("/js/"));
					
					var url = this.video;
					
					html += "<link rel='stylesheet' href='" + dir + "/js/video/video-js.css'/>";
					html += "<style type='text/css'>.video-icon{position:absolute;cursor:pointer;background:url(" + dir + "/js/video/__sprite.png) no-repeat;background-size:100px 100px;z-index:998;bottom:6px;left:10px;background-position:-2px -8px;display:inline-block;width:87px;height:35px}.video-time-icon{background-position: -2px -47px;}.video{width:422px;height:422px;display:none;overflow:hidden;z-index:-1;position:absolute;top:0;left:0}.video-show{width:422px;height:422px;overflow:visible;z-index:999; display:block}.video .video-js{display:block;vertical-align:top;font-size:14px;overflow:hidden;position:absolute;top:0;left:0;padding:0;line-height:1;color:#fff;background-color:#000;width:422px;height:422px}.video-js .vjs-tech,.video-js.vjs-fill{width:100%;height:100%}.video .close-video{position:absolute;cursor:pointer;right:15px;top:15px;width:12px;height:12px;background:url(" + dir + "/js/video/__sprite.png) no-repeat;background-position:-89px -89px;background-size: 100px 100px;}</style>";
					html += '<div class="video">';
					html += '<div class="J-v-player">';
					html += '<div class="video-js">';
					html += '<video id="video_' + uuid + '" class="video-js vjs-sublime-skin" controls preload="auto">';
					html += '<source src="' + url + '"></source>';
					html += '</video>';
					html += '</div>';
					html += '</div>';
					html += '<a class="close-video"></a>';
					html += '</div>';
					html += "<script type='text/javascript' src='" + dir + "/js/video/video.min.js'></script>";
					html += '<script type="text/javascript">';
					html += '$().ready(function(){';
					html += 'var player = videojs("video_' + uuid + '");';
					html += "$('body').on('click', '.video-icon', function() {$('.video').addClass('video-show');player.play();});";
					html += "$('body').on('click', '.close-video', function() {$('.video').removeClass('video-show');player.pause();});";
					html += '});';
					html += '</script>';
				}
				
				// ----主图视频 end-----
				
				html += '<div class="gg-imagebar clearfix">';

				// 相册向右滑动
				html += '<a href="javascript:;" class="gg-left-btn disabled"></a>';

				html += '<div class="gg-container">';
				html += '<div class="gg-content">';
				html += '<ul class="gg-handler">';

				html += this.render(this.images);

				html += '</ul>';
				html += '</div>';
				html += '</div>';

				// 相册向友滑动
				html += '<a href="javascript:;" class="gg-right-btn"></a>';
				
				$(this.container).html($.parseHTML(html, true));

				// 初始化按钮
				this.initButton();

				this.init = true;

			},
			renderImageUrl: function(url){
				if(!this.host || url.indexOf("http://") != -1 || url.indexOf("https://") != -1){
					return url;
				}
				url = this.host + "/" + url;
				while (url.indexOf("//") != -1) {
					url = url.replace("//", "/");
				}
				url = url.replace("http:/", "http://");
				url = url.replace("https:/", "https://");
				return url;
			},
			render: function(images) {
				var html = "";
				for (var i = 0; i < images.length; i++) {
					var image = images[i];
					
					if($.isArray(image)){
						for(var j = 0; j < image.length; j++){
							image[j] = this.renderImageUrl(image[j]);
						}
					}
					
					var current_class = i == 0 ? 'current' : '';
					html += '<li>';
					html += '<a href="' + image[2] + '" data-original="' + image[2] + '" rev="' + image[1] + '" rel="zoom-id: gg-zoom;" title="" class="' + current_class + '">';
					html += '<img src="' + image[1] + '" alt="" class="" />';
					html += '</a>';
					html += '</li>';
				}
				return html;
			},
			// 加载
			load: function(images) {
				var settings = this;
				var container = settings.container;

				var html = this.render(this.images);
				$(container).find(".gg-handler").html($.parseHTML(html));

				// 初始化按钮
				this.initButton();

				// 切换第一个图片显示
				$(container).find(".gg-handler li:first").mouseover();
			},
			// 初始化按钮栏
			initButton: function() {

				var settings = this;

				var container = settings.container;

				var index = 0;

				var leftBtn = $(container).find(".gg-left-btn");
				var rightBtn = $(container).find(".gg-right-btn");

				$(container).find(".gg-handler").width(70 * this.images.length);
				$(container).find(".gg-handler li").mouseover(function() {
					$(this).find('a').addClass('current');
					$(this).siblings().find('a').removeClass('current');

					var original = $(this).find("a").data("original");

					// 变更预览大图
					$(container).find(".MagicZoom").attr("href", original);
					$(container).find(".gg-image").attr("src", $(this).find("a").attr("rev"));
					$(container).find(".MagicZoomBigImageCont").find("img").attr("src", original);

				})

				if (this.images.length < 6) {
					$(rightBtn).addClass('disabled')
				}

				$(leftBtn).click(function() {
					index++;
					$(this).removeClass('disabled');
					if (num01 == (settings.images - 5)) {
						$(rightBtn).addClass('disabled');
					}
					if (num01 > (settings.images - 5)) {
						index = settings.images - 5;
					}
					if (gg_lis < 6) {
						index = 0;
						$(rightBtn).addClass('disabled');
						$(leftBtn).addClass('disabled');
					}
					$(container).find(".gg-handler").animate({
						left: -index * 70
					}, 100);
				});

				$(container).find(".gg-right-btn").click(function() {
					index--;
					if (index == 0) {
						$(rightBtn).removeClass('disabled');
						$(leftBtn).addClass('disabled');
					}
					if (index < 0) {
						index = 0;
					}
					$(container).find(".gg-handler").animate({
						left: -index * 70
					}, 100);
				});
			}

		};

		if ($(this).data("szy-goodsgallery")) {
			defaults = $(this).data("szy-goodsgallery");
			if ($.isArray(settings.images) && settings.images.length > 0) {
				// 清空图片
				defaults.images = [];
			}
			settings = $.extend(true, defaults, settings);
			settings.load(settings.images);
		} else {
			settings = $.extend(true, defaults, settings);
			settings.init();
		}

		$(this).data("szy-goodsgallery", settings);

		return settings;
	}

	function goods_gallery_control() {
		var num01 = 0;
		var gg_lis = $('#goods-gallery li').length;
		$('#goods-gallery').width(70 * gg_lis);
		$('#goods-gallery li').mouseover(function() {
			$(this).find('a').addClass('current');
			$(this).siblings().find('a').removeClass('current');
		})
		if (gg_lis < 6) {
			$('.scrright').addClass('disabled')
		}
		$('.scrright').click(function() {
			num01++;
			$('.scrleft').removeClass('disabled');
			if (num01 == (gg_lis - 5)) {
				$('.scrright').addClass('disabled');
			}
			if (num01 > (gg_lis - 5)) {
				num01 = gg_lis - 5;
			}
			if (gg_lis < 6) {
				num01 = 0;
				$('.scrright').addClass('disabled');
				$('.scrleft').addClass('disabled');
			}
			$('#goods-gallery').animate({
				left: -num01 * 70
			}, 100);
		})
		$('.scrleft').click(function() {
			num01--;
			if (num01 == 0) {
				$('.scrright').removeClass('disabled');
				$('.scrleft').addClass('disabled');
			}
			if (num01 < 0) {
				num01 = 0;
			}
			$('#goods-gallery').animate({
				left: -num01 * 70
			}, 100);
		})
	}

	$.fn.catselector = function(settings) {

		if (!settings) {
			return $(this).data("catselector");
		}

		var container = $(this);

		var defaults = {
			api: "catselector",
			container: $(this),
			url: '/site/cat-list',
			data: {
				format: "ztree"
			},
			values: [],
			items: null,
			ztree: null,
			// ztree配置
			ztree_config: {
				view: {
					dblClickExpand: true,
					selectedMulti: false,
					nameIsHTML: true
				},
				data: {
					simpleData: {
						enable: true,
						idKey: "cat_id",
						pIdKey: "parent_id",
						rootPId: "0",
					}
				}
			},
		};

		settings = $.extend(true, defaults, settings);

		settings = $(this).treechosen(settings);

		return settings;

	};

	$.fn.treechosen = function(settings) {

		var container = this;
		var ztree_id = uuid();

		var nodeMap = new Array();
		var hashSet = new Array();

		var zkeys = {
			root: null,
			id: null,
			parent_id: null,
			name: null,
		};

		function getRelationNodes(nodes, id) {
			var node = nodeMap[id];

			if (node != null && node[zkeys.parent_id] != zkeys.root && hashSet[node[zkeys.parent_id]] == undefined) {
				var pnode = nodeMap[node[zkeys.parent_id]];
				nodes.push(pnode);
				hashSet[pnode[zkeys.id]] = 0;
				return getRelationNodes(nodes, node[zkeys.parent_id]);
			}
		}

		function getFont(treeId, node) {
			return node.font ? node.font : {};
		}

		var defaults = {
			api: "treechosen",
			container: $(this),
			// 最大选择项
			size: 0,
			url: null,
			data: {
				format: "ztree"
			},
			values: [],
			items: null,
			getValues: function() {
				var values = [];
				$(this.container).find(".tree-chosen-item").each(function() {
					values.push($(this).data("value"));
				});
				return values;
			},
			getCheckedNodes: function(checked) {
				if (this.ztree) {
					checked = checked == false ? false : true;
					return this.ztree.getCheckedNodes(checked);
				} else {
					return [];
				}
			},
			addCallback: function(id, name) {

			},
			removeCallback: function(id, name) {

			},
			change: function() {

			},
			ztree: null,
			// ztree配置
			ztree_config: {
				check: {
					enable: false,
					chkStyle: 'checkbox',
				},
				view: {
					fontCss: getFont,
					dblClickExpand: true,
					selectedMulti: true,
					nameIsHTML: true
				},
				data: {
					key: {
						name: "name"
					},
					simpleData: {
						enable: true,
						idKey: "id",
						pIdKey: "parent_id",
						rootPId: "0",
					}
				},
				callback: {
					onClick: function(event, treeId, treeNode) {

					}
				}
			},
			render: function() {
				var html = '<div class="form-control-box">';
				html += '<div class="tree-chosen-box">';
				html += '<div class="tree-chosen-input-box form-control">';

				html += '</div>';

				html += '<div class="tree-chosen-panel-box">';
				html += '<input type="text" class="tree-chosen-input form-control-xs m-r-5" value="" placeholder="输入关键词、简拼、全拼搜索" style="width: 200px;">';
				html += '<a class="btn btn-primary btn-sm tree-chosen-btn-open m-r-2" title="全部展开/收起"><i class="fa fa-plus-circle" style="margin-right: 0px;"></i></a>';
				html += '<a class="btn btn-primary btn-sm tree-chosen-btn-clear" title="全部清除所选"><i class="fa fa-trash-o" style="margin-right: 0px;"></i></a>';
				html += '<div class="ztree-box">';
				html += '<ul id="' + ztree_id + '" class="ztree"></ul>';
				html += '</div>';
				html += '</div>';
				html += '</div>';

				$(this.container).html(html);
			},
			// 添加
			add: function(id, name, treeNode) {

				// 已存在则跳过
				if ($(this.container).find(".tree-chosen-input-box").find(".tree-chosen-item[data-value='" + id + "']").size() > 0) {
					return;
				}

				var size = $(this.container).find(".tree-chosen-input-box").find(".tree-chosen-item").size();

				if (this.size > 0 && size == this.size) {
					var value = $(this.container).find(".tree-chosen-input-box").find(".tree-chosen-item").last().data("value");
					this.remove(value);
					this.add(id, name, treeNode);
				} else {
					var html = '<span class="tree-chosen-item" data-value="' + id + '" data-name="' + name + '">' + name + '<i class="tree-chosen-close" title="点击移除">×</i></span>';
					var last_item = $(this.container).find(".tree-chosen-input-box").find(".tree-chosen-item").last();
					if (last_item.size() > 0) {
						$(last_item).after(html);
					} else {
						$(this.container).find(".tree-chosen-input-box").prepend(html);
					}

					if ($.isFunction(this.addCallback)) {
						this.addCallback.call(this, id, name, treeNode);
					}

					if ($.isFunction(this.change)) {
						this.change.call(this);
					}
				}
			},
			// 移除
			remove: function(id) {

				var target = $(this.container).find(".tree-chosen-input-box").find(".tree-chosen-item[data-value='" + id + "']");

				$(target).remove();

				if ($.isFunction(this.removeCallback)) {
					this.removeCallback.call(this, id, $(target).data("name"));
				}

				if ($.isFunction(this.change)) {
					this.change.call(this);
				}
			},
			// 改变
			change: function() {
				if ($.isFunction(this.change)) {
					var target = $(this.container).find(".tree-chosen-input-box").find(".tree-chosen-item[data-value]");
					var value = $(target).data("value");
					if (value != null) {
						var url = '/goods/category/is-change';
						$.post(url, {
							id: value
						}, function(result) {
							if (result.code == 0) {
								$(".is-change").hide();
								$("#categorymodel-is_parent").val("0");
							} else {

							}
						}, 'json');
					}
				}
			},
			// 隐藏
			hide: function() {
				$(container).find(".tree-chosen-panel-box").hide();
			},
			load: function() {

				if (this.loading == true) {
					return false;
				}

				this.loading = true;

				var settings = this;

				return $.get(this.url, this.data, function(result) {
					if ($.fn.zTree) {

						$.fn.zTree.init($(container).find("#" + ztree_id), settings.ztree_config, result.data);

						settings.ztree = $.fn.zTree.getZTreeObj(ztree_id);

						settings.items = result.data;

						for (var i = 0; i < settings.items.length; i++) {
							var node = settings.items[i];
							if (node != null) {
								nodeMap[node[zkeys.id]] = node;
							}
						}

						var nodes = settings.ztree.getNodes();

						for (var i = 0; i < nodes.length; i++) {
							var node = nodes[i];
							if (node.children && node.children.length > 0) {
								node.isParent = true;
							} else {
								node.isParent = false;
							}

							settings.ztree.updateNode(node);
						}
					} else {
						alert("缺少zTree");
					}
				}, "JSON").always(function() {
					$.loading.stop();

					if ($.isArray(settings.values)) {
						for (var i = 0; i < settings.values.length; i++) {
							var id = settings.values[i];
							var name = null;
							var node = null;
							if (id != zkeys.root) {
								node = settings.ztree.getNodeByParam(zkeys.id, id);
								name = node[zkeys.name];
								settings.add(id, name, node);
							}
						}
					}
				});
			},
			// 显示
			show: function() {
				if (settings.items == null) {
					$.loading.start();
					this.load();
					$(container).find(".tree-chosen-panel-box").show();
				} else {
					$.loading.stop();
					$(container).find(".tree-chosen-panel-box").show();
				}
				$(container).find(".tree-chosen-panel-box").find(".tree-chosen-input").focus();
			},
			// 搜索
			search: function(keyword) {

				var zNodes = this.items;

				for (var i = 0; i < zNodes.length; i++) {
					zNodes[i].font = {};
				}

				if (keyword == null || keyword.length == 0) {
					$.fn.zTree.init($("#" + ztree_id), this.ztree_config, zNodes);
					this.ztree = $.fn.zTree.getZTreeObj(ztree_id);
					this.ztree.refresh();
					return;
				}

				hashSet = new Array();

				var nodes = new Array();

				for (var i = 0; i < zNodes.length; i++) {
					var node = zNodes[i];

					if (node.children && node.children.length > 0) {
						node.isParent = true;
					} else {
						node.isParent = false;
					}

					if (node != null && node.keywords != undefined && node.keywords.indexOf(keyword) != -1 && hashSet[node[zkeys.parent_id]] == undefined) {
						node.font = {
							'color': 'red'
						};
						nodes.push(node);
						hashSet[node[zkeys.id]] = 0;

						getRelationNodes(nodes, node[zkeys.id]);
					}
				}

				$.fn.zTree.init($("#" + ztree_id), this.ztree_config, nodes);
				this.ztree = $.fn.zTree.getZTreeObj(ztree_id);
				this.ztree.refresh();
				this.ztree.expandAll(true);
			}
		};

		settings = $.extend(true, defaults, settings);
		settings.container = container;

		// 渲染页面
		settings.render();

		// 获取数据与ztree的key对应关系
		zkeys.id = settings.ztree_config.data.simpleData.idKey;
		zkeys.parent_id = settings.ztree_config.data.simpleData.pIdKey;
		zkeys.name = settings.ztree_config.data.key.name;
		zkeys.root = settings.ztree_config.data.simpleData.rootPId;

		// 单击回调函数
		settings.ztree_config.callback.onClick = function(event, treeId, treeNode) {
			settings.add(treeNode[zkeys.id], treeNode[zkeys.name], treeNode);
		}

		$(this).find(".tree-chosen-input").keyup(function() {
			settings.search($(this).val());
		});

		$(container).find(".tree-chosen-box").click(function(event) {
			if ($(event.target).hasClass("tree-chosen-close")) {
				var target = $(event.target).parents(".tree-chosen-item");
				settings.remove($(target).data("value"));
				return false;
			}
			settings.show();
			return false;
		});

		$(container).find(".tree-chosen-panel-box").on("click", function() {
			return false;
		});

		$(container).find(".tree-chosen-btn-open").on("click", function() {
			var expandFlag = true;
			if ($(this).data("is-open") == true) {
				expandFlag = false;
			}
			settings.ztree.expandAll(expandFlag);
			return false;
		});

		$(container).find(".tree-chosen-btn-clear").on("click", function() {
			$(container).find(".tree-chosen-item").remove();
			return false;
		});

		$("body").on("click", function(event) {
			$(container).find(".tree-chosen-panel-box").hide();
		});

		$(this).data(settings.api, settings);

		return settings;
	};

	/**
	 * 基于高德地图的地址选择器
	 */
	$.fn.addresspicker = function(options) {

		// options.map
		var map_options = $.extend({
			level: 16,
			// 缩放级别
			zooms: [8, 18],
			jogEnable: false,
			scrollWheel: false,
			zoomEnable: true,
			doubleClickZoom: false,
			// 无平滑动画
			animateEnable: false,
			resizeEnable: true
		}, options.map);

		var container = this;
		var auto = null;
		var placeSearch = null;
		var placeSearchNearBy = null;

		var position = null;

		var settings = {
			container: container,
			city: options.city,
			search_loading: options.search_loading == undefined ? true : options.search_loading,
			open_window: options.open_window == undefined ? true : options.open_window,

			position: options.position,
			// 用于自动提示
			input: options.input,
			// 定位当前位置的回调函数
			geolocation_callback: options.geolocation_callback,
			// 点击保存位置事件
			save_callback: options.save_callback,
			// 点击回原位置事件
			back_callback: options.back_callback,
			// 地图移动事件
			move_callback: options.move_callback,
			// 添加覆盖物
			addMarker: function(position, address, is_address) {
				if (is_address != false) {
					is_address = true;
				}

				var settings = this;

				// 清空覆盖物
				this.map.clearMap();

				this.marker = new AMap.Marker({
					map: settings.map,
					icon: is_address ? "/images/common/location.png" : "/images/common/nolocation.png",
					draggable: false,
					position: position,// marker所在的位置
					animation: is_address ? 'AMAP_ANIMATION_DROP' : 'AMAP_ANIMATION_NONE',
					raiseOnDrag: true,
					showMarker: true,
				});

				// 居中
				this.map.setCenter(position);

				if (address) {
					this.openWindow(address, is_address);
				} else {
					this.regeocoder(this.marker.getPosition(), function(address) {
						settings.openWindow(address);
					});
				}

				this.position = this.marker.getPosition();

				return this.marker;
			},
			// 打开消息窗体
			openWindow: function(content, is_address) {
				if (!settings.open_window) {
					return;
				}
				if (this.infoWindow == null) {
					this.infoWindow = new AMap.InfoWindow({
						offset: new AMap.Pixel(0, -30),
						showShadow: false
					});
				}

				if (is_address == undefined) {
					is_address = true;
				}

				if (!is_address) {
					this.infoWindow.setContent("<font color='#FF7C00'>" + content + "</font>");
				} else {
					this.infoWindow.setContent("当前位置：<label style='color: #ff4500;'>" + content + "</label>");
				}

				this.infoWindow.open(this.map, this.marker.getPosition());
			},
			// 获取当前位置
			geolocation: function() {

				var settings = this;

				// 当前位置
				this.map.plugin('AMap.Geolocation', function() {
					var geolocation = new AMap.Geolocation({
						// 是否使用高精度定位，默认:true
						enableHighAccuracy: true,
						// 超过10秒后停止定位，默认：无穷大
						timeout: 10000,
						// 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
						buttonOffset: new AMap.Pixel(3, 3),
						// 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
						zoomToAccuracy: false,
						buttonPosition: 'RB',
						showMarker: true,
						markerOptions: {
							draggable: false,
							animation: 'AMAP_ANIMATION_DROP',
							raiseOnDrag: true,
						}
					});
					settings.map.addControl(geolocation);
					geolocation.getCurrentPosition();

					AMap.event.addListener(geolocation, 'complete', function(data) {

						var address = data.formattedAddress;

						position = settings.map.getCenter();

						// 给地图添加点标记等覆盖物
						settings.addMarker(position, address);
						// 设置搜索城市范围
						adcode = data.addressComponent.adcode;

						settings.setCity(adcode);

						if ($.isFunction(settings.geolocation_callback)) {

							region_code = [];

							var codes = adcode.split("");

							for (var i = 0; i < codes.length; i++) {
								if (!(codes[i] == 0 && codes[i + 1] == 0)) {
									region_code.push(codes[i] + codes[i + 1]);
								}
								i++;
							}

							region_code = region_code.join(",");

							settings.geolocation_callback.call(settings, data, region_code, address);
						}
					});

					AMap.event.addListener(geolocation, 'error', function(data) {
						$.msg("无法获取位置信息，请检查定位权限是否开启");
					}); // 返回定位出错信息

				});
			},
			// 逆地理编码
			regeocoder: function(position, callback) {
				// 加载地理编码插件
				this.map.plugin(["AMap.Geocoder"], function() {
					var geocoder = new AMap.Geocoder({
						radius: 1000, // 以已知坐标为中心点，radius为半径，返回范围内兴趣点和道路信息
						extensions: "base" // 返回地址描述以及附近兴趣点和道路信息，默认"base"
					});

					// 返回地理编码结果
					AMap.event.addListener(geocoder, "complete", function geocoder_callBack(data) {
						var address = data.regeocode.formattedAddress;
						callback.call(data, address);
					});

					// 逆地理编码
					geocoder.getAddress(position);
				});
			},
			// 设置兴趣点城市
			// 可选值：城市名（中文或中文全拼）、citycode、adcode
			// 默认值：“全国”
			setCity: function(city) {
				// 设置搜索城市
				if (auto) {
					auto.setCity(city);
				}
				if (placeSearch) {
					placeSearch.setCity(city);
				}
				this.city = city;
			},
			// 获取地区编码
			getRegionCode: function(position, callback) {
				var geocoder = new AMap.Geocoder({
					radius: 1000,
					extensions: "all"
				});

				geocoder.getAddress(position, function(status, result) {
					if (status === 'complete' && result.info === 'OK') {
						var region_code = result.regeocode.addressComponent.adcode;
						var region_name = result.regeocode.formattedAddress;

						var codes = [];

						for (var i = 0; i < region_code.length; i = i + 2) {
							codes.push(region_code.charAt(i) + "" + region_code.charAt(i + 1));

							if (codes.length == 3) {
								break;
							}
						}

						region_code = codes.join(",");

						if ($.isFunction(callback)) {
							callback.call(result, region_code, region_name);
						}
					} else {
						console.error("访问高德地图服务接口失败！请检查您是否创建了web端应用并授权当前网址可以访问！");
					}
				});
			},
			// 搜索地址
			search: function(name, city, callback) {

				if (city) {
					this.setCity(city);
				}

				var settings = this;
				var container = this.container;

				var offset = $(container).offset();

				var index = null;
				if (settings.search_loading) {
					$.msg("正在定位中...", {
						time: 0,
						fixed: true,
						anim: -1,
						area: [$(container).width() + "px", $(container).height() + "px"],
						offset: [offset.top, offset.left],
						success: function(layero, i) {
							$(layero).find(".layui-layer-content").css("line-height", $(container).height() + "px");
							index = i;
						}
					});
				}
				// 清空覆盖物
				settings.map.clearMap();

				// 关键字查询查询
				placeSearch.search(name, function(status, result) {

					settings.map.setZoom(17);

					if (result.poiList) {
						var poi = result.poiList.pois[0];
						var position = poi.location;
						settings.addMarker(position, poi.address + poi.name);
					} else {
						var position = settings.map.getCenter();
						settings.addMarker(position, "未找到收货地址，请拖动地图标注一个准确位置", false);
					}

					if ($.isFunction(callback)) {
						callback.call(settings, result);
					}

					if (index) {
						$.closeAll();
					}
				});

				// 隐藏
				$(container).parents(".address-picker").find(".map-footer").hide();
			},
			// WAP：按中心点搜索一定范围内的地址
			searchNearBy: function(center, radius, city, callback) {
				if (city) {
					this.setCity(city);
				}
				var settings = this;
				var container = this.container;

				var offset = $(container).offset();

				var index = null;

				// 查询
				placeSearchNearBy.searchNearBy('', center, radius, function(status, result) {
					settings.map.setZoom(14);
					if (result.poiList) {
						var poi = result.poiList.pois[0];
						var position = poi.location;
						placeSearchNearBy.searchNearBy('', position, 1000, function(status, result) {
							if (status == 'complete') {
								settings.getMapAddressList(result.poiList.pois);
							}
						});
					} else {
						var position = settings.map.getCenter();
						settings.addMarker(position, "未找到收货地址，请拖动地图标注一个准确位置", false);
					}
					if ($.isFunction(callback)) {
						callback.call(settings, result);
					}

					if (index) {
						$.closeAll();
					}
				});
			},
			// WAP：
			searchNearByList: function(index, callback) {
				placeSearchNearBy.setPageIndex(index);
				placeSearchNearBy.searchNearBy('', settings.map.getCenter(), 1000, function(status, result) {
					if (status == 'complete') {
						settings.getMapAddressList(result.poiList.pois);
					}
				});
			},
			// WAP端生成地址列表
			getMapAddressList: function(pois, callback) {
				var list = '';
				for (var i = 0; i < pois.length; i++) {
					list = list + '<li data-lng="' + pois[i].location.lng + '" data-lat="' + pois[i].location.lat + '" data-address="' + pois[i].address + '" data-name="' + pois[i].name + '"><i class="iconfont addr-icon"></i><div class="address-info"><a class="address-info-select">选择</a><p class="address-info-t">' + pois[i].name + '</p><p class="address-info-b">' + pois[i].address + '</p></div></li>';
				}
				$('.SZY-MOBILE-ADDRESS-LIST').html(list);
			}
		};

		// 加载地图，调用浏览器定位服务
		settings.map = new AMap.Map("map_container", map_options);

		// 自动完成： options.input
		if (options.input) {
			auto = new AMap.Autocomplete({
				input: options.input,
				citylimit: false
			});

			// 注册监听，当选中某条记录时会触发
			AMap.event.addListener(auto, "select", function(e) {
				// 关键字查询查询
				settings.search(e.poi.name, e.poi.adcode, function(result) {
					settings.searchNearBy([result.poiList.pois[0].location.lng, result.poiList.pois[0].location.lat], 1000);
				});

			});
		}

		// 构造地点查询类-坐标查询
		placeSearchNearBy = new AMap.PlaceSearch({
			// map: settings.map,
			type: '汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施',
			citylimit: true,
			showCover: false,
			pageSize: 20,
			pageIndex: 1,
		// panel: "panel"
		});

		// 构造地点查询类
		placeSearch = new AMap.PlaceSearch({
			map: settings.map,
			citylimit: true,
			pageSize: 1,
		});

		if (options.position && options.position.lng != "" && options.position.lat != "") {
			// 给地图添加点标记等覆盖物
			var center = [options.position.lng, options.position.lat];
			settings.addMarker(center);
			settings.searchNearBy(center, 1000, settings.city);
		} else {
			settings.addMarker(settings.map.getCenter(), "", true);
			// 定位
			settings.geolocation();
		}

		// 加载标尺
		settings.map.addControl(new AMap.Scale({
			offset: new AMap.Pixel(3, 45),
			visible: true
		}));

		// 加载工具条
		settings.map.addControl(new AMap.ToolBar({
			offset: new AMap.Pixel(0, 20),
			position: 'LT',
			liteStyle: true
		}));

		// 平移地图，使marker始终居中
		var mapmove = false;
		settings.map.on("mapmove", function(e) {
			if (settings.marker) {
				// 关闭窗体
				if (settings.infoWindow) {
					settings.infoWindow.close();
				}
				settings.marker.setIcon("/images/common/location.png");
				settings.marker.setPosition(settings.map.getCenter());
			}
			mapmove = true;
		});

		// 手机端touch事件
		settings.map.on("touchend", function(e) {
			if (mapmove) {

				placeSearchNearBy.searchNearBy('', settings.marker.getPosition(), 1000, function(status, result) {
					if (status == 'complete') {
						settings.getMapAddressList(result.poiList.pois);
					}

				});
			}
		});

		settings.map.on("mouseup", function(e) {
			if (settings.marker && mapmove) {
				settings.regeocoder(settings.marker.getPosition(), function(address) {
					settings.openWindow(address);
				});
			}
			if (mapmove) {
				placeSearchNearBy.searchNearBy('', settings.marker.getPosition(), 1000, function(status, result) {
					if (status == 'complete') {
						settings.getMapAddressList(result.poiList.pois);
					}

				});
				$(container).parents(".address-picker").find(".map-footer").show();
			}
			// 标识平移状态：false
			mapmove = false;
			return false;
		});

		// 滚动条控制缩放
		$(settings.container).bind("mousewheel", function(e, data) {
			if (data > 0) {
				$(settings.container).find(".amap-zoom-touch-plus").click();
			} else {
				$(settings.container).find(".amap-zoom-touch-minus").click();
			}
			// 防止冒泡
			return false;
		});

		// 
		$("body").on("click", ".address-picker .save-map", function() {
			settings.position = settings.marker.getPosition();
			if ($.isFunction(settings.save_callback)) {
				settings.save_callback.call(settings);
			}
			// 隐藏
			$(container).parents(".address-picker").find(".map-footer").hide();
		});

		// 
		$("body").on("click", ".address-picker .back-map", function() {
			if (settings.position) {
				settings.addMarker(settings.position);
			}
			// 隐藏
			$(container).parents(".address-picker").find(".map-footer").hide();

			if ($.isFunction(settings.back_callback)) {
				settings.back_callback.call(settings);
			}
		});

		return settings;
	}

})(jQuery);