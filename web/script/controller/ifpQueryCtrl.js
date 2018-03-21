/**
 * 查询
 */
define([
    "config/ifpConfig",
    "service/ifpAPIService",
    "service/ifpJumpService",
    "filter/toTrustFilter.min",
    "directive/digitalOnly.min",
    "directive/chineseRestrict.min",
    "directive/englishComma.min",
    "directive/englishDigital.min",
    "directive/englishDigitalDashSlash.min"
], function (app) {
    app.controller("ifpQueryCtrl", ["$rootScope", "$scope", "$http", "$location", "$filter", "$q", "$timeout", "$uibModal", "IFPAPIService", "IFPJumpService",
        function ($rootScope, $scope, $http, $location, $filter, $q, $timeout, $uibModal, IFPAPIService, IFPJumpService, undefined) {
            var isDouble = $scope.isDouble = $location.search()["ctrl"] == "ifpQueryDouble"

            //#region 初始查询条件
            var searchConditon = {
                "id": "",
                "status": "-1",
                "productType": "-1",
                "airline": "",
                "depCity": "",
                "arrCity": "",
                "fileCode": "",
                "cabin": "",
                "saleDateStart": "",
                "saleDateEnd": "",
                "agent": "",
                "pageNum": 1,
                "pageSize": 20,
                "orderColumn": "",
                "travelType": isDouble ? "2" : "1"
            };

            $scope.search = angular.extend({}, searchConditon);
            $scope.list = [];
            //#endregion

            //#region 日历
            (function ($scope, undefined) {
                var now = new Date();
                $scope.saleValue = {
                    start: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                    startOpen: false,
                    end: undefined,
                    endOpen: false,
                };
                $scope.saleValue.end = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
                $scope.saleStartOpenClick = function () {
                    $scope.saleValue.startOpen = true;
                }
                $scope.saleEndOpenClick = function () {
                    $scope.saleValue.endOpen = true;
                }
                $scope.$watch("saleValue.start", function () {
                    $scope.search.saleDateStart = $filter("date")($scope.saleValue.start, "yyyy-MM-dd") || "";
                });
                $scope.search.saleDateStart = $filter("date")($scope.saleValue.start, "yyyy-MM-dd") || "";
                $scope.$watch("saleValue.end", function () {
                    $scope.search.saleDateEnd = $filter("date")($scope.saleValue.end, "yyyy-MM-dd") || "";
                });
                $scope.search.saleDateEnd = $filter("date")($scope.saleValue.end, "yyyy-MM-dd") || "";
            })($scope);
            //#endregion

            //#region 事件监听
            (function ($scope, undefined) {

                /**
                 * 查询点击事件
                 */
                $scope.searchClick = function () {
                    var conditonResult = beforeSearch($scope.search);
                    if (!conditonResult) {
                        return;
                    }
                    validCondition = angular.extend({}, conditonResult);
                    var searchDefer = search().then(function (data) {
                        searchResult(data);
                    }, function (status) {
                        if (status == -1) {
                            alert("请求超时");
                        } else {
                            alert("网络异常");
                        }
                        clearResult();
                    });
                };
                /**
                 * 重置点击事件
                 */
                $scope.resetClick = function () {
                    angular.extend($scope.search, searchConditon);
                    var now = new Date();
                    $scope.saleValue.start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    $scope.saleValue.end = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
                };
                /*
                 * 跳转链接
                 */
                $scope.goClick = function (href) {
                    window.open(href);
                };

                $scope.download = function () {
                    window.open(IFPAPIService.ifpBaseUrl + "policy/download/" + (isDouble ? "2" : "1"));
                }

                $scope.importDialogConfig = {
                    title: "导入",
                    show: false,
                    src: "./ifpImport.html?ctrl=" + (isDouble ? 'ifpImportDouble' : 'ifpImport')
                };
                /**
                 * 跳转到详情
                 */
                $scope.detailClick = function (item) {
                    window.open("./ifpShow.html?ctrl=" + (isDouble ? "ifpShowDouble" : "ifpShow") + "&id=" + item.id);
                };
            })($scope);
            //#endregion

            //#region 批量操作
            (function ($scope, undefined) {
                /**
                 * 全选
                 */
                $scope.selectAll = false;
                $scope.checkAllClick = function ($event) {
                    $scope.selectAll = !$scope.selectAll
                    if ($scope.selectAll == true) {
                        angular.forEach($scope.list, function (item) {
                            item.checked = true;
                        });
                    } else {
                        angular.forEach($scope.list, function (item) {
                            item.checked = false;
                        });
                    }
                };

                /**
                 * 单选
                 */
                $scope.checkClick = function ($event, item) {
                    //var target = $event.target;
                    //item.checked = target.checked;

                    var allChecked = true;
                    _.each($scope.list, function (item, index) {
                        if (!item.checked) {
                            allChecked = false;
                        }
                    });

                    if ($scope.list.length && allChecked) {
                        $scope.selectAll = true;
                    } else {
                        $scope.selectAll = false;
                    }
                };

                /**
                 * 挂起选择
                 */
                $scope.suspendSelectClick = function () {
                    var ids = getSelect();
                    if (ids.length) {
                        if (!confirm("确认批量挂起吗?")) {
                            return false;
                        }
                        suspendSelected(ids).then(function (data) {
                            if (data && data.success) {
                                alert(data.data || "批量挂起成功");
                                search().then(function (data) {
                                    searchResult(data);
                                }, function (status) {
                                    if (status == -1) {
                                        alert("请求超时");
                                    } else {
                                        alert("网络异常");
                                    }
                                    clearResult();
                                });
                            } else {
                                alert(_.map(data.errMsg, function (item) {
                                        return item
                                    }).join("<br>") || "批量挂起失败").then(function () {
                                    IFPJumpService.login(data);
                                });
                            }
                        }, function (status) {
                            if (status == -1) {
                                alert("请求超时");
                            } else {
                                alert("网络异常");
                            }
                        });
                    } else {
                        alert("请选择");
                    }
                };

                /**
                 * 投放选择
                 */
                $scope.resumeSelectClick = function () {
                    var ids = getSelect();
                    if (ids.length) {
                        if (!confirm("确认批量投放吗?")) {
                            return false;
                        }
                        resumeSelected(ids).then(function (data) {
                            if (data && data.success) {
                                alert(data.data || "批量解挂成功")
                                search().then(function (data) {
                                    searchResult(data);
                                }, function (status) {
                                    if (status == -1) {
                                        alert("请求超时");
                                    } else {
                                        alert("网络异常");
                                    }
                                    clearResult();
                                });
                            } else {
                                alert(_.map(data.errMsg, function (item) {
                                        return item
                                    }).join("<br>") || "批量解挂失败").then(function () {
                                    IFPJumpService.login(data);
                                })
                            }
                        }, function (status) {
                            if (status == -1) {
                                alert("请求超时");
                            } else {
                                alert("网络异常");
                            }
                        });
                    } else {
                        alert("请选择");
                    }
                };

                /**
                 * 删除
                 */
                $scope.deleteSelectClick = function () {
                    var ids = getSelect();
                    if (ids.length) {
                        if (!confirm("确认批量删除吗?")) {
                            return false;
                        }
                        deleteSelected(ids).then(function (data) {
                            if (data && data.success) {
                                alert(data.data || "批量删除成功")
                                search().then(function (data) {
                                    searchResult(data);
                                }, function (status) {
                                    if (status == -1) {
                                        alert("请求超时");
                                    } else {
                                        alert("网络异常");
                                    }
                                    clearResult();
                                });
                            } else {
                                alert(_.map(data.errMsg, function (item) {
                                        return item
                                    }).join("<br>") || "批量删除失败").then(function () {
                                    IFPJumpService.login(data);
                                })
                            }
                        }, function (status) {
                            if (status == -1) {
                                alert("请求超时");
                            } else {
                                alert("网络异常");
                            }
                        });
                    } else {
                        alert("请选择");
                    }
                };

                /**
                 * 导出
                 */
                $scope.exportClick = function () {
                    if (!confirm("确认是否按照当前查询条件进行批量导出")) {
                        return false;
                    }
                    exportRequest().then(function (data) {
                        if (data.success) {
                            if (confirm(data.data || "正在处理中，是否跳转到批量操作记录进行查看?")) {
                                window.open("./ifpOpRecord.html?ctrl=" + (isDouble ? "ifpOpRecordDouble" : "ifpOpRecord") + "&tasktype=2");
                            }
                        } else {
                            alert(_.map(data.errMsg, function (item) {
                                    return item;
                                }).join("<br>") || "导出失败").then(function () {
                                IFPJumpService.login(data);
                            });
                        }
                    }, function (status) {
                        if (status == -1) {
                            alert("请求超时")
                        } else {
                            alert("网络异常");
                        }
                    })
                }

                /**
                 * 获取选中的政策
                 */
                function getSelect() {
                    var ids = [];
                    _.each($scope.list, function (item, index) {
                        if (item.checked) {
                            ids.push(item.id);
                        }
                    });
                    return ids;
                }

                /**
                 * 批量删除
                 */
                function deleteSelected(ids) {
                    var param = {
                        ids: ids,
                        travelType: isDouble ? "2" : "1",
                        condition: validCondition
                    };

                    showLoading();
                    var deferred = $q.defer();
                    $http({
                        method: "post",
                        url: IFPAPIService.ifpBaseUrl + "policy/batchDelete",
                        data: param
                    }).success(function (data) {
                        hideLoading();
                        deferred.resolve(data);
                    }).error(function (data, status) {
                        hideLoading();
                        deferred.reject(status);
                    });
                    return deferred.promise;
                }

                /**
                 * 批量挂起
                 */
                function suspendSelected(ids) {
                    var param = {
                        ids: ids,
                        travelType: isDouble ? "2" : "1",
                        condition: validCondition
                    };

                    showLoading();
                    var deferred = $q.defer();
                    $http({
                        method: "post",
                        url: IFPAPIService.ifpBaseUrl + "policy/batchHangUp",
                        data: param
                    }).success(function (data) {
                        hideLoading();
                        deferred.resolve(data);
                    }).error(function (data, status) {
                        hideLoading();
                        deferred.reject(status);
                    });
                    return deferred.promise;
                }

                /**
                 * 批量投放
                 */
                function resumeSelected(ids) {
                    var param = {
                        ids: ids,
                        travelType: isDouble ? "2" : "1",
                        condition: validCondition
                    };

                    showLoading();
                    var deferred = $q.defer();
                    $http({
                        method: "post",
                        url: IFPAPIService.ifpBaseUrl + "policy/batchRepublish",
                        data: param
                    }).success(function (data) {
                        hideLoading();
                        deferred.resolve(data);
                    }).error(function (data, status) {
                        hideLoading();
                        deferred.reject(status);
                    });
                    return deferred.promise;
                }

                //#region 批量修改, 仅状态


                /**
                 * 编辑
                 */
                $scope.editSelectClick = function () {
                    if (!confirm("确认是否按照当前查询条件进行批量修改")) {
                        return false;
                    }
                    var ids = [];
                    var batchEditDialogInstance = batchEditDialog({
                        ok: function () {
                            if ($scope.stageChange.beforState == "-1") {
                                $scope.stageChange.valid = false;
                                $scope.stageChange.reason = "请选择修改前状态";
                                return;
                            }

                            if ($scope.stageChange.afterState == "-1") {
                                $scope.stageChange.valid = false;
                                $scope.stageChange.reason = "请选择修改后状态";
                                return;
                            }
                            $scope.stageChange.valid = true;
                            $scope.stageChange.reason = "";

                            if (confirm("确认修改吗?")) {
                                editSelected(ids, $scope.stageChange.beforState, $scope.stageChange.afterState)
                                    .then(function (data) {
                                        if (data && data.success) {
                                            batchEditDialogInstance.close();
                                            if (confirm(data.data || "正在处理中，是否跳转到批量操作记录进行查看?")) {
                                                window.open("./ifpOpRecord.html?ctrl=" + (isDouble ? "ifpOpRecordDouble" : "ifpOpRecord"));
                                            }
                                        } else {
                                            alert(_.map(data.errMsg, function (item) {
                                                    return item;
                                                }).join("<br>") || "修改失败").then(function () {
                                                IFPJumpService.login(data);
                                            });
                                        }
                                    }, function (status) {
                                        if (status == -1) {
                                            alert("请求超时");
                                        } else {
                                            alert("网络异常");
                                        }
                                    })
                            }
                        }
                    });
                };

                /**
                 * 批量修改, 仅状态
                 */
                function editSelected(ids, stateBefore, stateAfter) {
                    var param = {
                        ids: ids,
                        travelType: isDouble ? "2" : "1",
                        stateBefore: stateBefore,
                        stateAfter: stateAfter,
                        condition: validCondition
                    };

                    showLoading();
                    var deferred = $q.defer();
                    $http({
                        method: "post",
                        url: IFPAPIService.ifpBaseUrl + "policy/batchUpdate",
                        data: param
                    }).success(function (data) {
                        hideLoading();
                        deferred.resolve(data);
                    }).error(function (data, status) {
                        hideLoading();
                        deferred.reject(status);
                    });
                    return deferred.promise;
                }

                $scope.stageChange = {
                    beforState: "-1",
                    afterState: "-1",
                    valid: true,
                    reason: ""
                };
                $scope.beforStateChange = function () {
                    console.info($scope.stageChange.beforState);
                    $scope.stageChange.afterState = "-1";
                }
                /**
                 * 批量修改
                 */
                var batchEditDialog = function (config) {
                    $scope.stageChange.beforState = "-1";
                    $scope.stageChange.afterState = "-1";
                    $scope.stageChange.valid = true;
                    $scope.stageChange.reason = "";

                    var modalInstance = $uibModal.open({
                        templateUrl: "ifpSelectedEdit.html",
                        bindToController: true,
                        controllerAs: '$ctrl',
                        //size: "lg",
                        bindToController: true,
                        scope: $scope,
                        backdrop: "static"
                    });

                    $scope.batchOkClick = function () {
                        typeof config.ok == "function" && config.ok();
                    };
                    $scope.batchCloseClick = function () {
                        modalInstance.dismiss();
                    };
                    return modalInstance;
                };
                //#endregion


                /**
                 * 导出, 生成下载链接
                 */
                function exportRequest() {
                    var param = {
                        condition: angular.extend({}, validCondition),
                        travelType: isDouble ? "2" : "1",
                    };
                    showLoading();
                    var deferred = $q.defer();
                    $http({
                        method: "post",
                        url: IFPAPIService.ifpBaseUrl + "policy/export",
                        data: param
                    }).success(function (data) {
                        hideLoading();
                        deferred.resolve(data);
                    }).error(function (data, status) {
                        hideLoading();
                        deferred.reject(status);
                    });
                    return deferred.promise;
                }
            })($scope);

            //#endregion

            //#region 删除,挂起,投放
            (function ($scope, undefined) {
                /**
                 * 删除
                 */
                $scope.deleteClick = function (item) {
                    if (confirm("确定删除吗?")) {
                        var deleteDefer = deleteIfp(item.id);
                        deleteDefer.then(function (data) {
                            if (data && data.success) {
                                alert("删除成功");
                                search().then(function (data) {
                                    searchResult(data);
                                }, function (status) {
                                    if (status == -1) {
                                        alert("请求超时");
                                    } else {
                                        alert("网络异常");
                                    }
                                    clearResult();
                                });
                            } else {
                                alert(_.map(data.errMsg, function (item) {
                                    return item
                                }).join("<br>")).then(function () {
                                    IFPJumpService.login(data);
                                });
                            }
                        }, function (status) {
                            alert("网络异常");
                        });
                    }
                };

                /**
                 * 挂起
                 */
                $scope.suspendClick = function (item) {
                    if (confirm("确定挂起吗?")) {
                        suspendIfp(item.id).then(function (data) {
                            if (data && data.success) {
                                alert("挂起成功");
                                search().then(function (data) {
                                    searchResult(data);
                                }, function (status) {
                                    if (status == -1) {
                                        alert("请求超时");
                                    } else {
                                        alert("网络异常");
                                    }
                                    clearResult();
                                });
                            } else {
                                alert(_.map(data.errMsg, function (item) {
                                        return item
                                    }).join("<br>") || "挂起失败").then(function () {
                                    IFPJumpService.login(data);
                                });
                            }
                        }, function (data) {
                            alert("网络异常");
                        });
                    }
                };
                /**
                 * 投放
                 */
                $scope.resumeClick = function (item) {
                    if (confirm("确定投放吗?")) {
                        var deleteDefer = resumeIfp(item.id);
                        deleteDefer.then(function (data) {
                            if (data && data.success) {
                                alert("投放成功");
                                search().then(function (data) {
                                    searchResult(data);
                                }, function (status) {
                                    if (status == -1) {
                                        alert("请求超时");
                                    } else {
                                        alert("网络异常");
                                    }
                                    clearResult();
                                });
                            } else {
                                alert(_.map(data.errMsg, function (item) {
                                        return item
                                    }).join("<br>") || "投放失败").then(function () {
                                    IFPJumpService.login(data);
                                });
                            }
                        }, function (data) {
                            alert("网络异常");
                        });
                    }
                };

                /**
                 * 复制
                 */
                $scope.copyClick = function (item) {
                    window.open("./ifpAdd.html?ctrl=" + (isDouble ? "ifpCopyDouble" : "ifpCopy") + "&id=" + item.id);

                };

                /**
                 * 编辑
                 */
                $scope.editClick = function (item) {
                    existIfp(item.id).then(function (data) {
                        if (data.success) {
                            window.open("./ifpAdd.html?ctrl=" + (isDouble ? "ifpEditDouble" : "ifpEdit") + "&id=" + item.id);
                        } else {
                            alert(_.map(data.errMsg, function (item) {
                                    return item
                                }).join("<br>") || "不可修改").then(function () {
                                IFPJumpService.login(data);
                            })
                        }
                    }, function () {
                        alert("网络异常");
                    })

                };


                /**
                 * 删除
                 * @param id 政策id
                 */
                function deleteIfp(id) {
                    showLoading();
                    var deferred = $q.defer();
                    $http.post(IFPAPIService.ifpBaseUrl + "policy/deleteById", {id: id}).success(function (data) {
                        hideLoading();
                        deferred.resolve(data);
                    }).error(function (data) {
                        hideLoading();
                        deferred.reject(data);
                    });
                    return deferred.promise;
                }

                /**
                 * 挂起
                 */
                function suspendIfp(id) {
                    var deferred = $q.defer();
                    $http.post(IFPAPIService.ifpBaseUrl + "policy/hangUpById", {id: id}).success(function (data) {
                        deferred.resolve(data);
                    }).error(function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                }

                /**
                 * 投放
                 */
                function resumeIfp(id) {
                    var deferred = $q.defer();
                    $http.post(IFPAPIService.ifpBaseUrl + "policy/republishById", {id: id}).success(function (data) {
                        deferred.resolve(data);
                    }).error(function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                }

                /**
                 * 复制
                 */
                 /*(isDouble ? "copyRt" : "copyOw")*/
                function copyIfp(id) {
                    var deferred = $q.defer();
                    $http.post(IFPAPIService.ifpBaseUrl + "policy/checkExistence" , {id:id}).success(function (data) {
                        deferred.resolve(data);
                    }).error(function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                }

                /**
                 * 检验是否存在
                 */
                function existIfp(id) {
                    var deferred = $q.defer();
                    $http.post(IFPAPIService.ifpBaseUrl + "policy/checkExistence", {id: id}).success(function (data) {
                        deferred.resolve(data);
                    }).error(function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                }
            })($scope)
            //#endregion

            //#region 查询
            /**
             * 查询条件验证
             */
            function beforeSearch(condition) {
                var valid = true,
                    conditionTmp = angular.extend({}, condition);
                if (!isDouble) {
                    if ($scope.saleValue.end && $scope.saleValue.start) {

                        var startAddThreeMonth = new Date($filter("date")($scope.saleValue.start, "yyyy-MM-dd"));
                        startAddThreeMonth.setMonth(startAddThreeMonth.getMonth() + 3);

                        if ($scope.saleValue.end - $scope.saleValue.start < 0) {
                            alert("销售日期结束日期必须大于开始日期");
                            valid = false;
                        } else if ($scope.saleValue.end > startAddThreeMonth) {
                            alert("销售日期跨度不可以大于3个月");
                            valid = false
                        }
                    }
                }
                if (valid) {

                    if (conditionTmp.status == "-1") {
                        delete conditionTmp.status;
                    }
                    if (conditionTmp.productType == "-1") {
                        delete conditionTmp.productType;
                    }
                    if (false && isDouble) {
                        delete conditionTmp.saleDateStart;
                        delete conditionTmp.saleDateEnd;
                    }
                    angular.forEach(conditionTmp, function (value, key) {
                        conditionTmp[key] = ((value || "") + "").trim();
                    });
                    if (conditionTmp.airline) {
                        conditionTmp.airline = conditionTmp.airline.toUpperCase();
                    }
                    if (conditionTmp.depCity) {
                        conditionTmp.depCity = conditionTmp.depCity.toUpperCase();
                    }
                    if (conditionTmp.arrCity) {
                        conditionTmp.arrCity = conditionTmp.arrCity.toUpperCase();
                    }
                    return conditionTmp;
                } else {
                    return valid;
                }

            }

            var validCondition = angular.extend({}, $scope.search);//验证后的查询条件
            /**
             * 查询
             */
            function search(condition) {
                showLoading();
                var deferred = $q.defer();

                $http({
                    method: "post",
                    url: IFPAPIService.ifpBaseUrl + (isDouble ? "policy/searchRt" : "policy/searchOw"),
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
                        $scope.pagination.show = true;
                        $scope.list = data.data.list;

                        angular.element(".paginationInput input").val($scope.pagination.page);
                        cityHandler($scope.list);
                    } else {
                        clearResult();
                    }
                } else {
                    clearResult();
                    alert(_.map(data.errMsg, function (item, key) {
                        return item
                    }).join("<br>")).then(function () {
                        IFPJumpService.login(data);
                    });
                }

            }

            /*
             * 清理查询无结果
             */
            function clearResult() {
                $scope.list = [];
                $scope.pagination.total = 0;
                $scope.pagination.page = 1;
                $scope.pagination.pages = 0;
                $scope.pagination.show = true;
                angular.element(".paginationInput input").val($scope.pagination.page);
            }

            /*
             * 对城市数据进行
             */
            var cityHandler = function (list) {
                for (var i = 0, len = list.length; i < len; i++) {
                    var item = list[i],
                        citys = [];
                    if ((citys = item.depCities.split(",")).length > 20) {
                        citys = _.take(citys, 19);
                        citys.push("...");
                        item.depCitiesShow = citys.join(",");
                    } else {
                        item.depCitiesShow = item.depCities;
                    }
                    if ((citys = item.arrCities.split(",")).length > 20) {
                        citys = _.take(citys, 19);
                        citys.push("...");
                        item.arrCitiesShow = citys.join(",");
                    } else {
                        item.arrCitiesShow = item.arrCities;
                    }
                }
            };
            //#endregion

            //#region 分页
            (function ($scope, undefined) {
                $scope.pagination = {
                    perPage: 20,//一页显示多少数据
                    page: 1,//第几页
                    maxSize: 10,//一批显示多少页
                    total: 0,//总数量,
                    pages: 0//总共多少
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
                                    target.value = lastChangePageNum = 1;
                                    validCondition.pageNum = lastChangePageNum;
                                }

                            }, function (status) {
                                if (status == -1) {
                                    alert("请求超时");
                                } else {
                                    alert("网络异常");
                                }
                                clearResult();
                                target.value = $scope.pagination.page;
                            });
                        }
                    }
                };
            })($scope);
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
            }
            //var confirm = function (msg) {
            //    var defer = $q.defer();
            //    $scope.dialogContent = msg;
            //    dialog({
            //        size: "sm",
            //        ok: function () {
            //            defer.resolve();
            //        },
            //        cancel: function () {
            //            defer.reject();
            //        }
            //    });
            //    return defer.promise;
            //}
            //#endregion
        }]);

    angular.bootstrap(document, ["ifpApp"]);
});