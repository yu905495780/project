/**
 * 新增
 */
define([
    "config/ifgConfig",
    "service/ifg/ifgAPIService",
    "service/ifg/ifgJumpService",
    "filter/ifgToTrustFilter",
    "directive/ifg/englishChineseComma",
    "directive/ifg/chineseRestrict.min",
    "directive/ifg/englishDigital.min",
    "directive/ifg/digitalOnly.min",
    "directive/ifg/zeroRestrict.min",
    "directive/ifg/spaceRestrict.min",
    "directive/ifg/englishComma.min",
    "directive/ifg/englishDigitalComma.min",
    "directive/ifg/englishDigitalCommaSlash.min",
    "directive/ifg/commaReplace.min",
    "directive/ifg/commaRestrict.min",
    "directive/ifg/englishDigitalDashSlash.min",
    "directive/ifg/digitalHyphen",
    "directive/ifg/englishHexclamationComma"
], function (ifgApp) {
    ifgApp.controller("ifgAddCtrl", ["$rootScope", "$scope", "$http", "$location", "$filter", "$q", "$stateParams", "$timeout", "$uibModal", "IFGAPIService", "IFGJumpService",
        function ($rootScope, $scope, $http, $location, $filter, $q, $stateParams, $timeout, $uibModal, IFGAPIService, IFGJumpService, undefined) {

            var searchParam = $location.search(),
                ctrlPage = searchParam["ctrl"] || "";
            var isEdit = ctrlPage.indexOf("isEdit") > -1;//是否是编辑
            $scope.isEdit = isEdit;
            var isCopy = ctrlPage.indexOf("isCopy") > -1;//是否是复制
            var id = searchParam["id"];//编辑用id
            var baseUrl = IFGAPIService.ifgBaseUrl;

            // 初始化页面数据
            $scope.data = {
                "externalId": "",
                "mainFilegroupcode": "",
                "travelTypeRestrict": "0",
                "canRt": "-1",
                "canGroupFilecode": "",
                "airline": "",
                "depCities": "",
                "arrCities": "",
                "depCitiesForbid": "",
                "arrCitiesForbid": "",
                "cabinRestrict": "",
                "canConnectAirline": "-1",
                "connectAirline": "",
                "connectAirlineForbid": "",
                "canCodeSharing": "0",
                "transferTypeRestrict": "2",
                "transferCities": "",
                "flightRestrict": "",
                "flightRestrictForbid": "",
                "saleStartDate": "",
                "saleEndDate": "",
                "goDateRestrict": "",
                "goDateRestrictForbid": "",
                "returnDateRestrict": "",
                "returnDateRestrictForbid": "",
                "advanceSaleDate": "",
                "agentFee": "",
                // 返点留钱
                "saleRebase": "0",
                "saleRetention": "",
                "saleRebaseChild": "0",
                "saleRetentionChild": "",
                // 公转私返点留钱
                "saleRebasePri": "0",
                "saleRetentionPri": "",
                "saleRebaseChildPri": "0",
                "saleRetentionChildPri": "",

                "rtCommissionRule": "0",
                "invoiceFee": "0",
                "autoTicketing": "0",
                "reimbursementVoucher": "0",
                "bookingChannel": "1",
                "officeNo": "",
                "remark": "",
                "status": "1",
                "privateFlag": "0",
                "refundChangePercent": "",
                //区域代码历史值
                // "depCitiesElder": "",
                // "arrCitiesElder": "",
                // "depCitiesForbidElder": "",
                // "arrCitiesForbidElder": ""
                //公布政策留学生
                "age": "",
                "nationality": ""
            };

            $scope.rdata = {
                ztree: {},
                regionInfo: [],
                typeCode: "",
                showRegion: false,
                isFinish: false,
                depPreinfo: [],
                arrPreinfo: [],
                preinfo: []
            };

            $scope.isChangeArea = true;// true - 当前区域转城市 false - 当前城市转区域
            $scope.isDouble = $scope.data.travelTypeRestrict == 0 || $scope.data.travelTypeRestrict == 2;
            //$scope.isCabinRestrict=$scope.data.cabinRestrict =='ALL';

            // 初始化验证
            $scope.validate = {
                "externalId": {"valid": true, "reason": "", "defMsg": ""},
                "mainFilegroupcode": {"valid": true, "reason": "", "defMsg": "请完善文件编号信息"},
                "travelTypeRestrict": {"valid": true, "reason": "", "defMsg": "请完善行程类型信息"},
                "canRt": {"valid": true, "reason": "", "defMsg": "请完善是否允许1/2RT组合信息"},
                "canGroupFilecode": {"valid": true, "reason": "", "defMsg": "请完善可组文件编号信息"},
                "airline": {"valid": true, "reason": "", "defMsg": "请完善开票航司信息"},
                "depCities": {"valid": true, "reason": "", "defMsg": "请完善出发地信息"},
                "arrCities": {"valid": true, "reason": "", "defMsg": "请完善目的地信息"},
                "depCitiesForbid": {"valid": true, "reason": "", "defMsg": ""},
                "arrCitiesForbid": {"valid": true, "reason": "", "defMsg": ""},
                "cabinRestrict": {"valid": true, "reason": "", "defMsg": "请完善适用舱位信息"},
                "canConnectAirline": {"valid": true, "reason": "", "defMsg": "请完善是否适用于联运信息"},
                "connectAirline": {"valid": true, "reason": "", "defMsg": ""},
                "connectAirlineForbid": {"valid": true, "reason": "", "defMsg": ""},
                "canCodeSharing": {"valid": true, "reason": "", "defMsg": "请完善是否适用于共享航班信息"},
                "transferTypeRestrict": {"valid": true, "reason": "", "defMsg": "请完善是否适用于中转信息"},
                "transferCities": {"valid": true, "reason": "", "defMsg": ""},
                "flightRestrict": {"valid": true, "reason": "", "defMsg": ""},
                "flightRestrictForbid": {"valid": true, "reason": "", "defMsg": ""},
                "advanceSaleDate": {"valid": true, "reason": "", "defMsg": ""},
                "passengerTypeRestrict": {"valid": true, "reason": "", "defMsg": "请完善适用旅客信息"},
                "agentFee": {"valid": true, "reason": "", "defMsg": "请完善代理费信息"},
                "saleRebase": {"valid": true, "reason": "", "defMsg": "请完善成人返点信息"},
                "saleRetention": {"valid": true, "reason": "", "defMsg": "请完善成人留钱信息"},
                "saleRebaseChild": {"valid": true, "reason": "", "defMsg": "请完善儿童返点信息"},
                "saleRetentionChild": {"valid": true, "reason": "", "defMsg": "请完善儿童留钱信息"},
                // 公转私
                "saleRebasePri": {"valid": true, "reason": "", "defMsg": "请完善成人返点信息"},
                "saleRetentionPri": {"valid": true, "reason": "", "defMsg": "请完善成人留钱信息"},
                "saleRebaseChildPri": {"valid": true, "reason": "", "defMsg": "请完善儿童返点信息"},
                "saleRetentionChildPri": {"valid": true, "reason": "", "defMsg": "请完善儿童留钱信息"},
                "rtCommissionRule": {"valid": true, "reason": "", "defMsg": "请完善1/2RT佣金计算逻辑信息"},
                "invoiceFee": {"valid": true, "reason": "", "defMsg": "请完善开票费信息"},
                "autoTicketing": {"valid": true, "reason": "", "defMsg": "请完善出票方式"},
                "reimbursementVoucher": {"valid": true, "reason": "", "defMsg": "请完善报销凭证信息"},
                "bookingChannel": {"valid": true, "reason": "", "defMsg": "请完善预定配置信息"},
                "officeNo": {"valid": true, "reason": "", "defMsg": ""},
                "remark": {"valid": true, "reason": "", "defMsg": ""},
                "status": {"valid": true, "reason": "", "defMsg": "请完善保存状态信息"},
                "sale": {"valid": true, "reason": "", "defMsg": ""},
                "goDateRestrict": {"valid": true, "reason": "", "defMsg": ""},
                "goDateRestrictForbid": {"valid": true, "reason": "", "defMsg": ""},
                "returnDateRestrict": {"valid": true, "reason": "", "defMsg": ""},
                "returnDateRestrictForbid": {"valid": true, "reason": "", "defMsg": ""},
                "privateFlag": {"valid": true, "reason": "", "defMsg": "请完善是否转私有信息"},
                "refundChangePercent": {"valid": true, "reason": "", "defMsg": "请完善退改费用信息"},
                //留学生信息
                "age": {"valid": true, "reason": "", "defMsg": "请完善年龄限制信息"},
                "nationality": {"valid": true, "reason": "", "defMsg": "请完善国籍限制信息"}
            };
            getCityInfo();
            // 页面元素控制
            // 行程类型
            (function ($scope, undefined) {
                $scope.$watch("data.travelTypeRestrict", function () {
                    $scope.isDouble = $scope.data.travelTypeRestrict == 0 || $scope.data.travelTypeRestrict == 2;

                    if ($scope.isDouble) {
                        returnDateRestrictHandler();
                        returnDateRestrictForbidHandler();
                    }
                });
            })($scope);

            $scope.instructionDownload = function () {
                window.open(IFGAPIService.ifgBaseUrl + "iepolicy/downLoadAreaDetail");
            };

            /**
             * 区域选择
             * */
            $scope.ifgRegionClick = function ($event, code) {
                if ($scope.rdata.isFinish) {
                    $scope.rdata.showRegion = true;
                    $scope.rdata.typeCode = code;
                    if (code == 1) $scope.rdata.preinfo = $scope.rdata.arrPreinfo;
                    if (code == 0) $scope.rdata.preinfo = $scope.rdata.depPreinfo;
                }
            };

            /**
             * 查看城市代码
             * */
            $scope.cityCodeClick = function ($event, code) {
                var params = {};
                var cities = "";
                if (code == 1) {
                    if ($scope.data.arrCities.includes("全球") || $scope.data.arrCities.includes("0")) {
                        return;
                    }
                    cities = $scope.data.arrCities || "";
                }
                if (code == 0) {
                    if ($scope.data.depCities.includes("全球") || $scope.data.depCities.includes("0")) {
                        return;
                    }
                    cities = $scope.data.depCities || "";
                }
                if (cities && cities[0] !== "全球") {
                    if (typeof(cities) == 'string') params = cities.toUpperCase();
                    else params = cities;

                    var def = getCityCode(params);
                    def.then(function (data) {
                        if (data && data.success && data.data) {
                            var result = data.data.toString();
                            if (code == 0) $scope.data.depCities = result;
                            if (code == 1) $scope.data.arrCities = result;
                        } else {
                            var result = data.data.toString();
                            if (code == 0) {
                                $scope.validate["depCities"].valid = false;
                                $scope.validate["depCities"].reason = result + "不存在";
                            }
                            if (code == 1) {
                                $scope.validate["arrCities"].valid = false;
                                $scope.validate["arrCities"].reason = result + "不存在";
                            }
                        }
                    })
                }
            };

            /*
             * 选择区域保存
             * */
            $scope.saveRegion = function (param, code, pre) {

                // var citiesName = [];
                /* angular.forEach(param, function (value, key) {
                 var name = param[key].name;
                 citiesName.push(name);

                 });*/
                if (code == 1) {
                    $scope.data.arrCities = param;
                    $scope.rdata.arrPreinfo = pre;
                }
                if (code == 0) {
                    $scope.data.depCities = param;
                    $scope.rdata.depPreinfo = pre;
                }
                $scope.rdata.regionInfo = param;

                this.closeRegion();
            };

            /**
             *
             *关闭区域组件
             */
            $scope.closeRegion = function () {
                $scope.rdata.showRegion = false;
            };

            // /**
            //  * 查看地区/城市代码
            //   */
            // $scope.areaChangeClick = function ($event, code) {
            //     // 变更转换标识
            //     $scope.isChangeArea = !$scope.isChangeArea;
            //     var paramEnum = [
            //         {item: $scope.depCities, code: 0},
            //         {item: $scope.arrCities, code: 1},
            //         {item: $scope.depCitiesForbid, code: 2},
            //         {item: $scope.arrCitiesForbid, code: 3}
            //     ];
            //     // DOM控制
            //     $($event.target).text($scope.isChangeArea ? "查看城市代码" : "查看区域代码");
            //     if (!$scope.isChangeArea) { // 查看城市代码时记录区域代码历史值
            //         if (code == 0) {
            //             $scope.data.depCitiesElder = $scope.data.depCities;
            //         } else if (code == 1) {
            //             $scope.data.depCitiesElder = $scope.data.arrCities;
            //         } else if (code == 2) {
            //             $scope.data.depCitiesElder = $scope.data.depCitiesForbid;
            //         } else if (code == 3) {
            //             $scope.data.depCitiesElder = $scope.data.arrCitiesForbid;
            //         }
            //     }
            //     angular.forEach(paramEnum, function (item, index) {
            //         if (item.code == code) {
            //             cityAreaChange(item.item).then(function (data) {
            //                 if (data.success) {
            //                     cityCodeHandler(data.data, code);
            //                 }
            //             });
            //         }
            //     });
            //
            // };

            // 适用旅客
            var passengerTypeToNumEnum = {adult: 1, child: 0, student: 2},
                numToPassengerTypeEnum = {
                    "1": "adult", "0": "child", "2": "student"
                };
            var passengerTypeHandler = undefined;
            (function ($scope, undefined) {
                $scope.passengerTypeObj = {
                    "adult": true,
                    "child": false,
                    "student": false
                };
                passengerTypeHandler = function () {
                    var passengerTypeArr = $scope.data.passengerTypeRestrict.split(",");
                    if (passengerTypeToNumEnum.student == passengerTypeArr) {
                        $scope.passengerTypeObj.adult = false;
                    }
                    _.each(passengerTypeArr, function (item, index) {
                        $scope.passengerTypeObj[numToPassengerTypeEnum[item]] = true;
                    });
                };
                $scope.$watchCollection("passengerTypeObj", function () {
                    // 取消普通成人时自动取消儿童
                    var passengerTypeArr = [];
                });
            })($scope);

            /**
             * 留学生选择
             * */
            $scope.OptionClick = function ($event, type) {
                if ($event) {
                    if (type == "student") {
                        passengerTypeArr = [];
                        passengerTypeArr.push(passengerTypeToNumEnum["student"]);
                        $scope.passengerTypeObj["adult"] = false;
                        $scope.passengerTypeObj["child"] = false;
                    }
                    else if (type == "child") {
                        passengerTypeArr = [];
                        passengerTypeArr.push(passengerTypeToNumEnum["child"]);
                        passengerTypeArr.push(passengerTypeToNumEnum["adult"]);
                        $scope.passengerTypeObj["adult"] = true;
                        $scope.passengerTypeObj["child"] = true;
                        $scope.passengerTypeObj["student"] = false;
                    }
                    else if (type == "adult") {
                        passengerTypeArr = [];
                        passengerTypeArr.push(passengerTypeToNumEnum["adult"]);
                        $scope.passengerTypeObj["adult"] = true;
                        $scope.passengerTypeObj["child"] = false;
                        $scope.passengerTypeObj["student"] = false;
                    }
                }
                else {
                    if (type == "adult") {
                        passengerTypeArr = [];
                        passengerTypeArr.push(passengerTypeToNumEnum["student"]);
                        $scope.passengerTypeObj["child"] = false;
                        $scope.passengerTypeObj["student"] = true;
                    }
                    if (type == "student") {
                        passengerTypeArr = [];
                        passengerTypeArr.push(passengerTypeToNumEnum["adult"]);
                        $scope.passengerTypeObj["adult"] = true;
                        $scope.passengerTypeObj["child"] = false;
                    }
                    if (type == "child") {
                        passengerTypeArr = [];
                        passengerTypeArr.push(passengerTypeToNumEnum["adult"]);
                        $scope.passengerTypeObj["adult"] = true;
                        $scope.passengerTypeObj["student"] = false;
                    }
                }
                $scope.data.passengerTypeRestrict = passengerTypeArr.join(",");
            };

            // 航司高返政策
            /* var autoTicketingHandler = undefined;
             (function ($scope, undefined) {
             $scope.autoTicketingObj = false;// 初始化
             var autoTicketingEnum = {"0": true, "1": false};
             autoTicketingHandler = function () {
             var autoTicketingValue = $scope.data.autoTicketing;
             $scope.autoTicketingObj = autoTicketingEnum[autoTicketingValue];
             };
             $scope.$watchCollection("autoTicketingObj", function () {
             if ($scope.autoTicketingObj) {
             $scope.data.autoTicketing = "0";
             } else {
             $scope.data.autoTicketing = "1";
             }
             });
             })($scope);*/

            //销售日期, 旅行日期, 排除旅行日期
            var saleHandler = undefined,
                goDateRestrictHandler = undefined,
                goDateRestrictForbidHandler = undefined,
                returnDateRestrictHandler = undefined,
                returnDateRestrictForbidHandler = undefined;
            (function ($scope, undefined) {
                //销售日期
                //初始值
                var saleStartStr = $scope.data.saleStartDate || "",
                    saleEndStr = $scope.data.saleEndDate || "";
                $scope.saleValue = {
                    start: saleStartStr ? new Date(saleStartStr.replace(/-/ig, '\/')) : new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                    end: saleEndStr ? new Date(saleEndStr.replace(/-/ig, '\/')) : null
                };
                $scope.saleOption = {
                    start: {},
                    end: {
                        minDate: $scope.saleValue.start
                    }
                };
                /**
                 * 销售日期编辑数据处理
                 */
                saleHandler = function () {
                    saleStartStr = $scope.data.saleStartDate || "";
                    saleEndStr = $scope.data.saleEndDate || "";
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
                //销售日期开始变更
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
                    $scope.data.saleStartDate = $filter("date")($scope.saleValue.start, "yyyy-MM-dd") || "";
                    $scope.data.saleEndDate = $filter("date")($scope.saleValue.end, "yyyy-MM-dd") || "";
                });

                //#region 旅行日期
                //初始值
                var goDateRestrictArr = $scope.data.goDateRestrict.split('>');
                var goDateRestrictStartStr = goDateRestrictArr[0] || "",
                    goDateRestrictEndStr = goDateRestrictArr[1] || "";
                $scope.goDateRestrictValue = {
                    start: goDateRestrictStartStr ? new Date(goDateRestrictStartStr.replace(/-/ig, '\/'))
                        : new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                    end: goDateRestrictEndStr ? new Date(goDateRestrictEndStr.replace(/-/ig, '\/')) : null
                };
                $scope.goDateRestrictOption = {
                    start: {},
                    end: {
                        minDate: $scope.goDateRestrictValue.start
                    }
                };
                /**
                 * 旅行日期编辑数据处理
                 */
                goDateRestrictHandler = function () {
                    goDateRestrictArr = $scope.data.goDateRestrict.split('>');
                    goDateRestrictStartStr = goDateRestrictArr[0] || "";
                    goDateRestrictEndStr = goDateRestrictArr[1] || "";
                    $scope.goDateRestrictValue = {
                        start: goDateRestrictStartStr ? new Date(goDateRestrictStartStr.replace(/-/ig, '\/')) : null,
                        end: goDateRestrictEndStr ? new Date(goDateRestrictEndStr.replace(/-/ig, '\/')) : null
                    };
                    $scope.goDateRestrictOption.end.minDate = $scope.goDateRestrictValue.start;
                };
                //旅行日期开始点击
                $scope.goDateRestrictStartOpenClick = function () {
                    $scope.goDateRestrictStartCalOpen = true;
                };
                // 旅行日期开始变更
                $scope.goDateRestrictStartChange = function () {
                    $scope.goDateRestrictOption.end.minDate = $scope.goDateRestrictValue.start;
                    if ($scope.goDateRestrictValue.start > ($scope.goDateRestrictValue.end || null)) {
                        $scope.goDateRestrictValue.end = $scope.goDateRestrictValue.start;
                    }
                };
                //旅行日期结束点击
                $scope.goDateRestrictEndOpenClick = function () {
                    $scope.goDateRestrictEndCalOpen = true;
                };
                $scope.$watchCollection("goDateRestrictValue", function () {
                    $scope.data.goDateRestrict = [
                        $filter("date")($scope.goDateRestrictValue.start, "yyyy-MM-dd") || "",
                        $filter("date")($scope.goDateRestrictValue.end, "yyyy-MM-dd") || ""].join(">");
                });

                //回程旅行日期
                if ($scope.isDouble) {
                    //初始值
                    var returnDateRestrictArr = $scope.data.returnDateRestrict.split('>');
                    var returnDateRestrictStartStr = returnDateRestrictArr[0] || "",
                        returnDateRestrictEndStr = returnDateRestrictArr[1] || "";
                    $scope.returnDateRestrictValue = {
                        start: returnDateRestrictStartStr ? new Date(returnDateRestrictStartStr.replace(/-/ig, '\/')) : new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                        end: returnDateRestrictEndStr ? new Date(returnDateRestrictEndStr.replace(/-/ig, '\/')) : null
                    };
                    $scope.returnDateRestrictOption = {
                        start: {},
                        end: {
                            minDate: $scope.returnDateRestrictValue.start
                        }
                    };
                    /**
                     * 回程旅行日期编辑数据处理
                     */
                    returnDateRestrictHandler = function () {
                        returnDateRestrictArr = $scope.data.returnDateRestrict.split('>');
                        returnDateRestrictStartStr = returnDateRestrictArr[0] || "";
                        returnDateRestrictEndStr = returnDateRestrictArr[1] || "";
                        $scope.returnDateRestrictValue = {
                            start: returnDateRestrictStartStr ? new Date(returnDateRestrictStartStr.replace(/-/ig, '\/')) : new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                            end: returnDateRestrictEndStr ? new Date(returnDateRestrictEndStr.replace(/-/ig, '\/')) : null
                        };
                        $scope.returnDateRestrictOption.end.minDate = $scope.returnDateRestrictValue.start;
                    };
                    //回程旅行日期开始点击
                    $scope.returnDateRestrictStartOpenClick = function () {
                        $scope.returnDateRestrictStartCalOpen = true;
                    };
                    //回程旅行日期开始变更
                    $scope.returnDateRestrictStartChange = function () {
                        $scope.returnDateRestrictOption.end.minDate = $scope.returnDateRestrictValue.start;
                        if ($scope.returnDateRestrictValue.start > ($scope.returnDateRestrictValue.end || null)) {
                            $scope.returnDateRestrictValue.end = $scope.returnDateRestrictValue.start;
                        }
                    };
                    //回程旅行日期结束点击
                    $scope.returnDateRestrictEndOpenClick = function () {
                        $scope.returnDateRestrictEndCalOpen = true;
                    };
                    $scope.$watchCollection("returnDateRestrictValue", function () {
                        $scope.data.returnDateRestrict = [
                            $filter("date")($scope.returnDateRestrictValue.start, "yyyy-MM-dd") || "",
                            $filter("date")($scope.returnDateRestrictValue.end, "yyyy-MM-dd") || ""].join(">");
                    });
                }

                //禁止旅行日期
                //初始值
                var restrictGoForbids = $scope.data.goDateRestrictForbid.split(",");
                $scope.restrictGoForbidValue = [];
                goDateRestrictForbidHandler = function () {
                    if ($scope.data.goDateRestrictForbid) {
                        restrictGoForbids = $scope.data.goDateRestrictForbid.split(",");
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
                            end: null
                        });
                    }
                };
                if (!isEdit && !isCopy) {
                    goDateRestrictForbidHandler();
                }
                //旅行禁止开始点击
                $scope.goDateRestrictForbidStartOpenClick = function (item) {
                    item.startOpen = true;
                };
                //旅行禁止开始变更
                $scope.goDateRestrictForbidStartChange = function (item) {
                    item.endMinDate = item.start;
                    if (item.start > (item.end || null)) {
                        item.end = item.start;
                    }
                    $scope.goDateRestrictForbidEndChange();
                };
                //旅行禁止结束变更
                $scope.goDateRestrictForbidEndChange = function (item) {
                    var restrictGoForbidValue = $scope.restrictGoForbidValue,
                        restrictGoForbids = [];
                    angular.forEach(restrictGoForbidValue, function (value, key) {
                        restrictGoForbids.push(
                            [$filter("date")(value.start, "yyyy-MM-dd") || "", $filter("date")(value.end, "yyyy-MM-dd") || ""].join(">")
                        );
                    });
                    if (restrictGoForbids.length <= 1) {
                        if (restrictGoForbids[0] == ">") {
                            $scope.data.goDateRestrictForbid = "";
                        } else {
                            $scope.data.goDateRestrictForbid = restrictGoForbids.join(",");
                        }
                    } else {
                        $scope.data.goDateRestrictForbid = restrictGoForbids.join(",");
                    }
                };
                $scope.$watchCollection("restrictGoForbidValue", function () {
                    $scope.goDateRestrictForbidEndChange();
                });
                //旅行禁止结束点击
                $scope.goDateRestrictForbidStartEndClick = function (item) {
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

                // 回程禁止旅行日期
                if ($scope.isDouble) {
                    //初始值
                    var restrictReturnForbids = $scope.data.returnDateRestrictForbid.split(",");
                    returnDateRestrictForbidHandler = function () {
                        $scope.restrictReturnForbidValue = [];
                        if ($scope.data.returnDateRestrictForbid) {
                            restrictReturnForbids = $scope.data.returnDateRestrictForbid.split(",");
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
                                end: null
                            });
                        }
                    };
                    //新增时初始化
                    if (!isEdit && !isCopy) {
                        returnDateRestrictForbidHandler()
                    }
                    //回程旅行禁止开始点击
                    $scope.returnDateRestrictForbidStartOpenClick = function (item) {
                        item.startOpen = true;
                    };
                    //回程旅行禁止开始变更
                    $scope.returnDateRestrictForbidStartChange = function (item) {
                        item.endMinDate = item.start;
                        if (item.start > (item.end || null)) {
                            item.end = item.start;
                        }
                        $scope.returnDateRestrictForbidEndChange();
                    };
                    //回程旅行禁止结束变更
                    $scope.returnDateRestrictForbidEndChange = function (item) {
                        var restrictReturnForbidValue = $scope.restrictReturnForbidValue,
                            restrictReturnForbids = [];
                        angular.forEach(restrictReturnForbidValue, function (value, key) {
                            restrictReturnForbids.push(
                                [$filter("date")(value.start, "yyyy-MM-dd") || "", $filter("date")(value.end, "yyyy-MM-dd") || ""].join(">")
                            );
                        });
                        if (restrictReturnForbids.length <= 1) {
                            if (restrictReturnForbids[0] == ">") {
                                $scope.data.returnDateRestrictForbid = "";
                            } else {
                                $scope.data.returnDateRestrictForbid = restrictReturnForbids.join(",");
                            }
                        } else {
                            $scope.data.returnDateRestrictForbid = restrictReturnForbids.join(",");
                        }
                    };
                    //回程旅行禁止结束点击
                    $scope.returnDateRestrictForbidStartEndClick = function (item) {
                        item.endOpen = true;
                    };
                    //判断运价类型
                    $scope.autoTicketClick = function (item) {
                        $scope.data.autoTicketing = item;
                    };

                    $scope.cabinRestrictClick = function ($event) {
                        var checkbox = $event.target;
                        var checked = checkbox.checked;
                        if (checked) {
                            $scope.data.cabinRestrict = "ALL";
                            checkbox.previousElementSibling.readOnly = true;
                            checkbox.previousElementSibling.placeholder = "";
                        }
                        else {
                            $scope.data.cabinRestrict = "";
                            checkbox.previousElementSibling.readOnly = false;
                            checkbox.previousElementSibling.placeholder = "请输入适用舱位";
                        }
                    };
                    $scope.$watchCollection("restrictReturnForbidValue", function () {
                        $scope.returnDateRestrictForbidEndChange();
                    });
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
                }
            })($scope);
            //#endregion

            // 表单提交事件
            /**
             * 保存
             */
            $scope.saveClick = function ($ele) {
                if (beforeSaveValidate($scope, $scope.data, $scope.validate)) {
                    var param = angular.extend({}, $scope.data);
                    commonFunc.beforeClear(param);
                    commonFunc.upperCase(param);
                    commonFunc.clearFirstZero(param);
                    if (param.canRt != 1) {
                        param.rtCommissionRule = 0;
                    }

                    showLoading();
                    var url = "";
                    if (isEdit) {
                        url = "iepolicy/update"
                    } else if (isCopy) {
                        delete param.id;
                        url = "iepolicy/insert"
                    } else {
                        url = "iepolicy/insert"
                    }

                    $http.post(baseUrl + url, param).success(function (data) {
                        if (data.success) {
                            alert("保存成功").then(function () {
                                window.close();
                            });
                        }
                        else {
                            alert(_.filter(data.errMsg, function (item, key) {
                                    if (key == 'overdue') {
                                        return item;
                                    }
                                }).join("<br>") || "保存失败").then(function () {
                                errorScroll();
                                IFGJumpService.login(data);
                            });
                            saveFalseHandler(data.errMsg);
                            // window.scrollTo(0, 0);
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
            };

            /**
             * 提交前验证
             */
            function beforeSaveValidate($scope, data, validate) {
                var valid = true;
                // 清理校验结果
                angular.forEach($scope.validate, function (value, key) {
                    value.valid = true;
                    value.reason = "";
                });

                // 普通非空验证
                var inputRequires = ["mainFilegroupcode", "airline", "depCities", "arrCities", "cabinRestrict",
                        "agentFee", "saleRebase", "saleRetention", "invoiceFee"],//input必填

                    selectRequires = ["travelTypeRestrict", "canConnectAirline", "canCodeSharing", "transferTypeRestrict",
                        "rtCommissionRule", "reimbursementVoucher", "bookingChannel", "status"];//select必选

                if ($scope.isDouble) {
                    selectRequires.push("canRt");
                }

                if ($scope.passengerTypeObj.child) {
                    inputRequires.push("saleRetentionChild", "saleRebaseChild");
                }

                if (data.privateFlag == '2') {
                    inputRequires.push("saleRetentionPri", "saleRebasePri");
                    if ($scope.passengerTypeObj.child) {
                        inputRequires.push("saleRetentionChildPri", "saleRebaseChildPri");
                    }
                }

                if (!$scope.passengerTypeObj.adult && !$scope.passengerTypeObj.child && !$scope.passengerTypeObj.student) {
                    validate["passengerTypeRestrict"].valid = false;
                    validate["passengerTypeRestrict"].reason = validate["passengerTypeRestrict"].defMsg;
                    valid = false;
                }

                for (var inputLen = inputRequires.length; inputLen--;) {
                    var inputRequireItem = inputRequires[inputLen];
                    if (((data[inputRequireItem] || "") + "").trim() == "") {//如果未输入
                        validate[inputRequireItem].valid = false;
                        validate[inputRequireItem].reason = validate[inputRequireItem].defMsg;
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

                if ($scope.isDouble && data["canRt"] == 1) {
                    if (((data["canGroupFilecode"] || "") + "").trim() == "") {
                        validate["canGroupFilecode"].valid = false;
                        validate["canGroupFilecode"].reason = validate["canGroupFilecode"].defMsg;
                        valid = false;
                    }
                }

                if ((data.saleStartDate || "").trim() == "" || (data.saleEndDate || "").trim() == "") {
                    validate["sale"].valid = false;
                    validate["sale"].reason = "请完善销售日期";
                    valid = false;
                }

                //#region 旅行日期
                var dateRestrictGoValue = $scope.goDateRestrictValue;
                if (dateRestrictGoValue.start == null || dateRestrictGoValue.end == null) {
                    validate["goDateRestrict"].valid = false;
                    var msg = '';
                    if ($scope.isDouble) {
                        msg = '去程';
                    }
                    validate["goDateRestrict"].reason = "请完善" + msg + "旅行日期";
                    valid = false;
                }
                //#endregion

                //#region 回程旅行日期
                if ($scope.isDouble) {
                    var dateRestrictReturnValue = $scope.returnDateRestrictValue;
                    if (dateRestrictReturnValue.start == null || dateRestrictReturnValue.end == null) {
                        validate["returnDateRestrict"].valid = false;
                        validate["returnDateRestrict"].reason = "请完善回程旅行日期";
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
                        validate["goDateRestrictForbid"].valid = false;
                        validate["goDateRestrictForbid"].reason = "请完善排除日期";
                        valid = false;
                    }
                } else {
                    _.each(restrictGoForbidValue, function (value) {
                        if (value.start == null || value.end == null) {
                            validate["goDateRestrictForbid"].valid = false;
                            validate["goDateRestrictForbid"].reason = "请完善排除日期";
                            valid = false;
                            return false;
                        }
                    });
                }

                //#region 回程排除日期
                if ($scope.isDouble) {
                    var restrictReturnForbidValue = $scope.restrictReturnForbidValue;
                    if (restrictReturnForbidValue.length <= 1) {
                        if ((restrictReturnForbidValue[0].start != null && restrictReturnForbidValue[0].end == null) ||
                            (restrictReturnForbidValue[0].start == null && restrictReturnForbidValue[0].end != null)
                        ) {
                            validate["returnDateRestrictForbid"].valid = false;
                            validate["returnDateRestrictForbid"].reason = "请完善回程排除日期";
                            valid = false;
                        }
                    } else {
                        _.each(restrictReturnForbidValue, function (value) {
                            if (value.start == null || value.end == null) {
                                validate["returnDateRestrictForbid"].valid = false;
                                validate["returnDateRestrictForbid"].reason = "请完善回程排除日期";
                                valid = false;
                                return false;
                            }
                        });
                    }
                }
                //#endregion

                if (!valid) {
                    $timeout(errorScroll);
                }
                //验证出票方式
                if ($scope.data.autoTicketing.length == 0) {
                    validate["autoTicketing"].valid = false;
                    validate["autoTicketing"].reason = validate["autoTicketing"].defMsg;
                    valid = false;
                }
                //验证ALL的方式
                if ($scope.data.cabinRestrict.length > 3 && $scope.data.cabinRestrict.includes("ALL")) {
                    validate["cabinRestrict"].valid = false;
                    validate["cabinRestrict"].reason = "使用仓位两种输入方式只能二选一";
                    valid = false;
                }

                return valid;
            }

            /**
             * 提交失败原因提示
             */
            function saveFalseHandler(errObj) {
                // 清空校验信息
                angular.forEach($scope.validate, function (value, key) {
                    value.valid = true;
                    value.reason = "";
                });
                // 错误项及信息补充
                angular.forEach(errObj, function (value, key) {
                    var validateItem = $scope.validate[key];
                    if (validateItem) {
                        $scope.validate[key].valid = false;
                        $scope.validate[key].reason = value;
                    }
                });
                // 销售日期
                var saleError = [];
                if (errObj.saleStartDate) {
                    saleError.push(errObj.saleStartDate);
                }
                if (errObj.saleEndDate) {
                    saleError.push(errObj.saleEndDate);
                }
                if (saleError.length >= 1) {
                    $scope.validate["sale"].valid = false;
                    $scope.validate["sale"].reason = saleError.join(";");
                }
            }


            /*
             * 获取城市组件数据
             * */
            function getCityInfo() {
                var deferred = $q.defer();
                $http({
                    method: "get",
                    url: baseUrl + "iepolicy/showAreaTreeDTO",
                }).success(function (data) {
                    if (data && data.success && data.data) {
                        $scope.rdata.ztree = data.data;
                        deferred.resolve(data);
                        $scope.rdata.isFinish = true;
                    }
                }).error(function (data, status) {
                    deferred.reject(status);
                    $scope.rdata.isFinish = false;
                });
            }


            /**
             * 获取城市代码
             * @param params
             */
            function getCityCode(params) {
                var deferred = $q.defer();
                $http({
                    method: "get",
                    url: baseUrl + "iepolicy/showAllCity?param=" + params,
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (data, status) {
                    deferred.reject(status);
                });
                return deferred.promise;
            }

            /**
             * 编辑
             */
            if (isEdit) {
                getData(id).then(function (data) {
                    if (data && data.success) {
                        handleData(data.data);
                    } else {
                        alert(_.map(data.errMsg, function (item) {
                            return item
                        }).join("<br>")).then(function () {
                            IFGJumpService.login(data);
                        });

                    }
                }, function () {
                    alert("网络错误");
                });
            }

            /**
             * 复制
             */
            if (isCopy) {
                getData(id).then(function (data) {
                    if (data && data.success) {
                        handleData(data.data);
                        // 删除id
                        delete $scope.data.id;
                    } else {
                        alert(_.map(data.errMsg, function (item) {
                            return item
                        }).join("<br>")).then(function () {
                            IFGJumpService.login(data);
                        });
                    }
                }, function () {
                    alert("网络错误");
                });
            }

            /**
             * 城市代码/区域代码转换
             */
            function cityAreaChange(code) {
                var deferred = $q.defer();
                $http({
                    method: "post",
                    data: {code: code},
                    // todo
                    url: baseUrl + "iepolicy/test"
                }).success(function (data) {
                    deferred.resolve(data)
                }).error(function (data, status) {
                    deferred.reject(status); //请求失败
                });
                return deferred.promise;
            }

            /**
             * 城市码转换后处理
             */
            function cityCodeHandler(data, code) {
                if ($scope.isChangeArea) {// 当前城市码查看区域代码
                    if (code == 0) {
                        $scope.data.depCities = $scope.data.depCitiesElder;
                    } else if (code == 1) {
                        $scope.data.arrCities = $scope.data.depCitiesElder;
                    } else if (code == 2) {
                        $scope.data.depCitiesForbid = $scope.data.depCitiesElder;
                    } else if (code == 3) {
                        $scope.data.arrCitiesForbid = $scope.data.depCitiesElder;
                    }
                } else { // 当前区域代码查看城市代码
                    if (code == 0) {
                        $scope.data.depCities = data;
                    } else if (code == 1) {
                        $scope.data.arrCities = data;
                    } else if (code == 2) {
                        $scope.data.depCitiesForbid = data;
                    } else if (code == 3) {
                        $scope.data.arrCitiesForbid = data;
                    }
                }

            }

            /**
             * 获取数据
             */
            function getData(id) {
                var deferred = $q.defer();
                showLoading();
                $http.post(IFGAPIService.ifgBaseUrl + "iepolicy/detailById", {id: id})
                    .success(function (data) {
                        hideLoading();
                        deferred.resolve(data)
                    }).error(function (data) {
                    hideLoading();
                    deferred.reject(data); //请求失败
                });

                return deferred.promise;
            }

            /**
             * 编辑/复制时处理数据以渲染页面
             */
            function handleData(data) {
                _.each(data, function (item, key) {
                    if (typeof item == "number") {
                        data[key] = item + "";
                    }
                });
                $scope.data = data;
                $scope.isCabinRestrict = $scope.data.cabinRestrict == 'ALL';
                saleHandler();
                goDateRestrictHandler();
                goDateRestrictForbidHandler();
                // 往返时处理回程旅行日期和回程排除旅行日期
                if (data.travelTypeRestrict == 0 || data.travelTypeRestrict == 2) {
                    returnDateRestrictHandler();
                    returnDateRestrictForbidHandler();
                }
                passengerTypeHandler();
                // autoTicketingHandler();
                commonFunc.beforeClear(data);
            }

            /**
             * 通用函数
             */
            var commonFunc = {
                /**
                 * 数据清理, 清楚不必要的级联数据
                 */
                beforeClear: function (data) {
                    if (data.authorizeOfficeCode) {
                        delete data.authorizeOfficeCode;
                    }
                    if (data.canRt != 1) {
                        delete data.canGroupFilecode;
                    }
                    if (data.transferTypeRestrict != 1) {
                        delete data.transferCities;
                    }
                    if (data.travelTypeRestrict == 1) {
                        delete data.canGroupFilecode;
                        delete data.returnDateRestrictValue;
                        delete data.restrictReturnForbidValue;
                    }
                    if(!$scope.passengerTypeObj.student)
                    {
                        delete data.age;
                        delete data.nationality;
                    }
                    if (!$scope.passengerTypeObj.child) {
                        delete data.saleRebaseChild;
                        delete data.saleRetentionChild;
                        delete data.saleRebaseChildPri;
                        delete data.saleRetentionChildPri;
                    }
                    if (data.privateFlag != 2) {
                        delete data.saleRebasePri;
                        delete data.saleRetentionPri;
                        delete data.saleRebaseChildPri;
                        delete data.saleRetentionChildPri;
                    }
                    if (data.privateFlag == 2) {
                        delete data.externalId;
                    }
                    if (data.privateFlag == 0) {
                        delete data.refundChangePercent;
                    }
                    if (data.bookingChannel != 1) {
                        delete data.officeNo;
                    }
                    if (data.canConnectAirline != 1) {
                        delete data.connectAirline;
                        delete data.connectAirlineForbid;
                    }
                },
                /**
                 * 大写
                 */
                upperCase: function (data) {
                    if (data.airline) {
                        data.airline = data.airline.toUpperCase();
                    }
                    if (data.depCities && typeof(data.depCities) == 'string') {
                        data.depCities = data.depCities.toUpperCase();
                    }
                    if (data.arrCities && typeof(data.arrCities) == 'string') {
                        data.arrCities = data.arrCities.toUpperCase();
                    }
                    if (data.depCitiesForbid) {
                        data.depCitiesForbid = data.depCitiesForbid.toUpperCase();
                    }
                    if (data.arrCitiesForbid) {
                        data.arrCitiesForbid = data.arrCitiesForbid.toUpperCase();
                    }
                    if (data.cabinRestrict) {
                        data.cabinRestrict = data.cabinRestrict.toUpperCase();
                    }
                    if (data.transferCities) {
                        data.transferCities = data.transferCities.toUpperCase();
                    }
                    if (data.flightRestrict) {
                        data.flightRestrict = data.flightRestrict.toUpperCase();
                    }
                    if (data.flightRestrictForbid) {
                        data.flightRestrictForbid = data.flightRestrictForbid.toUpperCase();
                    }
                    if (data.connectAirline) {
                        data.connectAirline = data.connectAirline.toUpperCase();
                    }
                    if (data.connectAirlineForbid) {
                        data.connectAirlineForbid = data.connectAirlineForbid.toUpperCase();
                    }
                },
                /**
                 * 清理数字前的0
                 */
                clearFirstZero: function (data) {
                    if (/^\d+$/.test(data.advanceSaleDate)) {
                        data.advanceSaleDate = parseInt(data.advanceSaleDate, 10);
                    }

                    if (/^\d+$/.test(data.agentFee)) {
                        data.agentFee = parseInt(data.agentFee, 10);
                    }

                    if (/^\d+(\.\d+){0,1}$/.test(data.saleRetention)) {
                        data.saleRetention = parseFloat(data.saleRetention, 10);
                    }

                    if (/^\d+$/.test(data.saleRebase)) {
                        data.saleRebase = parseInt(data.saleRebase, 10);
                    }

                    if (/^\d+(\.\d+){0,1}$/.test(data.saleRetentionChild)) {
                        data.saleRetentionChild = parseFloat(data.saleRetentionChild, 10);
                    }

                    if (/^\d+$/.test(data.saleRebaseChild)) {
                        data.saleRebaseChild = parseInt(data.saleRebaseChild, 10);
                    }

                    if (data.privateFlag == 2) {
                        if (/^\d+(\.\d+){0,1}$/.test(data.saleRetentionPri)) {
                            data.saleRetentionPri = parseFloat(data.saleRetentionPri, 10);
                        }

                        if (/^\d+$/.test(data.saleRebasePri)) {
                            data.saleRebasePri = parseInt(data.saleRebasePri, 10);
                        }

                        if (/^\d+(\.\d+){0,1}$/.test(data.saleRetentionChildPri)) {
                            data.saleRetentionChildPri = parseFloat(data.saleRetentionChildPri, 10);
                        }

                        if (/^\d+$/.test(data.saleRebaseChildPri)) {
                            data.saleRebaseChildPri = parseInt(data.saleRebaseChildPri, 10);
                        }
                    }

                    if (/^\d+$/.test(data.invoiceFee)) {
                        data.invoiceFee = parseInt(data.invoiceFee, 10);
                    }
                }
            };

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

            /**
             * 关闭
             */
            $scope.closeClick = function ($ele) {
                window.close();
            };


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
            };

            $scope.pageShow = true;
        }]);
    angular.bootstrap(document, ["ifgApp"])
});
