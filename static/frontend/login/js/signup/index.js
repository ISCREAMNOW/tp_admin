define("signup/index", ["../library/placeholder", "../library/promise", "../library/validator", "../library/util", "../library/clickmap"], function (a, b, c) {
    function d(a, b) {
        G[a] = b, g()
    }

    function e() {
        function a() {
            return 0 === b ? void f() : (z.text(b + " 秒后重试"), void(b -= 1))
        }

        var b = 60;
        a(), z.data("timer", setInterval(a, 1e3)), d("sms_counting", !0)
    }

    function f() {
        clearInterval(z.data("timer")), "sms" === G.verify_type && z.text("获取短信校验码").data("timer", null), "voice" === G.verify_type && z.text("获取语音校验码").data("timer", null), d("sms_counting", !1)
    }

    function g() {
    }

    function h() {
        $("#change_verify_code").find("img").attr("src", "/frontend/Login/verify_code.html?from=signup&" + (new Date).valueOf()), $("#verify_code").val(""), p(D), d("sms_need_new_verify", !1)
    }

    function i(a) {
        return $("#" + a).val()
    }

    function j(a) {
        "string" == typeof a && (a = $(a)), a.parent().removeClass("error_ui").find(".invalid").hide()
    }

    function k(a, b) {
        q(a), p(a), a.parent().addClass("error_ui").find(".invalid").show().find(".msg").html(b)
    }

    function l(a) {
        return "mobile_verify" === a || "mobile_verify_on_blur" === a ? G : "password2" === a || "password2_on_blur" === a ? i("password") : null
    }

    function m() {
        if (G.sms_need_new_verify && "yes" == $(".imgVerifyWrap").attr("data-required")) return h(), k(E, "请按右图输入验证码，不区分大小写"), !1;
        if (G.sms_counting) return !1;
        if (G.sms_times_over) return !1;
        var a = i("mobile");
        return /^170/.test(a) ? void alert("抱歉，暂不支持虚拟运营商手机号码注册") : (d("mobile_sending", !0), e(), void $.getJSON("/frontend/Login/ajax_send_sms_for_mobile_register", {
            operation: "register",
            mobile: a,
            hash_code: i("verify_code"),
            verify_type: G.verify_type
        }, function (a) {
            d("mobile_sending", !1), "success" === a.status ? (d("mobile_verify_sent", !0), d("sms_need_new_verify", !0), a.times >= 3 ? ("sms" === G.verify_type && o(D, "校验码已发送，请查收短信"), "voice" === G.verify_type && ($(".sms_verify_wrapper .focus_text").html("请输入电话语音播报的验证码"), $("#mobile_verify").focus(function () {
                $(this).next().show().next().hide()
            }), $("#mobile_verify").blur(function () {
                $(this).next().hide()
            }), o(D, "验证码将以电话形式通知您，请注意接听"))) : a.times >= 1 ? ("sms" === G.verify_type && o(D, "校验码已发送，请查收短信，您还有 " + a.times + " 次获取机会"), "voice" === G.verify_type && ($(".sms_verify_wrapper .focus_text").html("请输入电话语音播报的验证码"), $("#mobile_verify").focus(function () {
                $(this).next().show().next().hide()
            }), $("#mobile_verify").blur(function () {
                $(this).next().hide()
            }), o(D, "验证码将以电话形式通知您，您还有 " + a.times + " 次获取机会"))) : a.times <= 0 && (0 === a.times && ("sms" === G.verify_type && o(D, "校验码已发送，请查收短信"), "voice" === G.verify_type && ($(".sms_verify_wrapper .focus_text").html("请输入电话语音播报的验证码"), $("#mobile_verify").focus(function () {
                $(this).next().show().next().hide()
            }), $("#mobile_verify").blur(function () {
                $(this).next().hide()
            }), o(D, "验证码将以电话形式通知您，请注意接听"))), f(), n())) : (f(), 11008 === a.errno ? k(B, '该手机号已存在，如果您是该用户，请立刻 <a href="/frontend/Login/index?signup&mobile=' + i("mobile") + '">登录</a>') : 11014 === a.errno ? (n(), "sms" === G.verify_type && k(D, "您的手机获取校验码已达当日上限，请于明日再试"), "voice" === G.verify_type && ($(".sign .line").eq(3).css("margin-top", "40px"), k(D, "您的操作过于频繁，请明日再试。如有问题，请致电400-123-8888"))) : 80001 === a.errno ? (k(E, a.msg), h()) : 80005 === a.errno ? (k(B, a.msg), h()) : 80006 === a.errno ? ($(".imgVerifyWrap").show().attr("data-required", "yes"), h(), p(D), E.trigger("focus"), H = I) : (k(D, a.msg), h()))
        }))
    }

    function n() {
        $("#getPhoneCode").text("明日再试"), d("sms_times_over", !0)
    }

    function o(a, b) {
        j(a), a.parent().addClass("hint_ui").find(".hint").html(b).show()
    }

    function p(a) {
        a.parent().removeClass("hint_ui").find(".hint").hide()
    }

    function q(a) {
        a.parent().find(".valid").hide()
    }

    function r(a) {
        a.parent().find(".valid").show()
    }

    function s(a, b) {
        b = b || $("#" + a);
        var c = x["check_" + a](b.val(), l(a));
        return c.then(function (c) {
            c ? (0 === c && j(b), "function" == typeof c && c(b), ("mobile" === a || "mobile_on_blur" === a) && (j(b), 1 === c && r(b))) : j(b)
        }, function (a) {
            k(b, a.message)
        }), c
    }

    function t() {
        $.post("/frontend/Login/ajax_signup", {
            mobile: i("mobile"),
            password: i("password"),
            password2: i("password2"),
            hash_code: i("verify_code"),
            mobileVerify: i("mobile_verify"),
            verify_type: G.verify_type,
            redirect: window.REDIRECT || ""
        }, function (a) {
            "0" === a.error ? window.location.href = a.redirect : (h(), "2" == a.error ? k($("#verify_code"), "验证码输入错误，请重新输入") : "8" == a.error && "sms" == G.verify_type ? k($("#mobile_verify"), "你输入的短信校验码有误，请重新输入") : "8" == a.error && "voice" == G.verify_type ? k($("#mobile_verify"), "你输入的语音校验码有误，请重新输入") : "9" == a.error ? k($("#mobile"), a.msg) : "7" == a.error && alert(a.msg))
        })
    }

    function u(a) {
        var b = C.parent().find(".focus_text");
        b.find(".safe").show(), b.find(".default").hide(), b.find(".pw_level").each(function () {
            var a = $(this);
            a.removeClass(a.attr("data-class"))
        });
        var c = b.find("[data-strength=" + a + "]");
        c.addClass(c.attr("data-class"))
    }

    function v() {
        var a = C.parent().find(".focus_text");
        a.find(".safe").hide(), a.find(".default").show()
    }

    a("../library/placeholder");
    var w = a("../library/promise"), x = a("../library/validator"), y = a("../library/util");
    a("../library/clickmap");
    var z = $("#getPhoneCode"), A = $("form"), B = $("#mobile"), C = $("#password"), D = $("#mobile_verify"),
        E = $("#verify_code"), F = $("#password2"), G = {};
    d("verify_type", $("#getPhoneCode").attr("data-verifyType"));
    var H = ["mobile", "verify_code", "password", "password2", "mobile_verify"],
        I = ["mobile", "verify_code", "password", "password2", "mobile_verify"],
        J = ["mobile", "password", "password2", "mobile_verify"];
    $(function () {
        $("#change_verify_code").click(h), ["mobile", "password", "password2", "verify_code", "mobile_verify"].map(function (a) {
            $("#" + a).bind("blur", function () {
                s(a + "_on_blur", $(this))
            })
        }), $("#mobile").bind("blur", function () {
            var a = $(this), b = a.val();
            G.mobile && G.mobile != b && h(), d("mobile", b)
        }), $("#mobile").bind("keydown", function () {
            q($(this))
        }), z.click(function (a) {
            return G.sms_times_over || G.sms_counting ? (a.preventDefault(), !1) : void("yes" == $(".imgVerifyWrap").attr("data-required") ? w.all(["mobile", "verify_code"].map(function (a) {
                return s(a)
            })).then(m) : ($("#verify_code").val(""), w.all(["mobile"].map(function (a) {
                return s(a)
            })).then(m)))
        }), A.submit(function (a) {
            a.preventDefault(), "yes" == $(".imgVerifyWrap").attr("data-required") || (H = J), H.map(j), w.all(H.map(function (a) {
                return s(a)
            })).then(function () {
                /^170/.test(i("mobile")) ? alert("抱歉，暂不支持虚拟运营商手机号码注册！") : t()
            }, h)
        }), H.map(function (a) {
            var b = $("#" + a);
            b.focus(function (a) {
                j(b), b.trigger("focusin")
            })
        }), C.bind("keyup", function (a) {
            var b = $(this), c = b.val();
            x.check_password(c).then(u, v)
        }), y.setUpperCaseNotify(C), y.setUpperCaseNotify(F), y.ieFocusTextPolyfill(), $("input, textarea").placeholder()
    })
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

        var g, h = "placeholder" in b.createElement("input"), i = "placeholder" in b.createElement("textarea"),
            j = c.fn;
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
                    0 === d.status ? c(new Error('该手机号已存在，如果您是该用户，请立刻 <a href="/frontend/Login/index?signup&mobile=' + a + '">登录</a>')) : b(d.status)
                }

                0 === a.length ? b() : /^170/.test(a) ? c(new Error("抱歉，暂不支持虚拟运营商手机号码注册！")) : !f.mobile.test(a) && a.length > 0 ? c(new Error("您输入的手机号码格式有误，需为 11 位数字格式")) : e[a] ? d(e[a]) : $.post("/frontend/Login/check_mobile", {mobile: a}, function (b) {
                    e[a] = b, d(b)
                })
            })
        }, check_mobile: function (a) {
            return new d(function (b, c) {
                function d(d) {
                    0 === d.status ? c(new Error('该手机号已存在，如果您是该用户，请立刻 <a href="/frontend/Login/index?signup&mobile=' + a + '">登录</a>')) : b(d.status)
                }

                0 === a.length ? c(new Error("请输入 11 位手机号码")) : f.mobile.test(a) ? /^170/.test(a) ? c(new Error("抱歉，暂不支持虚拟运营商手机号码注册！")) : e[a] ? d(e[a]) : $.post("/frontend/Login/check_mobile", {mobile: a}, function (b) {
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
                if (a.length < 6 || a.length > 16) d(new Error("为了您的账号安全，密码长度只能在 6-16 个字符之间")); else if (f.password.test(a)) switch (f.digital.test(a) && b++, f.lowercase.test(a) && b++, f.uppercase.test(a) && b++, f.symbols.test(a) && b++, b) {
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
                if (0 === a.length) c(); else if (a.length < 6 || a.length > 16) d(new Error("为了您的账号安全，密码长度只能在 6-16 个字符之间")); else if (f.password.test(a)) switch (f.digital.test(a) && b++, f.lowercase.test(a) && b++, f.uppercase.test(a) && b++, f.symbols.test(a) && b++, b) {
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
});