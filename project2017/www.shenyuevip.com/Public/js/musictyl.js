//歌曲列表
var Zzx = function(o){
	this.setting     = (typeof o === 'object') ? o : {};
	this.target 	 = this.setting.target || 'newSong';
	this.type        = typeof this.setting.type === 'number' ? this.setting.type : parseInt(this.setting.type);
	this.firstCount  = typeof this.setting.firstCount === 'number' ? this.setting.firstCount : parseInt(this.setting.firstCount);
	this.Count  	 = typeof this.setting.Count === 'number' ? this.setting.Count : parseInt(this.setting.Count);
	this.content     = $("#content");		
	//初始化
	this.init();		
}

Zzx.prototype ={
	init:function(){
		//列表初始化
		this.content.html("");
		//堆栈指针初始化
		this.stack = 0;
		//图片路径
		this.imgPath = 'data/';		
		//定时器
		this.timer = null;			
		//测试JSON数据（可以替换为AJAX请求返回值）
		this.testJson = {
						list:[
							
								{src:"1",title:"爱多一次 痛多一次",song:"13",singer:"谭咏麟"},
								{src:"2",title:"爱在深秋",song:"14",singer:"谭咏麟"},
								{src:"3",title:"朋友",song:"py",singer:"谭咏麟"},
								{src:"4",title:"情缘巴士站",song:"qybsz",singer:"谭咏麟"},
								{src:"5",title:"水中花",song:"szh",singer:"谭咏麟"},
								{src:"6",title:"也曾相识",song:"ycxs",singer:"谭咏麟"},
							]
						}
		this.createList(true);
		this.addHandle();
	},
	
	//创建内容列表
	createList:function(boolen){		
		//boolen:true/false,确定是否初次载入，
		this.ulNode = document.createElement("ul");
		this.ulNode.id = this.target+"list";
		this.content.append(this.ulNode);
		this.ulTarget = $("#"+this.ulNode.id);
		this.createMore();
		this.loadList(boolen);
	},
	
	//创建更多按钮
	createMore:function(){	
		this.moreNode = document.createElement("div");
		this.moreNode.className = 'mu-m';
		/*this.moreNode.innerHTML = '更多>>';*/
		this.moreNode.id = this.target+'more';
		this.moreTarget = $("#"+this.moreNode.id);
	},
	
	//加载列表	
	loadList:function(boolen){		
		var oList = this.testJson.list;
		var oLength;		
		if(boolen){  //计算加载歌曲数
			oLength = oList.length > this.firstCount ? this.firstCount: oList.length;			
		}else{
			oLength = (oList.length-this.stack) > this.Count ? this.Count: (oList.length-this.stack);				
		}	
		if(oLength<=0){
			this.moreTarget.text("这是最后一页了！");
		};
		
		if(!this.moreTarget[0]){
			this.content.append(this.moreNode);				
		};
		
		for(var i = 0 ; i < oLength ; i++){				
			this.loadDate(oList);
		}
		
	},
	
	//加载列表数据	
	loadDate:function(oList){			
		switch(this.type){  
			//根据不同的模块 定制不同的数据展示形式
			case 1:this.ulTarget.append('<li onclick="myControl.selectList(this,'+this.stack+')">'
				                      + '<div class="frp-box dot"><div class="frmPlay play-btn"><img src="' + url + '/images/eb.png"/></div></div>'
									  + '<span style="display:none;" class="musicData" pic='+oList[this.stack].src+' title='+oList[this.stack].title+' value='+oList[this.stack].song+'></span>'
									  + '<div class="mu-l">'+oList[this.stack].src+'</div>'
									  + '<div class="textBox dot">'+oList[this.stack].title+'</div>'
									  +	'<div class="singer dot">'+oList[this.stack].singer+'</div>'
									  + '</li>');
										break;
			case 2:this.content[0].innerHTML  = '此模块建设中...';
										break;
			default :alert("该模块出错！");
		}
		this.stack+=1;
	},
	
	//绑定事件
	addHandle:function(){
		var that = this;
		$("#"+this.moreNode.id).on('click',function(){
			//加载更多列表
			that.createList(false);
		});
	}
	
}
//播放器控制面板	
var Control = function(o){
	this.setting         = (typeof o === 'object')? o : {};		
	this.audio           = this.setting.audio;
	this.progressWrap    = this.setting.progressWrap;
	this.playModeNode    = this.setting.playModeNode;
	this.playBtn         = this.setting.playBtn;
	this.playTitle       = this.setting.playTitle;
	this.singerHead      = this.setting.singerHead;
	this.progress        = this.setting.progress;
	this.oWinObj         = this.setting.oWinObj;
	this.allTimeNode     = this.setting.allTimeNode;	  
	this.currentTimeNode = this.setting.currentTimeNode;  
	this.path            = "/Public/music/";  //歌曲路径（相对于html）
	this.imgPath         = 'data/';   //图片路径（相对于html）
	this.init();
}

Control.prototype = {	
	//初始化
	init:function(){
		//播放控制	
		this.start = true;
		//定时器
		this.timer = null;				
		this.audio.src = "";			
		//可选播放模式
		this.ModeData = [
			{mode:'modeButton default scb',text:'顺序播放模式',title:'顺序播放'},
			{mode:'modeButton random scb',text:'随机播放模式',title:'随机播放'},
			{mode:'modeButton single scb',text:'单曲循环模式',title:'单曲循环'}
		];
		//默认播放模式
		this.ModeIndex = 0;
		this.playMode = this.ModeData[this.ModeIndex].mode;
	},
	
	//选择歌曲列表
	selectList:function(_this,stack){	
		var allow = true;
		var index = null;
		this.oLi = _this;
		this.oUl = _this.parentNode;	
		if(index == stack && !this.start ){
			allow = false;
		}
		index = stack;
		this.loadMusic();
		if(allow){
			this.goPlay();
		}else{
			this.goPause();
		}											
	},
	
	//上一首
	prev:function(){
		if(this.oLi.previousSibling!=null){	
			this.oLi = this.oLi.previousSibling;
			this.loadMusic();
		}else{
			this.oWindow("已经是第一首了哦！");
		}
		this.goPlay();
	},
	
	//主控
	mainControl:function(){
		if(this.start){
			this.goPlay();
		}else{
			this.goPause();
		}	
	},
	
	//下一首
	next:function(){
		if(this.oLi.nextSibling!=null){
			this.oLi = this.oLi.nextSibling;
			this.loadMusic();
		}else{
			this.oWindow("已经是最后一首了哦！")
		}
		this.goPlay();
	},
	
	//播放模式选择
	selectMode:function(){
		this.ModeIndex = (this.ModeIndex<(this.ModeData.length-1))?(this.ModeIndex+1):0;
		this.playMode = this.ModeData[this.ModeIndex].mode;
		this.playTit = this.ModeData[this.ModeIndex].title;
		//this.oWindow(this.ModeData[this.ModeIndex].text);
		this.playModeNode.attr("class",this.playMode);
		this.playModeNode.attr("title",this.playTit);

	},
	
	//播放进度选择
	selectTime:function(event){
		var moveTo = event.pageX - this.progressWrap.offset().left;
		this.audio.currentTime = moveTo/parseInt(this.progressWrap.css("width"))*this.audio.duration;
		this.progress.css("width",moveTo+"px");
	},
	
	//自动播放
	autoPlay:function(){
		//监听歌曲结束
		var that = this;
		this.audio.addEventListener('ended', function () {
			if(typeof that.playMode==='string')
			{	//播放模式判断	
				switch(that.playMode){
					case 'modeButton default scb': that.oLi = (that.oLi.nextSibling!=null)?that.oLi.nextSibling:that.oUl.childNodes[0];
									break;
					 case 'modeButton random scb': that.oLi = that.oUl.childNodes[Math.round(Math.random()*(that.oUl.childNodes.length-1))];
									break;
					 case 'modeButton single scb': ;
						   default: ;
				}
				that.loadMusic();
				that.goPlay();
			}else{
				that.oWindow("循环类型不符!");		
			}
		},false);
	},
	
	//加载要播放的歌曲
	loadMusic:function(){
			$obj = $(this.oLi)
			var song = $obj.find(".musicData").attr("value");	
			var pic = $obj.find(".musicData").attr("pic");
			var title = $obj.find(".musicData").attr("title");
			this.singerHead.attr("src",this.imgPath + pic)
			this.audio.src = this.path + song +'.mp3';
			this.playTitle.html(title);
	},
	
	//判断当前是否歌曲列表
	songReady:function(){
		if(!this.audio.src){
			this.oWindow("请先选择歌曲！")
			return false;
		}else{
			return true;
		}
	},
	
	//转换为时间格式
	timeDispose:function (number) {
		var minute = parseInt(number / 60);
		var second = parseInt(number % 60);
		minute = minute >= 10 ? minute : "0" + minute;
		second = second >= 10 ? second : "0" + second;
		return minute + ":" + second;
	},	
	
	//自定义提示框
	oWindow:function(oText){
		this.oWinObj.show();
		this.oWinObj.html(oText);
		var doc = document.documentElement;
		var oWinX = (doc.clientWidth - this.oWinObj[0].offsetWidth)/2;
		var oWinY = (doc.clientHeight - this.oWinObj[0].offsetHeight-50)/2;
		this.oWinObj.css('left',oWinX+'px');
		this.oWinObj.css('top',oWinY+'px');
		var _this = this;
		setTimeout(function(){_this.oWinObj.hide();},1000)
	},
	
	//播放时间
	oTime:function(){
		if(this.audio.readyState >=4){
			var currentProgress = Math.round(this.audio.currentTime/this.audio.duration*parseInt(this.progressWrap.css("width")));
			this.progress.css("width",currentProgress+"px");
			this.allTimeNode.html(this.timeDispose(this.audio.duration));
			this.currentTimeNode.html(this.timeDispose(this.audio.currentTime));
		}
	},
	
	//播放
	goPlay:function(){
		if(this.songReady()){		
			this.audio.play();
			var _this = this;
			this.goPlayStyle();
			this.timer = setInterval(function(){_this.oTime()},1000)
			this.start = false;
			this.autoPlay();
		}
	},
	
	//暂停
	goPause:function(){
		this.audio.pause();
		this.goPauseStyle();
		clearInterval(this.timer);
		this.start = true;
	},
	
	//播放样式
	goPlayStyle:function(){
		var $oLiIndex = $(this.oLi);
		$(".frmPause").removeClass("frmPause");
		$oLiIndex.find(".frmPlay").addClass("frmPause");
		$oLiIndex.addClass("li_click").siblings().removeClass("li_click");				
		this.playBtn.addClass("pause");
		this.playBtn.removeClass("play");
		this.playBtn.attr("title","播放");
	},
	
	//暂停样式
	goPauseStyle:function(){
		var $oLiIndex = $(this.oLi);
		$(".frmPause").removeClass("frmPause");
		this.playBtn.addClass("play");
		this.playBtn.removeClass("pause");
		this.playBtn.attr("title","暂停");
	},	
}

function ZzxMusic(){
	
	var aa={};
	//模块设置
	var setting = {
		newSong:{'target':'newSong','type':'1','firstCount':10,'Count':5}
	};
	
	//默认加载模块
	aa.newSong = new Zzx(setting.newSong);
}

//实例化控制台
var myControl = new Control({
			 audio : document.getElementById("myMusic"), //播放器
	  playModeNode : $("#modeButton"),	 //模式选择按钮
		   playBtn : $("#playButton"),   //主控按钮
		 playTitle : $("#musicTitle"),   //歌曲TITLE容器
		singerHead : $("#singerHead"),   //歌曲插图容器
	  progressWrap : $("#progressWrap"), //歌曲进度条容器
		  progress : $("#progress"),     //歌曲进度条
		   oWinObj : $("#oWindow"),		 //警告窗容器
	   allTimeNode : $("#totleTime"),    //全部时间容器
   currentTimeNode : $("#currentTime")   //当前时间容器
});	

ZzxMusic();

$(function(){
	$(document).on("click","#newSonglist li",function(){
		$(".mu-playwrap").show();
	})
})