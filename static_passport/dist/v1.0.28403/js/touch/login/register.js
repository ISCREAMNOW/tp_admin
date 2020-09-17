define("touch/login/register", ["../../safeLogin/dialog", "library/template", "templates/Dialog"], function (a) {
    function b(a, b) {
        function c() {
            e.timer = setInterval(function () {
                d()
            }, 1e3)
        }

        function d() {
            e.back_date = (new Date).getTime(), e.time_number = Math.round((e.endtime - e.back_date) / 1e3), e.time_number <= 0 ? (e.time_number = 0, e.$outer.attr("has_click", "no"), "email_yanzheng" == e.$outer[0].id ? (e.$outer.hide(), e.$outer.prev().show()) : (e.$outer.removeClass("active"), e.$outer.text("验证")), clearTimeout(e.timer), e.timer = null) : e.$contenter.text(e.time_number)
        }

        var e = this;
        e.$outer = a, e.$contenter = b, e.time_number = 60, e.endtime = (new Date).getTime() + 6e4, c()
    }

    function c(a) {
        if ("success" === a.status) "此手机号已被占用，请选择其他手机进行注册或尝试登录" === a.msg ? (change_code(), new g({
                buttons: 1,
                okText: "我知道了",
                showTitle: !1,
                content: a.msg,
                okCallback: function () {
                }
            }).show()) : (new g({
                buttons: 1,
                okText: "我知道了",
                showTitle: !1,
                content: "请查收短信，一分钟内未收到可重新获取",
                okCallback: function () {
                }
            }).show(), $("#mobileVerify").show(), $("#mobileVerify_span").hide(), m.html("<span>60</span>秒"), m.addClass("active"), i = new b(m, m.find("span")), h = !1); else if (80006 === a.errno) {
            var c = "/mobile/Login/verify_code?from=signup&" + (new Date).getTime();
            $("#img_dynamic_hash_code").attr("src", c), o.show(), window.is_show_code = !0
        } else("error" === a.status || 2 === a.status) && (new g({
            buttons: 1,
            okText: "我知道了",
            showTitle: !1,
            content: a.msg,
            okCallback: function () {
            }
        }).show(), change_code())
    }

    function d(a) {
        return 1 != a.status ? (h = !0, a.hash_code && window.is_show_code === !1 && $("#verify_code").css("display", "block"), new g({
                buttons: 1,
                okText: "我知道了",
                showTitle: !1,
                content: a.msg,
                okCallback: function () {
                }
            }).show(), change_code(), !1) : ($.ajax({
                url: "/i/mobile/regist_m",
                type: "get",
                dataType: "json"
            }), void(location.href = a.redirect || "/"))
    }

    function e() {
        var a = Jumei.str_trim(n.val()), b = /^1\d{10}$/g;
        if (i && i.timer)return !1;
        if (0 == b.test(a))return n.focus(), new g({
            buttons: 1,
            okText: "我知道了",
            showTitle: !1,
            content: "请输入正确的手机号码",
            okCallback: function () {
            }
        }).show(), !1;
        if (/^170/.test(a))return n.focus(), new g({
            buttons: 1,
            okText: "我知道了",
            showTitle: !1,
            content: "抱歉，暂不支持虚拟运营商手机号码注册",
            okCallback: function () {
            }
        }).show(), !1;
        if (0 == j)return n.focus(), new g({
            buttons: 1,
            okText: "我知道了",
            showTitle: !1,
            content: l,
            okCallback: function () {
            }
        }).show(), !1;
        if (1 == j || 2 == j)return !0;
        if (10 != j)return !1;
        var c = {};
        return c.mobile = a, Jumei.ajax("/mobile/Login/check_mobile", c, "post", f), !1
    }

    function f(a) {
        if (j = a.status, 0 == a.status || 2 == a.status)return n.focus(), l = a.msg, new g({
            buttons: 1,
            okText: "我知道了",
            showTitle: !1,
            content: a.msg,
            okCallback: function () {
                alert(11)
            }
        }).show(), !1;
        if (1 == a.status && (!i || i && !i.timer)) {
            if ("yes" == m.attr("has_click")) {
                var b = {};
                b.mobile = Jumei.str_trim(n.val());
                var d = Jumei.str_trim(q.val() + "");
                if (1 == window.is_show_code && ("" == d || 4 != d.length))return new g({
                    buttons: 1,
                    okText: "我知道了",
                    showTitle: !1,
                    content: "请输入正确的图片验证码",
                    okCallback: function () {
                    }
                }).show(), !1;
                b.hash_code = d, h = !0, Jumei.ajax("/mobile/Login/ajax_send_sms_for_mobile_register", b, "get", c)
            } else m.attr("has_click", "no");
            return !0
        }
    }

    var g = a("../../safeLogin/dialog"), h = !0, i = null, j = 10, k = "", l = "", m = $(".register_yzm"), n = $("#account"), o = $("#mobile_verify_code"), p = $("#tele_register"), q = $("#yanzheng_code"), r = $("input[type=password]");
    n.focus(function () {
        k = Jumei.str_trim($(this).val())
    }), n.blur(function () {
        var a = Jumei.str_trim($(this).val());
        a != k && (j = 10, (!i || i && !i.timer) && (m.attr("has_click", "no"), a.length == k.length && (h = !0, change_code())))
    }), window.change_code = function () {
        var a = new Date, b = "/mobile/Login/verify_code?from=signup&" + a.getTime(), c = document.getElementById("img_dynamic_hash_code");
        window.is_show_code ? c.src = b : (c = document.getElementById("login_code"), c && (c.src = b)), $(c).prev().val("")
    }, p.click(function (a) {
        var b = $(this).parents("form"), c = !0, e = $.trim(n.val());
        if ("" != e && "none" == $("#mobileVerify").css("display"))return c = !1, new g({
            buttons: 1,
            okText: "我知道了",
            showTitle: !1,
            content: "请获取手机短信验证码",
            okCallback: function () {
            }
        }).show(), !1;
        if (b.find(".register_input").each(function () {
                return "hash_code" == $(this).attr("name") && "none" == $("#mobile_verify_code").css("display") || 0 == is_show_code ? !1 : $(this).attr("alertname") && "" == Jumei.str_trim($(this).val()) ? (c = !1, new g({
                            buttons: 1,
                            okText: "我知道了",
                            showTitle: !1,
                            content: $(this).attr("alertname"),
                            okCallback: function () {
                            }
                        }).show(), !1) : void 0
            }), 0 == c)return !1;
        var f = /^1\d{10}$/g;
        if (0 == f.test(e))return new g({
            buttons: 1,
            okText: "我知道了",
            showTitle: !1,
            content: "请输入正确的手机号码",
            okCallback: function () {
            }
        }).show(), !1;
        var h = Jumei.str_trim(r.val());
        if (h.length < 6 || 1 == /^\d*$/.test(h) || 1 == /^[A-Z]+$/.test(h) || 1 == /^[a-z]+$/.test(h) || 1 == /\s/.test(h) || 1 == /^\W*$/.test(h))return new g({
            buttons: 1,
            okText: "我知道了",
            showTitle: !1,
            content: "密码格式不正确，请重新输入",
            okCallback: function () {
            }
        }).show(), !1;
        var i = {};
        return i.mobile = Jumei.str_trim(n.val()), i.mobileVerify = Jumei.str_trim($("#mobileVerify").val()), i.redirect = window.redirect, i.password = Jumei.str_trim(r.val()), window.is_show_code && (i.hash_code = Jumei.str_trim(q.val())), Jumei.ajax("/mobile/Login/ajax_register", i, "post", d), !1
    }), m.click(function () {
        $("#focus").focus();
        var a = Jumei.str_trim(q.val() + "");
        if (!h && window.is_show_code)return change_code(), new g({
            buttons: 1,
            okText: "我知道了",
            showTitle: !1,
            content: "请重新输入图片验证码！",
            okCallback: function () {
            }
        }).show(), h = !0, !1;
        if ("yes" == $(this).attr("has_click") && i && i.timer)return !1;
        var b = e();
        if ($(this).attr("has_click", "yes"), !b)return !1;
        if (1 == window.is_show_code && ("" == a || 4 != a.length))return new g({
            buttons: 1,
            okText: "我知道了",
            showTitle: !1,
            content: "请输入正确的图片验证码！",
            okCallback: function () {
            }
        }).show(), !1;
        var d = {};
        d.mobile = Jumei.str_trim(n.val()), d.hash_code = a, h = !0, Jumei.ajax("/mobile/Login/ajax_send_sms_for_mobile_register", d, "get", c)
    }), $(function () {
        $("#back").bind("click", function () {
            return location.href = document.referrer, !1
        })
    })
});