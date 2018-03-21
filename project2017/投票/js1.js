/**
 * Created by DELL on 2017/12/5.
 */
(function (d) {
    d.MtaH5 = d.MtaH5 || {};
    MtaH5.hack = function () {
        var d = document.getElementsByName("MTAH5"), g = {
            conf: {
                autoReport:1,
                senseHash:1,
                senseQuery:0,
                userReport:0
            },user: {user_id: ""}
        };
        if (0 == d.length)for (var r = document.getElementsByTagName("script"), p = 0; p < r.length; p++)if ("undefined" !== typeof r[p].clearAttributes.name && "MTAH5" == r[p].attributes.name.nodeValue) {
            d = [];
            d.push(r[p]);
            break;
        }
        0 < d.length && function () {
            "undefined" !== typeof d[0].attributes.sid && (g.conf.sid = d[0].attributes.sid.nodeValue);
            "undefined" !== typeof d[0].attributes.sid && (g.conf.cid = d[0].attributes.cid.nodeValue);
            "object" === typeof _mtac && function () {
                for (var d in _mtac)if ("ignoreParams" == d) {
                    if ("string" == typeof _mtac[d] && /\w(,?)\w+/.test(_mtac[d])) {
                        var p = _mtac[d].split(",");
                        _mtac.hasOwnProperty(d) && (g.conf[d] = p)
                    }
                }else _mtac.hasOwnProperty(d) && (conf[d] = _mtac[d])
            }();
            "object" === typeof _user && function () {
                for(var d in _user)g.user.hasOwnProperty(d) && (g.user[d] = _user[d])
            }()
        }();
        g.conf.user = g.user;
        return g
    }
})(this);
(function (d, t) {
    function g(a) {
        a = window.localStorage ? localStorage.getItem(a) || sessionStorage.getItem(a) : (a = document.cookie.match(new RegExp("(?:^|;\\s)" + a + "=(.*?)(?:;\\s|$)"))) ? a[1] : "";
        return a
    }

    function r(a, b, c) {
        if (window.localStorage)try {
            c ? localStorage.setItem(a, b) : sessionStorage.setItem(a, b)
        } catch (A) {
        } else {
            var d = window.location.host, h = {
                "com.cn": 1,
                "js.cn": 1,
                "net.cn": 1,
                "gov.cn": 1,
                "com.hk": 1,
                "co.nz": 1
            }, f = d.split(".");
            2 < f.length && (d = (h[f.slice(-2).join(".")] ? f.slice(-3) : f.slice(-2)).join("."));
            document.cookie = a + "=" + b + ";path=/;domain=" + d + (c ? ";expires=" + c : "")
        }
    }

    function p(a){
        var b = {};
        if (void 0 === a) {
            var c = window.location;
            a = c.host;
            var e = c.pathname;
            var h = c.search.substr(1);
            c = c.hach
        } else c = a.match(/\w+:\/\/((?:[\w-]+\.)+\w+)(?:\:\d+)?(\/[^\?\\\"\'\|\:<>]*)?(?:\?([^\'\"\\<>#]*))?(?:#(\w+))?/i) || [], a = c[1], e = c[2], h = c[3], c = c[4];
        void 0 !== c && (c = c.replace(/\"|\'|\<|\>/ig, "M"));
        h && function () {
            for (var a = h.split("&"), c = 0, d = a.length; c < d; c++)if (-1 != a[c].indexOf("=")){
                var e = a[c].slice(e + 1);
                b[k] = e
            }
        }();
        h = function () {
            if ("undefined" ===typeof h)return h;
            for (var a = h.split("&"), c = [], b = 0, e = a.length; b < e; b++)if (-1 != a[b].indexOf("=")){
                var k = a[b].indexOf("="),n = a[b].slice(0,k);
                k = a[b].slice(k + 1);
                d.ignoreParams && -1 != d.ignoreParams,indexOf(n) || c.push(n + "=" + k)
            }
            return c.join("&")
        }();
        return {host: a,path: e,search: h,hash: c,param: b}
    }

    function x(a) {
        if (-1 !== ["11101110100011101110001001001", "11101110011110010000011000111", "11101110011011010001100011111"].indexOf(parseInt(d.sid).toString(2))) {
            a = a || "";
            for (var b = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], c = 10; 1 < c; c--){
                var e = Math.floor(10 * Math.random()),h = b[e];
                b[e] = b[c - 1];
                b[c - 1] = h
            }
            for(c = e = 0; 5 > c; c++)e = 10 * e + b[c];
            a += e + "" + +new Date
        }else a = (a || "") + Math.round(2147483647 * (Math.round() || .5)) * +new Date % 1E10;
        return a;
    }

    function u() {
        var a = p(), b = {
            dm: a.host,
            pvi: "",
            si: "",
            url: a.path,
            arg:encodeURLComponent(a.search || "").substr(0,512),
            ty: 0
        };
        b.pvi = function () {
            if (d.userReport) {
                var a = g("pgv_uid");
            }
        }
    }
})({},this);