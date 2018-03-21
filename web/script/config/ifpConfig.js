define(["jquery",
    "lodash",
    "angularAMD",
    "ui-router",
    "ui-uploader",
    "ng-bootstrap",
    "ng-popups",
], function ($, _, angularAMD) {

    var CssVersion = "201611281935",
        HtmlVersion = "201611281935";

    var ifpRouter = function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        $stateProvider.state("ifpQuery", angularAMD.route({
            url: "/ifpQuery",
            controllerUrl: "./script/controller/ifpQueryCtrl.js",
            controller: "ifpQueryCtrl",
            templateUrl: "./view/ifp/ifpQuery.html?v=" + HtmlVersion,
            onEnter: function () {

            },
            onExit: function () {

            }
        })).state("ifpQueryDouble", angularAMD.route({
            url: "/ifpQueryDouble",
            controllerUrl: "./script/controller/ifpQueryCtrl.js",
            controller: "ifpQueryCtrl",
            templateUrl: "./view/ifp/ifpQuery.html?v=" + HtmlVersion
        })).state("ifpAdd", angularAMD.route({
            url: "/ifpAdd",
            controllerUrl: "./script/controller/ifpAddCtrl.js",
            controller: "ifpAddCtrl",
            templateUrl: "./view/ifp/ifpAdd.html?v=" + HtmlVersion
        })).state("ifpAddDouble", angularAMD.route({
            url: "/ifpAddDouble",
            controllerUrl: "./script/controller/ifpAddCtrl.js",
            controller: "ifpAddCtrl",
            templateUrl: "./view/ifp/ifpAdd.html?v=" + HtmlVersion
        })).state("ifpEdit", angularAMD.route({
            url: "/ifpEdit?id",
            controllerUrl: "./script/controller/ifpAddCtrl.js",
            controller: "ifpAddCtrl",
            templateUrl: "./view/ifp/ifpAdd.html?v=" + HtmlVersion
        })).state("ifpEditDouble", angularAMD.route({
            url: "/ifpEditDouble?id",
            controllerUrl: "./script/controller/ifpAddCtrl.js",
            controller: "ifpAddCtrl",
            templateUrl: "./view/ifp/ifpAdd.html?v=" + HtmlVersion
        })).state("ifpImport", angularAMD.route({
            url: "/ifpImport",
            controllerUrl: "./script/controller/ifpImportCtrl.js",
            controller: "ifpImportCtrl",
            templateUrl: "./view/ifp/ifpImport.html?v=" + HtmlVersion
        })).state("ifpImportDouble", angularAMD.route({
            url: "/ifpImportDouble",
            controllerUrl: "./script/controller/ifpImportCtrl.js",
            controller: "ifpImportCtrl",
            templateUrl: "./view/ifp/ifpImport.html?v=" + HtmlVersion
        })).state("ifpShow", angularAMD.route({
            url: "/ifpShow?id&isDouble",
            controllerUrl: "./script/controller/ifpShowCtrl.js",
            controller: "ifpShowCtrl",
            templateUrl: "./view/ifp/ifpShow.html?v=" + HtmlVersion
        })).state("ifpShowDouble", angularAMD.route({
            url: "/ifpShowDouble?id",
            controllerUrl: "./script/controller/ifpShowCtrl.js",
            controller: "ifpShowCtrl",
            templateUrl: "./view/ifp/ifpShow.html?v=" + HtmlVersion
        })).state("ifpOrigin", angularAMD.route({
            url: "/ifpOrigin?id&isDouble",
            controllerUrl: "./script/controller/ifpShowCtrl.js",
            controller: "ifpShowCtrl",
            templateUrl: "./view/ifp/ifpShow.html?v=" + HtmlVersion
        })).state("ifpOriginDouble", angularAMD.route({
            url: "/ifpOriginDouble?id",
            controllerUrl: "./script/controller/ifpShowCtrl.js",
            controller: "ifpShowCtrl",
            templateUrl: "./view/ifp/ifpShow.html?v=" + HtmlVersion
        })).state("ifpOutput", angularAMD.route({
            url: "/ifpOutput",
            controllerUrl: "./script/controller/ifpOutputCtrl.js",
            controller: "ifpOutputCtrl",
            templateUrl: "./view/ifp/ifpOutput.html?v=" + HtmlVersion
        })).state("ifpOpRecord", angularAMD.route({
            url: "/ifpOpRecord?tasktype",
            controllerUrl: "./script/controller/ifpOpRecordCtrl.js",
            controller: "ifpOpRecordCtrl",
            templateUrl: "./view/ifp/ifpOpRecord.html?" + HtmlVersion
        })).state("ifpOpRecordDouble", angularAMD.route({
            url: "/ifpOpRecordDouble?tasktype",
            controllerUrl: "./script/controller/ifpOpRecordCtrl.js",
            controller: "ifpOpRecordCtrl",
            templateUrl: "./view/ifp/ifpOpRecord.html?v=" + HtmlVersion
        })).state("bgOpRecord", angularAMD.route({
            url: "/bgOpRecord?tasktype",
            controllerUrl: "./script/controller/ifpOpRecordCtrl.js",
            controller: "ifpOpRecordCtrl",
            templateUrl: "./view/ifp/ifpOpRecord.html?" + HtmlVersion
        })).state("ifpAccess", angularAMD.route({
            url: "/ifpAccess",
            controllerUrl: "./script/controller/ifpAccessCtrl.js",
            controller: "ifpAccessCtrl"
            // templateUrl: "./view/ifp/ifpOpRecord.html?" + HtmlVersion
        }));
    };

    var ifpApp = angular.module("ifpApp", ["ui.router", "ui.uploader", "ui.bootstrap", "angular-popups"]);

    //ifpApp.config(["$stateProvider", "$urlRouterProvider", ifpRouter]);
    ifpApp.config(['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]);
    ifpApp.run(["$rootScope", function ($rootScope) {
        $rootScope.$on("$stateChangeSuccess", function () {
            //$rootScope.showLoading = false;
            $rootScope.CssVersion = CssVersion;
        });
    }]);

    //return angularAMD.bootstrap(ifpApp);
    return ifpApp;
});
