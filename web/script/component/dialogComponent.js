define(["config/ifpConfig"], function (ifpApp) {
    ifpApp.component("dialogComponent", {
        templateUrl: "ifpDialog.html",
        controller: function () {
            var $ctrl = this;

            $ctrl.ok = function () {
                $ctrl.close({ $value: "close" });
            };

            $ctrl.cancel = function () {
                $ctrl.dismiss({ $value: "cancel" });
            };
        }
    });
});