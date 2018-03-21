/*
 * 操作记录
 */
define([
    "config/ifgConfig",
    "service/ifg/ifgAPIService",
    "service/ifg/ifgJumpService",
    "filter/ifgToTrustFilter"
], function (app) {
    app.controller("ifgOpRecordCtrl", ["$rootScope", "$scope", "$http", "$location", "$filter", "$q", "$stateParams", "$uibModal", "IFGAPIService", "IFGJumpService",
        function ($rootScope, $scope, $http, $location, $filter, $q, $stateParams, $uibModal, IFGAPIService, IFGJumpService, undefined) {

            var tType = $location.search()["taskType"];
                // isDouble = $scope.isDouble = $location.search()["ctrl"] == "ifgOpRecordDouble";

            //初始化查询条件
            var searchCondition = {
                "operateTimeStart": "",
                "operateTimeEnd": "",
                "taskType": ((tType > 0 && tType < 6) ? tType : "-1"),
                "operator": "",
                "pageNum": "1",
                "pageSize": "20"
            };

            $scope.search = angular.extend({}, searchCondition);

            //#region 日历
            (function ($scope, undefined) {
                var now = new Date();
                $scope.opValue = {
                    start: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                    startOpen: false,
                    end: undefined,
                    endOpen: false
                };
                $scope.opValue.end = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
                $scope.opStartOpenClick = function () {
                    $scope.opValue.startOpen = true;
                };
                $scope.opEndOpenClick = function () {
                    $scope.opValue.endOpen = true;
                };
                $scope.$watch("opValue.start", function () {
                    $scope.search.operateTimeStart = $filter("date")($scope.opValue.start, "yyyy-MM-dd") || "";
                });
                $scope.$watch("opValue.end", function () {
                    $scope.search.operateTimeEnd = $filter("date")($scope.opValue.end, "yyyy-MM-dd") || "";
                });

                // 立即赋值，页面加载完成需要使用条件查询数据
                $scope.search.operateTimeStart = $filter("date")($scope.opValue.start, "yyyy-MM-dd") || "";
                $scope.search.operateTimeEnd = $filter("date")($scope.opValue.end, "yyyy-MM-dd") || "";
            })($scope);
            //#endregion

            //#region 事件监听
            (function ($scope, undefined) {
                // 查询点击事件
                $scope.searchClick = function () {
                    var conditionResult = beforeSearch($scope.search);

                    if (!conditionResult) {
                        return;
                    }

                    validCondition = angular.extend({}, conditionResult);
                    var searchDefer = search().then(function (data) {
                        searchResult(data);
                    }, function (status) {
                        if (status == -1) {
                            alert("请求超时");
                        } else {
                            alert("网络异常");
                        }
                        clearResult()
                    });
                };

                /**
                 * 重置点击事件
                 */
                $scope.resetClick = function () {
                    angular.extend($scope.search, searchCondition);
                    var now = new Date();
                    $scope.opValue.start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    $scope.opValue.end = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
                };

            })($scope);
            //#endregion


            //#region 查询
            /**
             * 查询条件验证
             */
            function beforeSearch(condition) {
                var valid = true,
                    conditionTmp = angular.extend({}, condition);


                if ($scope.opValue.end && $scope.opValue.start) {
                    if ($scope.opValue.end - $scope.opValue.start < 0) {
                        alert("结束日期必须大于开始日期");
                        valid = false;
                    } else {
                        // 跨度检测
                    }
                }


                if (valid) {
                    if (conditionTmp.taskType == "-1") {
                        delete conditionTmp.taskType;
                    }

                    angular.forEach(conditionTmp, function (value, key) {
                        conditionTmp[key] = ((value || "") + "").trim();
                    });

                    return conditionTmp;
                } else {
                    return valid;
                }
            }

            var validCondition = {};//验证后的查询条件
            /**
             * 查询
             */
            function search(condition) {
                showLoading();
                var deferred = $q.defer();

                $http({
                    method: "post",
                    url: IFGAPIService.ifgBaseUrl + "iepolicy/getTaskProgressList",
                    timeout: 10000,
                    data: validCondition
                }).success(function (data) {
                    deferred.resolve(data);
                    hideLoading();
                }).error(function (data, status) {
                    deferred.reject(status);
                    hideLoading();
                });
                return deferred.promise;
            }

            /**
             * 查询结果进行处理
             */
            function searchResult(data) {
                if (data.success) {
                    if (data.data) {
                        $scope.pagination.total = data.data.total;
                        $scope.pagination.page = data.data.pageNum;
                        $scope.pagination.perPage = data.data.pageSize;
                        $scope.pagination.pages = data.data.pages;
                        $scope.list = data.data.list;
                        $scope.pagination.show = true;

                        angular.element(".paginationInput input").val($scope.pagination.page);
                    } else {
                        clearResult()
                    }
                } else {
                    alert(_.map(data.errMsg, function (item, key) {
                            return item
                        }).join("<br>") || "查询失败").then(function () {
                        IFGJumpService.login(data);
                    });
                    clearResult()
                }
            }

            function clearResult() {
                $scope.list = [];
                $scope.pagination.total = 0;
                $scope.pagination.page = 1;
                $scope.pagination.pages = 0;
                $scope.pagination.show = true;
                angular.element(".paginationInput input").val($scope.pagination.page);
            }

            //#endregion

            //#region 去下载
            /**
             * 去下载
             */
            $scope.downloadClick = function (url, id) {
                window.open(IFGAPIService.ifgBaseUrl + "iepolicy/downloadFile?id=" + id + "&url=" + url);
            };

            /**
             * 检查是否有权限
             */
            function checkPermition() {
                showLoading();
                var deferred = $q.defer();
                $http({
                    method: "post",
                    url: IFGAPIService.ifgBaseUrl + "iepolicy/checkPermition",
                    timeout: 10000,

                }).success(function (data) {
                    deferred.resolve(data);
                    hideLoading();
                }).error(function (data, status) {
                    deferred.reject(status);
                    hideLoading();
                });
                return deferred.promise;
            }

            //#endregion

            //#region 分页
            (function ($scope, undefined) {
                $scope.pagination = {
                    perPage: 20, //一页显示多少条数据
                    page: 1, // 第几页
                    maxSize: 10, // 一批显示多少页
                    total: 0, // 总数量
                    pages: 0 // 总共多少页
                };

                var lastChangePageNum = 1;
                $scope.paginationChange = function () {
                    validCondition.pageNum = $scope.pagination.page;
                    var paginationInput = angular.element(".paginationInput input");
                    search().then(function (data) {
                        searchResult(data);
                        if (data.success) {
                            paginationInput.val(lastChangePageNum = $scope.pagination.page);
                        } else {
                            paginationInput.val($scope.pagination.page = lastChangePageNum = 1);
                        }
                    }, function (status) {
                        if (status == -1) {
                            alert("请求超时");
                        } else {
                            alert("网络异常");
                        }
                        clearResult();
                        paginationInput.val($scope.pagination.page = lastChangePageNum = 1);
                    });
                };

                var paginationInput = angular.element(".paginationInput input");
                $scope.pageBlur = function ($event) {

                    var keycode = window.event ? $event.keyCode : $event.which;
                    if (keycode != 13) {
                        return true;
                    }

                    var target = $event.target,
                        value = target.value.trim() || $scope.pagination.page;
                    if (parseInt(value, 10)) {
                        if (value == $scope.pagination.page) {
                            return false;
                        } else {
                            validCondition.pageNum = value;
                            search().then(function (data) {
                                searchResult(data);
                                if (data.success) {
                                    lastChangePageNum = target.value = $scope.pagination.page;
                                    validCondition.pageNum = lastChangePageNum;
                                } else {
                                    clearResult();
                                    target.value = lastChangePageNum = 1;
                                    validCondition.pageNum = lastChangePageNum;
                                }

                            }, function (status) {
                                if (status == -1) {
                                    alert("请求超时");
                                } else {
                                    alert("网络异常");
                                }
                                clearResult()
                                target.value = $scope.pagination.page;

                            });
                        }
                    }
                }


            })($scope);
            //endregion


            //#region 弹框
            var dialog = function (config) {

                var modalInstance = $uibModal.open({
                    templateUrl: "ifgDialog.html",
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
                $rootScope.showLoading = true;
            }

            /**
             * 隐藏加载
             */
            function hideLoading() {
                $rootScope.showLoading = false;
            }

            //#endregion

            // 页面加载完成调用click事件
            $scope.searchClick();
        }]);
    angular.bootstrap(document, ["ifgApp"])
});
