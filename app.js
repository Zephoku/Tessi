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
app.get('/users', user.list);

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
    	db.users.find({
    		userID: user_data.userID
    	}, function(err, users) {
    		if (users.length !== 0 && !err) {
    			socket.emit('userBadgeResponse', 
    				{userID: user_data.userID, badges:users[0].badges});
    		}
    	})
    });

    // add a new badge 
    socket.on('userBadgeUpdate', function(user_data) {
    	db.user.find({userID: user_data.userID}, function(err, users) {
    		if(validateUsers(err, users)) {
    			users[0].badges[user_data.badgename] = db.badges.find({name: badgename});
    			db.user.update({userID:user_data.userID}, 
    				{$set: users[0].badges})
    			console.log(users[0].badges);
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
});

//action definitions
app.post('/submitFunctionName', function(req, res) {
    db.tutorials.save({"implTitle": req.body.content}, function(err, status) {
        console.log("function "+ req.body.content + " saved!");
        res.redirect('/');
    });
});

