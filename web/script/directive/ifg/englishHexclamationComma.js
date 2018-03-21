/**
 * Created by wk46083 on 2018/1/30.
 */
define(["config/ifgConfig"], function (ifpApp) {
    ifpApp.directive("englishHexclamationComma", function () {
    return {
        link: function (scope, elem, attrs, ctrl) {
            var ngModel = attrs.ngModel;
            scope.$watch(ngModel, function (newVal, oldVal) {
                var regex = /[^A-Z\,!]/ig;
                if (!newVal) {
                    return;
                }
                if (regex.test(newVal)) {
                    newVal = newVal.replace(regex, "");
                    var ngModels = ngModel.split(".");

                    if (ngModels.length > 1) {
                        var val = scope[ngModels[0]];
                        for (var i = 1, len = ngModels.length; i < len; i++) {
                            if (i >= len - 1) {
                                val[ngModels[i]] = newVal;
                            } else {
                                val = val(ngModels[i]);
                            }
                        }
                    } else {
                        scope[ngModels[0]] = newVal;
                    }
                }
            })
        }
    }
});
});

