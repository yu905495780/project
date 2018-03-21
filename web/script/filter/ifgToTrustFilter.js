define(["config/ifgConfig"], function (app) {
    app.filter('toTrustIFG', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);
});;