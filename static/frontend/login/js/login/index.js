define("login/index", ["../library/placeholder", "../library/promise", "../library/validator", "../library/util", "../library/clickmap", "./text_interactive_ver"], function (a) {
    function b() {
        var a = $(".loginBord").height();
        $(".loginWrap").css("height", a).css("margin-bottom", 50)
    }

    function c() {
        l = new noCaptcha;
        var a = window.NC_APPKEY, b = window.NC_SCENE, c = [a, (new Date).getTime(), Math.random()].join(":"), e = {
            renderTo: "#aliyun_verify",
            appkey: a,
            scene: b,
            token: c,
            callback: function (a) {
                a.token = c, a.nc_scene = b, window.ALIYUN_DATA = a, d($("#aliyun_verify"))
            }
        };
        l.init(e)
    }

    function d(a) {
        "string" == typeof a && (a = $(a)), a.parent().removeClass("error_ui").find(".invalid").hide()
    }

    function e(a, b) {
        a.parent().addClass("error_ui").find(".invalid").show().find(".msg").html(b)
    }

    function f(a, b) {
        d(a), a.parent().addClass("hint_ui").find(".hint").html(b).show()
    }

    function g(a) {
        a.parent().removeClass("hint_ui").find(".hint").hide()
    }

    function h() {
        var a = $(".gt_hover_tooltip");
        0 == a.length && (a = $('<div class="gt_hover_tooltip">不是拖图片哦，请拖图片下方的滚动条</div>'), $("body").append(a)), $(".gt_guide_tip").each(function () {
            $(this).find("a").eq(1).text("拖动滚动条，完成拼图验证")
        }), $(".gt_ads_holder").mousemove(function (b) {
            var c = b.clientX, d = b.clientY + $("body").scrollTop() + 20;
            a.css({left: c, top: d}).show()
        }).mouseleave(function () {
            a.hide()
        })
    }

    a("../library/placeholder");
    var i = a("../library/promise"), j = a("../library/validator"), k = a("../library/util");
    a("../library/clickmap");
    var l, m = a("./text_interactive_ver"), n = {
        showHeader: !0, themeColor: "ed145b", callback: function (a) {
            0 == a.ret && (document.getElementById("captcha_ticket").value = a.ticket, d($("#captcha_ticket")))
        }
    };
    $(function () {
        "qcloud" == window.SHOW_VERIFY_CODE && (capInit(document.getElementById("TCaptcha"), n), $("#getPhoneCode").click(function () {
            capRefresh()
        })), "aliyun" == window.SHOW_VERIFY_CODE && c()
    }), $(function () {
        function a(a, b) {
            D[a] = b
        }

        function c() {
            "geetest" == window.SHOW_VERIFY_CODE ? (window.GT_DATA && window.GT_DATA.selector(".gt_refresh_button").click(), window.GT_DATA = null) : "hanzi" == window.SHOW_VERIFY_CODE ? window.textInteractiveVer && window.textInteractiveVer.refreshVerImg() : "hash_code" == window.SHOW_VERIFY_CODE && ($("#verify_code").val(""), $("#change_verify_code").find("img").attr("src", "/i/account/hash_code?from=login&" + (new Date).valueOf()))
        }

        function h(a) {
            return $("#" + a).val()
        }

        function n() {
            $("#login-user-form .verityWrap").hide(), $("#login-user-form .gtVerifyWrap").hide(), window.textInteractiveVer && window.textInteractiveVer.hide(), "geetest" == window.SHOW_VERIFY_CODE ? (C = ["username", "login_password", "gt_verify"], $("#login-user-form .gtVerifyWrap").show()) : "hanzi" == window.SHOW_VERIFY_CODE ? (window.textInteractiveVer || (window.textInteractiveVer = new m), window.textInteractiveVer.show()) : "hash_code" == window.SHOW_VERIFY_CODE ? (C = ["username", "login_password", "verify_code"], $("#login-user-form .verityWrap").show()) : "qcloud" == window.SHOW_VERIFY_CODE ? C = ["username", "login_password", "captcha_ticket"] : "aliyun" == window.SHOW_VERIFY_CODE && (C = ["username", "login_password", "aliyun_verify"]), "hanzi" != window.SHOW_VERIFY_CODE && c(), $(".loginWrap").addClass("loginWrapVerify"), b()
        }

        function o() {
            var a = {
                email: $("#username").val(),
                password: $("#login_password").val(),
                auto_login: $("#auto_login").is(":checked") ? "on" : "off"
            };
            if ("geetest" == window.SHOW_VERIFY_CODE)a.challenge = GT_DATA.challenge, a.validate = GT_DATA.validate, a.seccode = GT_DATA.seccode; else if ("hanzi" == window.SHOW_VERIFY_CODE && window.textInteractiveVer) {
                if (!window.textInteractiveVer.check())return;
                a.hash_code = window.textInteractiveVer.getVerCode()
            } else"hash_code" == window.SHOW_VERIFY_CODE ? a.hash_code = $("#verify_code").val() : "qcloud" == window.SHOW_VERIFY_CODE ? a.captcha_ticket = document.getElementById("captcha_ticket").value : "aliyun" == window.SHOW_VERIFY_CODE && (a = $.extend(a, window.ALIYUN_DATA));
            $.post("/frontend/Login/ajax_login", a, function (a) {
                console.log(a);
                if (a && a.status) {
                    var b = window.SHOW_VERIFY_CODE;
                    window.SHOW_VERIFY_CODE = a.show_verify_code, a.show_verify_code != b ? n() : c(), "qcloud" == window.SHOW_VERIFY_CODE && (capRefresh(), document.getElementById("captcha_ticket").value = ""), "aliyun" == window.SHOW_VERIFY_CODE && (l && l.reset(), window.ALIYUN_DATA = null), 2 === a.status ? e($("#verify_code"), "验证码输入错误，请重新输入") : 3 === a.status ? e($("#username"), '您输入的登录名不存在，请核对后重新输入或<a href="/frontend/Login/register?login">注册</a>') : 5 === a.status ? e($("#login_password"), '您输入的密码错误，请核对后重新输入或<a href="/i/account/resetreq?signup">找回密码</a>') : 7 === a.status ? alert(a.msg) : 8 === a.status || (9 === a.status && 1 == a.need_valid_info ? location.href = "/i/verification/info" + (window.REDIRECT ? "?redirect=" + encodeURIComponent(window.REDIRECT) : "") : 10 === a.status && 1 == a.need_bind_mobile ? location.href = "/i/phone/bind" + (window.REDIRECT ? "?redirect=" + encodeURIComponent(window.REDIRECT) : "") : 11 === a.status && 1 == a.need_valid_mobile ? location.href = "/i/verification/valid_mobile" + (window.REDIRECT ? "?redirect=" + encodeURIComponent(window.REDIRECT) : "") : a.msg && alert(a.msg))
                } else {
                    // 登录成功
                    var b = window.REDIRECT;
                    location.href = b || "/";
                }
                    /*$.ajax({
                        url: "/frontend/Login/login_m", error: function () {
                            var a = window.IS_OPEN_PASSPORT;
                            if (1 == a){
                                p();
                            }else {
                                var b = window.REDIRECT;
                                location.href = b || "/"
                            }
                        }
                    })*/
            })
        }

        function p() {
            var a = "/frontend/Login/ajax_login";
            $.get(a, {action: "login"}, function (a) {
                $.cookie("jump", a, {path: "/"}), $.cookie("redirect", window.REDIRECT, {path: "/"});
                var b = window.location.href.match(/http[s]?:\/\/(.+?)\//);
                b = b ? b[1] : "passport.jumei.com", window.location.href = "http://" + b + "/i/account/jump"
            })
        }

        function q() {
            return null
        }

        function r(a) {
            var b = $("#" + a), c = j["check_" + a](b.val(), q(a));
            return c.then(function (a) {
                a ? (0 === a && d(b), "function" == typeof a && a(b)) : d(b)
            }, function (a) {
                e(b, a.message)
            }), c
        }

        function s() {
            $("#login-dynamic-form .verityWrap").hide(), $("#login-dynamic-form .gtVerifyWrap").hide(), window.dynamicTextInteractiveVer && window.dynamicTextInteractiveVer.hide(), "geetest" == window.DYNAMIC_VERIFY_TYPE ? (E = ["dynamic_mobile", "dynamic_gt_verify", "dynamic_password"], $("#login-dynamic-form .gtVerifyWrap").show()) : "hanzi" == window.DYNAMIC_VERIFY_TYPE ? (window.dynamicTextInteractiveVer || (window.dynamicTextInteractiveVer = new m({
                wrap: "#login-dynamic-form",
                from: "dynamic_login"
            })), window.dynamicTextInteractiveVer.show()) : "hash_code" == window.DYNAMIC_VERIFY_TYPE && (E = ["dynamic_mobile", "dynamic_verify_code", "dynamic_password"], $("#login-dynamic-form .verityWrap").show()), "hanzi" != window.DYNAMIC_VERIFY_TYPE && u(), $(".loginWrap").addClass("loginWrapVerify"), b()
        }

        function t() {
            $("#dynamic_mobile").bind("blur", function () {
                var b = $(this), c = b.val();
                D.mobile && D.mobile != c && (u(), D.sms_times_over && y()), a("mobile", c)
            }), $("#change_dynamic_verify_code").click(u), window.DYNAMIC_VERIFY_TYPE && s(), $("#login-dynamic-form").submit(function (a) {
                a.preventDefault(), E.map(d), i.all(E.map(r)).then(v, function () {
                    g(H), u()
                })
            }), F.click(function (a) {
                if (D.sms_times_over || D.sms_counting)return a.preventDefault(), !1;
                var b = ["dynamic_mobile"];
                "geetest" == window.DYNAMIC_VERIFY_TYPE ? b = ["dynamic_mobile", "dynamic_gt_verify"] : "hash_code" == window.DYNAMIC_VERIFY_TYPE && (b = ["dynamic_mobile", "dynamic_verify_code"]), i.all(b.map(function (a) {
                    return r(a)
                })).then(A, function () {
                    window.DYNAMIC_VERIFY_TYPE && s(), u()
                })
            }), ["dynamic_mobile", "dynamic_verify_code", "dynamic_password"].map(function (a) {
                var b = $("#" + a);
                b.focus(function (a) {
                    d(b), b.trigger("focusin")
                })
            })
        }

        function u() {
            "geetest" == window.DYNAMIC_VERIFY_TYPE ? (window.GT_DYNAMIC_DATA && window.GT_DYNAMIC_DATA.selector(".gt_refresh_button").click(), window.GT_DYNAMIC_DATA = null) : "hanzi" == window.DYNAMIC_VERIFY_TYPE ? window.dynamicTextInteractiveVer && window.dynamicTextInteractiveVer.refreshVerImg() : "hash_code" == window.DYNAMIC_VERIFY_TYPE && ($("#dynamic_verify_code").val(""), $("#change_dynamic_verify_code").find("img").attr("src", "/i/account/hash_code?from=dynamic_login&" + (new Date).valueOf())), a("sms_need_new_verify", !1)
        }

        function v() {
            var a = {
                mobile: h("dynamic_mobile"),
                dynamicCode: h("dynamic_password"),
                auto_login: $("#dynamic_auto_login").is(":checked") ? "on" : "off"
            };
            $.post("/frontend/Login/ajax_dynamiclogin", a, function (a) {
                if (0 === a.errcode) {
                    var b = window.REDIRECT;
                    location.href = b || "/"
                    /*$.ajax({
                        // TODO 手机端 登录
                        url: "/i/account/login_m", error: function () {
                         var a = window.IS_OPEN_PASSPORT;
                         if ("1" == a)p(); else {
                         var b = window.REDIRECT;
                         location.href = b || "/"
                         }
                         }
                    });*/
                }else {
                    var b = window.DYNAMIC_VERIFY_TYPE;
                    window.DYNAMIC_VERIFY_TYPE = a.dynamic_verify_type, b != a.dynamic_verify_type ? s() : 20008 !== a.errcode && u(), g(H), 20001 == a.errcode ? e(I, "您输入的手机号码格式有误，需为 11 位数字格式") : 20003 == a.errcode ? e(I, '您输入的手机号尚未注册，请核对后重新输入或<a href="/frontend/Login/register?mobile=' + h("dynamic_mobile") + '&login">注册</a>') : 20002 == a.errcode ? e(H, "请输入 6 位手机动态密码") : 20007 == a.errcode ? e(H, "动态密码过期，请重新获取") : 20008 == a.errcode ? e(H, " 您输入的动态密码有误，请核对后重新输入") : alert("系统繁忙，请刷新页面重试！")
                }
            })
        }

        function w() {
            clearInterval(F.data("timer")), F.text("获取手机动态密码").data("timer", null), a("sms_counting", !1)
        }

        function x() {
            function b() {
                return 0 === c ? void w() : (F.text(c + " 秒后重试"), void(c -= 1))
            }

            var c = 60;
            b(), F.data("timer", setInterval(b, 1e3)), a("sms_counting", !0)
        }

        function y() {
            $("#getPhoneCode").text("获取手机动态密码"), a("sms_times_over", !1)
        }

        function z() {
            $("#getPhoneCode").text("明日再试"), a("sms_times_over", !0)
        }

        function A() {
            if (window.DYNAMIC_VERIFY_TYPE && D.sms_need_new_verify)return u(), "geetest" == window.DYNAMIC_VERIFY_TYPE ? e($("#dynamic_gt_verify"), "请拖动完成验证") : "hanzi" == window.DYNAMIC_VERIFY_TYPE ? e(G, "请点击文字输入验证码") : "hash_code" == window.DYNAMIC_VERIFY_TYPE && e(G, "请先输入验证码"), !1;
            var b = {};
            if ("geetest" == window.DYNAMIC_VERIFY_TYPE)b.validate = GT_DYNAMIC_DATA.validate, b.challenge = GT_DYNAMIC_DATA.challenge, b.seccode = GT_DYNAMIC_DATA.seccode; else if ("hanzi" == window.DYNAMIC_VERIFY_TYPE) {
                if (!window.dynamicTextInteractiveVer || !window.dynamicTextInteractiveVer.check())return !1;
                b.hash_code = window.dynamicTextInteractiveVer.getVerCode()
            } else"hash_code" == window.DYNAMIC_VERIFY_TYPE && (b.hash_code = h("dynamic_verify_code"));
            return D.sms_counting ? !1 : D.sms_times_over ? !1 : (b.mobile = h("dynamic_mobile"), a("mobile_sending", !0), x(), void $.getJSON("/frontend/Login/ajax_send_sms_for_mobile_login", b, function (b) {
                a("mobile_sending", !1);
                var c = window.DYNAMIC_VERIFY_TYPE;
                window.DYNAMIC_VERIFY_TYPE = b.dynamic_verify_type, c != b.dynamic_verify_type ? s() : 0 !== b.errcode && u(), 0 === b.errcode ? (a("mobile_verify_sent", !0), H.parent().find(".focus_text").text("请输入 6 位手机动态密码"), a("sms_need_new_verify", !0), f(H, "动态密码已发至您的手机，" + window.dynamicSmsExpireTime + "分钟内有效，请注意查收")) : (g(H), w(), 0 == b.enable && z(), 10008 == b.errcode ? e(I, '您输入的手机号尚未注册，请核对后重新输入或<a href="/frontend/Login/register?mobile=' + h("dynamic_mobile") + '&login">注册</a>') : 10009 == b.errcode ? (z(), e(I, "您的手机获取动态密码过于频繁，请使用普通登录")) : 10002 == b.errcode ? e($("#dynamic_gt_verify"), "请拖动完成验证") : 10001 == b.errcode ? (z(), e(H, "您所在IP获取动态密码过于频繁，请使用普通登录")) : 10010 == b.errcode ? e(H, "您获取动态密码过于频繁，请稍后再试或使用普通登录") : 10004 == b.errcode ? e(G, "请按右图输入验证码，不区分大小写") : 10005 == b.errcode ? e(G, "验证码输入错误，请重新输入") : 10006 == b.errcode ? e(I, "请输入 11 位手机号码") : 10007 == b.errcode ? e(I, "您输入的手机号码格式有误，需为 11 位数字格式") : 10003 == b.errcode ? e($("#dynamic_gt_verify"), "请拖动完成验证") : alert("系统繁忙，请刷新页面重试！"))
            }))
        }

        var B = $("#login_password"), C = ["username", "login_password"], D = {method: "normal"}, E = ["dynamic_mobile", "dynamic_password"], F = $("#getPhoneCode"), G = $("#dynamic_verify_code"), H = $("#dynamic_password"), I = $("#dynamic_mobile");
        $("#change_verify_code").click(c), $("#login-user-form").submit(function (a) {
            a.preventDefault(), C.map(d), i.all(C.map(r)).then(function () {
                o()
            }, c)
        }), C.map(function (a) {
            var b = $("#" + a);
            b.focus(function () {
                d(b), b.trigger("focusin")
            })
        }), window.SHOW_VERIFY_CODE && c(), k.setUpperCaseNotify(B), $(".iconAccout p span").click(function () {
            $(".icon-p").toggle("100"), $(this).find("i").toggleClass("slider1")
        }), k.ieFocusTextPolyfill(), $("input, textarea").placeholder(), $("#username").focus(), window.SHOW_VERIFY_CODE && (n(), "hash_code" == window.SHOW_VERIFY_CODE && $("#login-user-form .verityWrap").insertAfter($("#login-user-form .textbox_ui.pass"))), t(), $("input[name=method]").click(function () {
            var c = $(this).attr("rel");
            a("method", $(this).val()), $("form").hide(), $("#" + c).show(), b()
        }), window.isOpenDynamicLogin && ($(".radio_wrapper").css({display: "block"}), $("#radio_dynamic").click()), b()
    }), window.gt_custom_ajax = function (a, b, c) {
        "login-dynamic-form" == $(b(".gt_input")).parents("form").attr("id") ? a && (window.GT_DYNAMIC_DATA = {}, GT_DYNAMIC_DATA.challenge = b(".geetest_challenge").value, GT_DYNAMIC_DATA.validate = b(".geetest_validate").value, GT_DYNAMIC_DATA.seccode = b(".geetest_seccode").value, GT_DYNAMIC_DATA.selector = b, d($("#dynamic_gt_verify"))) : a && (window.GT_DATA = {}, GT_DATA.challenge = b(".geetest_challenge").value, GT_DATA.validate = b(".geetest_validate").value, GT_DATA.seccode = b(".geetest_seccode").value, GT_DATA.selector = b, d($("#gt_verify")))
    }, window.gt_custom_refresh = function () {
        h()
    }, window.bind_interval = setInterval(function () {
        2 == $(".gt_slider_knob").length && (h(), clearInterval(window.bind_interval))
    }, 100)
}), define("library/placeholder", [], function (a, b, c) {
    !function (a, b, c) {
        function d(a) {
            var b = {}, d = /^jQuery\d+$/;
            return c.each(a.attributes, function (a, c) {
                c.specified && !d.test(c.name) && (b[c.name] = c.value)
            }), b
        }

        function e() {
            var a = c(this);
            a.val() === a.attr("placeholder") && a.hasClass("placeholder") && (a.data("placeholder-password") ? a.hide().next().show().focus().attr("id", a.removeAttr("id").data("placeholder-id")) : a.val("").removeClass("placeholder"))
        }

        function f() {
            var a, b = c(this), f = this.id;
            if ("" === b.val()) {
                if (b.is(":password")) {
                    if (!b.data("placeholder-textinput")) {
                        try {
                            a = b.clone().attr({type: "text"})
                        } catch (g) {
                            a = c("<input>").attr(c.extend(d(this), {type: "text"}))
                        }
                        a.removeAttr("name").data("placeholder-password", !0).data("placeholder-id", f).bind("focus.placeholder", e), b.data("placeholder-textinput", a).data("placeholder-id", f).before(a)
                    }
                    b = b.removeAttr("id").hide().prev().attr("id", f).show()
                }
                b.addClass("placeholder").val(b.attr("placeholder"))
            } else b.removeClass("placeholder")
        }

        var g, h = "placeholder" in b.createElement("input"), i = "placeholder" in b.createElement("textarea"), j = c.fn;
        h && i ? (g = j.placeholder = function () {
            return this
        }, g.input = g.textarea = !0) : (g = j.placeholder = function () {
            return this.filter((h ? "textarea" : ":input") + "[placeholder]").not(".placeholder").bind("focus.placeholder", e).bind("blur.placeholder", f).trigger("blur.placeholder").end()
        }, g.input = h, g.textarea = i, c(a).bind("unload.placeholder", function () {
            c(".placeholder").val("")
        }))
    }(window, document, jQuery)
}), define("library/promise", [], function (a, b, c) {
    var d = function (a) {
        function b(a, b) {
            setTimeout(function () {
                for (; e.length;) {
                    var c = e.shift();
                    if ("function" == typeof c[a]) {
                        c[a](b)
                    }
                }
            }, 1)
        }

        function c(a) {
            b(0, a)
        }

        function d(a) {
            b(1, a)
        }

        var e = [];
        a(c, d), this.then = function (a, b) {
            return e.push([a, b]), this
        }, this.chain = this.then, this["catch"] = function (a) {
            return this.then(void 0, a)
        }
    };
    d.deferred = function () {
        var a = [];
        return a.promise = new d(function (b, c) {
            a.resolve = b, a.reject = c
        }), a
    }, d.resolve = d.cast = function (a) {
        return new d(function (b) {
            b(a)
        })
    }, d.reject = function (a) {
        return new d(function (b, c) {
            c(a)
        })
    }, d.all = function (a) {
        function b(a, b) {
            g[b] = a, f--, 0 == f && e.resolve(g)
        }

        function c(a) {
            e.reject(a)
        }

        var e = d.deferred(), f = a.length, g = [];
        return a.forEach(function (a, e) {
            return a instanceof d ? void a.then(function (a) {
                b(a, e)
            }, function (a) {
                c(a)
            }) : void b(a, e)
        }), e.promise
    }, d.race = function (a) {
        function b(a, b) {
            f && (e.resolve(a), f = !1)
        }

        function c(a) {
            f && (e.reject(a), f = !1)
        }

        var e = d.deferred(), f = !0;
        return a.forEach(function (a, e) {
            return a instanceof d ? void a.then(function (a) {
                b(a, e)
            }, function (a) {
                c(a)
            }) : void b(a, e)
        }), e.promise
    }, d.fulfill = function (a) {
        function b(a, b) {
            g[b] = a, f--, 0 == f && e.resolve(g)
        }

        function c(a) {
            e.reject(a)
        }

        var e = d.deferred(), f = a.length, g = [];
        return a.forEach(function (a, e) {
            return a instanceof d ? void a.then(function (a) {
                b(a, e)
            }, function (a) {
                c(a)
            }) : void b(a, e)
        }), e.promise
    }, c.exports = d
}), define("library/validator", ["library/promise"], function (a, b, c) {
    var d = a("library/promise"), e = {}, f = {
        email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        mobile: /^1\d{10}$/,
        digital: /\d+/,
        lowercase: /[a-z]+/,
        uppercase: /[A-Z]+/,
        symbols: /[_!@#\$%\^&\*\(\)\\\|\/\?\.\<\>'"\{\}\[\]=\-\~\,\;\:\s]+/,
        password: /^[a-zA-Z0-9_!@#\$%\^&\*\(\)\\\|\/\?\.\<\>'"\{\}\[\]=\-\~\,\;\:\s]+$/,
        mobile_verify: /^\d{6}$/,
        mobile_verify_voice: /^\d{4}$/
    }, g = {
        check_username: function (a) {
            return new d(function (b, c) {
                0 === a.length ? c(new Error("请输入登录名，登录名可能是手机号、邮箱或用户名")) : b()
            })
        }, check_login_password: function (a) {
            return new d(function (b, c) {
                0 === a.length ? c(new Error("请输入密码，密码可能为字母、数字或符号的组合")) : b()
            })
        }, check_email: function (a) {
            return new d(function (b, c) {
                return 0 === a.length ? void c(new Error("Email为空")) : (f.email.test(a) ? b() : c(new Error("Email格式不正确")), void b())
            })
        }, check_mobile_on_blur: function (a) {
            return new d(function (b, c) {
                function d(d) {
                    0 === d.status ? c(new Error('该手机号已存在，如果您是该用户，请立刻 <a href="/i/account/login?signup&mobile=' + a + '">登录</a>')) : b(d.status)
                }

                0 === a.length ? b() : /^170/.test(a) ? c(new Error("抱歉，暂不支持虚拟运营商手机号码注册！")) : !f.mobile.test(a) && a.length > 0 ? c(new Error("您输入的手机号码格式有误，需为 11 位数字格式")) : e[a] ? d(e[a]) : $.post("/i/account/check_mobile", {mobile: a}, function (b) {
                    e[a] = b, d(b)
                })
            })
        }, check_mobile: function (a) {
            return new d(function (b, c) {
                function d(d) {
                    0 === d.status ? c(new Error('该手机号已存在，如果您是该用户，请立刻 <a href="/i/account/login?signup&mobile=' + a + '">登录</a>')) : b(d.status)
                }

                0 === a.length ? c(new Error("请输入 11 位手机号码")) : f.mobile.test(a) ? /^170/.test(a) ? c(new Error("抱歉，暂不支持虚拟运营商手机号码注册！")) : e[a] ? d(e[a]) : $.post("/i/account/check_mobile", {mobile: a}, function (b) {
                    e[a] = b, d(b)
                }) : c(new Error("您输入的手机号码格式有误，需为 11 位数字格式"))
            })
        }, check_mobile_no_ajax: function (a) {
            return new d(function (b, c) {
                0 === a.length ? c(new Error("请输入 11 位手机号码")) : f.mobile.test(a) ? b() : c(new Error("您输入的手机号码格式有误，需为 11 位数字格式"))
            })
        }, check_mobile_verify: function (a, b) {
            return b = b || {}, new d(function (c, d) {
                "sms" === b.verify_type ? b.mobile_verify_sent ? 0 === a.length ? d(new Error("请输入 6 位短信校验码")) : f.mobile_verify.test(a) ? c() : d(new Error("您输入的短信校验码格式有误，需为 6 位数字格式")) : d(new Error("请点击获取短信校验码")) : "voice" === b.verify_type ? b.mobile_verify_sent ? 0 === a.length ? d(new Error("请输入电话语音播报的验证码")) : f.mobile_verify_voice.test(a) ? c() : d(new Error("您输入的语音校验码格式有误，需为 4 位数字格式")) : d(new Error("请点击获取语音校验码")) : c()
            })
        }, check_mobile_verify_on_blur: function (a, b) {
            return b = b || {}, new d(function (c, d) {
                0 === a.length ? c() : ("sms" === b.verify_type && (b.mobile_verify_sent ? f.mobile_verify.test(a) ? c() : d(new Error("您输入的短信校验码格式有误，需为 6 位数字格式")) : d(new Error("请点击获取短信验证码"))), "voice" === b.verify_type && b.mobile_verify_sent && (f.mobile_verify_voice.test(a) ? c() : d(new Error("您输入的语音校验码格式有误，需为 4 位数字格式"))))
            })
        }, check_verify_code: function (a) {
            return new d(function (b, c) {
                0 === a.length ? c(new Error("请按右图输入验证码，不区分大小写")) : 4 !== a.length && c(new Error("验证码格式错误，请重新填写")), b()
            })
        }, check_verify_code_on_blur: function (a) {
            return new d(function (a, b) {
                a()
            })
        }, check_password2: function (a, b) {
            return new d(function (c, d) {
                0 === a.length && d(new Error("请再次输入密码")), b !== a && d(new Error("两次密码输入不一致，请重新输入")), c()
            })
        }, check_password2_on_blur: function (a, b) {
            return new d(function (c, d) {
                0 === a.length ? c() : b !== a ? d(new Error("两次密码输入不一致，请重新输入")) : c()
            })
        }, check_password: function (a) {
            var b = 0;
            return new d(function (c, d) {
                if (a.length < 6 || a.length > 16)d(new Error("为了您的账号安全，密码长度只能在 6-16 个字符之间")); else if (f.password.test(a))switch (f.digital.test(a) && b++, f.lowercase.test(a) && b++, f.uppercase.test(a) && b++, f.symbols.test(a) && b++, b) {
                    case 1:
                        d(new Error("密码不能使用纯数字、纯字母、纯符号"));
                        break;
                    case 2:
                        c("normal");
                        break;
                    case 3:
                    case 4:
                        c("strong")
                } else d(new Error("有不允许的字符"))
            })
        }, check_password_on_blur: function (a) {
            var b = 0;
            return new d(function (c, d) {
                if (0 === a.length)c(); else if (a.length < 6 || a.length > 16)d(new Error("为了您的账号安全，密码长度只能在 6-16 个字符之间")); else if (f.password.test(a))switch (f.digital.test(a) && b++, f.lowercase.test(a) && b++, f.uppercase.test(a) && b++, f.symbols.test(a) && b++, b) {
                    case 1:
                        d(new Error("密码不能使用纯数字、纯字母、纯符号"));
                        break;
                    case 2:
                        c("normal");
                        break;
                    case 3:
                    case 4:
                        c("strong")
                } else d(new Error("有不允许的字符"))
            })
        }, check_gt_verify: function () {
            return new d(function (a, b) {
                window.GT_DATA ? a() : b(new Error("请拖动完成验证"))
            })
        }, check_captcha_ticket: function () {
            return new d(function (a, b) {
                document.getElementById("captcha_ticket").value.length ? a() : b(new Error("请完成上方验证"))
            })
        }, check_aliyun_verify: function () {
            return new d(function (a, b) {
                window.ALIYUN_DATA ? a() : b(new Error("请拖动完成验证"))
            })
        }, check_dynamic_mobile: function (a) {
            return new d(function (b, c) {
                return 0 === a.length ? c(new Error("请输入 11 位手机号码")) : f.mobile.test(a) ? b() : c(new Error("您输入的手机号码格式有误，需为 11 位数字格式"))
            })
        }, check_dynamic_mobile_on_blur: function (a) {
            return g.check_mobile_on_blur(a)
        }, check_dynamic_verify_code: function (a) {
            return new d(function (b, c) {
                return 0 === a.length ? c(new Error("请先输入验证码")) : b()
            })
        }, check_dynamic_password: function (a) {
            return new d(function (b, c) {
                return 0 === a.length ? c(new Error("请输入6位手机动态密码")) : /^\d{6}$/.test(a) ? void b() : c(new Error("您输入的动态密码格式有误，需为6位数字格式"))
            })
        }, check_dynamic_gt_verify: function () {
            return new d(function (a, b) {
                window.GT_DYNAMIC_DATA ? a() : b(new Error("请拖动完成验证"))
            })
        }
    };
    c.exports = g
}), define("library/util", [], function (a, b, c) {
    function d(a) {
        var b = String.fromCharCode(a.which || a.keyCode), c = !1;
        return a.shiftKey ? c = a.shiftKey : a.modifiers && (c = !!(4 & a.modifiers)), b.toUpperCase() !== b || b.toLowerCase() === b || c ? !1 : !0
    }

    b.setUpperCaseNotify = function (a) {
        function b() {
            var b = a.offset(), c = $('<div class="uppercase-tooltip">键盘大写锁定已打开，请注意大小写</div>').appendTo("body");
            setTimeout(function () {
                c.css({top: b.top - 28 + "px", left: b.left + "px", width: a.outerWidth() - 12})
            }, 1)
        }

        function c() {
            $(".uppercase-tooltip").remove()
        }

        a.bind("keypress", function (a) {
            d(a) ? b() : c()
        }), a.bind("blur", c)
    }, b.ieFocusTextPolyfill = function () {
        (!document.querySelector || document.documentMode < 8) && $(".textbox_ui").focusin(function () {
            var a = $(this);
            a.is(".error_ui") || a.is(".hint_ui") || a.find(".focus_text").show()
        }).focusout(function (a) {
            $(this).find(".focus_text").hide()
        })
    }
}), define("library/clickmap", [], function (a, b, c) {
    _gaMark = RM_ACTION, $(function () {
        _gaq && _gaq.push && $("form").submit(function () {
            "signup" == RM_ACTION ? _gaMark += "_phone" : "pre_login" == RM_ACTION && ("login-user-form" == $(this).attr("id") ? _gaMark = "login_prelogin" : _gaMark = "signup_prelogin"), _gaq.push(["_trackEvent", _gaMark, "click"]);
            try {
                switch (RM_ACTION) {
                    case"login":
                        clickMap("www", !0).accountLogin(1, $("#username").val());
                        break;
                    case"pre_login":
                        "login-user-form" == $(this).attr("id") ? clickMap("www", !0).accountLogin(31, $("input[name='email']").val()) : clickMap("www", !0).accountSignup(32, $(this).attr("id"));
                        break;
                    case"signup":
                        clickMap("www", !0).accountSignup(2, "phone")
                }
            } catch (a) {
            }
        })
    })
}), window.seajs || (window.define = function (a) {
    window.TextInteractiveVer = a()
}), define("login/text_interactive_ver", [], function (a, b, c) {
    Function.prototype.bind = function () {
        var a = this, b = Array.prototype.slice.call(arguments), c = b.shift();
        return function () {
            return a.apply(c, b.concat(Array.prototype.slice.call(arguments)))
        }
    };
    var d = function (a) {
        this.bound = {onRefreshBtnClick: this._onRefreshBtnClick.bind(this)}, this._setOptions(a), this._init(), this._buildEvent(), this.refreshVerImg()
    };
    return d.settings = {
        wrap: "#login-user-form",
        verImg: "/i/account/hanzi",
        textPos: [{x: 3, y: 50}, {x: 62, y: 50}, {x: 119, y: 50}, {x: 3, y: 92}, {x: 62, y: 92}, {x: 119, y: 92}],
        from: "login",
        verTypeName: "hanzi",
        changeToOtherVerType: function (a) {
        }
    }, d.prototype = {
        _setOptions: function (a) {
            this.options = $.extend(!0, {}, d.settings, a)
        }, _init: function () {
            var a = '<div id="ver_text"><div style="line-height:30px;">验证码：点击与验证码相应的文字到验证码输入框内</div><div class="textBtnsWrap"></div><div class="input_big_wrap"><div class="t_v_success_icon"></div><div class="inputWrap"></div><div class="verImg"></div><a class="refresh_btn" href="javascript:void(0);">换一张</a></div><div class="t_v_err"><i></i><span>验证码失败：</span><div class="msg"></div></div>', b = $(this.options.wrap + " .gtVerifyWrap").length > 0 ? $(this.options.wrap + " .gtVerifyWrap") : $(".gtVerifyWrap");
            this.element = $(a).insertBefore(b), this.componets = {
                inputWrap: this.element.find(".inputWrap"),
                inputTexts: [],
                textBtnsWrap: this.element.find(".textBtnsWrap"),
                textBtns: [],
                verImg: this.element.find(".verImg"),
                refresh_btn: this.element.find(".refresh_btn"),
                successIcon: this.element.find(".t_v_success_icon"),
                errorTxt: this.element.find(".t_v_err"),
                errorMsg: this.element.find(".msg")
            };
            for (var c = 0; 3 > c; c++)this.componets.inputTexts.push($('<div class="t_v_input"></div>').appendTo(this.componets.inputWrap));
            this.componets.delBtn = $('<a href="javascript:void(0)" class="t_v_delBtn"></a>').appendTo(this.componets.inputWrap);
            for (var c = 0; 6 > c; c++) {
                var d = $('<div class="t_v_txt_btn" style="width:' + (5 == c ? 53 : 51) + 'px;" key="' + (c + 1) + '"></div>');
                d.css("background-position", "-" + this.options.textPos[c].x + "px -" + this.options.textPos[c].y + "px "), this.componets.textBtns.push(d.appendTo(this.componets.textBtnsWrap))
            }
        }, _buildEvent: function () {
            $(document).keydown(this._onKeyUp.bind(this));
            var a = this.options.textPos;
            $(this.componets.textBtns).each(function (b, c) {
                c.hover(function () {
                    var b = $(this), c = a[b.attr("key") - 1];
                    b.css("background-position", "-" + c.x + "px -" + (c.y + 92) + "px ")
                }, function () {
                    var b = $(this), c = a[b.attr("key") - 1];
                    b.css("background-position", "-" + c.x + "px -" + c.y + "px ")
                }), c.click(this._onTextBtnClick.bind(this))
            }.bind(this)), this.componets.delBtn.click(this._backspaceTextInputWord.bind(this)), this.componets.refresh_btn.click(this.bound.onRefreshBtnClick), this.componets.verImg.click(this.bound.onRefreshBtnClick)
        }, _onRefreshBtnClick: function () {
            window.ActiveXObject && !window.XMLHttpRequest ? this._checkVer(!0) : this.refreshVerImg(!0)
        }, _onKeyUp: function (a) {
            return 8 == a.keyCode && "body" == a.target.tagName.toLowerCase() ? (this._backspaceTextInputWord(), !1) : void 0
        }, _onTextBtnClick: function (a) {
            if (!(this.selectedTextCount >= 3)) {
                var b = this.componets.inputTexts[this.selectedTextCount], c = $(a.target).attr("key");
                b.css("background-position", "-" + (this.options.textPos[c - 1].x + 6) + "px -" + this.options.textPos[c - 1].y + "px "), this.selectedTextKeys[this.selectedTextCount] = c, 3 == ++this.selectedTextCount && this._checkVer()
            }
        }, _backspaceTextInputWord: function () {
            this.selectedTextCount > 0 && (this.selectedTextKeys[this.selectedTextCount - 1] = 0, this.componets.inputTexts[this.selectedTextCount - 1].css("background-position", "200px 0"), this.selectedTextCount--, this.componets.successIcon.hide(), this.verStatus = !1)
        }, refreshVerImg: function (a) {
            this.selectedTextCount = 0, this.selectedTextKeys = [], this.errorTimes = 0, this.verStatus = !1, this.componets.successIcon.hide(), a && this.componets.errorTxt.css("visibility", "hidden");
            var b = this.options.verImg + "?from=" + this.options.from + "&time=" + (new Date).valueOf();
            $(this.componets.textBtns).each(function (a, c) {
                c.css("background-image", "url(" + b + ")")
            }), $(this.componets.inputTexts).each(function (a, c) {
                c.css({"background-image": "url(" + b + ")", "background-position": "200px 0"})
            }), this.componets.verImg.css("background-image", "url(" + b + ")")
        }, _checkVer: function (a) {
            var b = "/i/account/pre_verify?from=" + this.options.from + "&hash_code=" + this.selectedTextKeys.join("") + "&" + (new Date).valueOf();
            $.getJSON(b, function (b) {
                return a ? void this.refreshVerImg(!0) : void(b.status ? (this.componets.successIcon.show(), this.componets.errorTxt.css("visibility", "hidden"), this.verStatus = !0) : (this.componets.successIcon.hide(), this.componets.errorMsg.html("验证码文字不匹配，请重新点击选择"), this.componets.errorTxt.css("visibility", "visible"), this.refreshVerImg(), b.type != this.options.verTypeName && this.options.changeToOtherVerType(b)))
            }.bind(this))
        }, check: function () {
            return !this.verStatus && this.selectedTextCount < 3 && (this.componets.errorMsg.html("验证码文字不能为空，请点击选择"), this.componets.errorTxt.css("visibility", "visible")), this.verStatus
        }, getVerCode: function () {
            return this.selectedTextKeys.join("")
        }, hide: function () {
            this.element.hide()
        }, show: function () {
            this.element.show()
        }
    }, d
});