var socket = io.connect('http://localhost:3000');
socket.on('ack', function(data) {
    if (data.init) {
        console.log("socket initialized...accepting facebook login...");
        // Additional JS functions here
        window.fbAsyncInit = function() {
            FB.init({
                appId      : '443581165736594', // App ID
                channelUrl : './channel.html', // Channel File
                status     : true, // check login status
                cookie     : true, // enable cookies to allow the server to access the session
                xfbml      : true  // parse XFBML
            });

            // Additional init code here
            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    // connected
                    console.log("UserID: " + response.authResponse.userID);
                    socket.emit('userID', {userID:response.authResponse.userID});
                } else if (response.status === 'not_authorized') {
                    // not_authorized
                } else {
                    // not_logged_in
                }
            });
        };

        function login() {
            FB.login(function(response) {
                if (response.authResponse) {
                    // connected
                    testAPI();
                } else {
                    // cancelled
                }
            });
        }

        function getLogin() {
            // Additional init code here
            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    testAPI();
                    // connected
                    var uid = response.authResponse.userID;
                    console.log("UserID: " + uid);
                } else if (response.status === 'not_authorized') {
                    // not_authorized
                    login();
                } else {
                    // not_logged_in
                    login();
                }
                
            });
        }

        function testAPI() {
            console.log('Welcome!  Fetching your information.... ');
            FB.api('/me', function(response) {
                console.log('Good to see you, ' + response.name + '.');
            });
        }


        // Load the SDK Asynchronously
        (function(d){
            var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement('script'); js.id = id; js.async = true;
            js.src = "//connect.facebook.net/en_US/all.js";
            ref.parentNode.insertBefore(js, ref);
        }(document));
    }
});