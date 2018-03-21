var fs = require('fs')
var path = require('path')
var express = require('express')
var proxyMiddleware = require('http-proxy-middleware')

var port = process.env.PORT || 3001
var app = express()
app.set('views', './')
app.engine('html', function(filename, options, callback){
  callback(null, fs.readFileSync(filename).toString())
})

var proxyTable = require('./proxy') || {}
Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
        options = { target: options }
    }
    app.use(proxyMiddleware(context, options))
})

function router(){
  var router = express.Router()
  fs.readdirSync('./').filter(function(dir){
    return fs.statSync(dir).isFile() && path.extname(dir) === '.html'
  }).map(function(filepath){
    return path.relative('./', filepath)
  }).forEach(function(subpath){
    router['get']('/ifp/' + subpath, function(req, res){
      res.render(subpath)
    })
  })
  return router
}

app.use(router())
app.use('/ifp/style', express.static(path.join(__dirname, '../style')))
app.use('/ifp/script', express.static(path.join(__dirname, '../script')))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})