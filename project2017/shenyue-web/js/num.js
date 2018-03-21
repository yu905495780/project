/**
 * Created by DELL on 2017/9/28.
 */
var num = 1;
var show = document.getElementById('show');
var t=setInterval(function () {
    if(num >= 328068){
        clearTimeout(t);
        setInterval(function () {
            num = parseInt(num, 10) + 3;
            show.innerHTML = num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        },750)
    }
    num = parseInt(num, 10) + 173;
    show.innerHTML = num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
})

var list=document.getElementById("list");
var headbox=document.getElementsByClassName("headb-box")[0];
var ali=headbox.getElementsByTagName("li");
var tab=document.getElementsByClassName("tab");
list.onclick=function () {
    headbox.style.display="block";
};
for(var i=0;i<ali.length;i++){
    ali[i].index=i;
    ali[i].onclick=function () {
        for(var j=0;j<tab.length;j++){
            tab[j].index=j;
            tab[j].className="tab head-list";
        }
        tab[this.index].className="tab head-list act";
        headbox.style.display="none";
    }
}




