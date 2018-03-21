<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<!DOCTYPE html PUBLIC "-//W3C//Dth HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dth">
<html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="http://cdn.static.runoob.com/libs/bootstrap/3.3.7/css/bootstrap.min.css">
    <script src="http://cdn.static.runoob.com/libs/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script src="http://cdn.static.runoob.com/libs/jquery/2.1.1/jquery.min.js"></script>
    <title>Title</title>
</head>
<body>
<ul id="myButtons1" class="bs-example" style="float: right" >
    <button type="reset" class="btn btn-primary" onclick="search()">刷新</button>
    <button type="button" class="btn btn-primary" onclick="createFunction()">创建Access Key</button>
</ul><br><br>

<div ng-app="" ng-controller="studentController">
    <table class="table table-hover">
        <tr  bgcolor="#f0f8ff">
            <th>AccessKey ID     </th>
            <th>AccessKey Secret </th>
            <%--<th>状态             </th>--%>
            <th>创建时间         </th>
            <th>操作             </th>
        </tr>
        <tbody id="table">

        </tbody>
        <%--<tr ng-repeat="subject in student.subjects">--%>
            <%--<td>{{ subject.AccesskeyID }}</td>--%>
            <%--<td><font color="#ffd700">{{ subject.AccesskeyScrect }}</font></td>--%>
            <%--<td><font color="#7fff00">{{ subject.status }}</font></td>--%>
            <%--<td>{{ subject.data }}</td>--%>
            <%--<td><button type="button" class="btn btn-primary" onclick="ddelete()">删除</button>--%>
                <%--<input type="hidden" id="id" value="{{ subject.id }}"/>--%>
            <%--</td>--%>
        <%--</tr>--%>

    </table>
</div>
<script>

    window.onload = function () {
        search();
    };

    function createFunction() {
        $.ajax({
            url:"/ifp/access/create",
            success:function (data) {
                search();
            }
        });

    }

    function ddelete(index) {
        //点击删除键，获取当前的AccessKeyID值
//        $http.post("/ifp/access/delete",$scope.id);//去controller中找delete方法
        var id = $("#id" + index).val();
        $.ajax({
            url:"/ifp/access/delete",
            data: {
                id : id
            },
            success:function (data) {
                search();
            },//成功的话返回查询的结果
            error:function(data){ //失败返回信息
                alert(data.msg);
            }
        });
        // 刷新表格
        search();
    }
    function search() {
        var html = "";
        $.ajax({
            url:"/ifp/access/search",
            success:function (data) {
                $.each(data.data, function (index, item) {
                    html = html +  '<tr><td>'+ item.accessKeyId+'</td><td>'+item.accessKeySecret+'</td><td>'+item.gmtCreate+'</td>' +
                            '<td><button type="button" class="btn btn-primary" onclick="ddelete('+index+') " >删除</button><input id="id'+index+'" type="hidden" value="'+
                            item.id +
                            '"/></td></tr>';
                });
                $("#table").html(html);
            }
        });
    }
</script>
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.15/angular.min.js"></script>
</body>
</html>