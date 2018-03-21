﻿define(["config/ifgConfig"], function (app) {
    app.directive("zeroRestrict", function () {
        return {
            require: "ngModel",
            link: function (scope, elem, attrs, ctrl) {
                var ngModel = attrs.ngModel;
                scope.$watch(ngModel, function (newVal, oldVal) {
                    var regex = /[\D]|0/g;
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
});;