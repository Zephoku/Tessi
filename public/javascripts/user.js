var socket = io.connect('http://localhost:3000');
socket.on('ack', function(data) {
	$(document).ready(function(){
		console.log("socket!");
		var html;
		var user_badges_ 
			= '[{"name":"Viva La Papel!","url":"/img/check_in_library.png","type":"place","content":"{\"street\":\"220 Powell Library Building\",\"city\":\"Los Angeles\",\"state\":\"CA\",\"country\":\"United States\",\"zip\":\"90095 \",\"latitude\":34.071823430229,\"longitude\":-118.44226221743}"},{"name":"Can I Haz Cheeseburger?","type":"place","url":"/img/check_in_food.png","content":"{\"street\":\"875 N Wilcox Ave\",\"city\":\"Montebello\",\"state\":\"CA\",\"country\":\"United States\",\"zip\":\"90640-1801\",\"latitude\":34.032269635641,\"longitude\":-118.12607202}"},{"name":"Camera Sweetheart","url":"/img/50photolikes.png","type":"photo","content":"http://sphotos-b.xx.fbcdn.net/hphotos-snc7/581624_2959459002209_971152391_n.jpg"},{"name":"Life is Complete","url":"/img/relation_to_single.png","type":"relationship","content":"Single"}]'
        var user_badges = JSON.parse(user_badges_)
        socket.emit('userBadgeRequest', {userID: 730148408});
        console.debug("request emitted");
		socket.on('userBadgeResponseUser', function(user_data){
			    user_badges = user_data.badges;
			    console.log("data fetched!" + user_badges);
			    
			    if (document.getElementById("nothinghasbeendone") && user_badges.length !== 0) {
				$("#nothinghasbeendone").remove();
				//var arrayBadgeName = [];

				for(var temp = 0; i < user_badges.length; temp++) {
				    //user_badges[temp].name;
					
					if (temp == 0) {
					html = '<div class="row"><div class="span4" id="todaylist"><p id="dynamiclist" class="dynamiclisttext"><img class="badgesonboard" src="'+user_badges[temp].url+'">'+user_badges[temp].name+'</p><p class="dynamiclistcaveat">'+user_badges[temp].content+'</p></div>';
				    } else if (temp%2 != 0) {
					html += '<div class="span4" id="todaylist"><p id="dynamiclist" class="dynamiclisttext"><img class="badgesonboard" src="'+user_badges[temp].url+'">'+user_badges[temp].name+'</p><p class="dynamiclistcaveat">'+user_badges[temp].content+'</p></div></div>';
				    } else {
					html += '<div class="row"><div class="span4" id="todaylist"><p id="dynamiclist" class="dynamiclisttext"><img class="badgesonboard" src="'+user_badges[temp].url+'">'+user_badges[temp].name+'</p><p class="dynamiclistcaveat">'+user_badges[temp].content+'</p></div>';
				    }
				}

				} else {
        
				for(var temp = 0; i < user_badges.length; temp++) {
				    //user_badges[temp].name;
					if (temp == 0) {
					html = '<div class="row"><div class="span4" id="todaylist"><p id="dynamiclist" class="dynamiclisttext"><img class="badgesonboard" src="'+user_badges[temp].url+'">'+user_badges[temp].name+'</p><p class="dynamiclistcaveat">'+user_badges[temp].content+'</p></div>';
				    } else if (temp%2 != 0) {
					html += '<div class="span4" id="todaylist"><p id="dynamiclist" class="dynamiclisttext"><img class="badgesonboard" src="'+user_badges[temp].url+'">'+user_badges[temp].name+'</p><p class="dynamiclistcaveat">'+user_badges[temp].content+'</p></div></div>';
				    } else {
					html += '<div class="row"><div class="span4" id="todaylist"><p id="dynamiclist" class="dynamiclisttext"><img class="badgesonboard" src="'+user_badges[temp].url+'">'+user_badges[temp].name+'</p><p class="dynamiclistcaveat">'+user_badges[temp].content+'</p></div>';
				    }
				}

			    }


			});
		
		$('#todaylistadd').prepend(html);});
    });