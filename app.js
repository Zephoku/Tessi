/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
//for heroku
//var dbURL = "mongodb://localhost/codeondb";
var dbURL = "codeondb";
var collections = ["tutorials"];
var db = require("mongojs").connect(dbURL,collections);

var app = express();
var server = http.createServer(app);
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

//socket for server-client side communication
var io = require('socket.io').listen(server);


server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//socket.io setup
io.sockets.on('connection', function (socket) {
    //initialize sockets
    socket.emit('ack', {init: true});
    socket.on('userID', function (data) {
        if (data.userID) {
            console.log("facebook userID retrieved "+ data.userID);
        } else {
            console.log("error retrieving facebook user ID");
        }
    });
});

//action definitions
app.post('/submitFunctionName', function(req, res) {
    db.tutorials.save({"implTitle": req.body.content}, function(err, status) {
        console.log("function "+ req.body.content + " saved!");
        res.redirect('/');
    });
});

