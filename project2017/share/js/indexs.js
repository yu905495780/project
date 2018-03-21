/**
 * Created by DELL on 2018/3/19.
 */
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return decodeURIComponent(r[2]); return null;
}

var avatar = document.getElementById("avatar");
//    avatar.src=GetQueryString("avatar");
/*var nickname = document.getElementById("nickname");
 nickname.innerHTML=GetQueryString("nickname").replace(/\+/g, " ");*/
var syid = document.getElementById("syid");
syid.innerHTML="ID:" + GetQueryString("syid");
if(GetQueryString("vip") == "true") {
    var vip = document.getElementById("vip");
    vip.style.display = 'inline-block';
}

if(GetQueryString("real") == "1"){
    var real = document.getElementById("real");
    real.style.display = 'inline-block';
}

if(GetQueryString("gender") == "0"){
    var gender = document.getElementById("gender");
    gender.className = "sex";
    var sex = document.getElementById("sex");
    sex.src = "img/girl2x.png";
}else if(GetQueryString("gender") == "1"){
    var gender = document.getElementById("gender");
    gender.className = "sex1";
    var sex = document.getElementById("sex");
    sex.src = "img/boy2x.png";
}
if(GetQueryString("age") != null){
    var age = document.getElementById("age");
    age.style.display = 'inline-block';
    age.innerHTML = GetQueryString("age");
}

if(GetQueryString("video") == "1"){
    var video = document.getElementById("video");
    video.style.display = 'inline-block';
}

if (null != GetQueryString("carId")) {
    var car = document.getElementById("car");
    car.style.display='inline-block';
    var carId = document.getElementById("carId");
    carId.src="img/car/car-brand-" + GetQueryString("carId") + ".png"
}