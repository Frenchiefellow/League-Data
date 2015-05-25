// Add or Update Basic User info in DB
function userToDB( user, ID, region, level, pR, cR, icon, update){
	var result;
	$.ajax({
		type: "POST",
		url: 'http://localhost:1337/xampp/lol/userDB.php?',
		data: 'name=' + user + "&ID=" + ID + "&reg=" + region.toUpperCase() + '&level=' + level + "&p=" + pR + "&c=" + cR + "&icon=" + icon + "&update=" + (update === true ? 1 : 0 ),
		cache: false,
		async: false, //Depreciated, may be a problem going forward?
		error: function( error ){
			result =  error;
		},
		success: function( response ){
			result = response;
		}
	});
	// Returns "added" or "updated" on success
	return result;
}

// Checks Whether User Exists in Our DB
function userExists( user ){
	var result;
	$.ajax({
		type: "GET",
		url: 'http://localhost:1337/xampp/lol/userDB.php?user=' + user,
		cache: false,
		async: false, //Depreciated, may be a problem going forward?
		error: function( error ){
			result = "error";
		},
		success: function( response ){
			result = response;
		}
	});

	// Returns False if not exists, otherwise returns User values in an array. 
	return result;
}

// Updates the Winrate for the Given Champion and Checks for Redundant Matches (i.e. will not update winrate from same match twice)
function winrates( champ, ID, result, division, matchID, sumID ){
	var result;
		$.ajax({
			type: "POST",
			url: 'http://localhost:1337/xampp/lol/champDB.php?',
			data: "champ=" + champ + "&ID=" + ID + "&win=" + result + "&div=" + division + "&mID=" + matchID + "&sumID=" + sumID,
			cache: false,
			async: false, //Depreciated, may be a problem going forward?
			error: function( error ){
				result = "error";
			},
			success: function( response ){
				result = response;
			}
		});

	return result;
}


//Returns whether the match has already been used to update Champion winrate
function checkRedundantMatch( matchID, sumID ){
	var result;
	$.ajax({
		type: "GET",
		url: 'http://localhost:1337/xampp/lol/champDB.php?',
		data: "check=true&sumID=" + sumID,
		cache: false,
		async: false, //Depreciated, may be a problem going forward?
		error: function( error ){
			result = "error";
		},
		success: function( response ){
			result = response;

		}
	});

	if( result === "No Value")
		return "No Matches Updated";
	else
		return ( Number(result) < Number(matchID) ) ? false : true;
	
	

}
