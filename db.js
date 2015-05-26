// Add or Update Basic User info in DB
function userToDB( user, ID, region, level, pR, cR, icon, update){
	var result = toAJAX( "POST", 'http://localhost:1337/xampp/lol/userDB.php?', 'name=' + user + "&ID=" + ID + "&reg=" + region.toUpperCase() + '&level=' + level + "&p=" + pR + "&c=" + cR + "&icon=" + icon + "&update=" + (update === true ? 1 : 0 ), false, false  );

	// Returns "added" or "updated" on success
	return result;
}

// Checks Whether User Exists in Our DB
function userExists( user ){
	var result = toAJAX( "GET", 'http://localhost:1337/xampp/lol/userDB.php?', 'user=' + user, false, false );

	// Returns False if not exists, otherwise returns User values in an array. 
	return result;
}

// Updates the Winrate for the Given Champion and Checks for Redundant Matches (i.e. will not update winrate from same match twice)
function winrates( champ, ID, result, division, matchID, sumID ){
	var result = toAJAX( "POST", 'http://localhost:1337/xampp/lol/champDB.php?', "champ=" + champ + "&ID=" + ID + "&win=" + result + "&div=" + division + "&mID=" + matchID + "&sumID=" + sumID, false, false );

	return result;
}


//Returns whether the match has already been used to update Champion winrate
function checkRedundantMatch( matchID, sumID ){
	var result = toAJAX("GET", "http://localhost:1337/xampp/lol/champDB.php?",  "check=true&sumID=" + sumID, false, false );

	if( result === "No Value")
		return "No Matches Updated";
	else if( result === "error")
		console.log(result);
	else
		return ( Number(result) < Number(matchID) ) ? false : true;
	
	

}
