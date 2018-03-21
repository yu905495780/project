function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return decodeURIComponent(r[2]);
    return null;
}

uid = GetQueryString("uid");

$(".head-left").click(function () {
    window.history.back();
});

//   判断服务器是微信还是QQ
function funServer(funServer, funServerhtml) {
    var funServerhtml = "";
    if (funServer == "1") {
        funServerhtml = '<img src="../img/weChat@2x.png" alt="" class="server">';
    } else if (funServer == "2") {
        funServerhtml = '<img src="../img/QQ@2x.png" alt="" class="server">';
    }
    return funServerhtml;
}
function funServer1(funServer,funServerhtml) {
    var funServerhtml = "";
    if(funServer == "1"){
        funServerhtml = '(微信战队)';
    }else if(funServer == "2"){
        funServerhtml = '(QQ战队)';
    }
    return funServerhtml;
}
//   判断头像是否存在
function avatar1(avatar, avatarhtml) {
    if (avatar == null) {
        avatarhtml = '<img src="'+avatarUrl+'resource/sy_default_avatar_1.5.png" alt="" class="avatar">';
    } else {
        avatarhtml = '<img src="'+avatarUrl+'' + avatar + '" alt="" class="avatar">';
    }
    return avatarhtml;
}
//   判断是否有队员 队长页面
function teammen(teammen,teammenhtml){
    var teammenhtml = "";
    if(teammen.length != 0){
        for(var n = 0; n < teammen.length; n++){
            teammenhtml += '<li class="deta-li tetali-box" id="'+teammen[n].id+'"> <div class="detali-l"> <p class="avatar">'+avatar1(teammen[n].avatar, $(".avatar").innerHTML)+'</p> <p class="username">'+teammen[n].nickname+'</p> </div> <div class="detali-r">踢出</div> </li>';
        }
    }
    return teammenhtml
}
//   判断队员的uid-
function funuid(uid,id,detalirhtml){
    var detalirhtml = "";
    if(uid == id){
        detalirhtml = '<div class="detali-r">退出</div>';
    }
    return detalirhtml;
}
//   判断是否有队员 他人页面
function teammen1(teammen,teammenhtml,uid){
    var teammenhtml = "";
    if(teammen.length != 0){
        for(var n = 0; n < teammen.length; n++){
            teammenhtml += '<li class="deta-li tetali-box" id="'+teammen[n].id+'"> <div class="detali-l"> <p class="avatar">'+avatar1(teammen[n].avatar, $(".avatar").innerHTML)+'</p> <p class="username">'+teammen[n].nickname+'</p> </div> '+funuid(uid,teammen[n].id,$(".detali-r").innerHTML)+' </li>';
        }
    }
    return teammenhtml;
}
function teamber(relation,join){
    join = "";
    if(relation == "0"){
        join = "加入";
    }else if(relation == "1"){
        join = "已加入";
    }else if(relation == "2"){
        join = "已加入";
    }
    return join;
}

$.ajax({
        type: "post",
        async: true,
        url: apiUrl+"/activity/n/gloryOfKings/getTeamList?uid=" + uid + "&page=1&limit=1000",
        dataType: "json",
        success: function (data){
            var a = data.datas.gloryOfKingsTeamList;
//                console.log(a);
            var li;
            for (var i = 0; i < a.length; i++){
                li = $('<li class="team-li" id="' + a[i].id + '"> <div class="teamli-left"> <div class="avatar-box"> '+ avatar1(a[i].teamLeader.avatar, $('.avatar-box').innerHTML) + '' + funServer(a[i].platform, $("avatar-box").innerHTML) + ' </div> <div class="name"> <p class="team-name">' + a[i].name + '</p> <p class="captain">队长：<span>' + a[i].teamLeader.nickname + '</span></p> </div> </div> <div class="teamli-right"> <div class="num">' + a[i].memberNum + '</div> <div class="like"><p class="zan">点赞</p> <p><span class="praisenum"> ' + a[i].praiseNum + '</span>赞</p> </div> <div class="join">'+teamber(a[i].relation,$(".join").innerHTML)+'</div> </div> </li>');
                $(".search-ul").append(li);

                if (!a[i].myPraise){
                    $("#" + a[i].id).find(".like").one("click", function () {
                        $.post(apiUrl+"/activity/n/gloryOfKings/setPraise?uid=" + uid + "&teamId=" + $(this).parents("li").attr("id"),
                            function (data) {
//                                        console.log(data);
                            }
                            , "json");
                        var num = Number($(this).find(".praisenum").html());
                        $(this).find(".zan").html("已点赞");
                        $(this).find(".praisenum").html(num + 1);
                    });
                } else {
                    $("#" + a[i].id).find(".zan").html("已点赞");
                }
            }


            $(".join,.teamli-left").click(function () {
                $(".search-box").css("display", "none");
                $(".search-ul").html("");
                $.post(apiUrl+"/activity/n/gloryOfKings/getTeamDetails?uid=" + uid + "&teamId=" + $(this).parents("li").attr("id"),
                    function (data) {
                        var deta = data.datas.gloryOfKingsTeamDetails;
//                              console.log(deta);
                        if(uid == deta.teamLeader.id){
                            var div;
                            div = $('<div class="detail-box"><div class="header"> <div class="head"> <div class="head-left"><img src="../img/back1.png" alt="" class="back"></div> <div class="head-mid">战队列表</div> <div class="head-right"></div> </div> </div> <div class="detalis"> <div class="detalis-title"> <div class="deta-left"></div> <div class="deta-mid">' + deta.name + '<span style="font-size: 0.18rem">'+funServer1(deta.platform,$(".deta-mid").innerHTML)+'</span></div> <div class="deta-right">' + deta.memberNum + '</div> </div> <div class="brief-introduction"> <p class="brief-tit">战队简介 :</p> <p class="brief-txt">' + deta.summary + '</p> </div> <div class="deta-num"> <i>点赞排名：<span>' + deta.praiseIndex + '</span></i> <i>超过前一名还需要<span>' + deta.praiseDifference + '</span>个赞</i> <div class="give-thumbs-up"> <p class="like">点赞</p> <p class="likenum"><span class="praisenum">' + deta.praiseNum + '</span>赞</p> </div> </div> <ul class="deta-ul"> <li class="deta-li" id="'+deta.teamLeader.id+'"> <div class="detali-l"> <p class="avatar">' + avatar1(deta.teamLeader.avatar, $('.avatar-box').innerHTML) + '</p> <p class="username">' + deta.teamLeader.nickname + '</p> <p class="captain">队长</p> </div> <div class="detali-r delete">解散</div> </li> '+teammen(deta.teamMember,$(".deta-ul").innerHTML)+' </ul> </div> <ul class="informations"></ul> </div>');
                            $.get(apiUrl+"/activity/n/gloryOfKings/getTeamApply?teamId="+deta.id,function (data) {
                                var applicant = data.datas.gloryOfKingsTeamApply;
                                     // console.log(applicant);
                                var li;
                                for(var m = 0; m < applicant.length; m++){
                                    li = $('<li class="list"> <div class="list-box"><div class="list-left"> <div class="avatar-box">'+avatar1(applicant[m].avatar, $('.avatar-box').innerHTML)+'</div> <div class="name"><span class="username">'+applicant[m].nickname+'</span>加入了战队</div> </div> <div class="list-right"> <p class="agree" onclick="tt(this,'+uid+','+applicant[m].teamId+','+applicant[m].uid+',1,\''+applicant[m].avatar+'\',\''+applicant[m].nickname+'\')">同意</p> <p class="refuse" onclick="hh(this,'+uid+','+applicant[m].teamId+','+applicant[m].uid+',-1)">拒绝</p> </div></div><div class="list-wrap"><p class="wrap-tit">申请理由:</p><p class="wrap-txt">'+applicant[m].applyMessage+'</p></div> </li>');
                                    $(".informations").append(li);

                                }

                                $(".detali-r").each(function () {
                                    $(this).click(function () {
                                        _this = $(this);
                                        if(_this.html() == "解散"){
                                            del = '<div class="del-box"><div class="del-wrap"><p class="del-tit">神约提示您：</p><p class="del-txt">确认要解散战队？</p><p class="del-btn"><span class="del-n">取消</span><span class="del-y">确定</span></p></div></div>'
                                            $("body").append(del);
                                            $(".del-n").click(function () {
                                                $(".del-box").css("display","none")
                                            })
                                            $(".del-y").click(function () {
                                                window.location.reload();
                                                $.get(apiUrl+"/activity/n/gloryOfKings/leaveTeam?uid="+uid+"&teamId="+deta.id+"&type=2&leaveUid="+_this.parents(".deta-li").attr("id"),function (data) {
//                                                            console.log(data);
                                                })
                                            })
                                        }else if(_this.html() == "踢出"){
                                            del = '<div class="del-box"><div class="del-wrap"><p class="del-tit">神约提示您：</p><p class="del-txt">确认要踢出该队员？</p><p class="del-btn"><span class="del-n">取消</span><span class="del-y">确定</span></p></div></div>'
                                            $("body").append(del);
                                            $(".del-n").click(function () {
                                                $(".del-box").css("display","none")
                                            })
                                            $(".del-y").click(function () {
                                                $.get(apiUrl+"/activity/n/gloryOfKings/leaveTeam?uid="+uid+"&teamId="+deta.id+"&type=1&leaveUid="+_this.parents(".deta-li").attr("id"),function (data) {
//                                                            console.log(data);
//                                                            console.log(this);
                                                })
                                                $(".del-box").css("display","none")
                                                _this.parents(".deta-li").remove();
                                                var membernum = $(".deta-right").html().substr(0,1);
                                                $(".deta-right").html(membernum-1+"/5");
                                            })
                                        }
                                    })
                                })

                            });
                            $("body").append(div);
                        }else{
                            var div;
                            div = $('<div class="detail-box"><div class="header"> <div class="head"> <div class="head-left"><img src="../img/back1.png" alt="" class="back"></div> <div class="head-mid">战队列表</div> <div class="head-right"></div> </div> </div> <div class="detalis"> <div class="detalis-title"> <div class="deta-left"></div> <div class="deta-mid">' + deta.name + '<span style="font-size: 0.18rem">'+funServer1(deta.platform,$(".deta-mid").innerHTML)+'</span></div> <div class="deta-right">' + deta.memberNum + '</div> </div> <div class="brief-introduction"> <p class="brief-tit">战队简介 :</p> <p class="brief-txt">' + deta.summary + '</p> </div> <div class="deta-num"> <i>点赞排名：<span>' + deta.praiseIndex + '</span></i> <i>超过前一名还需要<span>' + deta.praiseDifference + '</span>个赞</i> <div class="give-thumbs-up"> <p class="like">点赞</p> <p class="likenum"><span class="praisenum">' + deta.praiseNum + '</span>赞</p> </div> </div> <ul class="deta-ul"> <li class="deta-li"> <div class="detali-l"> <p class="avatar">' + avatar1(deta.teamLeader.avatar, $('.avatar-box').innerHTML) + '</p> <p class="username">' + deta.teamLeader.nickname + '</p> <p class="captain">队长</p> </div> </li> '+teammen1(deta.teamMember,$(".deta-ul").innerHTML,uid,deta.teamMember.id)+' </ul> </div> <div class="join-btn">立即加入</div> <div class="mask"><div class="maskbox"><div class="mask-txt"><textarea id="area" placeholder="请输入您的段位、等级等信息让队长更了解你。" class="mask-inp" onkeyup="funkeyup()"></textarea><p class="mask-num"><span id="text-count">0</span> / 20</p></div><div class="yon"><span class="canael">取消</span><span class="confirm">确认</span></div></div></div> </div>');
                            $("body").append(div);

                            $(".join-btn").click(function () {
                                $(".mask").css("display","block");
                                $(".confirm").click(function () {
                                    $.post(apiUrl+"/activity/n/gloryOfKings/joinTeam?uid="+uid+"&teamId="+deta.id+"&applyMessage="+$(".mask-inp").val(),
                                        function (data) {
//                                                        console.log(data);
                                            if(data.code == -140){
                                                div = '<div class="success-box"> <div class="success"> <p class="success-tit">神约提示您：</p> <p class="success-txt">'+data.msg+'</p> <p class="success-btn">确定</p> </div> </div>'
                                                $("body").append(div);
                                                $(".success-btn").click(function () {
                                                    window.location.href="search-team.html?uid="+uid;
                                                })
                                            }else if(data.code == -144){
                                                div = '<div class="success-box"> <div class="success"> <p class="success-tit">神约提示您：</p> <p class="success-txt">'+data.msg+'</p> <p class="success-btn">确定</p> </div> </div>'
                                                $("body").append(div);
                                                $(".success-btn").click(function () {
                                                    window.location.href="search-team.html?uid="+uid;
                                                })
                                            }else if(data.code == 200){
                                                div = '<div class="success-box"> <div class="success"> <p class="success-tit">神约提示您：</p> <p class="success-txt">您的申请已提交，请等待队长的审核。</p> <p class="success-btn">确定</p> </div> </div>'
                                                $("body").append(div);
                                                $(".success-btn").click(function () {
                                                    window.location.href="search-team.html?uid="+uid;
                                                })
                                            }else if(data.code == -138){
                                                div = '<div class="success-box"> <div class="success"> <p class="success-tit">神约提示您：</p> <p class="success-txt">'+data.msg+'</p> <p class="success-btn">确定</p> </div> </div>'
                                                $("body").append(div);
                                                $(".success-btn").click(function () {
                                                    window.location.href="search-team.html?uid="+uid;
                                                })
                                            }
                                        });
                                    $(".mask").css("display","none");
                                });
                            });

                            $(".canael").click(function () {
                                $(".mask").css("display","none");
                            });
                            $(".success-btn").click(function () {
                                $(".success-box").css("display","none");
                            })
                            $(".detali-r").each(function () {
                                _this = $(this)
                                _this.click(function () {
                                    del = '<div class="del-box"><div class="del-wrap"><p class="del-tit">神约提示您：</p><p class="del-txt">确认要退出该战队？</p><p class="del-btn"><span class="del-n">取消</span><span class="del-y">确定</span></p></div></div>'
                                    $("body").append(del);
                                    $(".del-n").click(function () {
                                        $(".del-box").css("display","none")
                                    })
                                    $(".del-y").click(function () {
                                        $.get(apiUrl+"/activity/n/gloryOfKings/leaveTeam?uid="+uid+"&teamId="+deta.id+"&type=1&leaveUid="+_this.parents(".deta-li").attr("id"),function (data) {
//                                                  console.log(data);
//                                                  console.log(this);
                                        })
                                        $(".del-box").css("display","none")
                                        _this.parents(".deta-li").remove();
                                        var membernum = $(".deta-right").html().substr(0,1);
                                        $(".deta-right").html(membernum-1+"/5");
                                    })
                                })
                            })
                        }
                        if (!deta.myPraise) {
                            console.log(deta.myPraise);
                            $(".give-thumbs-up").one("click", function () {
                                $.post(apiUrl+"/activity/n/gloryOfKings/setPraise?uid=" + uid + "&teamId=" + deta.id,
                                    function (data) {
//                                             console.log(data);
                                    }
                                    , "json");
                                var num = Number($(this).find(".praisenum").html());
                                $(this).find(".like").html("已点赞");
                                $(this).find(".praisenum").html(num + 1);
                            });
                        } else {
                            $(".detail-box").find(".like").html("已点赞");
                        }
                        $(".back").click(function () {
                            $(this).parents(".detail-box").remove();
                            $(".search-box").css("display", "block");
                            window.location.reload();
                        });


                    });
            })
        }
    });


function funkeyup() {
    var $this = $("#area"),
        _val = $this.val(),
        count = "";
    if (_val.length > 20) {
        $this.val(_val.substring(0, 20));
    }
    count = 20 - $this.val().length;
    $("#text-count").text(count);
}
function myFunction() {
    var input = document.getElementById("myInput");
    var filter = input.value.toUpperCase();
    var li = document.getElementsByClassName("team-li");
    for (var i = 0; i < li.length; i++) {
        var username = li[i].getElementsByClassName("team-name")[0];
        if (username) {
            if (username.innerHTML.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }

        }
    }
}

function hh(t,uid,teamd,applyid,type) {
    del = '<div class="del-box"><div class="del-wrap"><p class="del-tit">神约提示您：</p><p class="del-txt">确认要拒绝该申请？</p><p class="del-btn"><span class="del-n">取消</span><span class="del-y">确定</span></p></div></div>'
    $("body").append(del);
    $(".del-n").click(function () {
        $(".del-box").css("display","none")
    });
    $(".del-y").click(function () {
        $.get(apiUrl+"/activity/n/gloryOfKings/proveJoinApply?uid="+uid+"&teamId="+teamd+"&applyUid="+applyid+"&type="+type,function (data) {
//                console.log(data);
//                console.log(this)
        });
        $(".del-box").css("display","none");
        $(t).parents(".list").remove();
    })
}
function tt(t,uid,teamd,applyid,type,appavat,appnike) {
    $.get(apiUrl+"/activity/n/gloryOfKings/proveJoinApply?uid="+uid+"&teamId="+teamd+"&applyUid="+applyid+"&type="+type,function (data) {
//            console.log(data);
        if(data.code == 200){
            var list = $('<li class="deta-li tetali-box" id="'+applyid+'"> <div class="detali-l"> <p class="avatar">'+avatar1(appavat, $(".avatar").innerHTML)+'</p> <p class="username">'+appnike+'</p> </div> <div class="detali-r">踢出</div> </li>')
            $(".deta-ul").append(list);
            var membernum = $(".deta-right").html().substr(0,1);
            $(".deta-right").html(parseInt(membernum)+parseInt(1)+"/5");
            $(".detali-r").click(function () {
                _this = $(this);
                if(_this.html() == "解散"){
                    del = '<div class="del-box"><div class="del-wrap"><p class="del-tit">神约提示您：</p><p class="del-txt">确认要解散战队？</p><p class="del-btn"><span class="del-n">取消</span><span class="del-y">确定</span></p></div></div>'
                    $("body").append(del);
                    $(".del-n").click(function () {
                        $(".del-box").css("display","none")
                    })
                    $(".del-y").click(function () {
                        window.location.reload();
                        $.get(apiUrl+"/activity/n/gloryOfKings/leaveTeam?uid="+uid+"&teamId="+teamd+"&type=2&leaveUid="+_this.parents(".deta-li").attr("id"),function (data) {
//                                                console.log(data);
                        })
                    })
                }else if(_this.html() == "踢出"){
                    del = '<div class="del-box"><div class="del-wrap"><p class="del-tit">神约提示您：</p><p class="del-txt">确认要踢出该队员？</p><p class="del-btn"><span class="del-n">取消</span><span class="del-y">确定</span></p></div></div>'
                    $("body").append(del);
                    $(".del-n").click(function () {
                        $(".del-box").css("display","none")
                    })
                    $(".del-y").click(function () {
                        $.get(apiUrl+"/activity/n/gloryOfKings/leaveTeam?uid="+uid+"&teamId="+teamd+"&type=1&leaveUid="+_this.parents(".deta-li").attr("id"),function (data) {
//                                                console.log(data);
//                                                console.log(this);
                        })
                        $(".del-box").css("display","none")
                        _this.parents(".deta-li").remove();
//                                            console.log("123")
                        var membernum = $(".deta-right").html().substr(0,1);
                        $(".deta-right").html(membernum-1+"/5");
                    })
                }
            })
        }else if(data.code == -149){
            div = '<div class="success-box"> <div class="success"> <p class="success-tit">神约提示您：</p> <p class="success-txt">'+data.msg+'</p> <p class="success-btn">确定</p> </div> </div>'
            $("body").append(div);
            $(".success-btn").click(function () {
                window.location.href="search-team.html?uid="+uid;
            })
        }else if(data.code == -150){
            div = '<div class="success-box"> <div class="success"> <p class="success-tit">神约提示您：</p> <p class="success-txt">'+data.msg+'</p> <p class="success-btn">确定</p> </div> </div>'
            $("body").append(div);
            $(".success-btn").click(function () {
                window.location.href="search-team.html?uid="+uid;
            })
        }else if(data.code == -138){
            div = '<div class="success-box"> <div class="success"> <p class="success-tit">神约提示您：</p> <p class="success-txt">'+data.msg+'</p> <p class="success-btn">确定</p> </div> </div>'
            $("body").append(div);
            $(".success-btn").click(function () {
                window.location.href="search-team.html?uid="+uid;
            })
        }
    })
    $(t).parents(".list").remove()
}