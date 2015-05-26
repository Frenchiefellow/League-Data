var host = "http://localhost:1337/xampp/lol/";
var urlBase = 'https://na.api.pvp.net/api/lol/';
var key = //;
var messages = [ 'User Not Found in Region', 'Unknown Error', "Matches Not Found", "Unranked", "User Data not Found"];
var apiRef = [ '/v1.4/summoner/by-name/', '/v2.2/matchhistory/', '/v2.5/league/by-summoner/' ];

// GET request to receive data from Riot API; JSON returned 
function grabData( fullUrl, apiRef ){
	var userData;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			userData = JSON.parse(xhr.responseText); //Parse to JSON to access by index
			console.log(userData);
		}
		else if(xhr.status == 404){
			console.log( messages[4] );
		}
	}
	xhr.open("GET", fullUrl, false); //Async Depreciated; may be a problem moving forward?
	xhr.send(null);	 
	
	if( userData !== undefined)
		return userData;
	else{
		switch( apiRef ){
			case apiRef[0]: 
				return messages[0];
				break;
			case apiRef[1]:
				return messages[2];
				break;
			case apiRef[2]:
				return messages[3];
				break;
			default:
				return messages[1];
				break;
		}
	}
	
		
}

// Constructs and Returns full Riot API URL 
function buildUrl(region, param, apiRef){
	return (urlBase + region + apiRef + param + key);
}

// Constructs and Returns full Riot API URL for Versions (built differently)
function versionsUrl(region){
	return (urlBase +  'static-data/' + region + '/v1.2/versions' + key)
}


// Returns the relationship between the two numbers
function comparator( num1, num2){
	if( num1 > num2)
		return 1;
	else if( num1 < num2)
		return -1;
	else
		return 0;
}

// AJAX request assembler
function toAJAX( request, URL, datas, cached, sync){
	var result;
		$.ajax({
			type: request,
			url: URL,
			data: datas,
			cache: cached,
			async: sync, 
			error: function( error ){
				result = "error";
			},
			success: function( response ){
				result = response;
			}
		});

	return result;
}
