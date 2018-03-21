define(["jquery",
    "lodash",
    "angularAMD",
    "ui-router",
    "ui-uploader",
    "ng-bootstrap",
    "ng-popups",
    "ztree",
], function ($, _, angularAMD) {

    var CssVersion = "201611281935",
        HtmlVersion = "201611281935";

    var ifgApp = angular.module("ifgApp", ["ui.router", "ui.uploader", "ui.bootstrap", "angular-popups"]);

    //ifgApp.config(["$stateProvider", "$urlRouterProvider", ifpRouter]);
    ifgApp.config(['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]);
    ifgApp.run(["$rootScope", function ($rootScope) {
        $rootScope.$on("$stateChangeSuccess", function () {
            //$rootScope.showLoading = false;
            $rootScope.CssVersion = CssVersion;
        });
    }]);

    //return angularAMD.bootstrap(ifgApp);
    return ifgApp;
});
