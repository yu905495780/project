function ajax(method,url,Async,fun){
				    /*1、创建对象*/
					var xhr = ""; 
					if(window.XMLHttpRequest){
						xhr = new XMLHttpRequest();
					}else if(window.ActiveXObject){
						xhr = new ActiveXObject("Microsoft.XMLHTTP");
					}
					/*2、监听事件*/
					xhr.onreadystatechange = function(){
						if(xhr.readyState==4&&xhr.status==200){
							var data = JSON.parse( xhr.responseText );
							fun(data);
						}
					};
					/*3、为发送做准备*/
					xhr.open(method,url,Async);
					/*4、发送*/
					xhr.send();
			}