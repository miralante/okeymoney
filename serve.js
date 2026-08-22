/* Minimal static file server for local review only. Not part of the app. */
var http = require('http');
var fs = require('fs');
var path = require('path');
var ROOT = __dirname;
var PORT = 8080;
var MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.md': 'text/plain; charset=utf-8'
};
http.createServer(function (req, res) {
  var url = decodeURIComponent(req.url.split('?')[0]);
  if (url === '/') url = '/index.html';
  var file = path.join(ROOT, url);
  if (file.indexOf(ROOT) !== 0) { res.statusCode = 403; return res.end('Forbidden'); }
  fs.stat(file, function (err, st) {
    if (err || !st.isFile()) { res.statusCode = 404; return res.end('Not found: ' + url); }
    res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    fs.createReadStream(file).pipe(res);
  });
}).listen(PORT, function () {
  console.log('Serving ' + ROOT + ' on http://localhost:' + PORT + '/');
});