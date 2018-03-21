var http=require('http');
var url1=require('url');
var fs=require('fs');
http.createServer(function(req,res){

    var cu=url1.parse(req.url);
    console.log(cu);
    var path = cu.pathname;
    if(path=='/favicon.ico'){
        res.end();
    }else{
        res.setHeader("Access-Control-Allow-Origin","*");
        res.writeHead(200,{"Content-type":"text/html;charset=utf-8"});
        fs.readFile("."+path,function(err,data){
            if(err){
                console.log(err);
                res.end();
            }else{
                res.write(data);
                res.end();
            }
        })
    }
}).listen(4546);
console.log("服务器启动了……");