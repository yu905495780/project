requirejs.config({
    baseUrl: 'script',
    paths: {
        "jquery": "lib/jquery-2.2.4.min",
        "lodash": "lib/lodash.min",
        "angular": "lib/angular.min",
        "ui-router": "lib/angular-ui-router.min",
        "ng-bootstrap": "lib/ui-bootstrap-tpls.min",
        "angularAMD": "lib/angularAMD.min",
        "ngload": "lib/ngload.min",
        "ngLocal": "lib/angular-locale_zh-cn",
        "ui-uploader": "lib/uploader.min",
        "ng-popups": "lib/angular-popups",
        "ztree": "lib/jquery.ztree.all.min"
    },
    waitSeconds: 0,
    shim: {
        "angular": {
            deps: ["jquery"]
        },
        "ng-popups": {
            deps: ["angular"]
        },
        "ui-router": {
            deps: ["angular"]
        },
        "ui-uploader": {
            deps: ["angular"]
        },
        "ngLocal": {
            deps: ["angular"]
        },
        "ng-bootstrap": {
            deps: [
                "angular",
                "ngLocal"
            ]
        },
        "angularAMD": {
            deps: ["angular"]
        },
        "ngload": {
            deps: ["angularAMD"]
        },
        "ztree": {
          deps: ["jquery"]
        },
    },
    urlArgs: "v=201808151605"
    //urlArgs: "v=" + new Date().getTime()
});
//define(["config/ifpConfig"], function () { });
