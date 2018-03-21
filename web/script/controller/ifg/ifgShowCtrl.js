/**
 * 新增
 */
define([
    "config/ifgConfig",
    "service/ifg/ifgAPIService",
    "service/ifg/ifgJumpService",
    "filter/ifgToTrustFilter"
], function (ifgApp) {
    ifgApp.controller("ifgShowCtrl", ["$rootScope", "$scope", "$http", "$location", "$filter", "$q", "$stateParams", "$timeout", "$uibModal", "IFGAPIService", "IFGJumpService",
        function ($rootScope, $scope, $http, $location, $filter, $q, $stateParams, $timeout, $uibModal, IFGAPIService, IFGJumpService, undefined) {
            var searchParam = $location.search(),
                ctrlPage = searchParam["ctrl"];
            var id = searchParam["id"],
                idBefore = searchParam["idBefore"],
                baseUrl = IFGAPIService.ifgBaseUrl,
                isOrigin = ctrlPage == "isOrigin";

            $scope.isOrigin = isOrigin;
            $scope.data = {};
            $scope.logData = {};
            $scope.isDouble = true;

            if (isOrigin) {
                document.title = "公布运价政策-修改后数据";
                var originDefer = getOriginData(id, idBefore);
                originDefer.then(function (data) {
                    $rootScope.showLoading = false;
                    if (data && data.success) {
                        if (data.data) {
                            $scope.isDouble = data.data.travelTypeRestrict == "0" || data.data.travelTypeRestrict == "2";
                            angular.extend($scope.data, handlerData(data.data));
                            angular.extend($scope.logData, handleLogData(data.logData));
                            $timeout(cityTextAreaHeightHandler);
                        } else {
                            alert(_.map(data.errMsg, function (item) {
                                    return item;
                                }).join("<br>") || "未查询到数据").then(function () {

                            });
                        }

                    } else {
                        alert(_.map(data.errMsg, function (item) {
                                return item
                            }).join("<br>") || "未查询到数据").then(function () {
                            IFGJumpService.login(data);
                        });
                    }
                }, function (status) {
                    $rootScope.showLoading = false;
                    if (status == -1) {
                        alert("请求超时");
                    } else {
                        alert("网络错误");
                    }
                })

            } else {
                document.title = "公布运价政策-详情";
                var dataDefer = getData(id);
                dataDefer.then(function (data) {
                    $rootScope.showLoading = false;
                    if (data && data.success) {
                        if (data.data) {
                            $scope.isDouble = data.data.travelTypeRestrict == "0" || data.data.travelTypeRestrict == "2";
                            angular.extend($scope.data, handlerData(data.data));
                            $scope.data.logs = data.operateLog;
                            $timeout(cityTextAreaHeightHandler);
                        } else {
                            alert(_.map(data.errMsg, function (item) {
                                    return item;
                                }).join("<br>") || "未查询到数据").then(function () {

                            });
                        }

                    } else {
                        alert(_.map(data.errMsg, function (item) {
                            return item
                        }).join("<br>")).then(function () {
                            IFGJumpService.login(data);
                        });
                    }
                }, function (status) {
                    $rootScope.showLoading = false;
                    if (status == -1) {
                        alert("请求超时");
                    } else {
                        alert("网络错误");
                    }
                });
            }

            /**
             * 获取详情数据
             */
            function getData(id) {
                var deferred = $q.defer();
                $http({
                    method: "post",
                    data: {id: id},
                    url: baseUrl + "iepolicy/detailById",
                    timeout: 10000
                }).success(function (data) {
                    deferred.resolve(data)
                }).error(function (data, status) {
                    deferred.reject(status); //请求失败
                });
                return deferred.promise;
            }

            /**
             * 获取操作记录的原始数据
             */
            function getOriginData(rowkey, rowKeyBefore) {

                var deferred = $q.defer();
                $http({
                    method: "post",
                    data: {
                        "rowKey": rowkey,
                        "rowKeyBefore": rowKeyBefore
                    },
                    url: baseUrl + "iepolicy/originData",
                    timeout: 10000
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (data, status) {
                    deferred.reject(status);
                });
                return deferred.promise;
            }

            /**
             * 处理数据, 方便页面渲染
             */
            function handlerData(data) {
                var result = {};
                result.combineAirline = false;
                result.child = false;
                var status = {"0": "已挂起", "1": "投放中", "2": "已删除", "3": "已失效"},
                    statusStyle = {"0": "text-primary", "1": "text-success", "2": "text-danger", "3": "text-muted"};
                result.status = status[data.status + ""];
                result.statusStyle = statusStyle[data.status + ""];
                result.id = data.id;
                result.externalId = data.externalId;//外部政策ID
                result.mainFileGroupCode = data.mainFilegroupcode;//文件编号
                result.travelType = {"0": "单程&往返", "1": "单程", "2": "往返"}[data.travelTypeRestrict];
                result.bCanRt = {"1": "是", "0": "否"}[data.canRt];//是否允许混仓
                if (data.canRt == 1) {
                    result.canGroupFileCode = data.canGroupFilecode; //可组文件编号
                }
                result.airline = data.airline;//开票航司
                result.depCities = data.depCities;//出发地
                result.arrCities = data.arrCities;//目的地
                result.depCitiesExcept = data.depCitiesForbid;
                result.arrCitiesExcept = data.arrCitiesForbid;
               // result.cabin = {"ALL":"全部"}[data.cabinRestrict];//舱位
                if(data.cabinRestrict=="ALL")
                {
                    result.cabin="全部";
                }
                else
                {
                    result.cabin=data.cabinRestrict;
                }
                result.isCombine = {"1": "是", "0": "否","2":"不限"}[data.canConnectAirline];
                if (data.canConnectAirline == 1) {
                    result.combineAirline = true;
                    result.combineAirlines = data.connectAirline;
                    result.combineAirlinesForbid = data.connectAirlineForbid;
                }
                result.isShare = {"2": "是", "1": "不限", "0": "否"}[data.canCodeSharing];
                result.isTransfer = {"1": "是", "0": "否","2":"不限"}[data.transferTypeRestrict];//是否支持中转
                if (data.transferTypeRestrict) {
                    result.transferCities = data.transferCities;//中转城市
                }
                result.segmentFlightAllow = data.flightRestrict || "无限制";//可售航班
                result.segmentFlightDeny = data.flightRestrictForbid || "无限制";//禁售航班
                result.sale = data.saleStartDate + " 至 " + data.saleEndDate;//销售日期
                result.dateRestrictGo = data.goDateRestrict.split(">").join(" 至 ");//允许旅行日期

                result.dateRestrictGoForbid = [];//禁止旅行日期
                if (data.goDateRestrictForbid.trim()) {
                    var dateRestrictGoForbids = data.goDateRestrictForbid.split(",");
                    _.each(dateRestrictGoForbids, function (item, index) {
                        result.dateRestrictGoForbid.push(item.replace(">", " 至 "));
                    });
                }

                if (data.travelTypeRestrict == "0" || data.travelTypeRestrict == "2") {
                    result.dateRestrictReturn = data.returnDateRestrict.split(">").join(" 至 ");//回程允许旅行日期

                    result.dateRestrictReturnForbid = [];//禁止旅行日期
                    if (data.returnDateRestrictForbid.trim()) {
                        var dateRestrictReturnForbids = data.returnDateRestrictForbid.split(",");
                        _.each(dateRestrictReturnForbids, function (item, index) {
                            result.dateRestrictReturnForbid.push(item.replace(">", " 至 "));
                        });
                    }
                }

                if (data.advanceSaleDate) {
                    result.advancedSaleDate = data.advanceSaleDate + "天";//提前出票天数
                }

                var passengerTypes = data.passengerTypeRestrict.split(","),
                    passengerTypeArr = [];
                var passengerEnum = {"1": "普通成人", "0": "儿童","2":"留学生"};
                _.each(passengerTypes, function (item, index) {
                    passengerTypeArr.push(passengerEnum[item]);
                });
                result.passengerType = passengerTypeArr.join(",");//适用乘客类型

                result.deputizeCost = (data.agentFee || "0.00") + "%";
                result.adultRetention = (data.saleRetention || "0.00") + "%";
                result.adultRebase = (data.saleRebase || "0") + "CNY";
                if (data.passengerTypeRestrict.indexOf("0") > -1) {
                    result.child = true;
                    result.childRetention = (data.saleRetentionChild || "0.00") + "%";
                    result.childRebase = (data.saleRebaseChild || "0") + "CNY";
                }
                result.privateFlag = (data.privateFlag || 0);
                if (data.privateFlag == 1) {
                    result.refundChangePercent = (data.refundChangePercent || "0") + "%";
                }
                result.rtCal = {"0": "取少", "1": "各取各"}[data.rtCommissionRule];
                result.ticketFee = (data.invoiceFee || "0") + "CNY";
                result.autoTicketing = {"1": "是", "0": "否"}[data.autoTicketing];
                result.canReimbursementVoucher = {"1": "发票", "0": "行程单"}[data.reimbursementVoucher];//报销凭证
                result.reserveType = {"1": "同程预订", "2": "已绑定配置预订"}[data.bookingChannel];//预订配置
                if (data.bookingChannel == 1) {
                    result.officeNo = data.officeNo;
                }
                result.remark = data.remark;//备注
                result.age=data.age;//年龄
                result.nationality=data.nationality;//国籍
                return result;
            }

            /**
             * 日志对比数据渲染
             */
            function handleLogData(data) {
                var result = {};
                var status = {"0": "已挂起", "1": "投放中", "2": "已删除", "3": "已失效"},
                    statusStyle = {"0": "text-primary", "1": "text-success", "2": "text-danger", "3": "text-muted"};
                if (dataExist(data.status)) {
                    result.status = status[data.status + ""];
                    result.statusStyle = statusStyle[data.status + ""];
                }
                if (dataExist(data.id)) {
                    result.id = data.id;
                }
                if (dataExist(data.externalId)) {
                    result.externalId = data.externalId;//外部政策ID
                }
                if (dataExist(data.mainFilegroupcode)) {
                    result.mainFileGroupCode = data.mainFilegroupcode;//文件编号
                }
                if (dataExist(data.travelTypeRestrict)) {
                    result.travelType = {"0": "单程&往返", "1": "单程", "2": "往返"}[data.travelTypeRestrict];
                }
                if (dataExist(data.canRt)) {
                    result.bCanRt = {"1": "是", "0": "否"}[data.canRt];//是否允许混仓
                }
                if (dataExist(data.canGroupFilecode)) {
                    result.canGroupFileCode = data.canGroupFilecode; //可组文件编号
                }
                if (dataExist(data.airline)) {
                    result.airline = data.airline;//开票航司
                }
                if (dataExist(data.depCities)) {
                    result.depCities = data.depCities;//出发地
                }
                if (dataExist(data.arrCities)) {
                    result.arrCities = data.arrCities;//目的地
                }
                if (dataExist(data.depCitiesForbid)) {
                    result.depCitiesExcept = data.depCitiesForbid;
                }
                if (dataExist(data.arrCitiesForbid)) {
                    result.arrCitiesExcept = data.arrCitiesForbid;
                }
                if (dataExist(data.cabinRestrict)) {
                    if(data.cabinRestrict=="ALL")//舱位
                    {
                        result.cabin="全部";
                    }
                    else
                    {
                        result.cabin=data.cabinRestrict;
                    }
                }
                if (dataExist(data.canConnectAirline)) {
                    result.isCombine = {"1": "是", "0": "否","2":"不限"}[data.canConnectAirline];
                }
                if (dataExist(data.connectAirline)) {
                    result.combineAirlines = data.connectAirline;
                }
                if (dataExist(data.connectAirlineForbid)) {
                    result.combineAirlinesForbid = data.connectAirlineForbid;
                }
                if (dataExist(data.canCodeSharing)) {
                    result.isShare = {"2": "是", "1": "不限", "0": "否"}[data.canCodeSharing];
                }
                if (dataExist(data.transferTypeRestrict)) {
                    result.isTransfer = {"1": "是", "0": "否","2":"不限"}[data.transferTypeRestrict];//是否支持中转
                }
                if (dataExist(data.transferCities)) {
                    result.transferCities = data.transferCities;//中转城市
                }
                if (dataExist(data.flightRestrict)) {
                    result.segmentFlightAllow = data.flightRestrict || "无限制";//可售航班
                }
                if (dataExist(data.flightRestrictForbid)) {
                    result.segmentFlightDeny = data.flightRestrictForbid || "无限制";//禁售航班
                }
                if (dataExist(data.saleStartDate) && dataExist(saleEndDate)) {
                    result.sale = data.saleStartDate + " 至 " + data.saleEndDate;//销售日期
                }
                if (dataExist(data.goDateRestrict)) {
                    result.dateRestrictGo = data.goDateRestrict.split(">").join(" 至 ");//允许旅行日期
                }
                // todo
                if (dataExist(data.goDateRestrictForbid)) {
                    result.dateRestrictGoForbid = [];//禁止旅行日期
                    var dateRestrictGoForbids = data.goDateRestrictForbid.trim().split(",");
                    _.each(dateRestrictGoForbids, function (item, index) {
                        result.dateRestrictGoForbid.push(item.replace(">", " 至 "));
                    });
                }
                if (dataExist(data.returnDateRestrict)) {
                    result.dateRestrictReturn = data.returnDateRestrict.split(">").join(" 至 ");//回程允许旅行日期
                }
                // todo
                if (dataExist(data.returnDateRestrictForbid)) {
                    result.dateRestrictReturnForbid = [];//禁止旅行日期
                    var dateRestrictReturnForbids = data.returnDateRestrictForbid.trim().split(",");
                    _.each(dateRestrictReturnForbids, function (item, index) {
                        result.dateRestrictReturnForbid.push(item.replace(">", " 至 "));
                    });
                }
                if (dataExist(data.advanceSaleDate)) {
                    result.advancedSaleDate = data.advanceSaleDate + "天";//提前出票天数
                }
                if (dataExist(data.passengerTypeRestrict)) {
                    var passengerTypes = data.passengerTypeRestrict.split(","),
                        passengerTypeArr = [];
                    var passengerEnum = {"1": "普通成人", "0": "儿童","2":"留学生"};
                    _.each(passengerTypes, function (item, index) {
                        passengerTypeArr.push(passengerEnum[item]);
                    });
                    result.passengerType = passengerTypeArr.join(",");//适用乘客类型
                }
                if (dataExist(data.agentFee)) {
                    result.deputizeCost = (data.agentFee || "0.00") + "%";
                }
                if (dataExist(data.saleRetention)) {
                    result.adultRetention = (data.saleRetention || "0.00") + "%";
                }
                if (dataExist(data.saleRebase)) {
                    result.adultRebase = (data.saleRebase || "0") + "CNY";
                }
                if (dataExist(data.saleRetentionChild)) {
                    result.childRetention = (data.saleRetentionChild || "0.00") + "%";
                }
                if (dataExist(data.privateFlag)) {
                    result.privateFlag = (data.privateFlag || 0);
                }
                if (dataExist(data.refundChangePercent)) {
                    result.refundChangePercent = (data.refundChangePercent || "0") + "%";
                }
                if (dataExist(data.rtCommissionRule)) {
                    result.rtCal = {"0": "取少", "1": "各取各"}[data.rtCommissionRule];
                }
                if (dataExist(data.invoiceFee)) {
                    result.ticketFee = (data.invoiceFee || "0") + "CNY";
                }
                if (dataExist(data.autoTicketing)) {
                    result.autoTicketing = {"0": "是", "1": "否"}[data.autoTicketing];
                }
                if (dataExist(data.reimbursementVoucher)) {
                    result.canReimbursementVoucher = {"1": "发票", "0": "行程单"}[data.reimbursementVoucher];//报销凭证
                }
                if (dataExist(data.bookingChannel)) {
                    result.reserveType = {"1": "同程预订", "2": "已绑定配置预订"}[data.bookingChannel];//预订配置
                }
                if (dataExist(data.officeNo)) {
                    result.officeNo = data.officeNo;
                }
                if (dataExist(data.remark)) {
                    result.remark = data.remark;//备注
                }
                if(dataExist(data.age))
                {
                    result.age=data.age;
                }
                if(dataExist(data.nationality))
                {
                    result.nationality=data.nationality;
                }
                return result;
            }

            function dataExist(data) {
                return data || data == 0;
            }

            /**
             * 日志数据
             */
            $scope.originShowClick = function (log) {
                window.open("./ifgShow.html?ctrl=isOrigin&id=" + encodeURIComponent(log.rowKey) + "&idBefore=" + encodeURIComponent(log.rowKeyBefore));
            };

            function cityTextAreaHeightHandler() {
                var bodyWidth = $(".container ", document.body).width();

                var citys = $("textarea.city").each(function (index, item) {
                    var ele = $(item);
                    ele.css({
                        "max-height": "auto",
                        "min-height": "auto"
                    });
                    ele.css("max-height", item.scrollHeight);
                    if (item.scrollHeight <= 110) {
                        ele.css("min-height", item.scrollHeight);
                    } else {
                        ele.css("min-height", 110);
                    }
                });
            }

            $(window).on("resize", function () {
                cityTextAreaHeightHandler();
            });

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

            $rootScope.showLoading = true;
        }
    ]);
    angular.bootstrap(document, ["ifgApp"]);
});