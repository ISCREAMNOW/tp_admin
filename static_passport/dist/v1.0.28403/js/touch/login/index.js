define("touch/login/index", ["../service/sms", "library/q", "../../safeLogin/dialog", "library/template", "templates/Dialog"], function (a) {
    function b(a) {
        function b(b) {
            b.ticket && (o.captcha_ticket = b.ticket, Jumei.show_ajax(), $.ajax({
                url: "/mobile/Login/ajax_login",
                success: a,
                error: function () {
                    Jumei.hide_ajax(), new m({
                        buttons: 1,
                        okText: "我知道了",
                        showTitle: !1,
                        content: "网络故障，请再试一次",
                        okCallback: function () {
                        }
                    }).show()
                },
                timeout: 6e4,
                type: "post",
                data: o,
                dataType: "json"
            }))
        }

        n = !0;
        var c = {callback: b, showHeader: !0, themeColor: "ed145b"};
        capInit(document, c)
    }

    function c() {
        var a = window.NC_APPKEY, b = window.NC_SCENE, c = [a, (new Date).getTime(), Math.random()].join(":"), d = {
            renderTo: "#aliyun_verify",
            appkey: a,
            scene: b,
            token: c,
            callback: function (a) {
                a.token = c, a.nc_scene = b, window.ALIYUN_DATA = a
            },
            error: function () {
            },
            verifycallback: function (a) {
                "200" == a.code
            }
        };
        NoCaptcha.init(d), NoCaptcha.setEnabled(!0)
    }

    function d(a) {
        Jumei.hide_ajax(), window.GT_VERIFY = a.geetest, window.has_hash = a.hash_code, window.QCLOUD_VERIFY = a.qclount_captcha, window.aliyun_captcha = a.aliyun_captcha, window.ALIYUN_DATA = null, window.aliyun_captcha && NoCaptcha.reset(), !window.GT_VERIFY && $("#geetest-wrap").hide(), !window.has_hash && $("#verify_code").hide(), 0 != a.status && ($("#signup-hashcode-confirm").val(""), window.QCLOUD_VERIFY || (window.GT_VERIFY || window.has_hash) && window.change_code()), a && a.status ? 2 === a.status ? new m({
                    buttons: 1,
                    okText: "我知道了",
                    showTitle: !1,
                    content: "验证码输入错误，请重新输入",
                    okCallback: function () {
                    }
                }).show() : 3 === a.status ? new m({
                        buttons: 1,
                        okText: "我知道了",
                        showTitle: !1,
                        content: '<span>您输入的登录名不存在，请核对后重新输入或<a href="/mobile/Login/register?login" class="decoration">注册</a></span>',
                        okCallback: function () {
                        }
                    }).show() : 5 === a.status ? new m({
                            buttons: 1,
                            okText: "我知道了",
                            showTitle: !1,
                            content: '<span>您输入的密码错误，请核对后重新输入或<a href="/mobile/Login/reset" class="decoration">找回密码</a></span>',
                            okCallback: function () {
                            }
                        }).show() : 7 === a.status ? new m({
                                buttons: 1,
                                okText: "我知道了",
                                showTitle: !1,
                                content: a.msg,
                                okCallback: function () {
                                    window.location.reload()
                                }
                            }).show() : 8 === a.status ? new m({
                                    buttons: 1,
                                    okText: "我知道了",
                                    showTitle: !1,
                                    content: "验证失败",
                                    okCallback: function () {
                                    }
                                }).show() : 9 === a.status && 1 == a.need_valid_info ? location.href = "/m/verification/info" + (window.REDIRECT ? "?redirect=" + encodeURIComponent(window.REDIRECT) : "") : 10 === a.status && 1 == a.need_bind_mobile ? location.href = "/i/mobile/bind" + (window.REDIRECT ? "?redirect=" + encodeURIComponent(window.REDIRECT) : "") : 11 === a.status && 1 == a.need_valid_mobile ? location.href = "/m/verification/valid_mobile" + (window.REDIRECT ? "?redirect=" + encodeURIComponent(window.REDIRECT) : "") : a.msg && new m({
                                                buttons: 1,
                                                okText: "我知道了",
                                                showTitle: !1,
                                                content: a.msg,
                                                okCallback: function () {
                                                }
                                            }).show() : $.ajax({
                url: "/i/account/login_m", error: function () {
                    var a = window.REDIRECT;
                    location.href = a || "/"
                }
            })
    }

    function e() {
    }

    function f() {
        return "hash_code" == DYNAMIC_SHOW_VERIFY_CODE
    }

    function g() {
        return "geetest" == DYNAMIC_SHOW_VERIFY_CODE
    }

    function h() {
        $("#dynamic-geetest-wrap").hide(), $("#dynamic_verify_code").hide(), "geetest" == DYNAMIC_SHOW_VERIFY_CODE ? $("#dynamic-geetest-wrap").attr("style", "display: -webkit-box;display: -webkit-flex;display:-ms-flexbox; display: flex;") : "hash_code" == DYNAMIC_SHOW_VERIFY_CODE && $("#dynamic_verify_code").attr("style", "display: -webkit-box;display: -webkit-flex;display:-ms-flexbox; display: flex;")
    }

    function i() {
        "geetest" == DYNAMIC_SHOW_VERIFY_CODE ? (window.GT_DYNAMIC_DATA && window.GT_DYNAMIC_DATA.selector(".gt_refresh_button").click(), window.GT_DYNAMIC_DATA = null) : "hash_code" == DYNAMIC_SHOW_VERIFY_CODE && (t.attr("src", window.DYNAMIC_VERIFY_URL + "&" + (new Date).valueOf()), $("#dynamic_hash_code").val(""))
    }

    function j() {
        s.bind("input", function () {
            var a = $.trim(q.val());
            $(this).val().length > 3 && a.length > 0 && /^1\d{10}$/.test(a) ? $("#ga_dynamic_login").addClass("hover") : $("#ga_dynamic_login").removeClass("hover")
        })
    }

    function k() {
        var a = $("#login input[type=password]"), b = $("#login #account");
        a.bind("input", function () {
            var a = $.trim(b.val());
            $(this).val().length > 3 && a.length > 0 ? $("#ga_login").addClass("hover") : $("#ga_login").removeClass("hover")
        })
    }

    var l = a("../service/sms"), m = a("../../safeLogin/dialog"), n = !1, o = {};
    window.NoCaptcha && c(), window.change_code = function () {
        if (!window.QCLOUD_VERIFY)if ($("#geetest-wrap").hide(), $("#verify_code").hide(), window.GT_VERIFY) window.GT_DATA && GT_DATA.selector(".gt_refresh_button").click(), window.GT_DATA = null, $("#geetest-wrap").show(); else if (window.NoCaptcha) NoCaptcha.reset(); else {
            var a = new Date, b = "/i/account/hash_code?from=login&" + a.getTime();
            document.getElementById("code").src = b, $("#verify_code").show()
        }
    }, $(function () {
        $("#geetest-wrap").hide(), $("#verify_code").hide(), window.GT_VERIFY ? $("#geetest-wrap").show() : window.has_hash && $("#verify_code").show()
    }), $("#ga_login").click(function () {
        var a = $(this).parents("form"), c = a.find("#account"), e = a.find("input[type=password]"), f = a.find("#signup-hashcode-confirm"), g = "" == c.val(), h = "" == e.val(), i = window.has_hash && !window.GT_DATA && "" == f.val(), j = window.GT_VERIFY && !window.GT_DATA, k = window.NoCaptcha && !window.ALIYUN_DATA;
        if (g || h) {
            if (g)return new m({
                buttons: 1, okText: "我知道了", showTitle: !1, content: "请输入用户名", okCallback: function () {
                }
            }).show(), !1;
            if (h)return new m({
                buttons: 1,
                okText: "我知道了",
                showTitle: !1,
                content: "请输入6-16位登陆密码",
                okCallback: function () {
                }
            }).show(), !1
        } else if (window.QCLOUD_VERIFY); else if (i || j || k) {
            if (window.change_code(), i)return new m({
                buttons: 1,
                okText: "我知道了",
                showTitle: !1,
                content: "请输入验证码",
                okCallback: function () {
                }
            }).show(), !1;
            if (j)return new m({
                buttons: 1, okText: "我知道了", showTitle: !1, content: "请拖动完成验证", okCallback: function () {
                }
            }).show(), !1;
            if (k)return new m({
                buttons: 1, okText: "我知道了", showTitle: !1, content: "请拖动完成验证", okCallback: function () {
                }
            }).show(), !1
        }
        return o.email = Jumei.str_trim(c.val()), o.password = Jumei.str_trim(e.val()), o.redirect = window.REDIRECT, window.QCLOUD_VERIFY ? n ? capRefresh() : b(d) : (window.GT_VERIFY ? (o.challenge = GT_DATA.challenge, o.validate = GT_DATA.validate, o.seccode = GT_DATA.seccode) : window.NoCaptcha ? o = $.extend(o, window.ALIYUN_DATA) : window.has_hash && (o.hash_code = f.val()), Jumei.show_ajax(), $.ajax({
                url: "/mobile/Login/ajax_login",
                success: d,
                error: function () {
                    Jumei.hide_ajax(), new m({
                        buttons: 1,
                        okText: "我知道了",
                        showTitle: !1,
                        content: "网络故障，请再试一次",
                        okCallback: function () {
                        }
                    }).show()
                },
                timeout: 6e4,
                type: "post",
                data: o,
                dataType: "json"
            })), !1
    }), window.gt_custom_ajax = function (a, b) {
        "login-dynamic-form" == $(b(".gt_input")).parents("form").attr("id") ? a && (window.GT_DYNAMIC_DATA = {}, GT_DYNAMIC_DATA.challenge = b(".geetest_challenge").value, GT_DYNAMIC_DATA.validate = b(".geetest_validate").value, GT_DYNAMIC_DATA.seccode = b(".geetest_seccode").value, GT_DYNAMIC_DATA.selector = b) : a && (window.GT_DATA = {}, GT_DATA.challenge = b(".geetest_challenge").value, GT_DATA.validate = b(".geetest_validate").value, GT_DATA.seccode = b(".geetest_seccode").value, GT_DATA.selector = b)
    };
    var p = $(".register_yzm"), q = $("#dynamic_mobile"), r = $("#dynamic_hash_code"), s = $("#dynamic_password"), t = $("#img_dynamic_hash_code"), u = new l({
        onCountStart: function () {
            var a = p.text();
            p.data("text", a)
        }, onCountDown: function (a) {
            p.text(a + " 秒"), p.addClass("active")
        }, onCountStop: function () {
            h(), i(), p.removeClass("active"), p.text("验证")
        }
    });
    h(), t.click(i), j(), k(), p.click(function (a) {
        if (!u.canSend())return a.preventDefault(), !1;
        var b = $.trim(q.val());
        if (0 == b.length)return void new m({
            buttons: 1,
            okText: "我知道了",
            showTitle: !1,
            content: "请输入 11 位手机号码",
            okCallback: function () {
            }
        }).show();
        if (!/^1\d{10}$/.test(b))return void new m({
            buttons: 1,
            okText: "我知道了",
            showTitle: !1,
            content: "您输入的手机号码格式有误，需为 11 位数字格式",
            okCallback: function () {
            }
        }).show();
        var c = {from: "touch", mobile: b};
        if (g()) {
            if (!window.GT_DYNAMIC_DATA)return void new m({
                buttons: 1,
                okText: "我知道了",
                showTitle: !1,
                content: "请拖动完成验证",
                okCallback: function () {
                }
            }).show();
            c.challenge = window.GT_DYNAMIC_DATA.challenge, c.seccode = window.GT_DYNAMIC_DATA.seccode, c.validate = window.GT_DYNAMIC_DATA.validate
        } else if (f()) {
            var d = $.trim(r.val());
            if (4 != d.length)return void new m({
                buttons: 1,
                okText: "我知道了",
                showTitle: !1,
                content: "请输入图片验证码",
                okCallback: function () {
                }
            }).show();
            c.hash_code = d
        }
        u.send(c).then(function (a) {
            if (a.dynamic_verify_type) {
                var b = window.DYNAMIC_SHOW_VERIFY_CODE;
                b != a.dynamic_verify_type && (window.DYNAMIC_SHOW_VERIFY_CODE = a.dynamic_verify_type)
            }
            new m({
                buttons: 1,
                okText: "我知道了",
                showTitle: !1,
                content: "动态密码已发至您的手机，" + window.dynamicSmsExpireTime + "分钟内有效，请注意查收",
                okCallback: function () {
                }
            }).show()
        }, function (a) {
            if (a.dynamic_verify_type) {
                var b = window.DYNAMIC_SHOW_VERIFY_CODE;
                b != a.dynamic_verify_type && (window.DYNAMIC_SHOW_VERIFY_CODE = a.dynamic_verify_type)
            }
            h(), i(), 0 == a.enable && e(), 10008 == a.errcode ? new m({
                    buttons: 1,
                    okText: "我知道了",
                    showTitle: !1,
                    content: "您输入的手机号尚未注册，请核对后重新输入",
                    okCallback: function () {
                    }
                }).show() : 10009 == a.errcode ? (e(), new m({
                        buttons: 1,
                        okText: "我知道了",
                        showTitle: !1,
                        content: "您的手机获取动态密码过于频繁，请使用普通登录",
                        okCallback: function () {
                        }
                    }).show()) : 10002 == a.errcode ? new m({
                            buttons: 1,
                            okText: "我知道了",
                            showTitle: !1,
                            content: "请拖动完成验证",
                            okCallback: function () {
                            }
                        }).show() : 10001 == a.errcode ? (e(), new m({
                                buttons: 1,
                                okText: "我知道了",
                                showTitle: !1,
                                content: "您所在IP获取动态密码过于频繁，请使用普通登录",
                                okCallback: function () {
                                }
                            }).show()) : 10010 == a.errcode ? new m({
                                    buttons: 1,
                                    okText: "我知道了",
                                    showTitle: !1,
                                    content: "您获取动态密码过于频繁，请稍后再试或使用普通登录",
                                    okCallback: function () {
                                    }
                                }).show() : 10004 == a.errcode ? new m({
                                        buttons: 1,
                                        okText: "我知道了",
                                        showTitle: !1,
                                        content: "请按输入图片验证码，不区分大小写",
                                        okCallback: function () {
                                        }
                                    }).show() : 10005 == a.errcode ? new m({
                                            buttons: 1,
                                            okText: "我知道了",
                                            showTitle: !1,
                                            content: "验证码输入错误，请重新输入",
                                            okCallback: function () {
                                            }
                                        }).show() : 10006 == a.errcode ? new m({
                                                buttons: 1,
                                                okText: "我知道了",
                                                showTitle: !1,
                                                content: "请输入 11 位手机号码",
                                                okCallback: function () {
                                                }
                                            }).show() : 10007 == a.errcode ? new m({
                                                    buttons: 1,
                                                    okText: "我知道了",
                                                    showTitle: !1,
                                                    content: "您输入的手机号码格式有误，需为 11 位数字格式",
                                                    okCallback: function () {
                                                    }
                                                }).show() : 10003 == a.errcode ? new m({
                                                        buttons: 1,
                                                        okText: "我知道了",
                                                        showTitle: !1,
                                                        content: "请拖动完成验证",
                                                        okCallback: function () {
                                                        }
                                                    }).show() : new m({
                                                        buttons: 1,
                                                        okText: "我知道了",
                                                        showTitle: !1,
                                                        content: "系统繁忙，请刷新页面重试！",
                                                        okCallback: function () {
                                                        }
                                                    }).show()
        })
    }), $("#login-dynamic-form").submit(function (a) {
        a.preventDefault(), a.stopPropagation();
        var b = $.trim(q.val());
        if (0 == b.length)return void new m({
            buttons: 1,
            okText: "我知道了",
            showTitle: !1,
            content: "请输入 11 位手机号码",
            okCallback: function () {
            }
        }).show();
        if (!/^1\d{10}$/.test(b))return void new m({
            buttons: 1,
            okText: "我知道了",
            showTitle: !1,
            content: "您输入的手机号码格式有误，需为 11 位数字格式",
            okCallback: function () {
            }
        }).show();
        var c = {mobile: b}, d = $.trim(s.val());
        return d.length < 3 ? void new m({
                buttons: 1,
                okText: "我知道了",
                showTitle: !1,
                content: "请输入短信验证码",
                okCallback: function () {
                }
            }).show() : (c.dynamicCode = d, 0 == $("#ajax-loading").length && $(".warper").append('<div class="ajax-loading" id="ajax-loading"><img src="/static_passport/images/ajax-loader.gif" alt=""></div>'), $("#ajax-loading").show(), void $.post("/mobile/Login/ajax_dynamiclogin", c, function (a) {
                $("#ajax-loading").hide(), 0 === a.errcode ? $.ajax({
                        url: "/i/account/login_m", error: function () {
                            var a = REDIRECT;
                            location.href = a || "/"
                        }
                    }) : (20008 !== a.errcode && i(), 20001 == a.errcode ? new m({
                            buttons: 1,
                            okText: "我知道了",
                            showTitle: !1,
                            content: "您输入的手机号码格式有误，需为 11 位数字格式",
                            okCallback: function () {
                            }
                        }).show() : 20003 == a.errcode ? new m({
                                buttons: 1,
                                okText: "我知道了",
                                showTitle: !1,
                                content: "您输入的手机号尚未注册，请核对后重新输入",
                                okCallback: function () {
                                }
                            }).show() : 20002 == a.errcode ? new m({
                                    buttons: 1,
                                    okText: "我知道了",
                                    showTitle: !1,
                                    content: "请输入 6 位手机动态密码",
                                    okCallback: function () {
                                    }
                                }).show() : 20007 == a.errcode ? new m({
                                        buttons: 1,
                                        okText: "我知道了",
                                        showTitle: !1,
                                        content: "动态密码过期，请重新获取",
                                        okCallback: function () {
                                        }
                                    }).show() : 20008 == a.errcode ? new m({
                                            buttons: 1,
                                            okText: "我知道了",
                                            showTitle: !1,
                                            content: "您输入的动态密码有误，请核对后重新输入",
                                            okCallback: function () {
                                            }
                                        }).show() : new m({
                                            buttons: 1,
                                            okText: "我知道了",
                                            showTitle: !1,
                                            content: "系统繁忙，请刷新页面重试！",
                                            okCallback: function () {
                                            }
                                        }).show())
            }, "json"))
    }), $(function () {
        $("#use_jumei_account").bind("click", function () {
            $("#use_iphone_login").parents("form").show(), $("#use_jumei_account").parents("form").hide()
        }), $("#use_iphone_login").bind("click", function () {
            $("#use_iphone_login").parents("form").hide(), $("#use_jumei_account").parents("form").show()
        }), $("#back").bind("click", function () {
            return location.href = document.referrer, !1
        })
    })
});