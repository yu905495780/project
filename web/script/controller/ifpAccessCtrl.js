/**
 * 查询
 */
define([
    "config/ifpConfig",
    "service/ifpAPIService",
    "service/ifpJumpService",
    "filter/toTrustFilter.min"
], function (app) {
    app.controller("ifpAccessCtrl", ["$rootScope", "$scope", "$http", "$location", "$filter", "$q", "$timeout", "$uibModal", "IFPAPIService", "IFPJumpService",
        function ($rootScope, $scope, $http, $location, $filter, $q, $timeout, $uibModal, IFPAPIService, IFPJumpService, undefined) {

            /**
             * 初始化查询
             */
            $scope.list = [];
            search().then(function (data) {
                searchHandler(data);
            }, function (status) {
                if (status == -1) {
                    alert("请求超时");
                } else {
                    alert("网络异常");
                }
            });

            (function ($scope, undefined) {
                /**
                 * 创建点击
                 */
                $scope.addClick = function () {
                    var insertDefer = insert();
                    insertDefer.then(function (data) {
                        insertHandler(data);
                        search().then(function (data) {
                            searchHandler(data);
                        }, function (status) {
                            $scope.list = [];
                            if (status == -1) {
                                alert("请求超时");
                            } else {
                                alert("网络异常");
                            }
                        });
                    }, function (status) {
                        if (status == -1) {
                            alert("请求超时");
                        } else {
                            alert("网络异常");
                        }
                    });
                };

                /**
                 * 删除
                 */
                $scope.deleteClick = function (item) {
                    if (confirm("确定删除吗?")) {
                        var deleteDefer = deleteAccessKey(item.id);
                        deleteDefer.then(function (data) {
                            if (data && data.success) {
                                alert("删除成功");
                                search().then(function (data) {
                                    searchHandler(data);
                                }, function (status) {
                                    if (status == -1) {
                                        alert("请求超时");
                                    } else {
                                        alert("网络异常");
                                    }
                                    $scope.list = [];
                                });
                            } else {
                                alert(data.message || "系统异常");
                            }
                        }, function (status) {
                            alert("网络异常");
                        });
                    }
                };

                /**
                 * 下载
                 */
                $scope.downloadClick = function () {
                    window.open(IFPAPIService.ifpBaseUrl + "access/download");
                };
                /**
                 * 刷新
                 */
                $scope.refreshClick = function () {
                    search().then(function (data) {
                        searchHandler(data);
                    }, function (status) {
                        if (status == -1) {
                            alert("请求超时");
                        } else {
                            alert("网络异常");
                        }
                    });
                }
            })($scope);

            /**
             * 新增
             */
            function insert() {
                showLoading();
                var deferred = $q.defer();
                $http({
                    method: "post",
                    url: IFPAPIService.ifpBaseUrl + "access/create",
                    timeout: 10000
                }).success(function (data) {
                    deferred.resolve(data);
                    hideLoading();
                }).error(function (data, status) {
                    deferred.reject(status);
                    hideLoading();
                });
                return deferred.promise;
            }

            function insertHandler(data) {
                if (!data.success) {
                    $scope.list = [];
                    alert(data.message || "系统异常");
                }
            }

            /**
             * 查询
             */
            function search() {
                showLoading();
                var deferred = $q.defer();
                $http({
                    method: "post",
                    url: IFPAPIService.ifpBaseUrl + "access/search",
                    timeout: 10000
                }).success(function (data) {
                    deferred.resolve(data);
                    hideLoading();
                }).error(function (data, status) {
                    deferred.reject(status);
                    hideLoading();
                });
                return deferred.promise;
            }

            function searchHandler(data) {
                if (data.success) {
                    if (data.data) {
                        $scope.list = data.data;
                    } else {
                        $scope.list = [];
                    }
                } else {
                    $scope.list = [];
                    alert(data.message || "系统异常");
                }
            }

            /**
             * 删除
             */
            function deleteAccessKey(id) {
                showLoading();
                var deferred = $q.defer();
                $http.post(IFPAPIService.ifpBaseUrl + "access/delete", { id: id }).success(function (data) {
                    hideLoading();
                    deferred.resolve(data);
                }).error(function (data) {
                    hideLoading();
                    deferred.reject(data);
                });
                return deferred.promise;
            }

            /**
             * 显示加载
             */
            function showLoading() {
                $rootScope.showLoading = true;
            }

            /**
             * 隐藏加载
             */
            function hideLoading() {
                $rootScope.showLoading = false;
            }

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
        }]);
    angular.bootstrap(document, ["ifpApp"]);
});