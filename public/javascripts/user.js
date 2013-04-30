var socket = io.connect('http://localhost:3000');
socket.on('ack', function(data) {
		console.log("socket!");
		var html;
        var user_badges;
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
		
		$('#todaylistadd').prepend(html);});
    });