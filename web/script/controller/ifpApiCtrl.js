/**
 * Created by wk46083 on 2017/5/3.
 */
define([
    "config/ifpConfig",
    "service/ifpAPIService",
    "service/ifpJumpService",
    "filter/toTrustFilter"], function (app) {
    app.controller("ifpApiCtrl", ["$rootScope", "$scope", "$http", "$location", "$filter", "$q", "$stateParams", "$timeout", "$uibModal", "IFPAPIService", "IFPJumpService",
        function ($rootScope, $scope, $http, $location, $filter, $q, $stateParams, $timeout, $uibModal, IFPAPIService, IFPJumpService, undefined) {
            //#region 原始数据
            $scope.data = {
                "ApiContent": "",
                 "Type":"1"
            };
            //#region 验证
            $scope.validate = {
                "ApiContent": {"valid": true, "reason": "", defMsg: "请输入Api请求参数"}
            };
            //#endregion
            var baseUrl = IFPAPIService.ifpBaseUrl;//基本Url
            //#region
            $scope.changeX = function ($ele) {
               // var value= $("#sel").val();
                //var s="{\"operateType\":"+value+"}";
                //$("#requestvalue").val(s);
               // $("#ResultValue").val("");
            }
            //#endregion

            //#region 提交
            /**
             * 保存
             */
            $scope.saveClick = function ($ele) {
                if (!beforeSaveValidate($scope, $scope.data, $scope.validate)) {
                    return;
                } else {
                    var param = angular.extend({}, $scope.data);
                    var obj = JSON.parse(param.ApiContent);
                    if(obj.operateType!=param.Type)
                    {
                        alert("请求参数不合法,请重新输入");
                        return;
                    }
                    showLoading();
                    var url = "api/GetApi";
                    $http.post(baseUrl + url, param.ApiContent).success(function (data) {
                         $("#ResultValue").val(JSON.stringify(data));
                         hideLoading();
                     }).error(function (data, status) {
                         if (status == "-1") {
                             alert("请求超时");
                         } else {
                             alert("网络错误");
                         }
                         hideLoading();
                     });
                }
            }
            /**
             * 支付前验证
             */
            function beforeSaveValidate($scope, data, validate) {
                var valid = true;
                angular.forEach($scope.validate, function (value, key) {
                    value.valid = true;
                    value.reason = "";
                });
                //#region 普通非空验证
                var inputRequires = ["ApiContent"]//input必填

                 for (var len = inputRequires.length; len--;) {
                    var requireItem = inputRequires[len];
                    if (((data[requireItem] || "") + "").trim() == "") {//如果未输入
                        validate[requireItem].valid = false;
                        validate[requireItem].reason = validate[requireItem].defMsg;
                        valid = false;
                    }
                }
                //#endregion
                if (!valid) {
                    $timeout(errorScroll);
                }
                return valid;
            }
            /**
             * 提交失败原因提示
             */
            function saveFalseHandler(errObj) {
                angular.forEach($scope.validate, function (value, key) {
                    value.valid = true;
                    value.reason = "";
                });
                angular.forEach(errObj, function (value, key) {
                    var validteItem = $scope.validate[key];
                    if (validteItem) {
                        $scope.validate[key].valid = false;
                        $scope.validate[key].reason = value;
                    }
                });
            }

            //#endregion



            //#region 弹框
            var dialog = function (config) {

                var modalInstance = $uibModal.open({
                    templateUrl: "ifpDialog.html",
                    bindToController: true,
                    controllerAs: '$ctrl',
                    size: config.size,
                    bindToController: true,
                    scope: $scope,
                    backdrop: "static"
                });

                modalInstance.result.then(function () {
                    typeof config.ok == "function" && config.ok();
                }, function () {
                    typeof config.cancel == "function" && config.cancel();
                });
                $scope.dialogOkClick = function () {
                    modalInstance.close();

                };
                $scope.dialogCancelClick = function () {
                    modalInstance.dismiss();
                };
            };
            var alert = function (msg) {
                var defer = $q.defer();
                $scope.dialogContent = msg;
                dialog({
                    size: "sm",
                    ok: function () {
                        defer.resolve();
                    }
                });
                return defer.promise;
            };
            //#endregion



            //#region loading
            /**
             * 显示加载
             */
            function showLoading() {
                $scope.showLoading = true;
            }

            /**
             * 隐藏加载
             */
            function hideLoading() {
                $scope.showLoading = false;
            }

            //#endregion
            // $scope.pageShow = true;
        }]);
    angular.bootstrap(document, ["ifpApp"])
});
