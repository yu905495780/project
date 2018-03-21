define(["config/ifgConfig"], function (ifgApp) {
    ifgApp.factory("IFGJumpService", function () {
        var IFPUrl = window.IFPUrl || {};
        var loginUrl = IFPUrl.loginUrl || "http://sztest.ifp.com/iflight";

        return {
            login: function (result) {
                if (!result.success && result.errMsg && result.errMsg.overdue) {
                    window.parent.location.href = loginUrl;
                }
            }
        }
    });
});