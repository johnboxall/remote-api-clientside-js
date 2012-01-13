var http = require('http')
  , https = require('https')
  , util = require('util')
  , static = new (require('node-static').Server)('./public')

function copy(obj) {
  var o = {};
  for (p in obj) o[p] = obj[p];
  return o;
}

var srv = http.createServer(function(req, rsp) {
  console.log(req.url);

  if (req.url[1] == '_') {
    req.url = req.url.slice(2);
    return static.serve(req, rsp);
  }

  var headers = copy(req.headers);
  delete headers.host;

  var opts = {
    host: 'api.github.com',
    method: req.method,
    path: '/' + req.url.split('/').slice(2).join('/'),
    headers: headers
  };

  var xreq = https.request(opts, function(xrsp) {
    rsp.writeHead(xrsp.statusCode, xrsp.headers);
    xrsp.pipe(rsp);
  });

  req.pipe(xreq);
});


var HOST = '0.0.0.0'
  , PORT = 8000

srv.listen(PORT, HOST);
console.log('@ ' + HOST + ':' + PORT)
