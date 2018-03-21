define(["config/ifpConfig"], function (app) {
    app.filter('toTrust', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);
});;