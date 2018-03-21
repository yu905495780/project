/**
 * 查询
 */
define([
    "config/ifgConfig",
    "service/ifg/ifgAPIService",
    "service/ifg/ifgJumpService",
    "filter/ifgToTrustFilter",
    "directive/ifg/chineseRestrict.min",
    "directive/ifg/englishDigital.min",
    "directive/ifg/digitalOnly.min",
    "directive/ifg/zeroRestrict.min",
    "directive/ifg/spaceRestrict.min",
    "directive/ifg/englishComma.min",
    "directive/ifg/englishDigitalComma.min",
    "directive/ifg/englishDigitalCommaSlash.min",
    "directive/ifg/commaReplace.min",
    "directive/ifg/englishDigitalDashSlash.min"
], function (ifgApp) {
    ifgApp.controller("ifgQueryCtrl", ["$rootScope", "$scope", "$http", "$location", "$filter", "$q", "$stateParams", "$timeout", "$uibModal", "IFGAPIService", "IFGJumpService",
        function ($rootScope, $scope, $http, $location, $filter, $q, $stateParams, $timeout, $uibModal, IFGAPIService, IFGJumpService, undefined) {

            var urlConstant = {
                "search": "iepolicy/search",
                "download": "iepolicy/downLoad",
                "delete": "iepolicy/deleteById",
                "hangUp": "iepolicy/hangUpById",
                "putIn": "iepolicy/republicById",
                "exist": "iepolicy/checkExistence",
                "batchDelete": "iepolicy/batchDelete",
                "batchHangUp": "iepolicy/batchHangUp",
                "batchPutIn": "iepolicy/batchRepublish",
                "batchUpdate": "iepolicy/batchUpdate",
                "export": "iepolicy/export"
            };

            // 初始化页面数据
            var searchCondition = {
                "id": "",
                "status": "1",
                "travelType": "-1",
                "airline": "",
                "depCities": "",
                "arrCities": "",
                "mainFilegroupcode": "",
                "cabinRestrict": "",
                "externalId": "",
                "privateFlag": "-1",
                "pageNum": 1,
                "pageSize": 20

            };

            $scope.search = angular.extend({}, searchCondition);
            $scope.list = [];
            var validCondition = angular.extend({}, $scope.search);//验证后的查询条件

            // 时间监听
            (function ($scope, undefined) {

                /**
                 * 查询点击事件
                 */
                $scope.searchClick = function () {
                    validCondition = angular.extend({}, $scope.search);
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
                    angular.extend($scope.search, searchCondition);
                };

                /**
                 * 跳转链接
                 */
                $scope.goClick = function (href) {
                    window.open(href);
                };

                $scope.download = function () {
                    window.open(IFGAPIService.ifgBaseUrl + urlConstant.download);
                };

                $scope.importDialogConfig = {
                    title: "导入",
                    show: false,
                    src: "./ifgImport.html?ctrl=ifgImport"
                };
                /**
                 * 跳转到详情
                 */
                $scope.detailClick = function (item) {
                    window.open("./ifgShow.html?ctrl=ifgShow&id=" + item.id);
                };
            })($scope);

            /**
             * 单条操作
             */
            (function ($scope, undefined) {
                /**
                 * 复制
                 */
                $scope.copyClick = function (item) {
                    var url = "./ifgAdd.html?ctrl=isCopy&id=" + item.id;
                    window.open(url);
                };

                /**
                 * 删除
                 */
                $scope.deleteClick = function (item) {
                    if (confirm("确定删除吗?")) {
                        var deleteDefer = deleteIfg(item.id);
                        deleteDefer.then(function (data) {
                            if (data && data.success) {
                                alert("删除成功").then(function () {
                                    // 操作成功后刷新页面
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
                                });
                            } else {
                                alert(_.map(data.errMsg, function (item) {
                                    return item
                                }).join("<br>")).then(function () {
                                    IFGJumpService.login(data);
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
                        suspendIfg(item.id).then(function (data) {
                            if (data && data.success) {
                                alert("挂起成功").then(function () {
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
                                });
                            } else {
                                alert(_.map(data.errMsg, function (item) {
                                        return item
                                    }).join("<br>") || "挂起失败").then(function () {
                                    IFGJumpService.login(data);
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
                        var deleteDefer = resumeIfg(item.id);
                        deleteDefer.then(function (data) {
                            if (data && data.success) {
                                alert("投放成功").then(function () {
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
                                });
                            } else {
                                alert(_.map(data.errMsg, function (item) {
                                        return item
                                    }).join("<br>") || "投放失败").then(function () {
                                    IFGJumpService.login(data);
                                });
                            }
                        }, function (data) {
                            alert("网络异常");
                        });
                    }
                };

                /**
                 * 编辑
                 */
                $scope.editClick = function (item) {
                    existIfg(item.id).then(function (data) {
                        if (data.success) {
                            window.open("./ifgAdd.html?ctrl=isEdit&id=" + item.id);
                        } else {
                            alert(_.map(data.errMsg, function (item) {
                                    return item
                                }).join("<br>") || "不可修改").then(function () {
                                IFGJumpService.login(data);
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
                function deleteIfg(id) {
                    showLoading();
                    var deferred = $q.defer();
                    $http.post(IFGAPIService.ifgBaseUrl + urlConstant.delete, {id: id}).success(function (data) {
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
                function suspendIfg(id) {
                    var deferred = $q.defer();
                    $http.post(IFGAPIService.ifgBaseUrl + urlConstant.hangUp, {id: id}).success(function (data) {
                        deferred.resolve(data);
                    }).error(function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                }

                /**
                 * 投放
                 */
                function resumeIfg(id) {
                    var deferred = $q.defer();
                    $http.post(IFGAPIService.ifgBaseUrl + urlConstant.putIn, {id: id}).success(function (data) {
                        deferred.resolve(data);
                    }).error(function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                }

                /**
                 * 检验是否存在
                 */
                function existIfg(id) {
                    var deferred = $q.defer();
                    $http.post(IFGAPIService.ifgBaseUrl + urlConstant.exist, {id: id}).success(function (data) {
                        deferred.resolve(data);
                    }).error(function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                }
            })($scope);

            /**
             * 批量操作
             */
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
                    var allChecked = true;
                    _.each($scope.list, function (item, index) {
                        if (!item.checked) {
                            allChecked = false;
                        }
                    });

                    $scope.selectAll = $scope.list.length && allChecked;
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
                                    IFGJumpService.login(data);
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
                                    IFGJumpService.login(data);
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
                                    IFGJumpService.login(data);
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
                                window.open("./ifgOpRecord.html?taskType=2");
                            }
                        } else {
                            alert(_.map(data.errMsg, function (item) {
                                    return item;
                                }).join("<br>") || "导出失败").then(function () {
                                IFGJumpService.login(data);
                            });
                        }
                    }, function (status) {
                        if (status == -1) {
                            alert("请求超时")
                        } else {
                            alert("网络异常");
                        }
                    })
                };

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
                 * 批量挂起
                 */
                function suspendSelected(ids) {
                    var param = {
                        ids: ids,
                        condition: validCondition
                    };

                    showLoading();
                    var deferred = $q.defer();
                    $http({
                        method: "post",
                        url: IFGAPIService.ifgBaseUrl + urlConstant.batchHangUp,
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
                        condition: validCondition
                    };

                    showLoading();
                    var deferred = $q.defer();
                    $http({
                        method: "post",
                        url: IFGAPIService.ifgBaseUrl + urlConstant.batchPutIn,
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
                 * 批量删除
                 */
                function deleteSelected(ids) {
                    var param = {
                        ids: ids,
                        condition: validCondition
                    };

                    showLoading();
                    var deferred = $q.defer();
                    $http({
                        method: "post",
                        url: IFGAPIService.ifgBaseUrl + urlConstant.batchDelete,
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
                 * 编辑
                 */
                $scope.editSelectClick = function () {
                    if (!confirm("确认是否按照当前查询条件进行批量修改")) {
                        return false;
                    }
                    var batchEditDialogInstance = batchEditDialog({
                        ok: function () {
                            if ($scope.stageChange.beforeState == "-1") {
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
                                editSelected($scope.stageChange.beforeState, $scope.stageChange.afterState)
                                    .then(function (data) {
                                        if (data && data.success) {
                                            batchEditDialogInstance.close();
                                            if (confirm(data.data || "正在处理中，是否跳转到批量操作记录进行查看?")) {
                                                window.open("./ifgOpRecord.html");
                                            }
                                        } else {
                                            alert(_.map(data.errMsg, function (item) {
                                                    return item;
                                                }).join("<br>") || "修改失败").then(function () {
                                                IFGJumpService.login(data);
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
                function editSelected(stateBefore, stateAfter) {
                    var param = {
                        stateBefore: stateBefore,
                        stateAfter: stateAfter,
                        condition: validCondition
                    };

                    showLoading();
                    var deferred = $q.defer();
                    $http({
                        method: "post",
                        url: IFGAPIService.ifgBaseUrl + urlConstant.batchUpdate,
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
                    beforeState: "-1",
                    afterState: "-1",
                    valid: true,
                    reason: ""
                };

                $scope.beforeStateChange = function () {
                    console.info($scope.stageChange.beforeState);
                    $scope.stageChange.afterState = "-1";
                };

                /**
                 * 批量修改
                 */
                var batchEditDialog = function (config) {
                    $scope.stageChange.beforeState = "-1";
                    $scope.stageChange.afterState = "-1";
                    $scope.stageChange.valid = true;
                    $scope.stageChange.reason = "";

                    var modalInstance = $uibModal.open({
                        templateUrl: "ifgSelectedEdit.html",
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

                /**
                 * 导出, 生成下载链接
                 */
                function exportRequest() {
                    var param = {
                        // travelType: isDouble ? "2" : "1",
                        condition: angular.extend({}, validCondition)
                    };
                    showLoading();
                    var deferred = $q.defer();
                    $http({
                        method: "post",
                        url: IFGAPIService.ifgBaseUrl + urlConstant.export,
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

            /**
             * 查询
             */
            function search(condition) {
                showLoading();
                var deferred = $q.defer();
                if (validCondition.travelType == "-1") {
                    delete validCondition.travelType;
                }
                if (validCondition.status == "-1") {
                    delete validCondition.status;
                }
                if (validCondition.privateFlag == "-1") {
                    delete validCondition.privateFlag;
                }
                $http({
                    method: "post",
                    url: IFGAPIService.ifgBaseUrl + urlConstant.search,
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
             * 处理查询结果
             */
            function searchResult(data) {
                if (data.success) {
                    $scope.selectAll = false;
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
                    alert(_.map(data.errMsg, function (item, key) { return item }).join("<br>")).then(function () {
                        IFGJumpService.login(data);
                    });
                }
            }

            /**
             * 城市数据过长时结尾展示'...' 避免单元格被撑开
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

            /**
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

            /**
             * 分页
             */
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
                    var keyCode = window.event ? $event.keyCode : $event.which;
                    if (keyCode != 13) {
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

            /**
             * 提示框
             */
            var dialog = function (config) {
                var modalInstance = $uibModal.open({
                    templateUrl: "ifgDialog.html",
                    bindToController: true,
                    controllerAs: '$ctrl',
                    size: config.size,
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

            /**
             * 警示框
             */
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
        }]);
    angular.bootstrap(document, ["ifgApp"])
});
