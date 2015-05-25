/**
* 
* THINGS TO POTENTIALLY FACTOR IN:
*
* Individual Statistics:
*** Overall Winrate
*** Winrate on Champion
*** Winrate Last 10 games
*** Advantages over enemy laner? (Division, K:D, winrate, etc)
*
* Champion Statistics-Overall/Tier
*** Individual Winrates (Pulled/Derived)
*** Bot Lane Synergies (Winrates) (Derived)
*** Comp Winrates (Derived)
*** Champion Synergies (Derived)
*** Champion 
*
* Map Side Winrates (Pulled/Derived)
*
* Check Duo-Queues
*** Pairing Winrate (derived)
*** Champion Synergies 
*** Laning Synergies? (e.g If both bot, or Mid/jg)
*
**/

//Main Function
function startAssessment( match ){
	//retrieve match
	var players = grabPlayers( match );
	var result = gatherData( players );
	displayResults( results );
}

//Retrieves Players in the Current Match
function grabPlayers( match ){
	var players;
	//retrieve players, champions, etc.
	return players;
}

//Grabs Relevant Data for analysis
function gatherData( players ){
		var champs = summoners = Array();
		$.each( players.champions, function( key, val){
			champs.push(this);
		});
		$.each( players, function(key, val){
			summoners.push(this.username);
		});

		var champData = retrieveChampionStatistics( champs );
		var playerData = retrievePlayerStatistics( summoners );


		//Collect any other data;
		//start analysis
		return expectedResult;
}

//Retrieves relevant Champion Statistics
function retrieveChampionStatistics( champions ){
	// get Champion Data from DB
	// get comp data
	// get synergy data
	return superNestedDataJSON;
}

//Retrieves relevant Player Statistics
function retrievePlayerStatistics ( player ){
	//Get Relevant Player Data
	return superNestedDataJSON;
}

//Displays the Results to the User
function displayResults( results ){
	//HTMLize and CSSize the results
}

// Updates the Winrates of All Champs and Pairings in the DB
function updateWinRates( champs, result ){
	var length = champs.length;
	if(length === 1){
		//update individual winrates in DB
	}
	else{
		for(Object x in champs)
			//update individual winrates in DB
			//update comp winrate in DB
			//update winrate with each champ in DB
		for( champ.role === 'BOT' in champs )
			//Find all BOT champs, update bot lane synergy in DB
	}	
}

// Assign Roles to Champs (Jungle, Mid)
function assignComp( champs ){
	for(Object x in champs)
		//GET Champ Name
		//GET Champion.JSON and retrieve its Roles
		//Check Summoner spells, farm, items (Look for Smite, low farm per minute, support/jungle items )
		//Factor in any other things that may determine role. 
		//Determine probability that champ X is Role Y
		//Assign Champ.role (Mid, Bot, Jungle, Top)
		//Assign Champ.subRole (ADC, support, tank, mage, assassin, fighter, etc.)
}