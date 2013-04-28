var socket = io.connect('http://localhost:3000');
socket.on('ack', function(data) {
    if (data.init) {
        console.log("socket initialized...accepting facebook login...");
        // Additional JS functions here
        
        // Load the SDK Asynchronously
        (function(d){
            var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement('script'); js.id = id; js.async = true;
            js.src = "//connect.facebook.net/en_US/all.js";
            ref.parentNode.insertBefore(js, ref);
        }(document));

        window.fbAsyncInit = function() {
            FB.init({
                appId      : '443581165736594', // App ID
                channelUrl : './channel.html', // Channel File
                status     : true, // check login status
                cookie     : true, // enable cookies to allow the server to access the session
                xfbml      : true  // parse XFBML
            });
        };

        /*
         BADGE LOGIC 
         */
        function badgeLogics (data) {
            this.data = data;
            this.user_id = data.id;
            
            var user_badges;
            
            function getUserBadges() {
                socket.emit('userBadgeRequest', {userID: user_id});
                socket.on('userBadgeResponse', function(user_data){
                    user_badges = user_data.badges;
                });
            }
            
            function updateUserBadges(badgename, userID) {
                socket.emit('userBadgeUpdate', {userID: user_id, badges: user_badges});
            }
            
            /* checks if badge already exists for the user */
            function checkForBadge(badgename, badgelist) {
                for(var badge in badgelist) {
                    if (badge.name === badgename) {
                        return true;
                    }
                }
                return false;
            }
            
            this.vivaLaPapel = function(status_posts) {
                if (checkForBadge())
                    for(var i = 0; i < status_posts.length; i++) {
                        post = status_posts[i];
                        //console.debug(post);
                        if(post.place && post.place.name.indexOf('Library') != -1) {  
                            users[0].badges['Viva La Papel!'] = true;
                        }
                    }
            };
	    this.cameraSweetHeart = function(photos) {
                var photoList = photos.data;
                for (var photoIndex = 0; photoIndex < photoList.length; photoIndex++) {
                    var likes = photoList[photoIndex].likes.data;
                    if (likes.length >= 50) {
                        //Push the badge to the photo database
                        
                    }
                }                
	    };

            this.letThemEatCake = function(birthdate) {
                var today = new Date();

                var birthday = new Date(birthdate);

                if (today.getMonth() == birthday.getMonth() &&
                    today.getDate() == birthday.getDate()) {
                    user_badges.push({
                        name: 'Let Them Eat Cake',
                        type: 'birthday',
                        content: 'Happy Birthday'
                    });
                }
            }

	this.tooManyLikes() = function(status_posts) {
		for(var i = 0; i < status_posts.length; i++) {
			post = status_posts[i];
			if (post.data["likes"] && post.data.likes.data.length >= 20) {
				user_badges.push({
					name: 'Too Many Likes',
					type: 'status',
					content: post.data.message
				});
			}
		}    
	}

	// call with wuTanClan(Data.likes.data)
	this.wuTanClan = function(likes) {
		for(var i = 0; i < likes.length; i++) {
			if (likes[i].category == "Sport") {
				user_badges.push({
					name: 'Wu Tan Clan',
					type: 'interest', 
					content: likes[i].name
				});
			}
		}
	}

	    this.run = function() {
	        //730148408?fields=photos.fields(likes)

	         this.canIHazCheeseburger(data.location);	// Checked into restaurant
	         this.lovebirds(data.relationship);	// Got into relationship
	         this.vivaLaPapel(data.location);	//Checked into library
	         this.aRealGuitarHero(data.location);	// checked into a concert
	         this.flyOnTheWall(data.relationship); // it's complicated
	         this.gleefulPopularity(data.status); //Over 10 people comment on your status 
	         this.letThemEatCake(data.birthday); 	// birthday
	         this.lifeIsComolete(data.relationship);	// breakup
	         this.wuTanClan();	//has more than 3 sports interest 
	         this.tooManyLikes(); 	// 20+ likes on a status post
	         */
	    };
            
        }
        

        //event listeners
        document.getElementById("FacebookLogin").addEventListener("click", getLogin, false);
        
        function login() {
            FB.login(function(response) {
                if (response.authResponse) {
                    // connected
                    getLogin();
                } else {
                    // cancelled
                }
            }, {scope:'user_status, user_photos'});
        }
        
        function getLogin() {
            // Additional init code here
            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    $("FacebookLogin").hide();
                    testAPI();
                    // connected
                    var uid = response.authResponse.userID;
                    console.log("UserID: " + uid);
                    
                } else if (response.status === 'not_authorized') {
                    // not_authorized
                    $("FacebookLogin").show();
                    console.log("not authorized");
                    login();
                } else {
                    // not_logged_in
                    $("FacebookLogin").show();
                    console.log("not logged in");
                    login();
                }
                
            });
        }
        function testAPI() {
            console.debug("testAPi"); 
            FB.api('/me?fields=photos.fields(likes),statuses.limit(10)', function(response) {
                console.debug(response);
            });
        }
    }
});
