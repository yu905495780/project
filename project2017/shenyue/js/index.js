/*pc端神约用户的动画*/
var imglist = document.querySelector(".img-list");
var imglistli = imglist.querySelectorAll("li");
for(var i = 0; i < imglistli.length; i++) {
	imglistli[i].onmouseover = function() {
		var imgcon = this.querySelector(".content");
		imgcon.style.display = "block";
	};
	imglistli[i].onmouseout = function() {
		var imgcon = this.querySelector(".content");
		imgcon.style.display = "none";
	};
}
/*！pc端神约用户的动画*/

/*pc端附近人的动画*/
var num = 1;
var show = document.getElementById('show');
var t=setInterval(function () {
	if(num >= 359794){
		clearTimeout(t);
		 setInterval(function () {
			 num = parseInt(num) + 3;
			 show.innerHTML = num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
		 },700)
	}
	num = parseInt(num) + 173;
	show.innerHTML = num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
},0);
/*！pc端附近人的动画*/

/*移动端附近人的动画*/
var num1 = 1;
var hide = document.getElementById('hide');
var t1=setInterval(function () {
	if(num1 >= 328068){
		clearTimeout(t1);
		setInterval(function () {
			num1 = parseInt(num1) + 3;
			hide.innerHTML = num1.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
		},750)
	}
	num1 = parseInt(num1) + 173;
	hide.innerHTML = num1.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
},0);
/*！移动端附近人的动画*/

/*移动端导航栏的动画*/
var list=document.getElementById("list");
var headbox=document.getElementsByClassName("headb-box")[0];
var ali=headbox.getElementsByTagName("li");
var tab=document.getElementsByClassName("tab");
list.onclick=function () {
	headbox.style.display="block";
};
for(var m=0;m<ali.length;m++){
	ali[m].index=m;
	ali[m].onclick=function () {
		for(var j=0;j<tab.length;j++){
			tab[j].index=j;
			tab[j].className="tab head-list";
		}
		tab[this.index].className="tab head-list act";
		headbox.style.display="none";
	}
}
/*移动端导航栏的动画*/