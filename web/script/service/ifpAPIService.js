define(["config/ifpConfig"], function (ifpApp) {
    ifpApp.factory("IFPAPIService", function () {
        return {
            ifpBaseUrl: "/ifp/"
        };
    });
});
