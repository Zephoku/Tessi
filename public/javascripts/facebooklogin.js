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
                appId      : '333483723421810', // App ID
                channelUrl : './channel.html', // Channel File
                status     : true, // check login status
                cookie     : true, // enable cookies to allow the server to access the session
                xfbml      : true  // parse XFBML
            });
        };



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
                    //testAPI();
                    callFBGraph();
                    // connected
                    //var uid = response.authResponse.userID;
                    //console.log("UserID: " + uid);
                } else if (response.status === 'not_authorized') {
                    // not_authorized
                    console.log("not authorized");
                    login();
                } else {
                    // not_logged_in
                    console.log("not logged in");
                    login();
                }
                
            });
        }

        /*
          BADGE LOGIC 
        */
        function badgeLogics (Data) {
          this.Data = Data;
          var user_id;

          var user_badges = [];

          function getUserBadges() {
            socket.emit('userBadgeRequest', {userID: user_id})
            socket.on('userBadgeResponse', function(user_data){
              user_badges = user_data.badges;
            })
          }

          function updateUserBadges(badges, userID) {
            socket.emit('userBadgeUpdate', {userID: userID, badges: badges});
          }

          this.vivaLaPapel = function(status_posts) {
            for(var i = 0; i < status_posts.length; i++) {
              post = status_posts[i];
              //console.debug(post);
              if(post.place && post.place.name.indexOf('Library') != -1) {  
                user_badges.push({ name: 'Viva La Papel!', 
                      type: 'place',
                      content: JSON.stringify(post.location)
                    });
                break;
              }
            }
          };
          
          this.canIHazCheeseburger = function(status_posts) {
            for(var i = 0; i < status_posts.length; i++) {
              post = status_posts[i];
              if(post["place"] 
                && (
                     post.place.name.indexOf('Buffet') != -1
                  || post.place.name.indexOf('Restaurant') != -1 
                  || post.place.name.indexOf('Ramen') != -1 
                    ) ) {  
                user_badges.push({ name: 'Can I Haz Cheeseburger?', 
                      type: 'place',
                      content: JSON.stringify(post["location"])
                    });
                break;
              }
            }
          }


          this.cameraSweetHeart = function(photos) {
            var photoList = photos.data;
            for(var photoIndex = 0; photoIndex < photoList.length; photoIndex++) {
              if (photoList[photoIndex]['likes'])
                var likes = photoList[photoIndex].likes.data;
              else
                continue;
              if(likes.length>=50) {
                // push badge to photo db
                user_badges.push({
                  name: 'Camera Sweetheart',
                  type: 'photo',
                  content: photoList[photoIndex].images[0].source
                })
              }
            }
          }

          this.lovebirds = function(data) {
            if (data["relationship_status"] && data["relationship_status"] === "In a Relationship") {
              user_badges.push({
                name: 'lovebirds',
                type: 'relationship',
                content: data["relationship_status"]
              });
            }
          }

          this.flyOnTheWall = function(data) {
            if (data["relationship_status"] && data["relationship_status"] === "It's Complicated") {
              user_badges.push({
                name: 'Fly On the Wall',
                type: 'relationship',
                content: data["relationship_status"]
              });
            }
          }

          this.aRealGuitarHero = function(data) {
            var concertRegex = /music|concert|chamber|sing/;
            var eventList = data["events"];
            if (eventList) {
              for (var eventIndex = 0; eventIndex < eventList.data.length; eventIndex++) {
                var name = eventList.data[eventIndex];
                if (concertRegex.test(name)) {
                  user_badges.push({
                    name: 'A Real Guitar Hero',
                    type: 'events',
                    content: "I'm going to " + name
                  });
                }
              }
            }
          }

          this.letThemEatCake = function(data) {
                var birthdate;
                if (data['birthday'])
                  birthdate = data.birthday; 
                else 
                  return;
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

          this.tooManyLikes = function(status_posts) {
             for(var i = 0; i < status_posts.length; i++) {
                var post = status_posts[i];
                if (post["likes"] && post.likes.data.length >= 20) {
                        user_badges.push({
                                name: 'Too Many Likes',
                                type: 'status',
                                content: post.data.message
                        });
                }
              }
          }

          this.gleefulPopularity = function(status_posts) {
            for (var i = 0; i < status_posts.length; i++) {
              var post = status_posts[i];
              if (post["comments"] && post.comments.data.length >= 10) {
                user_badges.push({
                  name: "Gleeful Popularity",
                  type: "status",
                  content: post.data.message
                });
              }
            }
          }

          this.lifeIsComplete = function(data) {
            if (data["relationship_status"] && data["relationship_status"] === "Single") {
              user_badges.push({
                name: 'Life is Complete',
                type: 'relationship',
                content: data["relationship_status"]
              });
            }
          }

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
            getUserBadges();

            this.user_id = Data.id;
            if (Data["statuses"]  && (Data["statuses"])["data"]) {
              this.tooManyLikes(Data.statuses.data);
              this.vivaLaPapel(Data.statuses.data);  //Checked into library
              this.canIHazCheeseburger(Data.statuses.data); // Checked into restaurant
              this.gleefulPopularity(Data.statuses.data);
            }

            if (Data["photos"]) {
              this.cameraSweetHeart(Data.photos);
            }

            if (Data["likes"] && (Data["likes"])["data"]) {
              this.wuTanClan(Data.likes.data);
            }
            this.lovebirds(Data);
            this.aRealGuitarHero(Data);
            this.letThemEatCake(Data);
            this.flyOnTheWall(Data);
            this.lifeIsComplete(Data);


            console.debug(user_badges);
            updateUserBadges(user_badges, user_id);
            getUserBadges()

            console.debug(user_badges);

            
            //730148408?fields=photos.fields(likes)
            //console.log(data.photos.);
            //this.cameraSweetHeart(data.photos.fields);  // Over 50 likes on photo
            /*
            this.canIHazCheeseburger(data.location);  // Checked into restaurant
            this.lovebirds(data.relationship);  // Got into relationship
            this.vivaLaPapel(data.location);  //Checked into library
            this.aRealGuitarHero(data.location);  // checked into a concert
            this.flyOnTheWall(data.relationship); // it's complicated
            this.gleefulPopularity(data.status); //Over 10 people comment on your status 
            this.letThemEatCake(data.birthday);   // birthday
            this.lifeIsComolete(data.relationship); // breakup
            this.wuTanClan(); //has more than 3 sports interest 
            */
            //this.tooManyLikes();  // 20+ likes on a status post
            
          };

        }


        function callFBGraph() {
          console.debug("callFBGraph"); 
          FB.api('/me?fields=photos.fields(likes),statuses.limit(10),events,relationship_status,likes', function(response) {
            //console.debug(response)

            var bl = new badgeLogics(response);
            bl.run();
            /*
            console.debug(response);
            socket.emit('userBadgeRequest',{userID:response.id});
            var my_badges;
            socket.on('userBadgeResponse', function(user_badge_data){
              if(!user_badge_data.badges) {
                console.debug("no badges");
                my_badges = null;
              } else 
                console.debug("badges: " + user_badge_data.badges);
                my_badges = user_badge_data.badges;
            });

            for (i = 0; i < response.statuses.data.length; i++) {
              status = response.statuses.data[i];
              if (status.likes != null) {
                console.debug(status.likes.data.length);
                //if( !checkForBadge("Too Many Likes", my_badges) && status.likes.data.length > 10) {
                if (true) {
                  giveNewBadge("Too Many Likes", response.id);
                }

              break;
              }

              if (status.place != null ) {
                console.debug(status.place.location);
              }
            }
            */
          });
        }
      }
});