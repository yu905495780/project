/**
 * Created by DELL on 2018/3/13.
 */
// JavaScript Document


var thistile=document.title;
var startTilt="";
var entTilt="";
setInterval(function(){
    entTilt=thistile;
    if(entTilt!=startTilt){
        startTilt=entTilt;
    }else{
        if(entTilt!=""){
            document.title=thistile;
        }
    }
},2000)



$(document).ready(function() {

    ///////鎵€鏈夐粯璁PP妗堜緥///////////
    setTimeout(function(){
        $(".DtiasNv a").each(function(index, element) {
            var thistext=$(this).text();
            if(thistext.indexOf("APP")>-1){
                $(this).trigger("click");
            }
        });
    },3)
    ////////////////


    /////////鐢佃瘽鎸夐挳//////////
    if(IsPC()){
        //	$(".PosFixNavR a.a1").attr("href","javascript:void(0)");
    }
    //$(".PosFixNavR a").eq(1).attr("href","javascript:void(0)");
    ////////////鎿嶄綔鏂规硶绀烘剰////////////
    if($(".bankScroll").length>0){
        $("body").append("<div class='mouseshiyi'><div class='mouseshiyia'><img class='img1' src='/skins/images/mouseKey.png'><img class='img2' src='/skins/images/mouseKeya.png'><img class='img3' src='/skins/images/tip.png'></div></div>")
        var shudscin=0;
        var shudssd=setInterval(function(){
            $(".mouseshiyi").toggleClass("opamouseshiyi");
            shudscin++;
            if(shudscin>10){
                clearInterval(shudssd);
                $(".mouseshiyi").removeClass("opamouseshiyi");
                $(".mouseshiyi").remove();
            }
        },2000)


    }
    ////////////鎿嶄綔鏂规硶绀烘剰////////////


    ////////妗堜緥璇︾粏椤靛幓闄ゆ牱寮�//////
    $(".DongtaXQneR img").each(function(index, element) {
        $(this).removeAttr("style");
    });

    ////////妗堜緥璇︾粏椤靛幓闄ゆ牱寮�***//////

    var scrollTopisBol=true;
    var bankScroll_cueshun=0;

    ///////////鍟嗘ˉ//////////
    //$(".serveAppBk2_btn,.phoneLinkbtn,.serveAppBk3_linkbtn,.WEBlink1,.DongtNRxqyR1,.DongtNRxqyR2").attr("href","javascript:void(0)");
    //$(".serveAppBk2_btn,.phoneLinkbtn.serveAppBk3_linkbtn,.WEBlink1").parents("a").attr("href","javascript:void(0)");
    $(".PosFixNavR a").eq(1).click(function(){
        //$("#bdbridgeIconBg").trigger("click");
        //$("#BDBridgeMess").removeAttr("style");
        shangqiaotriclick();
    })
    $(".serveAppBk2_btn,.phoneLinkbtn,.serveAppBk3_linkbtn,.WEBlink1,.DongtNRxqyR1,.DongtNRxqyR2").click(function(){
        //$("#bdbridgeIconBg").trigger("click");
        //$("#BDBridgeMess").removeAttr("style");
        shangqiaotriclick();
    })

    function shangqiaotriclick(){
        $(".qiao-icon-title,.nb-icon-bridge-base").trigger("click");

    }


    var jishudxcs=0;
    var setIntervalAA=setInterval(function(){
        if($("#BDBridgeIconIframe").length>0 && $("#BDBridgeWrap").length>0 && $("#BDBridgeIconWrap").length>0 && $("#bridgehead").length>0){
            //$("#BDBridgeWrap div,#BDBridgeWrap a,#BDBridgeWrap span,#BDBridgeWrap iframe").width(0).height(0);
            $("#BDBridgeIconWrap,#BDBridgeIconWrap div,#BDBridgeIconWrap a,#BDBridgeIconWrap span,#BDBridgeIconWrap iframe").width(0).height(0);
            $("#BDBridgeWrap").css("opacity",1);
            $("#BDBridgeMess").hide();
            jishudxcs++;
            if(jishudxcs>5){
                clearInterval(setIntervalAA);
            }

        }
    },500)

    ///////////鍟嗘ˉ//////////


    if($(".bankScroll").length>0){
        $(".bottoms_over").addClass("bottoms_overBox");
    }

    ///////瀵艰埅///////////
    $(".Navlistata,.NavMore").click(function(){
        $(".Navli").toggleClass("visibles");
    })
    ///////瀵艰埅**///////////

    /*$("body").mousewheel(function(event, delta, deltaX, deltaY){
     var windSCrotOP=$(window).scrollTop();
     $("html,body").stop().animate({scrollTop:windSCrotOP-deltaY*300},800,"linear")
     return false;
     })*/


    $(".liaoJie_list ul li .ruad").each(function(index, element) {
        var thisImg=$(this).html();
        if(index==2){
            $(this).html("<span><b><img src='/skins/images/numberImg.png'><img class='imgsa' src='/skins/images/numberImg.png'></b><b class='yuan'>"+thisImg+"</b></span>")
        }else if(index==3){
            $(this).html("<span><b><img src='/skins/images/numberImg.png'><img class='imgsa' src='/skins/images/numberImg.png'></b><b><img src='/skins/images/numberImg.png'><img class='imgsa' src='/skins/images/numberImg.png'></b><b><img src='/skins/images/numberImg.png'><img class='imgsa' src='/skins/images/numberImg.png'></b><b class='yuan'>"+thisImg+"</b></span>")
        }else if(index==1){
            $(this).html("<span><b><img src='/skins/images/numberImg.png'><img class='imgsa' src='/skins/images/numberImg.png'></b><b><img src='/skins/images/numberImg.png'><img class='imgsa' src='/skins/images/numberImg.png'></b><b><img src='/skins/images/numberImg.png'><img class='imgsa' src='/skins/images/numberImg.png'></b><b class='yuan'>"+thisImg+"</b></span>");
        }else{
            $(this).html("<span><b><img src='/skins/images/numberImg.png'><img class='imgsa' src='/skins/images/numberImg.png'></b><b><img src='/skins/images/numberImg.png'><img class='imgsa' src='/skins/images/numberImg.png'></b><b class='yuan'>"+thisImg+"</b></span>")
        }

    });


    ///////鎴戜滑鐨勬湇鍔℃粦鍏ユ晥鏋�/////////
    /*$(".serveAppBk6_ul li").hover(function(){
     $(this).find("img").stop().animate({top:20,marginBottom:35},300,"linear")
     },function(){
     $(this).find("img").stop().animate({top:0,marginBottom:25},300,"linear")
     })*/
    ///////鎴戜滑鐨勬湇鍔℃粦鍏ユ晥鏋�***/////////
    //////////妗堜緥榧犳爣鍒掑叆//////////
    /*$(".serveAppBk5_ul li a").hover(function(){
     $(this).find(".img").stop().animate({width:"110%",height:"110%"},700,"linear")
     },function(){
     $(this).find(".img").stop().animate({width:"100%",height:"100%"},200,"linear")

     })*/

    //////////妗堜緥榧犳爣鍒掑叆****//////////

    ////////鍜ㄨ鎸夐挳榧犳爣鍒掑叆//////////
    $(".serveAppBk2_btn,.WEBlink1").hover(function(){
        $(this).animate({left:-5},100,"easeOutBack")
        $(this).animate({left:5},100,"easeOutBack")
        $(this).animate({left:0},200,"easeOutElastic")
    },function(){})

    $(".phoneLinkbtn").hover(function(){
        $(this).animate({marginLeft:-76},100,"easeOutBack")
        $(this).animate({marginLeft:-66},100,"easeOutBack")
        $(this).animate({marginLeft:-71},200,"easeOutElastic")

    },function(){})

    $(".serveAppBk3_linkbtn").hover(function(){
        $(this).animate({left:-50},100,"easeOutBack")
        $(this).animate({left:-40},100,"easeOutBack")
        $(this).animate({left:-45},200,"easeOutElastic")

    },function(){})





    ////////鍜ㄨ鎸夐挳榧犳爣鍒掑叆***//////////
    var divAry=[];
    if($(".bankScroll").length>0){

        $(".bankScroll").each(function(index, element) {
            divAry.push($(this));
        });
        divscrollTopAE();

    }



    function divscrollTopAE(){
        var divleng=$(".bankScroll").length;
        var windowHt;
        var windSCrotOP;
        var curbank;

        var isgunsd=true;
        var setTimesx;


        function setTimesx_hs(){
            isgunsd=true;
        }

        //////////////////////////////////鏉垮潡缂╂斁///////////////////////////////
        ////////榧犳爣婊氳疆鎵€闇€鍙橀噺///////////
        var bankScroll_index=0;

        var bankScroll_leng=$(".bankScroll").length;
        var mouseWheelis=true;
        var setIntersdss;

////////bankScroll缂╂斁/////////
        var headHet=$(".header").height();
        var serveApHt=$(".serveAppPaddiTp").height();
        bankScrollSCSE();
        $(".Gkb").load(bankScrollSCSE);

        function bankScrollSCSE(){



            var windowheights=$(window).height();
            var windowWIdh=$(window).width();

            ScrollSCS_bk3(windowheights,windowWIdh);
            ScrollSCS_bk3guNd(windowheights,windowWIdh);
            if(windowWIdh>windowheights && windowWIdh>1000){
                $(".bankScroll").height(windowheights).css({padding:0});
                if($(".bankScroll .header").length<1 && $(".bankScroll").length>0){
                    $(".header").addClass("headerPosin");
                    $(".serveApp1").addClass("serveApp1Posin");
                }
                ScrollSCS_bk1(windowheights,windowWIdh);

                $("html,body").scrollTop(bankScroll_index*windowheights);
                // $(".WebServiceYS_Scroll").width(Math.min(windowWIdh,(windowheights-140)*1902/710));
                $(".serveAppBk5_ul_webs").width(Math.min(windowWIdh,(windowheights-150)*1902/670));
                //$(".WebServiceYS_Scroll").css({top:windowheights-$(".WebServiceYS_Scroll").height()});
            }else{
                $(".bankScroll").attr("style","");
                ScrollSCS_bk1(windowheights,windowWIdh);
                $(".ScrollSCS_NR2,.ScrollSCS_NR3,.ScrollSCS_NR4,.ScrollSCS_NR5,.CentMain,.bottoms_over").attr("style","");
                //$(".Sybanner,.Sybannerli .img").attr("style","");
                $(".header").removeClass("headerPosin");
                $(".serveApp1").removeClass("serveApp1Posin");
                // $(".WebServiceYS_Scroll").attr("style","");
                $(".serveAppBk5_ul_webs").attr("style","");
                //$(".WebServiceYS_Scroll").css({top:0});
                $(".liaoJie_list ul li .ruad span b").eq(0).find("img").css({top:-68*1});
                $(".liaoJie_list ul li .ruad span b").eq(1).find("img").css({top:-68*1});

                $(".liaoJie_list ul li .ruad span b").eq(3).find("img").css({top:-68*1});
                $(".liaoJie_list ul li .ruad span b").eq(4).find("img").css({top:-68*5});
                $(".liaoJie_list ul li .ruad span b").eq(5).find("img").css({top:-68*0});

                $(".liaoJie_list ul li .ruad span b").eq(7).find("img").css({top:-68*4});

                $(".liaoJie_list ul li .ruad span b").eq(9).find("img").css({top:-68*8});
                $(".liaoJie_list ul li .ruad span b").eq(10).find("img").css({top:-68*0});
                $(".liaoJie_list ul li .ruad span b").eq(11).find("img").css({top:-68*0});

            }

        }





        ///////ScrollSCS_bk/////////
        function ScrollSCS_bk1(ht,wd){
            // var chazhis=ht-headHet;

            var chazhis=ht;
            var bilizhi=737/1200;
            var bannerItmW=Math.min(1200,ht/bilizhi);

            // $(".Sybannerli .bannerItm1.img").css({marginLeft:-1900/2*bilizhi});
            var chazhisA=parseInt(bannerItmW*bilizhi);

            if(ht<wd*1.1 && wd>1000){
                $(".Sybanner,.Sybannerli").height(chazhis);
                $(".bannerItm").height(chazhisA).width(bannerItmW);
                $(".bannerItm").css({left:(wd-bannerItmW)/2,top:(ht-chazhisA)/2})
                $(".SybannerL,.SybannerR").removeAttr("style");
                $(".Sybanner").css("padding-top",0);
                $(".Sybannerli").css("top",0);
            }else{
                bannerItmW=wd;
                chazhisA=parseInt(bannerItmW*bilizhi)
                $(".Sybanner,.Sybannerli").height(chazhisA);
                $(".bannerItm").height(chazhisA).width(bannerItmW);
                $(".Sybanner").css("padding-top",53);
                $(".bannerItm").css({left:0,top:0})
                $(".Sybannerli").css("top",53);
            }
        }





        /*function ScrollSCS_bk1(ht,wd){
         var chazhis=ht-headHet;
         var bilizhi=chazhis/737;
         var bannerItmW=Math.min(1200*bilizhi,wd);
         $(".Sybanner,.Sybannerli").height(chazhis);
         $(".Sybannerli .bannerItm1.img").css({marginLeft:-1900/2*bilizhi});
         $(".bannerItm").width(bannerItmW).css({marginLeft:-bannerItmW/2})

         }*/

        function ScrollSCS_bk3(ht,wd){
            var chazhis=ht-237;
            var bilizh=2*13/20/4;
            var wdthAA=Math.min(chazhis/bilizh,wd);
            var heiTaa=parseInt(wdthAA*bilizh);
            /*if($(".bankScroll").length>0){*/
            if(wd>1000){
                $(".serveAppBk5_ul").width(wdthAA);
                $(".serveAppBk5_ul").height(heiTaa);
                $(".ScrollSCS_NR3_PC").css("top",(ht-heiTaa-237)/2+57)
            }else{
                $(".serveAppBk5_ul").removeAttr("style");
                $(".ScrollSCS_NR3_PC").removeAttr("style");
            }
            /*}*/
        }


        /////////瑙傜偣/////////////
        function ScrollSCS_bk3guNd(ht,wd){
            /*var chazhis=ht-340;
             var bilizh=400/1200;
             var wdthAA=Math.min(chazhis/bilizh,wd);
             var heiTaa=parseInt(wdthAA*bilizh);
             if(wd>1000){
             $(".Dtiasul").width(wdthAA);
             $(".Dtiasul").height(335);
             }else{
             $(".Dtiasul").removeAttr("style");
             }*/

        }



        ///////ScrollSCS_bk***/////////

        $("html,body").scrollTop("0");

        $(window).resize(function(){
            bankScrollSCSE();
        })
        //////////////////////////////////鏉垮潡缂╂斁****///////////////////////////////




        $(window).keydown(function(e){
            if(e.keyCode==38 || e.keyCode==40){

                kedangmousedwheel((e.keyCode-39)*-1);
                return false;
            }
        })


        function kedangmousedwheel(deltaY){

            if(scrollTopisBol){
                bankScroll_index=bankScroll_cueshun;
                ///alert(bankScroll_cueshun)
            }
            $(".mouseshiyi").removeClass("opamouseshiyi");
            $(".mouseshiyi").remove();

            if($(window).width()>1000){
                if(mouseWheelis==true){
                    //console.warn(mouseWheelis+" asdsad");
                    clearInterval(setIntersdss);
                    setIntersdss=setInterval(mouseWheelis_hs,500);
                    mouseWheelis=false;
                    windowHt=$(window).height();
                    if(deltaY<0 && bankScroll_index==bankScroll_leng-1){
                        $(".bottoms_over").animate({height:72},500,"easeInOutQuad");
                    }
                    if(deltaY<0 && bankScroll_index<bankScroll_leng-1){
                        bankScroll_index++;
                        $("html,body").stop().animate({scrollTop:bankScroll_index*windowHt},800,"easeInOutCubic")
                    }
                    if(deltaY>0 && bankScroll_index>0 && $(".bottoms_over").height()<10){
                        bankScroll_index--;
                        $("html,body").stop().animate({scrollTop:bankScroll_index*windowHt},800,"easeInOutCubic")
                    }


                    $(".bankScroll").removeClass("srollBOxcurenT").eq(bankScroll_index).addClass("srollBOxcurenT");

                    if(deltaY>0 && $(".bottoms_over").height()>10){
                        $(".bottoms_over").animate({height:0},500,"easeInOutQuad");
                    }
                    if(bankScroll_index==3 && $(".liaoJie_list ul li .ruad span b.yuan").length>0){
                        $(".liaoJie_list ul li .ruad span b img").css({top:0});
                        setTimeout(function(){
                            $(".liaoJie_list ul li .ruad span b").eq(0).find("img").stop().animate({top:-68*1-680},500,"easeOutCubic");
                            $(".liaoJie_list ul li .ruad span b").eq(1).find("img").stop().animate({top:-68*1-680},700,"easeOutCubic");

                            $(".liaoJie_list ul li .ruad span b").eq(3).find("img").stop().animate({top:-68*1-680},800,"easeOutCubic");
                            $(".liaoJie_list ul li .ruad span b").eq(4).find("img").stop().animate({top:-68*5-680},900,"easeOutCubic");
                            $(".liaoJie_list ul li .ruad span b").eq(5).find("img").stop().animate({top:-68*0-680},900,"easeOutCubic");

                            $(".liaoJie_list ul li .ruad span b").eq(7).find("img").stop().animate({top:-68*4-680},1000,"easeOutCubic");

                            $(".liaoJie_list ul li .ruad span b").eq(9).find("img").stop().animate({top:-68*8-680},1500,"easeOutCubic");
                            $(".liaoJie_list ul li .ruad span b").eq(10).find("img").stop().animate({top:-68*0-680},1700,"easeOutCubic");
                            $(".liaoJie_list ul li .ruad span b").eq(11).find("img").stop().animate({top:-68*0-680},1700,"easeOutCubic");

                        },1500)


                    }

                }

                return false;
            }




        }



        //////榧犳爣婊氳疆///////
        $("body").mousewheel(function(event, delta, deltaX, deltaY){
            if(scrollTopisBol){
                bankScroll_index=bankScroll_cueshun;
                ///alert(bankScroll_cueshun)
            }
            $(".mouseshiyi").removeClass("opamouseshiyi");
            $(".mouseshiyi").remove();

            if($(window).width()>1000){
                if(mouseWheelis==true){
                    //console.warn(mouseWheelis+" asdsad");
                    clearInterval(setIntersdss);
                    setIntersdss=setInterval(mouseWheelis_hs,500);
                    mouseWheelis=false;
                    windowHt=$(window).height();
                    if(deltaY<0 && bankScroll_index==bankScroll_leng-1){
                        $(".bottoms_over").animate({height:72},500,"easeInOutQuad");
                    }
                    if(deltaY<0 && bankScroll_index<bankScroll_leng-1){
                        bankScroll_index++;
                        $("html,body").stop().animate({scrollTop:bankScroll_index*windowHt},800,"easeInOutCubic")
                    }
                    if(deltaY>0 && bankScroll_index>0 && $(".bottoms_over").height()<10){
                        bankScroll_index--;
                        $("html,body").stop().animate({scrollTop:bankScroll_index*windowHt},800,"easeInOutCubic")
                    }


                    $(".bankScroll").removeClass("srollBOxcurenT").eq(bankScroll_index).addClass("srollBOxcurenT");

                    if(deltaY>0 && $(".bottoms_over").height()>10){
                        $(".bottoms_over").animate({height:0},500,"easeInOutQuad");
                    }
                    if(bankScroll_index==3 && $(".liaoJie_list ul li .ruad span b.yuan").length>0){
                        $(".liaoJie_list ul li .ruad span b img").css({top:0});
                        setTimeout(function(){
                            $(".liaoJie_list ul li .ruad span b").eq(0).find("img").stop().animate({top:-68*1-680},500,"easeOutCubic");
                            $(".liaoJie_list ul li .ruad span b").eq(1).find("img").stop().animate({top:-68*1-680},700,"easeOutCubic");

                            $(".liaoJie_list ul li .ruad span b").eq(3).find("img").stop().animate({top:-68*1-680},800,"easeOutCubic");
                            $(".liaoJie_list ul li .ruad span b").eq(4).find("img").stop().animate({top:-68*5-680},900,"easeOutCubic");
                            $(".liaoJie_list ul li .ruad span b").eq(5).find("img").stop().animate({top:-68*0-680},900,"easeOutCubic");

                            $(".liaoJie_list ul li .ruad span b").eq(7).find("img").stop().animate({top:-68*4-680},1000,"easeOutCubic");

                            $(".liaoJie_list ul li .ruad span b").eq(9).find("img").stop().animate({top:-68*8-680},1500,"easeOutCubic");
                            $(".liaoJie_list ul li .ruad span b").eq(10).find("img").stop().animate({top:-68*0-680},1700,"easeOutCubic");
                            $(".liaoJie_list ul li .ruad span b").eq(11).find("img").stop().animate({top:-68*0-680},1700,"easeOutCubic");

                        },1500)


                    }

                }

                return false;
            }

        })
        function mouseWheelis_hs(){
            mouseWheelis=true;
            clearInterval(setIntersdss);
        }
        //////榧犳爣婊氳疆***///////

    }







    function curbank_sh(){
        var pusx=[];
        for(var i=0;i<divAry.length && pusx.length<2;i++){
            if(divAry[i].offset().top<$(window).scrollTop()+5 && divAry[i].offset().top+divAry[i].height()>$(window).scrollTop()+5){
                pusx.push(i);
            }
        }
        if(pusx.length<1){
            return 100;
        }else{
            return 	pusx[0];
        }
    }




/////////鍜ㄨ鍥剧墖姣斾緥////////
    var setIntermsd;
    $(window).resize(function(){
        ZixunBilili();
        clearInterval(setIntermsd);
        setIntermsd=setInterval(setIntermsd_hs,500);
    });
    ZixunBilili();
    function ZixunBilili(){
        var IMgWIEDHT=$(".Dtiasul li").eq(0).width();
        $(".Dtiasul li a >img").height(IMgWIEDHT*387/680);
    }

    function setIntermsd_hs(){
        clearInterval(setIntermsd);
        ZixunBilili();
    }

/////////鍒ゆ柇鏄惁涓篜C/////////////

    function IsPC()
    {
        var userAgentInfo = navigator.userAgent;
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
        }
        return flag;
    }

/////////鍒ゆ柇鏄惁涓篜C绔�****/////////////
    var scollTopsx=0;
    var seIntimesTopisBol;
    function seIntimesTopisBol_hs(){
        clearInterval(seIntimesTopisBol);
        scrollTopisBol=true;

    }
    if(IsPC()){
        scrollFontdin();
        $(window).scroll(function(){
            scrollFontdin();
            scrollTopisBol=false;
            clearInterval(seIntimesTopisBol);
            seIntimesTopisBol=setInterval(seIntimesTopisBol_hs,500);
        })
    }

    function scrollFontdin(){
        bankScroll_cueshun=retrubnbankScroll();
        //console.log(bankScroll_cueshun)
        scollTopsx=$(window).scrollTop();
        WomendSevas(scollTopsx); ////鎴戜滑鐨勬湇鍔�/////
        CaseBankr(scollTopsx);/////妗堜緥鐗堝潡//////
        understandIM(scollTopsx);//////鏇存繁鐨勪簡瑙ｆ垜浠�///////
        OurpointHs(scollTopsx);////鎴戜滑鐨勮鐐�////////
        contactusHs(scollTopsx);///////鑱旂郴鎴戜滑/////////////
    }



    function retrubnbankScroll(){
        var shuzhucsA=3000;
        var shuzhucs=[];
        if($(".bankScroll").length>0){
            $(".bankScroll").each(function(index, element) {
                var shuzhucsb=Math.abs($(this).offset().top-$(window).scrollTop());
                if(shuzhucsb<shuzhucsA){
                    shuzhucs.push(index);
                    shuzhucsA=shuzhucsb;
                }
            });
            return shuzhucs.pop();
        }else{
            return 0;
        }
    }

    function shuzhucs_sort(index1,index2){
        if(index1<index2){
            return -1;
        }else if(index1>index2){
            return 1;
        }else{
            return 0;
        }
    }

    ////////鎴戜滑鐨勬湇鍔�////////
    function WomendSevas(offTop){
        if($(".serveAppBk6_List").length>0 && $(window).width()>1000){
            var topzhi=$(".serveAppBk6").offset().top-offTop;
            $(".serveAppBk6 .serveAppBk3_Title").css("top",-topzhi*0.5);
            $(".serveAppBk6 .serveAppBk2_btn").css("top",-topzhi*0.3);
            $(".serveAppBk6_List").css("top",-topzhi*0.2);
            $(".serveAppBk6_ul li").each(function(index, element) {
                $(this).css({top:-(4-index)*topzhi*0.1})
            });
        }else{
            $(".serveAppBk6 .serveAppBk3_Title").css("top",0);
            $(".serveAppBk6 .serveAppBk2_btn").css("top",0);
            $(".serveAppBk6_List").css("top",0);
            $(".serveAppBk6_ul li").css("top",0);
        }
    }

    /////////////妗堜緥鐗堝潡////////////
    function CaseBankr(offTop){
        if($(".serveAppPaddiTp").length>0 && $(window).width()>1000){
            var topzhi=$(".serveAppPaddiTp").parents(".bankScroll").offset().top-offTop;
            $(".serveAppPaddiTp .serveAppBk3_Title").css("top",-topzhi*2);
            $(".serveAppPaddiTp .serveAppBk2_btn").css("top",-topzhi*1.5)
            $(".serveAppPaddiTp .DtiasNv ").css("top",-topzhi*0.1)
            //$(".serveAppBk5_ul").css("top",-topzhi*0.5);
        }else{
            $(".serveAppPaddiTp .serveAppBk3_Title").css("top",0);
            $(".serveAppPaddiTp .serveAppBk2_btn").css("top",0)
            $(".serveAppPaddiTp .DtiasNv ").css("top",0)
            //$(".serveAppBk5_ul").css("top",0);
        }
    }
    ///////鏇存繁鐨勪簡瑙ｆ垜浠�//////
    function understandIM(offTop){
        if($(".liaoJie_list").length>0 && $(window).width()>1000){
            var topzhi=$(".Index_liaoJie").offset().top-offTop;
            $(".Index_liaoJie .liaoJie_tilte").css("top",-(topzhi*0.7-80));
            $(".Index_liaoJie .serveAppBk2_btn").css("top",-topzhi*0.9)
            $(".liaoJie_list ul li").each(function(index, element) {
                $(this).css("top",-(index*0.5*topzhi+topzhi*0.02));
            });
        }else{
            $(".Index_liaoJie .liaoJie_tilte").css("top",0);
            $(".Index_liaoJie .serveAppBk2_btn").css("top",0)
            $(".liaoJie_list ul li").css("top",0);
        }
    }
    ///////////鎴戜滑鐨勮鐐�//////////
    function OurpointHs(offTop){
        if($(".ourpoint").length>0 && $(window).width()>1000){
            var topzhi=$(".ourpoint ").offset().top-offTop;
            $(".ourpoint .ourpoint_Tilet img").css("top",-topzhi*0.5);
            $(".ourpoint .serveAppBk2_btn").css("top",-topzhi*0.3);
            $(".ourpoint .Dtiasul").css("top",-topzhi*0.2);
        }else{
            $(".ourpoint .ourpoint_Tilet img").css("top",0);
            $(".ourpoint .serveAppBk2_btn").css("top",0);
            $(".ourpoint .Dtiasul").css("top",0);
        }
    }
    //////////鑱旂郴鎴戜滑////////////
    function contactusHs(offTop){
        if($(".contactSy").length>0 && $(window).width()>1000){
            var topzhi=$(".contactSy ").offset().top-offTop;
            $(".contactSy .contactSy_tilte").css("top",-topzhi*0.7);
            $(".contactSy .serveAppBk2_btn").css("top",-topzhi*0.5);
            $(".contactSy .contactSy_NRl").css("top",-topzhi*0.4);
            $(".contactSy .contactSy_NRr").css("top",-topzhi*0.4);
        }else{
            $(".contactSy .contactSy_tilte").css("top",0);
            $(".contactSy .serveAppBk2_btn").css("top",0);
            $(".contactSy .contactSy_NRl").css("top",0);
            $(".contactSy .contactSy_NRr").css("top",0);
        }
    }




    $(window).scroll(function(){
        var windhsoueght=$(".bankScroll").height();
        $(".backImgsClassA,.backImgsClassB,.backImgsClassC,.backImgsClassD").each(function(index, element) {
            $(this).css({top:Math.max($(this).parents(".bankScroll").offset().top-$(window).scrollTop()-windhsoueght,-windhsoueght)/10});
        });

    })







    /////////杩斿洖椤堕儴////////
    $(".PosFixNavR a:last").click(function(){
        $("html,body").animate({scrollTop:0},500,"easeInOutCubic");
        bankScroll_index=0;
    })











});