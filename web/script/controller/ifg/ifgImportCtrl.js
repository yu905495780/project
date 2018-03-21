/**
 * 导入
 */
define([
    "config/ifgConfig",
    "service/ifg/ifgAPIService",
    "service/ifg/ifgJumpService",
    "filter/ifgToTrustFilter"
], function (app) {
    app.controller("ifgImportCtrl", ["$scope", "$http", "$location", "$filter", "$q", "$stateParams", "$timeout", "IFGAPIService", "IFGJumpService", "uiUploader",
        function ($scope, $http, $location, $filter, $q, $stateParams, $timeout, IFGAPIService, IFGJumpService, uiUploader, undefined) {
            $scope.acceptType = "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            $scope.ierrMsg = [];
            $scope.isImport = false;
            $scope.isFinished = false;
            // 删除选中的文件
            $scope.btn_remove = function (file) {
                if ($scope.isImport) {
                    return;
                }
                uiUploader.removeFile(file);
                $scope.isFinished = false;
            };

            // 更新新选择的文件
            $scope.files = [];
            var element = document.getElementById('file1');
            element.addEventListener('change', function ($event) {
                var files = $event.target.files;

                uiUploader.removeAll(); // 需要变更，单个文件上传

                uiUploader.addFiles(files);
                $scope.files = uiUploader.getFiles();
                $scope.isFinished = false;
                $scope.ierrMsg.length = 0;
                $scope.$apply();
            });


            // 导入、文件上传
            $scope.btn_upload = function () {
                $scope.isFinished = false;
                var TotalNum = uiUploader.files.length,
                    FinishNum = 0; // 多个文件上传会触发多次onCompleted

                if (beforeImport()) {
                    $scope.isImport = true;

                    uiUploader.startUpload({
                        url: IFGAPIService.ifgBaseUrl + "iepolicy/upLoad",
                        headers: {
                            'Accept': 'application/json'
                        },
                        concurrency: 2,
                        onProgress: function (file) {
                            $scope.$apply();
                        },
                        onCompleted: function (file, responseText) {
                            var response = JSON.parse(responseText || "{}");
                            $scope.isImport = false;
                            if (response.success) {
                                $scope.isFinished = true;
                                $scope.successMsg = response.data;
                            } else {
                                $scope.ierrMsg.length = 0;
                                $scope.ierrMsg.push({ "msg": _.map(response.errMsg, function (item) { return item; }).join("<br>") || "上传失败" });
                            }
                            uiUploader.removeAll();
                            $scope.$apply();
                            document.forms['fileUploader'].reset();
                        },
                        onError: function (e) {
                            $scope.ierrMsg.length = 0;
                            $scope.ierrMsg.push({ "msg": "上传异常" });
                            $scope.isImport = false;
                            $scope.$apply();
                            document.forms['fileUploader'].reset();
                        }
                    });
                }
            };

            /*
             * 导入之前，文件大小和数量验证
             */
            function beforeImport() {
                $scope.ierrMsg = [];

                if (uiUploader.files.length == 0) {
                    $scope.ierrMsg.push({ "msg": "请先选择文件" });
                } else if (uiUploader.files.length > 3) {
                    $scope.ierrMsg.push({ "msg": "选择文件超过3个" });
                } else {
                    for (var idx = 0; idx < uiUploader.files.length; idx++) {
                        if (uiUploader.files[idx].size > 5242880) {  // 5MB
                            $scope.ierrMsg.push({ "msg": uiUploader.files[idx].name + "的大小超过5MB" });
                            break;
                        }
                    }
                }
                return $scope.ierrMsg.length <= 0;

            }

        }]);
    angular.bootstrap(document, ["ifgApp"])
});