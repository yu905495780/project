<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta charset="utf-8">
<title>神约ICP首页</title>
<!--–[if IE]-->
<meta http-equiv="x-ua-compatible" content="ie=9">
<!--[endif]–-->

<!--[if lte IE 8]>
<EMBED src="./media/bg.mp3" autostart="true" loop="true" width="0" height="0">
<![endif]-->
<link rel="stylesheet" type="text/css" href="/www.shenyuevip.com/Public/css/common.css">
<link rel="stylesheet" type="text/css" href="/www.shenyuevip.com/Public/css/home.css">
<script src="http://api.html5media.info/1.1.6/html5media.min.js"></script>
</head>
<body>
<div id="wrapper">
    <div class="head">
		<div class="head_cont">
			 <ul>
          <li class="logo"><a href="<?php echo U('Index/index');?>"><img src="/www.shenyuevip.com/Public/images/logo.jpg"></a></li>
          <li class="cur"><a href="<?php echo U('Index/index');?>">首页</a></li>
          <li><a href="<?php echo U('Index/singer');?>">歌手</a></li>
          <li><a href="<?php echo U('Index/singerlist');?>">排行榜</a></li>
       </ul>
       <ul class="right">
          <li><a href="<?php echo U('Login/register');?>">注册</a></li>
          <li><a href="<?php echo U('Login/login');?>">登录</a></li>
       </ul>							
		</div>
	</div>
    <!-- 内容 -->
    <div class="main">		
        <div class="main-model">
            <div class="title"><img src="/www.shenyuevip.com/Public/images/title1.jpg"></div>
            <div class="cont">
                <div class="cont-left">
                    <h3>热歌榜</h3>
                    <h3>风云榜</h3>
                      <div id="playwrap" class="mu-playwrap">
                        <div id="playContent" class="mu-playcontent">
                          <span>
                            <audio id="myMusic">
							</audio>
                          </span>
                          <div class="audioControl">
                            <a id="prevButton" class="last scb" title="上一首" onClick="myControl.prev()" href="javascript:;"></a>
                            <a id="playButton" class="play scb" title="播放" onClick="myControl.mainControl()" href="javascript:;"></a>
                            <a id="nextButton" class="next scb" title="下一首" onClick="myControl.next()" href="javascript:;"></a>              
                          </div>
                          <div class="mu-scrubber" title="点击选择播放进度" style="width: 670px;">
                            <div onClick="myControl.selectTime(event)" id="progressWrap" class="mu-progresswrap" style="width: 668px;"></div>
                            <div id="progress" class="mu-progress"></div>
                          </div>
                          <div id="timeshow" class="mu-timeshow">
                            <span id="currentTime">00:00</span>
                            <span>/</span>
                            <span id="totleTime">00:00</span>
                          </div>
                        </div>
                      </div>
                      <div style="clear:both"></div>
                      <div class="tableHead">
                         <ul>
                            <li class="firstLi" style="width:300px">歌曲</li>
                            <li style="width:100px">歌手</li>
                         </ul>
                      </div>
                      <div class="tableHead" style="margin-left:55px;">
                         <ul>
                            <li class="firstLi" style="width:300px">歌曲</li>
                            <li style="width:100px">歌手</li>
                         </ul>
                      </div>
                      <div style="clear:both"></div>
                      <div id="content" class="mu-content mu-content2"></div>
            </div>
        </div>
            <div class="title title2">
                <img src="/www.shenyuevip.com/Public/images/title2.jpg">
            </div>
            <div class="img">
                <img src="/www.shenyuevip.com/Public/images/img.jpg">
            </div>         
        </div>
    </div>
    <div class="footer">
         <div class="footer_cont">
             <ul>
                 <li><a href="">服务条款</a><a href="">安全须知</a><a href="">“神约”用户协议</a><a href="">客服电话：4008 7288 83</a></li>
                 <li><a href="">备案/许可证编号为：京ICP备17025424</a></li>
             </ul>
         </div>
    </div>
</div>
<script type="text/javascript" src="/www.shenyuevip.com/Public/js/jquery-1.9.1.min.js"></script>
<script src="/www.shenyuevip.com/Public/js/home.js"></script>
<script>
    var url = "/www.shenyuevip.com/Public";//定义js中的url路径
</script>
<script src="/www.shenyuevip.com/Public/js/musicindex1.js"></script>
</body>
</html>