define("boot", [], function () {
    var a = "static_passport", b = "v1.0.28403", c = seajs.data.base.replace(/^(\w+\:\/\/[^\/]+\/).*/, "$1");
    location && location.search && location.search.indexOf("__debugger__") > -1 ? (seajs.config({base: c + a + "/src/js"}), $(function () {
        $("link[rel=stylesheet]").each(function (c, d) {
            var e = $(d).attr("href");
            e && e.indexOf(a + "/dist/" + b + "/") > 0 && $(d).attr("href", $(d).attr("href").replace(a + "/dist/" + b + "/", a + "/src/"))
        })
    })) : seajs.config({base: c + a + "/dist/" + b + "/js"})
}), seajs.use("boot");

// define("boot", [], function () {
//     var a = "static_passport", b = "v1.0.28403", c = seajs.data.base.replace(/^(\w+\:\/\/[^\/]+\/).*/, "$1");
//     location && location.search && location.search.indexOf("__debugger__") > -1 ? (seajs.config({base: c + a + "/src/js"}), $(function () {
//         $("link[rel=stylesheet]").each(function (c, d) {
//             var e = $(d).attr("href");
//             e && e.indexOf(a + "/dist/" + b + "/") > 0 && $(d).attr("href", $(d).attr("href").replace(a + "/dist/" + b + "/", a + "/src/"))
//         })
//     })) : seajs.config({base: c + a + "/dist/" + b + "/js"})
// }), seajs.use("boot");

// define("boot", [], function () {
//     var a = "static_passport", b = "v1.0.28403", c = seajs.data.base.replace(/^(\w+\:\/\/[^\/]+\/).*/, "$1");
//     location && location.search && location.search.indexOf("__debugger__") > -1 ? (seajs.config({base: c + a + "/src/js"}), $(function () {
//         $("link[rel=stylesheet]").each(function (c, d) {
//             var e = $(d).attr("href");
//             e && e.indexOf(a + "/static/mobile/") > 0 && $(d).attr("href", $(d).attr("href").replace(a + "/static/mobile/", a + "/src/"))
//         })
//
//     })) : seajs.config({base: c + "static/mobile/" + a + "/js"})
// }), seajs.use("boot");