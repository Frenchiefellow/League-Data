// Main function for Loading Page details and assets
function assignPageDetails(){
	fetchUser( userExists( getUserName()), getUserName(), getRegion() );
}

// Returns User Name from Query String
function getUserName(){
	var location = window.location.href;
	var user = location.substring( location.indexOf("?") + 1 , location.indexOf("&"));
	user = user.substring( user.indexOf("=") + 1, user.length );
	return user;
}

// Returns Region from Query String
function getRegion(){
	var location = window.location.href;
	var region = location.substring( location.indexOf("&") + 1, location.length);
	region = region.substring( region.indexOf('=') + 1, region.length );
	return region;
}


// Display User Information in HTML
function HTMLize( array, rank, version ){
		$('#user').html( array.Name );
		$('#region').html( array.Region);
		$('#level').html( array.Level );
		$('#pRank').html( array.pRank);
		$('#cRank').html( array.cRank );

		$('#profileIcon').attr("src", "http://ddragon.leagueoflegends.com/cdn/" + version + "/img/profileicon/" + array.icon + ".png ");
		
		assignRankColors( array.cRank.toLowerCase(), true );
		assignRankColors( array.pRank.toLowerCase(), false);

		if( rank !== undefined)
			$("#delta").html(rank);

}

// Add Appropriate Color Gradient to User Based on Given Rank
function assignRankColors( rank, type ){

		//Ternary for checking rank type (current or previous), so to add border to Icon for Current Rank
		var id = (type === true) ? $('#curRank ,#profileIcon') : $('#prevRank');
		//Ternary for checking if the Rank has other data appended to it (e.g. LP)
		rank = (rank.indexOf(" ") > -1 ) ? rank.substring(0, rank.indexOf(" ")) : rank;

		switch( rank ){
			case 'unranked':
					// If unranked, we don't want to make the icon hidden, so redefine the id's element
					id = (type === true) ? $('#curRank') : $('#prevRank');
					id.css("visibility", "hidden");
					break;
			case 'bronze':
					id.addClass('bronzeGradient');
					break;
			case 'silver':
					id.addClass('silverGradient');
					break;
			case 'gold':
					id.addClass('goldGradient');
					break;
			case 'platinum':
					id.addClass('platGradient');
					break;
			case 'diamond':
					id.addClass('diamondGradient');
					break;
			case 'master':
					id.addClass('masterGradient');
					break;
			case 'challenger':
					id.addClass('challGradient');
					break;
			default:
					break;
		}
}

//Grabs User information from Riot and/or DB
function fetchUser( param, userQ, regionQ, match, rank){
	var result;
	switch( param ){
		case "error" :
			console.log( 'Error Finding User.' );
			break;

		case "false":
		case 'update':
			// Retrieve Version Number for DDragon data retrieval from Riot
			var versions = grabData( versionsUrl( regionQ.toLowerCase() ) );
			var dataSet = grabData( buildUrl( regionQ, userQ, apiRef[0] ), apiRef[0] );
			var sumID = dataSet[userQ.replace("%20", "")]['id']; // Replace space characters so we can access index
			var matches = grabData( buildUrl( regionQ, sumID, apiRef[1] ), apiRef[1] );
			var tier;
			var diff;
			var currentRank;

			//Grab Current (displayed) Division and LP (Stored since last update)
			if( $('#cRank').text() !== "" && $("#cRank").text() !== "Unranked"){
					currentRank = $('#cRank').text().split(' ');
					currentRank = getRank( currentRank[1], currentRank[3].substring(0, currentRank[3].indexOf("L")));
			}

			// Riot returns 404 in the case of Currently Unranked, thus the Try block.
			try{
		  		tier = grabData( buildUrl( regionQ, sumID + '/entry', apiRef[2] ), apiRef[2] );
		  	}catch( e ){
		  		console.log( e + ": Error" );
		  	}
		  	
		
			var user = dataSet[userQ.replace("%20", "")]['name'];
			var icon = dataSet[userQ.replace("%20", "")]['profileIconId'];
			var level = dataSet[userQ.replace("%20", "")]['summonerLevel'];
			var pRank, cRank;
		
			// As long as the request for Rank didn't 404 above
			if( tier !== messages[3] && tier !== messages[1]){
				cRank = tier[sumID][0]['tier'] + " " + tier[sumID][0]['entries'][0]['division'] + " - " + tier[sumID][0]['entries'][0]['leaguePoints'] + "LP";
				diff = getRank( tier[sumID][0]['entries'][0]['division'] , tier[sumID][0]['entries'][0]['leaguePoints'] );
				pRank = matches['matches'][0]['participants'][0]['highestAchievedSeasonTier'];
			}
			else{
				cRank = "Unranked";
				pRank = "Unranked";
			}

			results = (param === 'false') ? userToDB( user, sumID, regionQ, level, pRank, cRank, icon, false ) : userToDB( user, sumID, regionQ, level, pRank, cRank, icon, true );
		
			window.localStorage.setItem('m', JSON.stringify(matches));
			
			if( results === "added" || results === 'updated'){
				if( currentRank !== undefined || diff !== undefined)
					fetchUser( userExists( user ), user, regionQ, matches, gainLoss( currentRank, diff) ); // Call this method again to extract and display User Information
				else
					fetchUser( userExists( user ), user, regionQ, matches, {} );
			}
			grabStats( matches, sumID, false, versions[0] ); 

			break;

		default:
			// Retrieve Version Number for DDragon data retrieval from Riot
			var versions = grabData( versionsUrl( getRegion().toLowerCase() ) );

			HTMLize( JSON.parse( param ), rank, versions[0] ); // Parse it to JSON so you can access by index
			
			var sumAssoc, sID;
			if( match === undefined ){
				try{
					match = JSON.parse( window.localStorage.getItem('m') ) ;
					sID = match.matches['0'].participantIdentities['0'].player.summonerId
					sumAssoc = match.matches['0'].participantIdentities['0'].player.summonerName.toLowerCase();
				}catch( e ){
					console.log( e );
				}

				// Check to make sure that any match in localStorage is the correct one for the User Name
				
				if( match === null || sumAssoc !== getUserName().toLowerCase() ){
					var userData = JSON.parse( userExists( userQ ) );
					match = grabData( buildUrl( regionQ, userData.ID, apiRef[1] ), apiRef[1] );
					window.localStorage.setItem('m', JSON.stringify(match));
					sID = match.matches['0'].participantIdentities['0'].player.summonerId;
					grabStats( match, sID, false, versions[0] );
				}
			}

			grabStats( match, sID,  true, versions[0] );
			break;


	}
}

//Determines Division Number from Roman Numerals and returns division number and LP in an array. 
function getRank( div, lp){
	var division;
	switch (div){
		case "I" :
				division = 1;
				break;
		case "II" :
				division = 2;
				break;
		case "III" :
				division = 3;
				break;
		case "IV" : 
				division = 4;
				break;
		case "V" :
				division = 5;
				break;
		default : 
				break;
	}
	return [division, lp];

}

//Determines the change in LP since last update
function gainLoss( cur, newer ){
	var deltaDiv, deltaLP, delta;
	deltaDiv = comparator( cur[0], newer[0] ); //Return relation between the two divisions (e.g >, <, =)

	switch( deltaDiv ){
		case 0:
			if( deltaLP === 0)
				delta = 0;
			else 
				delta = newer[1] - cur[1];
			break;
		case 1:
			delta =  (100 - cur[1]) + newer[1];
			break;
		case -1:
			delta = (newer[1] - 100) - cur[1];
			break;
		default:
			break;
	}
	return (delta >= 0) ? "+" + delta + "LP" : delta + "LP"; //Returns +(X)LP if >=0, -(X)LP otherwise
}



