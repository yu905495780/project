/**
 * 明细
 */
define([
    "config/ifpConfig",
    "service/ifpAPIService",
    "service/ifpJumpService",
    "filter/toTrustFilter",
], function (app) {
    app.controller("ifpShowCtrl", ["$rootScope", "$scope", "$http", "$location", "$filter", "$q", "$stateParams", "$timeout", "$uibModal", "IFPAPIService", "IFPJumpService",
        function ($rootScope, $scope, $http, $location, $filter, $q, $stateParams, $timeout, $uibModal, IFPAPIService, IFPJumpService, undefined) {
            var searchParam = $location.search(),
                ctrlPage = searchParam["ctrl"];

            var id = searchParam["id"],
                baseUrl = IFPAPIService.ifpBaseUrl,
                isDouble = _.indexOf(["ifpShowDouble", "ifpOriginDouble"], ctrlPage) > -1,
                isOrigin = _.indexOf(["ifpOrigin", "ifpOriginDouble"], ctrlPage) > -1;
            // previous id 
            var preId = searchParam['preId']

            $scope.isDouble = isDouble;
            $scope.isOrigin = isOrigin;


            $scope.data = {};
            if (isOrigin) {
                document.title = "私有运价-修改后数据";
                // var origonDefer = getOriginData(id);
                // origonDefer.then(function (data) {
                //     $rootScope.showLoading = false;
                //     if (data && data.success) {
                //         if (data.data) {
                //             angular.extend($scope.data, handlerData(data.data));
                //             $timeout(cityTextAreaHeightHandler);
                //         } else {
                //             alert(_.map(data.errMsg, function (item) {
                //                 return item;
                //             }).join("<br>") || "未查询到数据").then(function () {

                //             });
                //         }

                //     } else {
                //         alert(_.map(data.errMsg, function (item) { return item }).join("<br>") || "未查询到数据").then(function () {
                //             IFPJumpService.login(data);
                //         });
                //     }
                // }, function (status) {
                //     $rootScope.showLoading = false;
                //     if (status == -1) {
                //         alert("请求超时");
                //     } else {
                //         alert("网络错误");
                //     }
                // })
                fetchOrderDetailP()
                  .then(function(data){
                    // error
                    // if(data[0].errMsg || data[1].errMsg){
                    //   var errStr = _.compact([].concat(data[0].errMsg, data[1].errMsg)).join(',')
                    //   throw Error(errStr)
                    // }
                    return processData(data.data)
                  }).then(function(data){
                    angular.extend($scope.data, data);
                    $timeout(cityTextAreaHeightHandler);
                  }).catch(function(err){
                    if (err == -1) {
                      alert("请求超时");
                    } else {
                      alert( err.message || "网络错误");
                    }
                  }).finally(function(){
                    $rootScope.showLoading = false;
                  })

            } else {
                document.title = "私有运价-详情";
                var dataDefer = getData(id);
                dataDefer.then(function (data) {
                    $rootScope.showLoading = false;
                    if (data && data.success) {
                        if (data.data) {
                            var _data = handlerData(data.data)
                            // 兼容模板中的 data._new
                            _data._new = _data
                            angular.extend($scope.data, _data);
                            $scope.data.logs = data.operateLog;
                            $timeout(cityTextAreaHeightHandler);
                        } else {
                            alert(_.map(data.errMsg, function (item) {
                                return item;
                            }).join("<br>") || "未查询到数据").then(function () {

                            });
                        }

                    } else {
                        alert(_.map(data.errMsg, function (item) { return item }).join("<br>")).then(function () {
                            IFPJumpService.login(data);
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
                    data: { id: id },
                    url: baseUrl + "policy/queryById",
                    timeout: 10000,
                }).success(function (data) {
                    deferred.resolve(data)
                }).error(function (data, status) {
                    deferred.reject(status); //请求失败
                });

                false && $timeout(function () {
                    deferred.resolve({ success: !0, data: { bCanRt: 1, canGroupFileCode: "abc", canRetStay: 1, minStay: "1D", maxStay: "3D", weekRestrictReturn: "1,2,3,4,5,6,7", changeFeeRet: 500, canRefundPartUnused: 1, refundFeePartUnused: 500, id: 0, mainFileGroupCode: "abc", productType: 0, stockType: 0, airline: "CA", addressOption: 2, depCities: "BJS", isTransfer: 1, transferCities: "SHA", arrCities: "HKG", cabin: "Y", grade: 1, segmentFlightAllow: "CA0001-0999", segmentFlightDeny: "CA1000-1999", canDepStay: 1, saleStart: "2016-10-01", saleEnd: "2016-11-01", dateRestrictGo: "2016-11-15>2016-11-25", dateRestrictGoForbid: "2016-12-01>2016-12-10,2016-12-20>2016-12-25", advancedSaleDate: 5, weekRestrictGo: "1/2/3/4/5/6/7", minPeopleNum: 1, maxPeopleNum: 9, passengerType: "1,2", filePrice: 1500, filePriceChild: 1e3, currency: "1", saleRetention: .0299, saleRebase: -100, reserveType: 1, officeNo: "abc,abc", canReimbursementVoucher: 0, canChange: "1", canChangeRet: "1", changeFeeDep: 500, canRefund: 1, refundFeeAllUnused: 500, noShowRestrict: 1, noShowFee: 500, noShowRemark: "abc", buyTicketNotice: "abc", luggageType: 1, luggageWeightsBags: 10,singleLuggageWeight:2, canInvalid: 1, invalidFee: 500, remark: "abc", status: 0, travelType: 1, agentId: 0 }, errMsg: { ErrorColumn: "ErrorMessage" } });
                }, 3000);
                return deferred.promise;
            }

            /**
             * 获取操作记录的原始数据
             */
            function getOriginData(rowkey) {

                var deferred = $q.defer();
                $http({
                    method: "post",
                    data: { "originId": rowkey },
                    url: baseUrl + "policy/originData",
                    timeout: 10000
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (data, status) {
                    deferred.reject(status);
                })
                return deferred.promise;
            }


            /**
             * 处理数据, 方便页面渲染
             */
            function handlerData(data) {

                //#region 状态
                var result = {};
                var status = { "0": "已挂起", "1": "投放中", "2": "已删除", "3": "已失效" },
                    statusStyle = { "0": "text-primary", "1": "text-success", "2": "text-danger", "3": "text-muted" };
                result.status = status[data.status + ""];
                result.statusStyle = statusStyle[data.status + ""];
                //#endregion

                result.id = data.id;
                result.mainFileGroupCode = data.mainFileGroupCode;//文件编号
                result.externalId = data.externalId;//外部政策ID
                result.productType = { "0": "直销", "2": "特惠", "1": "清舱产品" }[data.productType];//产品类型
                result.stockType = { "0": "见舱" }[data.stockType];//库存类型

                result.bCanRt = { "1": "是", "0": "否" }[data.bCanRt];//是否允许混仓
                if (data.bCanRt == 1) {
                    result.canGroupFileCode = data.canGroupFileCode; //可组文件编号
                }

                result.airline = data.airline;//开票航司
                result.addressOption = { "1": "机场", "2": "城市" }[data.addressOption];//录入方式
                result.depCities = data.depCities;//出发地啊
                result.isTransfer = { "1": "是", "0": "否" }[data.isTransfer];//是否支持中转
                if (data.isTransfer) {
                    result.transferCities = data.transferCities;//中转城市
                }
                result.arrCities = data.arrCities;//目的地
                result.cabin = data.cabin;//舱位
                result.grade = { "1": "经济", "2": "超值经济", "3": "公务", "4": "头等" }[data.grade];//舱位等级 2016-11-04未使用
                result.segmentAirlines = data.segmentAirlines;// v1.5 航司组合
                result.segmentFlightAllow = data.segmentFlightAllow || "无限制";//可售航班
                result.segmentFlightDeny = data.segmentFlightDeny || "无限制";//禁售航班
                result.canDepStay = { "0": "不允许", "1": "允许" }[data.canDepStay];//是否允许(去程)中途停留
                result.canRetStay = { "0": "不允许", "1": "允许" }[data.canRetStay];//是否允许返程中途停留
                result.sale = data.saleStart + " 至 " + data.saleEnd;//销售日期
                result.dateRestrictGo = data.dateRestrictGo.split(">").join(" 至 ");//允许旅行日期

                result.dateRestrictGoForbid = [];//禁止旅行日期
                if (data.dateRestrictGoForbid.trim()) {
                    var dateRestrictGoForbids = data.dateRestrictGoForbid.split(",");
                    _.each(dateRestrictGoForbids, function (item, index) {
                        result.dateRestrictGoForbid.push(item.replace(">", " 至 "));
                    });
                }

                if (isDouble) {
                    result.dateRestrictReturn = data.dateRestrictReturn.split(">").join(" 至 ");//回程允许旅行日期

                    result.dateRestrictReturnForbid = [];//禁止旅行日期
                    if (data.dateRestrictReturnForbid.trim()) {
                        var dateRestrictReturnForbids = data.dateRestrictReturnForbid.split(",")
                        _.each(dateRestrictReturnForbids, function (item, index) {
                            result.dateRestrictReturnForbid.push(item.replace(">", " 至 "));
                        });
                    }
                }

                if (data.advancedSaleDate) {
                    result.advancedSaleDate = data.advancedSaleDate + "天";//提前出票天数
                }

                result.timeLimitType = {"0" : "支付成功后", "1" : "航班起飞前"}[data.timeLimitType];
                result.limitTime = data.limitTime;
                result.minStay = data.minStay;//最长停留天数
                result.maxStay = data.maxStay;//最长停留天数
                result.weekRestrictGo = data.weekRestrictGo;//去程班期限制
                result.weekRestrictReturn = data.weekRestrictReturn;//去程班期限制
                result.minPeopleNum = data.minPeopleNum;//最小出行人数
                result.maxPeopleNum = data.maxPeopleNum;//最大出行人数

                var passengerTypes = data.passengerType.split(","),
                    passengerTypeArr = [];
                var passengerEnum = { "1": "普通成人", "0": "儿童", "2": "学生" };
                _.each(passengerTypes, function (item, index) {
                    passengerTypeArr.push(passengerEnum[item]);
                });
                result.passengerType = passengerTypeArr.join(" ");//适用乘客类型

                result.filePrice = data.filePrice;//成人销售票面
                if (_.indexOf(passengerTypes, "0") >= 0) {
                    result.filePriceChild = data.filePriceChild;//儿童销售票面
                }
                result.currency = { "CNY": "人民币" }[data.currency];//币种
                result.saleRetention = data.saleRetention + "%";//返点
                result.saleRebase = data.saleRebase;

                result.reserveType = { "1": "同程预订", "2": "已绑定配置预订" }[data.reserveType];//预订配置
                result.reserveTypeId = data.reserveType;
                if (data.reserveType == 1) {
                    result.officeNo = data.officeNo;
                }
                if (false && data.reserveType == 1) {
                    var officeNos = data.officeNo.split(",");
                    result.officeNo1 = officeNos[0];//授权office
                    result.officeNo2 = officeNos[1];
                }


                result.canReimbursementVoucher = { "1": "发票", "0": "行程单" }[data.canReimbursementVoucher];//报销凭证

                result.canChange = { "0": "不允许", "1": "允许" }[data.canChange];//去程是否允许改期
                if (data.canChange == 1) {
                    result.changeFeeDep = data.changeFeeDep || "";//(去程)改期费
                }

                result.canChangeRet = { "0": "不允许", "1": "允许" }[data.canChangeRet];//返程是否允许改期
                if (data.canChangeRet == 1) {
                    result.changeFeeRet = data.changeFeeRet || "";//回程改期费
                }

                result.canRefund = { "0": "不允许", "1": "允许" }[data.canRefund];//未使用是否允许退票
                if (data.canRefund == 1) {
                    result.refundFeeAllUnused = data.refundFeeAllUnused;//退票费
                }

                result.canRefundPartUnused = { "0": "不允许", "1": "允许" }[data.canRefundPartUnused];//部分未使用是否允许退票
                if (data.canRefundPartUnused == 1) {
                    result.refundFeePartUnused = data.refundFeePartUnused;//部分未使用是否允许退票
                }

                result.noShowRestrict = { "0": "不允许", "1": "允许" }[data.noShowRestrict];//是否允许NOSHOW
                if (data.noShowRestrict == 1) {
                    result.noShowFee = data.noShowFee || "不涉及";//noshow费
                    result.noShowRemark = data.noShowRemark || "不涉及";//NOSHOW说明
                }

                result.buyTicketNotice = data.buyTicketNotice || "不涉及";//购票须知

                result.luggageType = { "1": "KG/公斤", "2": "PC/件数" }[data.luggageType];//行李规格
                result.luggageWeightsBags = data.luggageWeightsBags;//行李额
                result.singleLuggageWeight=data.singleLuggageWeight;//行李限重

                result.canInvalid = { "1": "允许", "0": "不允许" }[data.canInvalid];//当日作废
                if (data.canInvalid == 1) {
                    result.invalidFee = data.invalidFee;//废票费
                }
                result.remark = data.remark;//备注

                return result;
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

            $scope.originShowClick = function (log) {
                var url = "./ifpShow.html?ctrl=" + (isDouble ? "ifpOriginDouble" : "ifpOrigin") + "&id=" + encodeURIComponent(log.rowKey)
                url += '&preId=' + encodeURIComponent(log.rowKeyBefore)
                window.open(url);
            }
            $(window).on("resize", function () {
                cityTextAreaHeightHandler();
            });
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
            //#endregion
            $rootScope.showLoading = true;

            /**
             * fetch order detail
             */
            function fetchOrderDetailP(){
            //   return $q.all([getOriginData(preId), getOriginData(id)])
              var deferred = $q.defer();
              $http({
                method: 'post',
                data: {rowKeyBefore: preId, rowKey: id},
                url: baseUrl + 'policy/compareLog',
                timeout: 10000
              }).success(function(data){
                if(data && data.success){
                  deferred.resolve(data)
                }else{
                  deferred.reject(Error(_.values(data.errMsg).join('\n')))
                }
              }).error(function(err){
                deferred.reject(err)
              })
              return deferred.promise
            }

            /**
             * diff data
             * @param {Object} oldData 
             * @param {Object} newData 
             */
            function diff(oldData, newData){
              var diffs = {}  
              var newDataKeys = _.keys(newData)
              _.forEach(oldData, function(val, key){
                // dont care performance
                if(!_.isEqual(val, newData[key])){
                  diffs[key] = newData[key]
                }
              })
              
              _.forEach(newDataKeys, function(val){
                if(!oldData.hasOwnProperty(val)){
                  diffs[val] = newData[val]
                }
              })

              return diffs
            }

            /**
             * process data
             * @param {Object} data 
             */
            function processData(data){
            //   var oldData = handlerData(data[0].data)
            //   var newData = handlerData(data[1].data)
              var oldData = handlerData(data.rowKeyBefore)
              var newData = handlerData(data.rowKey)

              var diffs = diff(oldData, newData)
              
              return _.extend(oldData, {_new: newData, _diffs: diffs})
            }
        }]);
    angular.bootstrap(document, ["ifpApp"]);
});