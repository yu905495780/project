define(["config/ifgConfig"], function (app) {
    app.directive("englishChineseComma", function () {
        return {
            link: function (scope, elem, attrs, ctrl) {
                var ngModel = attrs.ngModel;
                scope.$watch(ngModel, function (newVal, oldVal) {
                    var regex = /[^A-Z0-9\u4E00-\u9FA5|\,\-\（\）\/ \(\)\，]/ig;
                    if (!newVal || typeof(newVal) !== 'string') {
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