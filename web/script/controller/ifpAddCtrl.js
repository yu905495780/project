/**
 * 新增
 */
define([
    "config/ifpConfig",
    "service/ifpAPIService",
    "service/ifpJumpService",
    "filter/toTrustFilter",
    "directive/chineseRestrict.min",
    "directive/englishDigital.min",
    "directive/digitalOnly.min",
    "directive/zeroRestrict.min",
    "directive/spaceRestrict.min",
    "directive/englishComma.min",
    "directive/englishDigitalComma.min",
    "directive/englishDigitalCommaSlash.min",
    "directive/englishDigitalDashSlash.min",
    "directive/englishCommaSlash.min"
], function (app) {
    app.controller("ifpAddCtrl", ["$rootScope", "$scope", "$http", "$location", "$filter", "$q", "$stateParams", "$timeout", "$uibModal", "IFPAPIService", "IFPJumpService",
        function ($rootScope, $scope, $http, $location, $filter, $q, $stateParams, $timeout, $uibModal, IFPAPIService, IFPJumpService, undefined) {

            var searchParam = $location.search(),
                ctrlPage = searchParam["ctrl"] || "";

            var isDouble = ctrlPage == "ifpAddDouble" || ctrlPage == "ifpEditDouble" || ctrlPage == "ifpCopyDouble",//是否是往返程
                isEdit = ctrlPage.indexOf("ifpEdit") > -1;//是否是编辑

            var isCopy = ctrlPage.indexOf("Copy") > -1;//是否是复制
            var id = searchParam["id"];//编辑用id

            var baseUrl = IFPAPIService.ifpBaseUrl;//基本Url

            //#region 原始数据
            $scope.data = {
                "id": 0,
                "mainFileGroupCode": "",
                "externalId": "",
                "productType": "-1",
                "stockType": "-1",
                "airline": "",
                "addressOption": "-1",
                "depCities": "",
                "isTransfer": "0",
                "transferCities": "",
                "arrCities": "",
                "cabin": "",
                "grade": "-1",
                "segmentAirlines": "", // v1.5 航司组合
                "segmentFlightAllow": "",
                "segmentFlightDeny": "",
                "canDepStay": "-1",
                "saleStart": "",
                "saleEnd": "",
                "dateRestrictGo": "",
                "dateRestrictGoForbid": "",
                "timeLimitType": "0",
                // "limitTime":"48",
                "advancedSaleDate": "",
                "weekRestrictGo": "",
                "minPeopleNum": "",
                "maxPeopleNum": "",
                "passengerType": "",
                "filePrice": "",
                "filePriceChild": "",
                "currency": "-1",
                "saleRetention": "",
                "saleRebase": "",
                "reserveType": "-1",//预订配置 1:同程 2:已绑定配置预订
                "officeNo": "",//office 号
                "canReimbursementVoucher": "-1",
                "canChange": "-1",
                "changeFeeDep": "",
                "canRefund": "-1",
                "refundFeeAllUnused": "",
                "noShowRestrict": "-1",
                "noShowFee": "",
                "noShowRemark": "",
                "buyTicketNotice": "",
                "luggageType": "-1",
                "luggageWeightsBags": "",
                "singleLuggageWeight":"",
                "canInvalid": "-1",
                "invalidFee": "",
                "remark": "",
                "status": "-1",
                "travelType": isDouble ? 2 : 1
            };
            if (isDouble) {
                $scope.data.cabin = "";
                $scope.data.bCanRt = "-1";// 是否允许混仓 1-允许、0-不允许
                $scope.data.canGroupFileCode = "";// 可组文件编号
                $scope.data.canRetStay = "-1";// 是否允许回程停留 0：不允许，1：允许
                $scope.data.minStay = "";// 最短停留天数
                $scope.data.maxStay = "";// 最长停留天数
                $scope.data.weekRestrictReturn = "";// 回程星期限制
                $scope.data.canChangeRet = "-1";
                $scope.data.changeFeeRet = "";// 回程改期费
                $scope.data.canRefundPartUnused = "-1";// 部分未使用可否退票 0:不允许，1:允许
                $scope.data.refundFeePartUnused = "";// 部分未使用退票费用
                $scope.data.dateRestrictReturn = "";// 回程旅行日期
                $scope.data.dateRestrictReturnForbid = "";//回程禁止旅行日期

            }
            $scope.isDouble = isDouble;
            //#endregion

            //#region 验证
            $scope.validate = {
                "mainFileGroupCode": {"valid": true, "reason": "", defMsg: "请输入文件编号"},
                "externalId": {"valid": true, "reason": ""},
                "productType": {"valid": true, "reason": "", defMsg: "请选择产品类型"},
                "stockType": {"valid": true, "reason": "", defMsg: "请选择库存模式"},
                "airline": {"valid": true, "reason": "", defMsg: "请输入开票航司"},
                "addressOption": {"valid": true, "reason": "", defMsg: "请选择录入方式"},
                "depCities": {"valid": true, "reason": "", defMsg: "请输入出发地"},
                "isTransfer": {"valid": true, "reason": "", defMsg: "请选择是否中转"},//是否中转
                "transferCities": {"valid": true, "reason": "", defMsg: "请输入中转点"},//依赖于是否中转
                "arrCities": {"valid": true, "reason": "", defMsg: "请输入目的地"},
                "cabin": {"valid": true, "reason": "", defMsg: "请输入适用舱位"},
                "grade": {"valid": true, "reason": "请选择舱位等级"},
                "segmentAirlines": {"valid": true, "reason": ""},// v1.5 新增航司组合字段
                "segmentFlightAllow": {"valid": true, "reason": ""},
                "segmentFlightDeny": {"valid": true, "reason": ""},
                "canDepStay": {"valid": true, "reason": "", defMsg: "请选择"},
                "sale": {"valid": true, "reason": ""},//销售日期开始,销售日期结束, 特殊处理
                "dateRestrictGo": {"valid": true, "reason": ""},//旅行日期, 特殊处理
                "dateRestrictGoForbid": {"valid": true, "reason": ""},//排序旅行日期, 特殊处理
                "timeLimitType": {"valid": true, "reason": ""},
                // "limitTime": { "valid": true, "reason": "" },
                "advancedSaleDate": {"valid": true, "reason": ""},
                "weekRestrictGo": {"valid": true, "reason": "", defMsg: "请输入适用班期"},
                "minPeopleNum": {"valid": true, "reason": ""},
                "maxPeopleNum": {"valid": true, "reason": ""},
                "passengerType": {"valid": true, "reason": "", defMsg: "请选择适用旅客"},//适用旅客, 特殊处理, 输入范畴
                "filePrice": {"valid": true, "reason": "", defMsg: "请输入成人销售票面"},
                "filePriceChild": {"valid": true, "reason": "", defMsg: "请输入儿童销售票面"},
                "currency": {"valid": true, "reason": "", defMsg: "请选择结算币种"},
                "saleRetention": {"valid": true, "reason": "", defMsg: "请输入返点值"},
                "saleRebase": {"valid": true, "reason": ""},
                "reserveType": {"valid": true, "reason": "", defMsg: "请选择预订配置"},
                "officeNo": {"valid": true, "reason": "", defMsg: "请填写office号"},
                "officeNo1": {"valid": true, "reason": "", defMsg: "请填写officeNo"},//特殊处理
                "officeNo2": {"valid": true, "reason": "", defMsg: "请填写officeNo"},//特殊处理
                "canReimbursementVoucher": {"valid": true, "reason": "", defMsg: "请选择"},
                "canChange": {"valid": true, "reason": "", defMsg: "请选择"},//特殊处理
                "canChangeValueDep": {"valid": true, "reason": "", defMsg: "请选择"},//去程是否可以改期
                "changeFeeDep": {"valid": true, "reason": "", defMsg: "请输入改期费"},
                "canRefund": {"valid": true, "reason": "", defMsg: "请选择"},
                "refundFeeAllUnused": {"valid": true, "reason": "", defMsg: "请输入全部未使用退票费"},
                "noShowRestrict": {"valid": true, "reason": "", defMsg: "请选择"},
                "noShowFee": {"valid": true, "reason": "", defMsg: "请输入NoShow费"},
                "noShowRemark": {"valid": true, "reason": ""},
                "buyTicketNotice": {"valid": true, "reason": ""},
                "luggageType": {"valid": true, "reason": "", defMsg: "请选择行李规格"},
                "luggageWeightsBags": {"valid": true, "reason": "", defMsg: "请输入行李额"},
                "canInvalid": {"valid": true, "reason": "", defMsg: "请选择"},
                "invalidFee": {"valid": true, "reason": "", defMsg: "请输入废票费"},
                "remark": {"valid": true, "reason": ""},
                "status": {"valid": true, "reason": "", defMsg: "请选择"},
                "travelType": {"valid": true, "reason": ""},
                "singleLuggageWeight":{"valid": true, "reason": "",defMsg:"请输入单件限重"},
                "copyEquals": {"valid": true, "reason": "", defMsg: "相同内容的政策不能重复保存"}

            };
            if (isDouble) {
                $scope.validate.bCanRt = {"valid": true, "reason": "", defMsg: "请选择"};//允许1/2RT组合
                $scope.validate.canGroupFileCode = {"valid": true, "reason": "", defMsg: "请输入可组合文件号"};//依赖于允许1/2RT组合
                $scope.validate.canRetStay = {"valid": true, "reason": "", defMsg: "请选择"};
                $scope.validate.minStay = {"valid": true, "reason": "", defMsg: "请输入最短停留天数"};
                $scope.validate.maxStay = {"valid": true, "reason": "", defMsg: "请输入最长停留天数"};
                $scope.validate.canChangeRet = {"valid": true, "reason": "", defMsg: "请选择"};//返程是否可以改期
                $scope.validate.changeFeeRet = {"valid": true, "reason": "", defMsg: "请输入回程改期费"};
                $scope.validate.changeFeeDep = {"valid": true, "reason": "", defMsg: "请输入去程改期费"};
                $scope.validate.weekRestrictGo = {"valid": true, "reason": "", defMsg: "请输入去程适用班期"},
                    $scope.validate.weekRestrictReturn = {"valid": true, "reason": "", defMsg: "请输入回程适用班期"};
                $scope.validate.dateRestrictReturn = {"valid": true, "reason": ""};//回程旅行日期, 特殊处理
                $scope.validate.dateRestrictReturnForbid = {"valid": true, "reason": ""};//回程排除旅行日期, 特殊处理

                $scope.validate.canChangeValueRet = {"valid": true, "reason": "", defMsg: "请选择"},

                    $scope.validate.canRefundPartUnused = {"valid": true, "reason": "", defMsg: "请选择"};
                $scope.validate.refundFeePartUnused = {"valid": true, "reason": "", defMsg: "请输入部分使用退票费"};


            }
            //#endregion

            //#region officeNo
            var officeNosHandler = undefined;
            (function ($scope, undefined) {

                $scope.officeNos = [];
                officeNosHandler = function () {
                    var officeNos = [];
                    officeNos = ($scope.data.officeNo || "").split(",");

                    if (officeNos.length <= 1) {
                        officeNos.push("");
                    }
                    $scope.officeNos = angular.extend($scope.officeNos, officeNos);
                }

                $scope.$watchCollection("officeNos", function () {
                    var officeNoArr = [];
                    if (($scope.officeNos[0] || "").trim()) {
                        officeNoArr.push(($scope.officeNos[0] || "").trim());
                    }

                    if (($scope.officeNos[1] || "").trim()) {
                        officeNoArr.push(($scope.officeNos[1] || "").trim());
                    }

                    $scope.data.officeNo = officeNoArr.join(",");

                });
            })($scope);

            //#endregion

            //#region 销售日期, 旅行日期, 排除旅行日期
            var saleHandler = undefined,
                dateRestrictGoHandler = undefined,
                dateRestrictGoForbidHandler = undefined,
                dateRestrictReturnHandler = undefined,
                dateRestrictReturnForbidHandler = undefined;
            (function ($scope, undefined) {

                //#region 销售日期
                //初始值
                var saleStartStr = $scope.data.saleStart || "",
                    saleEndStr = $scope.data.saleEnd || "";
                $scope.saleValue = {
                    start: saleStartStr ? new Date(saleStartStr.replace(/-/ig, '\/')) : null,
                    end: saleEndStr ? new Date(saleEndStr.replace(/-/ig, '\/')) : null
                };

                $scope.saleOption = {
                    start: {},

                    end: {
                        minDate: $scope.saleValue.start
                    },
                };
                /**
                 * 销售日期编辑数据处理
                 */
                saleHandler = function () {
                    saleStartStr = $scope.data.saleStart || "",
                        saleEndStr = $scope.data.saleEnd || "";
                    $scope.saleValue = {
                        start: saleStartStr ? new Date(saleStartStr.replace(/-/ig, '\/')) : null,
                        end: saleEndStr ? new Date(saleEndStr.replace(/-/ig, '\/')) : null
                    };
                    $scope.saleOption.end.minDate = $scope.saleValue.start;
                };

                //销售日期开始点击
                $scope.saleStartOpenClick = function () {
                    $scope.saleStartCalOpen = true;
                };

                $scope.saleStartChange = function () {
                    $scope.saleOption.end.minDate = $scope.saleValue.start;
                    if ($scope.saleValue.start > ($scope.saleValue.end || null)) {
                        $scope.saleValue.end = $scope.saleValue.start;
                    }
                };

                //销售日期结束点击
                $scope.saleEndOpenClick = function () {
                    $scope.saleEndCalOpen = true;
                };
                $scope.$watchCollection("saleValue", function () {
                    $scope.data.saleStart = $filter("date")($scope.saleValue.start, "yyyy-MM-dd") || "";
                    $scope.data.saleEnd = $filter("date")($scope.saleValue.end, "yyyy-MM-dd") || "";
                });
                //#endregion

                //#region 旅行日期
                //初始值
                var dateRestrictGoArr = $scope.data.dateRestrictGo.split('>');

                var dateRestrictGoStartStr = dateRestrictGoArr[0] || "",
                    dateRestrictGoEndStr = dateRestrictGoArr[1] || "";
                $scope.dateRestrictGoValue = {
                    start: dateRestrictGoStartStr ? new Date(dateRestrictGoStartStr.replace(/-/ig, '\/')) : null,
                    end: dateRestrictGoEndStr ? new Date(dateRestrictGoEndStr.replace(/-/ig, '\/')) : null
                };

                $scope.dateRestrictGoOption = {
                    start: {},

                    end: {
                        minDate: $scope.dateRestrictGoValue.start
                    }
                };

                /**
                 * 旅行日期编辑数据处理
                 */
                dateRestrictGoHandler = function () {
                    dateRestrictGoArr = $scope.data.dateRestrictGo.split('>');
                    dateRestrictGoStartStr = dateRestrictGoArr[0] || "",
                        dateRestrictGoEndStr = dateRestrictGoArr[1] || "";
                    $scope.dateRestrictGoValue = {
                        start: dateRestrictGoStartStr ? new Date(dateRestrictGoStartStr.replace(/-/ig, '\/')) : null,
                        end: dateRestrictGoEndStr ? new Date(dateRestrictGoEndStr.replace(/-/ig, '\/')) : null
                    };
                    $scope.dateRestrictGoOption.end.minDate = $scope.dateRestrictGoValue.start;
                };

                //旅行日期开始点击
                $scope.dateRestrictGoStartOpenClick = function () {
                    $scope.dateRestrictGoStartCalOpen = true;
                };

                $scope.dateRestrictGoStartChange = function () {
                    $scope.dateRestrictGoOption.end.minDate = $scope.dateRestrictGoValue.start;
                    if ($scope.dateRestrictGoValue.start > ($scope.dateRestrictGoValue.end || null)) {
                        $scope.dateRestrictGoValue.end = $scope.dateRestrictGoValue.start;
                    }
                };

                //旅行日期结束点击
                $scope.dateRestrictGoEndOpenClick = function () {
                    $scope.dateRestrictGoEndCalOpen = true;
                };
                $scope.$watchCollection("dateRestrictGoValue", function () {
                    $scope.data.dateRestrictGo = [
                        $filter("date")($scope.dateRestrictGoValue.start, "yyyy-MM-dd") || "",
                        $filter("date")($scope.dateRestrictGoValue.end, "yyyy-MM-dd") || ""].join(">");
                });


                //#endregion

                //#region 回程旅行日期
                if (isDouble) {
                    //初始值
                    var dateRestrictReturnArr = $scope.data.dateRestrictReturn.split('>');

                    var dateRestrictReturnStartStr = dateRestrictReturnArr[0] || "",
                        dateRestrictReturnEndStr = dateRestrictReturnArr[1] || "";
                    $scope.dateRestrictReturnValue = {
                        start: dateRestrictReturnStartStr ? new Date(dateRestrictReturnStartStr.replace(/-/ig, '\/')) : null,
                        end: dateRestrictReturnEndStr ? new Date(dateRestrictReturnEndStr.replace(/-/ig, '\/')) : null
                    };

                    $scope.dateRestrictReturnOption = {
                        start: {},

                        end: {
                            minDate: $scope.dateRestrictReturnValue.start
                        }
                    };

                    /**
                     * 回程旅行日期编辑数据处理
                     */
                    dateRestrictReturnHandler = function () {
                        dateRestrictReturnArr = $scope.data.dateRestrictReturn.split('>');
                        dateRestrictReturnStartStr = dateRestrictReturnArr[0] || "",
                            dateRestrictReturnEndStr = dateRestrictReturnArr[1] || "";
                        $scope.dateRestrictReturnValue = {
                            start: dateRestrictReturnStartStr ? new Date(dateRestrictReturnStartStr.replace(/-/ig, '\/')) : null,
                            end: dateRestrictReturnEndStr ? new Date(dateRestrictReturnEndStr.replace(/-/ig, '\/')) : null
                        };
                        $scope.dateRestrictReturnOption.end.minDate = $scope.dateRestrictReturnValue.start;
                    };

                    //回程旅行日期开始点击
                    $scope.dateRestrictReturnStartOpenClick = function () {
                        $scope.dateRestrictReturnStartCalOpen = true;
                    };

                    $scope.dateRestrictReturnStartChange = function () {
                        $scope.dateRestrictReturnOption.end.minDate = $scope.dateRestrictReturnValue.start;
                        if ($scope.dateRestrictReturnValue.start > ($scope.dateRestrictReturnValue.end || null)) {
                            $scope.dateRestrictReturnValue.end = $scope.dateRestrictReturnValue.start;
                        }
                    };

                    //回程旅行日期结束点击
                    $scope.dateRestrictReturnEndOpenClick = function () {
                        $scope.dateRestrictReturnEndCalOpen = true;
                    };
                    $scope.$watchCollection("dateRestrictReturnValue", function () {
                        $scope.data.dateRestrictReturn = [
                            $filter("date")($scope.dateRestrictReturnValue.start, "yyyy-MM-dd") || "",
                            $filter("date")($scope.dateRestrictReturnValue.end, "yyyy-MM-dd") || ""].join(">");
                    });
                }


                //#endregion

                //#region 禁止旅行日期
                //初始值
                var restrictGoForbids = $scope.data.dateRestrictGoForbid.split(",");
                $scope.restrictGoForbidValue = [];

                dateRestrictGoForbidHandler = function () {
                    if ($scope.data.dateRestrictGoForbid) {
                        restrictGoForbids = $scope.data.dateRestrictGoForbid.split(",");
                        _.each(restrictGoForbids, function (item, index) {
                            var arr = item.split(">");
                            $scope.restrictGoForbidValue.push({
                                start: arr[0] ? new Date(arr[0].replace(/-/ig, '\/')) : undefined,
                                startOpen: false,
                                end: arr[1] ? new Date(arr[1].replace(/-/ig, '\/')) : undefined,
                                endOpen: false,
                                endMinDate: arr[0] ? new Date(arr[0].replace(/-/ig, '\/')) : undefined
                            })
                        });
                    }
                    if ($scope.restrictGoForbidValue.length <= 0) {
                        $scope.restrictGoForbidValue.push({
                            start: null,
                            end: null,
                        });
                    }
                };
                if (!isEdit && !isCopy) {
                    dateRestrictGoForbidHandler()
                }
                //旅行禁止开始点击
                $scope.dateRestrictGoForbidStartOpenClick = function (item) {
                    item.startOpen = true;
                };

                $scope.dateRestrictGoForbidStartChange = function (item) {
                    item.endMinDate = item.start;
                    if (item.start > (item.end || null)) {
                        item.end = item.start;
                    }
                    $scope.dateRestrictGoForbidEndChange();
                };
                $scope.dateRestrictGoForbidEndChange = function (item) {
                    var restrictGoForbidValue = $scope.restrictGoForbidValue,
                        restrictGoForbids = [];
                    angular.forEach(restrictGoForbidValue, function (value, key) {
                        restrictGoForbids.push(
                            [$filter("date")(value.start, "yyyy-MM-dd") || "", $filter("date")(value.end, "yyyy-MM-dd") || ""].join(">")
                        );
                    });
                    if (restrictGoForbids.length <= 1) {
                        if (restrictGoForbids[0] == ">") {
                            $scope.data.dateRestrictGoForbid = "";
                        } else {
                            $scope.data.dateRestrictGoForbid = restrictGoForbids.join(",");
                        }
                    } else {
                        $scope.data.dateRestrictGoForbid = restrictGoForbids.join(",");
                    }
                };
                $scope.$watchCollection("restrictGoForbidValue", function () {
                    $scope.dateRestrictGoForbidEndChange();
                });
                //旅行禁止结束点击
                $scope.dateRestrictGoForbidStartEndClick = function (item) {
                    item.endOpen = true;
                };


                //新增禁止旅行日期点击
                $scope.restrictGoForbidAddClick = function ($index) {
                    $scope.restrictGoForbidValue.splice($index + 1, 0, {
                        start: null, startOpen: false, end: null, endOpen: false
                    });
                };

                //删除禁止旅行日期点击
                $scope.restrictGoForbidPlusClick = function ($index) {
                    $scope.restrictGoForbidValue.splice($index, 1);
                };
                //#endregion

                if (isDouble) {
                    //#region 回程禁止旅行日期
                    //初始值
                    var restrictReturnForbids = $scope.data.dateRestrictReturnForbid.split(",");
                    $scope.restrictReturnForbidValue = [];

                    dateRestrictReturnForbidHandler = function () {
                        if ($scope.data.dateRestrictReturnForbid) {
                            restrictReturnForbids = $scope.data.dateRestrictReturnForbid.split(",");
                            _.each(restrictReturnForbids, function (item, index) {
                                var arr = item.split(">");
                                $scope.restrictReturnForbidValue.push({
                                    start: arr[0] ? new Date(arr[0].replace(/-/ig, '\/')) : undefined,
                                    startOpen: false,
                                    end: arr[1] ? new Date(arr[1].replace(/-/ig, '\/')) : undefined,
                                    endOpen: false,
                                    endMinDate: arr[0] ? new Date(arr[0].replace(/-/ig, '\/')) : undefined
                                })
                            });
                        }
                        if ($scope.restrictReturnForbidValue.length <= 0) {
                            $scope.restrictReturnForbidValue.push({
                                start: null,
                                end: null,
                            });
                        }
                    };
                    if (!isEdit && !isCopy) {
                        dateRestrictReturnForbidHandler()
                    }
                    //回程旅行禁止开始点击
                    $scope.dateRestrictReturnForbidStartOpenClick = function (item) {
                        item.startOpen = true;
                    };

                    $scope.dateRestrictReturnForbidStartChange = function (item) {
                        item.endMinDate = item.start;
                        if (item.start > (item.end || null)) {
                            item.end = item.start;
                        }
                        $scope.dateRestrictReturnForbidEndChange();
                    };
                    $scope.dateRestrictReturnForbidEndChange = function (item) {
                        var restrictReturnForbidValue = $scope.restrictReturnForbidValue,
                            restrictReturnForbids = [];
                        angular.forEach(restrictReturnForbidValue, function (value, key) {
                            restrictReturnForbids.push(
                                [$filter("date")(value.start, "yyyy-MM-dd") || "", $filter("date")(value.end, "yyyy-MM-dd") || ""].join(">")
                            );
                        });
                        if (restrictReturnForbids.length <= 1) {
                            if (restrictReturnForbids[0] == ">") {
                                $scope.data.dateRestrictReturnForbid = "";
                            } else {
                                $scope.data.dateRestrictReturnForbid = restrictReturnForbids.join(",");
                            }
                        } else {
                            $scope.data.dateRestrictReturnForbid = restrictReturnForbids.join(",");
                        }
                    };
                    $scope.$watchCollection("restrictReturnForbidValue", function () {
                        $scope.dateRestrictReturnForbidEndChange();
                    });
                    //回程旅行禁止结束点击
                    $scope.dateRestrictReturnForbidStartEndClick = function (item) {
                        item.endOpen = true;
                    };


                    //新增回程禁止旅行日期点击
                    $scope.restrictReturnForbidAddClick = function ($index) {
                        $scope.restrictReturnForbidValue.splice($index + 1, 0, {
                            start: null, startOpen: false, end: null, endOpen: false
                        });
                    };

                    //删除回程禁止旅行日期点击
                    $scope.restrictReturnForbidPlusClick = function ($index) {
                        $scope.restrictReturnForbidValue.splice($index, 1);
                    };
                    //#endregion
                }
            })($scope);
            //#endregion

            //#region 废弃 适用班期
            false && (function ($scope, undefined) {
                $scope.weekRestrictGoObj = {
                    "Mon": false,
                    "Tue": false,
                    "Wed": false,
                    "Thu": false,
                    "Fri": false,
                    "Sat": false,
                    "Sun": false
                };

                var weekToNumEnum = {Mon: "1", Tue: "2", Wed: "3", Thu: "4", Fri: "5", Sat: "6", Sun: "7"},

                    numToWeekEnum = {
                        "1": "Mon", "2": "Tue", "3": "Wed", "4": "Thu", "5": "Fri", "6": "Sat", "7": "Sun"
                    };

                var weekRestrictGoArr = $scope.data.weekRestrictGo.split("/");

                _.each(weekRestrictGoArr, function (item, index) {
                    $scope.weekRestrictGoObj[numToWeekEnum[item]] = true;
                });

                $scope.$watchCollection("weekRestrictGoObj", function () {

                    var weekRestrictGoArr = [];
                    angular.forEach($scope.weekRestrictGoObj, function (value, key) {
                        if (value) {
                            weekRestrictGoArr.push(weekToNumEnum[key]);
                        }

                    });

                    $scope.data.weekRestrictGo = weekRestrictGoArr.join("/");

                });
            })($scope);
            //#endregion

            //#region 适用旅客
            var passengerTypeHandler = undefined;
            (function ($scope, undefined) {
                $scope.passengerTypeObj = {
                    "adult": true,
                    "child": false,
                    "student": false
                };

                var passengerTypeToNumEnum = {adult: 1, child: 0, student: 2},
                    numToPassengerTypeEnum = {
                        "1": "adult", "0": "child", "2": "student"
                    };

                passengerTypeHandler = function () {
                    var passengerTypeArr = $scope.data.passengerType.split(",");

                    _.each(passengerTypeArr, function (item, index) {
                        $scope.passengerTypeObj[numToPassengerTypeEnum[item]] = true;
                    });
                };

                $scope.$watchCollection("passengerTypeObj", function () {
                    var passengerTypeArr = [];
                    angular.forEach($scope.passengerTypeObj, function (value, key) {
                        if (value) {
                            passengerTypeArr.push(passengerTypeToNumEnum[key]);

                        }
                    });
                    $scope.data.passengerType = passengerTypeArr.join(",");
                });
            })($scope);
            //#endregion

            //#region 是否允许改期
            false && (function ($scope, undefined) {
                var canChange = $scope.data.canChange,
                    canChangeArr = canChange.split("/");
                $scope.canChangeValueDep = canChangeArr[0] || "-1";

                if (isDouble) {
                    $scope.canChangeValueRet = canChangeArr[1] || "-1";
                    $scope.$watch("canChangeValueDep", function () {
                        $scope.data.canChange = [$scope.canChangeValueDep, $scope.canChangeValueRet].join("/");
                    });

                    $scope.$watch("canChangeValueRet", function () {
                        $scope.data.canChange = [$scope.canChangeValueDep, $scope.canChangeValueRet].join("/");
                    });

                } else {
                    $scope.$watch("canChangeValueDep", function () {
                        $scope.data.canChange = $scope.canChangeValueDep;
                    });
                }

            })($scope);
            //#endregion

            //#region 出票时长类型
            false && (function ($scope, undefined) {
                $scope.$watch("data.timeLimitType", function () {
                    if ($scope.data.timeLimitType == 1) {
                        $scope.data.limitTime = 3;
                    } else {
                        $scope.data.limitTime = 48;
                    }
                });
            })($scope);
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
                    beforeClear(param);
                    uppercase(param);
                    clearFirstZero(param);
                    showLoading();
                    var url = "";
                    if (isEdit) {
                        url = isDouble ? "policy/updateRt" : "policy/updateOw"
                    }else if(isCopy){
                        url = isDouble ? "policy/copyRt" : "policy/copyOw"
                    } else {
                        url = isDouble ? "policy/insertRt" : "policy/insertOw"
                    }


                    $http.post(baseUrl + url, param).success(function (data) {
                        if (data.success) {
                            alert("保存成功").then(function () {
                                window.close();
                            });
                        }
                        else {
                            alert(_.filter(data.errMsg, function (item, key) {
                                    if (key == 'overdue' || key == 'ratelimit') {
                                        return item;
                                    }
                                }).join("<br>") || "保存失败").then(function () {
                                errorScroll();
                                IFPJumpService.login(data);
                            });
                            saveFalseHandler(data.errMsg);
                            window.scrollTo(0, 0);
                        }
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
                var inputRequires = ["mainFileGroupCode", "airline", "depCities", "arrCities", "cabin",
                        "weekRestrictGo", "saleRetention", "passengerType", "luggageWeightsBags"],//input必填

                    selectRequires = ["productType", "stockType", "addressOption", "isTransfer", "timeLimitType",
                        "canDepStay", "currency", "reserveType", "canReimbursementVoucher", "canChange",
                        "canRefund", "noShowRestrict", "luggageType", "canInvalid", "status"];//select必选

                if (isDouble) {
                    inputRequires.push("minStay", "maxStay", "weekRestrictReturn");
                    selectRequires.push("bCanRt", "canRetStay", "canChangeRet", "canRefundPartUnused");
                }


                for (var len = inputRequires.length; len--;) {
                    var requireItem = inputRequires[len];
                    if (((data[requireItem] || "") + "").trim() == "") {//如果未输入
                        validate[requireItem].valid = false;
                        validate[requireItem].reason = validate[requireItem].defMsg;
                        valid = false;
                    }
                }
                for (var len = selectRequires.length; len--;) {
                    var requireItem = selectRequires[len];
                    if (data[requireItem] == null || (data[requireItem] || "") + "" == "-1") {//如果未选择
                        validate[requireItem].valid = false;
                        validate[requireItem].reason = validate[requireItem].defMsg;
                        valid = false;
                    }
                }
                //#endregion

                //#region 票面
                //"filePrice", "filePriceChild",
                if ($scope.passengerTypeObj.adult) {
                    if (((data["filePrice"] || "") + "").trim() == "") {
                        validate["filePrice"].valid = false;
                        validate["filePrice"].reason = validate["filePrice"].defMsg;
                        valid = false;
                    }
                } else {
                    validate["passengerType"].valid = false;
                    validate["passengerType"].reason = "成人是必选项";
                    valid = false;
                }
                if ($scope.passengerTypeObj.child) {
                    if (((data["filePriceChild"] || "") + "").trim() == "") {
                        validate["filePriceChild"].valid = false;
                        validate["filePriceChild"].reason = validate["filePriceChild"].defMsg;
                        valid = false;
                    }
                }
                //#endregion

                //#region 预订配置
                if (data.reserveType == 1) {
                    //var officeNos = $scope.officeNos;
                    //if ((officeNos[0] || "").trim() == "" && (officeNos[1] || "").trim() == "") {
                    //    validate["officeNo1"].valid = false;
                    //    validate["officeNo1"].reason = validate["officeNo1"].defMsg;
                    //    valid = false;
                    //}

                    if ((data.officeNo || "").trim() == "") {
                        validate["officeNo"].valid = false;
                        validate["officeNo"].reason = validate["officeNo"].defMsg;
                        valid = false;
                    }
                }
                //#endregion


                //#region 允许1/2RT组合
                if (isDouble) {
                    if (data["bCanRt"] == "1" && ((data["canGroupFileCode"] || "") + "").trim() == "") {
                        validate["canGroupFileCode"].valid = false;
                        validate["canGroupFileCode"].reason = validate["canGroupFileCode"].defMsg;
                        valid = false;
                    }
                }
                //#endregion

                //#region 中转
                if (data["isTransfer"] == "1" && ((data["transferCities"] || "") + "").trim() == "") {
                    validate["transferCities"].valid = false;
                    validate["transferCities"].reason = validate["transferCities"].defMsg;
                    valid = false;
                }
                //#endregion

                //#region 销售日期
                if ((data.saleStart || "").trim() == "" || (data.saleEnd || "").trim() == "") {
                    validate["sale"].valid = false;
                    validate["sale"].reason = "请完善销售日期";
                    valid = false;
                }
                //#endregion

                //#region 旅行日期
                var dateRestrictGoValue = $scope.dateRestrictGoValue;
                if (dateRestrictGoValue.start == null || dateRestrictGoValue.end == null) {
                    validate["dateRestrictGo"].valid = false;
                    var msg = '';
                    if (isDouble) {
                        msg = '去程';
                    }
                    validate["dateRestrictGo"].reason = "请完善" + msg + "旅行日期";
                    valid = false;
                }
                //#endregion

                //#region 回程旅行日期
                if (isDouble) {
                    var dateRestrictReturnValue = $scope.dateRestrictReturnValue;
                    if (dateRestrictReturnValue.start == null || dateRestrictReturnValue.end == null) {
                        validate["dateRestrictReturn"].valid = false;
                        validate["dateRestrictReturn"].reason = "请完善回程旅行日期";
                        valid = false;
                    }
                }
                //#endregion

                //#region 排除日期
                var restrictGoForbidValue = $scope.restrictGoForbidValue;
                if (restrictGoForbidValue.length <= 1) {
                    if ((restrictGoForbidValue[0].start != null && restrictGoForbidValue[0].end == null) ||
                        (restrictGoForbidValue[0].start == null && restrictGoForbidValue[0].end != null)
                    ) {
                        validate["dateRestrictGoForbid"].valid = false;
                        validate["dateRestrictGoForbid"].reason = "请完善排除日期";
                        valid = false;
                    }
                } else {
                    _.each(restrictGoForbidValue, function (value) {
                        if (value.start == null || value.end == null) {
                            validate["dateRestrictGoForbid"].valid = false;
                            validate["dateRestrictGoForbid"].reason = "请完善排除日期";
                            valid = false;
                            return false;
                        }
                    });
                }

                if (false && valie && restrictGoForbidValue.length >= 2) {
                    var validDateRegion = [{
                            start: restrictGoForbidValue[0].start,
                            end: restrictGoForbidValue[0].start
                        }],
                        toValidDates = _.takeRight(restrictGoForbidValue, restrictGoForbidValue.length - 1);

                    for (var toValidDatesI = 0,
                             toValidDateslen = toValidDates.length; toValidDatesI < toValidDateslen; toValidDatesI++) {
                        if (valid == false) {
                            break;
                        }
                        var toValidDate = toValidDates[toValidDatesI];
                        for (var validRegionJ = 0,
                                 validRegionLen = validDateRegion.length; validRegionJ < validRegionLen; validRegionJ++) {
                            var validDate = validDateRegion[validRegionJ];
                            if ((toValidDate.start > validDate.start && toValidDate.start < validDate.end) ||
                                (toValidDate.end > validDate.start && toValidDate.end < validDate.end)) {
                                valid = false;
                                validate["dateRestrictGoForbid"].valid = false;
                                validate["dateRestrictGoForbid"].reason = "排除日期存在交集, 请重新选择";
                                break;
                            }
                        }
                    }
                }
                //#endregion

                //#region 回程排除日期
                if (isDouble) {
                    var restrictReturnForbidValue = $scope.restrictReturnForbidValue;
                    if (restrictReturnForbidValue.length <= 1) {
                        if ((restrictReturnForbidValue[0].start != null && restrictReturnForbidValue[0].end == null) ||
                            (restrictReturnForbidValue[0].start == null && restrictReturnForbidValue[0].end != null)
                        ) {
                            validate["dateRestrictReturnForbid"].valid = false;
                            validate["dateRestrictReturnForbid"].reason = "请完善回程排除日期";
                            valid = false;
                        }
                    } else {
                        _.each(restrictReturnForbidValue, function (value) {
                            if (value.start == null || value.end == null) {
                                validate["dateRestrictReturnForbid"].valid = false;
                                validate["dateRestrictReturnForbid"].reason = "请完善回程排除日期";
                                valid = false;
                                return false;
                            }
                        });
                    }
                }
                //#endregion

                //#region 退票
                if (data.canRefund == "1") {
                    if (((data["refundFeeAllUnused"] || "") + "").trim() == "") {
                        validate["refundFeeAllUnused"].valid = false;
                        validate["refundFeeAllUnused"].reason = validate["refundFeeAllUnused"].defMsg;
                        valid = false;
                    }
                }

                if (data.canRefundPartUnused == "1") {
                    if (((data["refundFeePartUnused"] || "") + "").trim() == "") {
                        validate["refundFeePartUnused"].valid = false;
                        validate["refundFeePartUnused"].reason = validate["refundFeePartUnused"].defMsg;
                        valid = false;
                    }
                }
                //#endregion

                //#region 改期
                if (data.canChange == "1") {
                    if (((data["changeFeeDep"] || "") + "").trim() == "") {
                        validate["changeFeeDep"].valid = false;
                        validate["changeFeeDep"].reason = validate["changeFeeDep"].defMsg;
                        valid = false;
                    }
                }
                if (data.luggageType == "2") {
                    if (((data["singleLuggageWeight"] || "") + "").trim() == "") {
                        validate["singleLuggageWeight"].valid = false;
                        validate["singleLuggageWeight"].reason = validate["singleLuggageWeight"].defMsg;
                        valid = false;
                    }
                }
                if (isDouble) {
                    if (data.canChangeRet == "1") {
                        if (((data["changeFeeRet"] || "") + "").trim() == "") {
                            validate["changeFeeRet"].valid = false;
                            validate["changeFeeRet"].reason = validate["changeFeeRet"].defMsg;
                            valid = false;
                        }
                    }
                }
                //#endregion

                //#region 判断复制时是否与原来的值一样 copyEquals

                if (isCopy) {
                    function diff(oldData, newData) {

                        var ret = true
                        _.forEach(oldData, function (val, key) {
                            var _val1, _val2;
                            if (key === 'dateRestrictGo' || key === 'dateRestrictGoForbid' || key === 'depCities' || key === 'arrCities' || key === 'cabin' || key === 'depCities' || key === "segmentAirlines" || key === 'segmentFlightAllow' || key == "segmentFlightDeny" || key=="dateRestrictReturnForbid" || key=="dateRestrictReturn") {

                                    _val1 = _.sortBy((val || '').split(','))
                                    _val2 = _.sortBy((newData[key] || '').split(','))
                                    if (!_.isEqual(_val1, _val2)) {
                                        ret = false
                                    }

                            } else {
                                if (!_.isEqual(val, newData[key])) {
                                    ret = false
                                }
                            }
                        })
                        return ret
                    }

                    $scope.copyEquals = diff($scope.copyData, $scope.data)
                    if ($scope.copyEquals) {
                        alert("相同内容的政策不能重复保存！");
                        valid = false;
                    }
                }
                //#endregion

                //#region noshow
                if (data.noShowRestrict == "1") {
                    if (((data["noShowFee"] || "") + "").trim() == "") {
                        validate["noShowFee"].valid = false;
                        validate["noShowFee"].reason = validate["noShowFee"].defMsg;
                        valid = false;
                    }
                }
                //#endregion

                //#region noshow
                if (data.canInvalid == "1") {
                    if (((data["invalidFee"] || "") + "").trim() == "") {
                        validate["invalidFee"].valid = false;
                        validate["invalidFee"].reason = validate["invalidFee"].defMsg;
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
             * 数据清理, 清楚不必要的级联数据
             */
            function beforeClear(data) {
                if (data.bCanRt != 1) {
                    delete data.canGroupFileCode;
                }
                if (data.isTransfer != 1) {
                    delete data.transferCities;
                }

                if (!$scope.passengerTypeObj.adult) {
                    delete data.filePrice;
                }
                if (!$scope.passengerTypeObj.child) {
                    delete data.filePriceChild;
                }
                if (data.reserveType != 1) {
                    delete data.officeNo;
                }
                if (data.canChange != 1) {
                    delete data.changeFeeDep;
                }
                if (data.luggageType != 2) {
                    delete data.singleLuggageWeight;
                }
                if (data.canChangeRet != 1) {
                    delete data.changeFeeRet;
                }
                if (data.canRefund != 1) {
                    delete data.refundFeeAllUnused;
                }
                if (data.canRefundPartUnused != 1) {
                    delete data.refundFeePartUnused;
                }
                if (data.noShowRestrict != 1) {
                    delete data.noShowFee;
                    delete data.noShowRemark;
                }
                if (data.canInvalid != 1) {
                    delete data.invalidFee;
                }
            }

            /**
             * 大写
             */
            function uppercase(data) {
                if (data.airline) {
                    data.airline = data.airline.toUpperCase();
                }
                if (data.cabin) {
                    data.cabin = data.cabin.toUpperCase();
                }
                if (data.depCities) {
                    data.depCities = data.depCities.toUpperCase();
                }
                if (data.transferCities) {
                    data.transferCities = data.transferCities.toUpperCase();
                }

                if (data.arrCities) {
                    data.arrCities = data.arrCities.toUpperCase();
                }
                if (data.segmentFlightAllow) {
                    data.segmentFlightAllow = data.segmentFlightAllow.toUpperCase();
                }
                if (data.segmentFlightDeny) {
                    data.segmentFlightDeny = data.segmentFlightDeny.toUpperCase();
                }
                if (data.segmentAirlines) {
                    data.segmentAirlines = data.segmentAirlines.toUpperCase();
                }
            }

            /*
             * 清理数字前的0
             */
            function clearFirstZero(data) {
                if (/^\d+$/.test(data.filePrice)) {
                    data.filePrice = parseInt(data.filePrice, 10);
                }

                if (/^\d+$/.test(data.filePriceChild)) {
                    data.filePriceChild = parseInt(data.filePriceChild, 10);
                }

                if (/^\d+(\.\d+){0,1}$/.test(data.saleRetention)) {
                    data.saleRetention = parseFloat(data.saleRetention, 10);
                }

                if (/^\d+$/.test(data.saleRebase)) {
                    data.saleRebase = parseInt(data.saleRebase, 10);
                }

                if (/^\d+$/.test(data.changeFeeDep)) {
                    data.changeFeeDep = parseInt(data.changeFeeDep, 10);
                }
                //单件限额
                if (/^\d+$/.test(data.singleLuggageWeight)) {
                    data.singleLuggageWeight = parseInt(data.singleLuggageWeight, 10);
                }

                if (/^\d+$/.test(data.changeFeeRet)) {
                    data.changeFeeRet = parseInt(data.changeFeeRet, 10);
                }

                if (/^\d+$/.test(data.refundFeeAllUnused)) {
                    data.refundFeeAllUnused = parseInt(data.refundFeeAllUnused, 10);
                }

                if (/^\d+$/.test(data.refundFeePartUnused)) {
                    data.refundFeePartUnused = parseInt(data.refundFeePartUnused, 10);
                }

                if (/^\d+$/.test(data.noShowFee)) {
                    data.noShowFee = parseInt(data.noShowFee, 10);
                }

                if (/^\d+$/.test(data.luggageWeightsBags)) {
                    data.luggageWeightsBags = parseInt(data.luggageWeightsBags, 10);
                }

                if (/^\d+$/.test(data.invalidFee)) {
                    data.invalidFee = parseInt(data.invalidFee, 10);
                }
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
                //#region 销售日期
                var saleError = [];
                if (errObj.saleStart) {
                    saleError.push(errObj.saleStart);
                }
                if (errObj.saleEnd) {
                    saleError.push(errObj.saleEnd);
                }
                if (saleError.length >= 1) {
                    $scope.validate["sale"].valid = false;
                    $scope.validate["sale"].reason = saleError.join(";");
                }
                //#endregion
                //#region officeNo
                if (errObj.officeNo) {
                    if (false && $scope.officeNos[0]) {
                        $scope.validate["officeNo1"].valid = false;
                        $scope.validate["officeNo1"].reason = errObj.officeNo;
                    }

                    if (false && $scope.officeNos[1]) {
                        $scope.validate["officeNo2"].valid = false;
                        $scope.validate["officeNo2"].reason = errObj.officeNo;
                    }
                    $scope.validate["officeNo"].valid = false;
                    $scope.validate["officeNo"].reason = errObj.officeNo;
                }
                //#endregion

            }

            //#endregion

            /**
             * 发生错误时, 滚动到第一个发生错误的地方
             */
            function errorScroll() {
                var errorField = [],
                    errorFieldPosition = [];
                _.each($scope.validate, function (item, key) {
                    if (item.valid == false) {
                        errorField.push(key);
                        var offset = $("." + key + "Location").offset();
                        if (offset && offset.top) {
                            errorFieldPosition.push(offset.top - 10);
                        } else {
                            console.info(key);
                        }

                    }
                });
                window.scrollTo(0, _.min(errorFieldPosition));
            }

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

            //#region 编辑
            if (isEdit || isCopy) {
                var ifpId = id;

                getData(ifpId).then(function (data) {
                    if (data && data.success) {
                        handlerData(data.data);
                    } else {
                        alert(_.map(data.errMsg, function (item) {
                            return item
                        }).join("<br>")).then(function () {
                            IFPJumpService.login(data);
                        });

                    }
                }, function () {
                    alert("网络错误");
                });

                /**
                 * 获取数据
                 */
                function getData(id) {
                    var deferred = $q.defer();
                    showLoading();
                    $http.post(IFPAPIService.ifpBaseUrl + "policy/queryById", {id: id})
                        .success(function (data) {
                            data.data.singleLuggageWeight=data.data.singleLuggageWeight=='null'?23:data.data.singleLuggageWeight;
                            hideLoading();
                            deferred.resolve(data)
                        }).error(function (data) {
                        hideLoading();
                        deferred.reject(data); //请求失败
                    });

                    return deferred.promise;
                }

                function handlerData(data) {
                    _.each(data, function (item, key) {
                        if (typeof item == "number") {
                            data[key] = item + "";
                        }
                    });
                    $scope.data = data;
                    // $scope.copyData= angular.copy( $scope.data)

                    false && officeNosHandler();
                    saleHandler();
                    dateRestrictGoHandler();
                    dateRestrictGoForbidHandler();
                    if (isDouble) {
                        dateRestrictReturnHandler();
                        dateRestrictReturnForbidHandler();
                    }
                    passengerTypeHandler();
                    beforeClear(data);
                    $scope.copyData = angular.copy($scope.data)
                }
            }
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

            /**
             * 航司组合自动补齐
             */
            function airlineCombine(airline, transferType, travelType) {
                var param = {
                    airline: airline,
                    transferType: transferType,
                    travelType: travelType ? 2 : 1
                };
                var deferred = $q.defer();
                $http.post(IFPAPIService.ifpBaseUrl + "policy/completeAirlineCombine", param)
                    .success(function (data) {
                        deferred.resolve(data)
                    }).error(function (data) {
                    deferred.reject(data); //请求失败
                });
                return deferred.promise;
            }

            $scope.handleAirlineCombine = function () {
                // 航司组合为空时激活自动提示功能，若航司组合有值则不覆盖现有值
                if ($scope.data.airline != '' && $scope.data.isTransfer != '-1') {
                    airlineCombine($scope.data.airline, $scope.data.isTransfer, isDouble).then(function (data) {
                        if (data && data.success) {
                            // 补齐航司组合数据
                            $scope.data.segmentAirlines = data.data;
                        }
                    }, function () {
                        alert("网络错误");
                    });
                }
            };

            /**
             * 关闭
             */
            $scope.closeClick = function ($ele) {
                window.close();
            };
            $scope.pageShow = true;
        }]);
    angular.bootstrap(document, ["ifpApp"])
});
