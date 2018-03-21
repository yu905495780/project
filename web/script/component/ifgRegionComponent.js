define([
    "config/ifgConfig",
], function (app) {
    app.component("ifgRegion", {
        bindings: {
            ztree: '<',
            preinfo: '<',
            typecode: '<',
            saveclick: '&',
            cancelclick: '&',
        },
        /*controller: [""],*/ //接数据后
        controller: ['$scope', function ($scope) {
            // debugger;
            var setting = {
                check: {
                    enable: true,
                    chkboxType: {"Y": "s", "N": "s"}
                },
                view: {
                    showIcon: false
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onCheck: function (event, treeId, treeNode) {
                        var currentTree = treeNode;
                        setCheck(treeNode);
                        $(currentTree).bind("change", setCheck);

                    }
                },
            };
            var zNodes = this.ztree;
            var ctrl = this;
            //初始化列表
            $.fn.zTree.init($("#zTreeDemo"), setting, zNodes);

            /**
             * 处理上次勾选数据
             */

            var zTree = $.fn.zTree.getZTreeObj("zTreeDemo");
            var preInfo = ctrl.preinfo;
            if (zTree && zTree !== null) {
                var pNodes = zTree.getNodes();
                var allNodes = zTree.transformToArray(pNodes);
                for (var item in allNodes) {
                    for (var i in preInfo) {
                        if (preInfo[i].id == allNodes[item].id) {
                            zTree.checkNode(allNodes[item], true, true);
                            if (preInfo[i].id == 1) disabledNodes(preInfo[i]);
                        } else {
                            continue;
                        }
                    }
                }
            }

            /*
            * 保存按钮,过滤掉父层级下层数据
            * */
            $scope.saveclick = function () {
                var zTree = $.fn.zTree.getZTreeObj("zTreeDemo");
                var selNodes = zTree.getCheckedNodes();
                var outputArray = [];
                var cityCode = [];
                cityCode.push(ctrl.typecode);
                for (var item in selNodes) {
                    var parentNode = selNodes[item].getParentNode();
                    if (parentNode && parentNode.checked) {
                        continue;
                    }
                    else if (selNodes[item].id !== 1) {
                        /*  var _obj = selNodes[item];
                          if(_obj.pid == null) _obj.pid = 0;
                          outputArray.push(_obj);*/
                        var _obj = selNodes[item] && selNodes[item].name;
                        outputArray.push(_obj);
                    } else {
                        /*  var _obj = selNodes[item];
                          if(_obj.pid == null) _obj.pid = 0;
                          outputArray.push(_obj);*/
                        var _obj = selNodes[item] && selNodes[item].name;
                        outputArray.push(_obj);
                    }
                }
                ;
                ctrl.saveclick({selectInfo: outputArray.toString(), typeCode: cityCode, preInfo: selNodes});
            };

            /**
             * 取消选择
             * */
            $scope.cancelclick = function () {
                ctrl.cancelclick();
            };


            /*
             *check事件
             * */
            function setCheck(treeNode) {
                var zTree = $.fn.zTree.getZTreeObj("zTreeDemo");
                var selectNodes = zTree.getCheckedNodes();
                $scope.selectNodes = selectNodes;
                disabledNodes(treeNode);
            }

            /*
            *全球勾选状态下，禁止勾选其他项
            * */

            function disabledNodes(treeNode) {
                var crtNode = treeNode;
                var zTree = $.fn.zTree.getZTreeObj("zTreeDemo");
                var nodes = zTree.getNodesByFilter(filter),
                    parNode = crtNode.getParentNode();
                for (var i = 0, len = nodes.length; i < len; i++) {
                    if (crtNode.checked && crtNode.id == 1) {
                        zTree.setChkDisabled(nodes[i], true)
                    } else if (!treeNode.checked && treeNode.id == 1) {
                        zTree.setChkDisabled(nodes[i], false);
                    }
                }
                if (!crtNode.checked && parNode) {
                    zTree.checkNode(parNode, false);
                    if (parNode.getParentNode()) zTree.checkNode(parNode.getParentNode(), false);
                }
            }

            /*
            * 过滤获取除全球以外的全部数据
            * */
            function filter(node) {
                return (node.id !== 1);
            }
        }],
        templateUrl: "templates/ifgRegionTmpl.html",
    })
})