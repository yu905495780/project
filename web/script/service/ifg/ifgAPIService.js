define(["config/ifgConfig"], function (ifgApp) {
    ifgApp.factory("IFGAPIService", function () {
        return {
            ifgBaseUrl: "/ifp/"
        };
    });
});
