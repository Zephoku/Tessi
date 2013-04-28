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
var collections = ["users"];
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
app.get('/user', routes.user);
//app.get('/users', user.list);

//socket for server-client side communication
var io = require('socket.io').listen(server);


server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/* returns true if everything is ok */ 
function validateUsers(err, users) {
	if (!users && !err) {
      console.log("user doesn't exist"); 
      return false;
  } else if (err) {
      console.log("db error inside socket.io " + err);
      return false;
  } else if (users.length !== 0 && !err) {
      return true;
  }
}




//socket.io setup
io.sockets.on('connection', function (socket) {
    //initialize sockets
    socket.emit('ack', {init: true});

    // requesting user data based on user key
    socket.on('userBadgeRequest', function(user_data) {
    	console.log("user data requested!!!!!");
      db.users.find({
    		userID: user_data.userID
    	}, function(err, users) {
    		if (users.length !== 0 && !err) {
          console.log("user found!!!!!");
    			socket.emit('userBadgeResponseUser', 
    				{userID: user_data.userID, badges:users[0].badges});
    		  socket.emit('userBadgeResponse', 
            {userID: user_data.userID, badges:users[0].badges});
        }
    	})
    });

    // add new badges
    socket.on('userBadgeUpdate', function(user_badges) {
    	db.users.find({userID: user_badges.userID}, function(err, users) {
    		if(validateUsers(err, users)) {
    			db.user.update({userID:ser_data.userID}, 
    				{$set: user_badges.badges});
    		}
    	})
    });

    // inserting and updating user data
    socket.on('userData', function (data) {
        if (data.userID) {
            console.log("facebook userID retrieved "+ data.userID);
            db.users.find({
                userID:data.userID
            }, function(err, users) {
                if (!users && !err) {
                    //create new user if it doesn't exist
                    console.log("new user " + data.userID +
                                "constructing new db instance!");
                    db.users.save({
                        userID:data.userID
                    }, function (err, status) {
                        console.log("new user " + data.userID + " created!");
                    });
                    
                } else if (err) {
                    console.log("db error inside socket.io " + err);
                } else if (users && !err) {
                    //the user exist, there can only be one user
                    console.log("user " + data.userID + " exists, updating instances");
                }
                
            });
            
        } else {
            console.log("error retrieving facebook user ID");
        }
    });
/*
    socket.on('redirect', function(data) {
        app.get('/user', function(req, res) {
          
        });
    });
*/
});

