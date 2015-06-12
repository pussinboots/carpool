var connect = require('connect');
var serveStatic = require('serve-static');
var modRewrite = require('connect-modrewrite');

var port = Number(process.env.PORT || 9000);
var server = connect();
server.use(modRewrite([
            '!\\.appcache|\\.woff|\\.ttf|\\.html|\\.js|\\.css|\\.png$ /index.html [L]'
          ])).
    use(serveStatic(__dirname+'/public')).
    listen(port);
