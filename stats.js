// Main Function for Stats, collects statistics totals for 10 games in the matches retreived from Riot API
function grabStats( json ){
	var totals = { "games": 0, "assists" : 0, "deaths" : 0, "doubleKills": 0, "firstBloods" : 0, "goldEarned" : 0, "goldSpent" : 0, "inhibitorKills" : 0, "kills" : 0, "magicDamageDealt" : 0, "magicDamageDealtToChampions" : 0, "magicDamageTaken" : 0, "minionsKilled" : 0, "neutralMinionsKilled" : 0, "neutralMinionsKilledEnemyJungle" : 0, "neutralMinionsKilledTeamJungle" : 0, "pentaKills" : 0, "physicalDamageDealt" : 0, "physicalDamageDealtToChampions" : 0, "physicalDamageTaken" : 0, "quadraKills" : 0, "sightWardsBoughtInGame" : 0, "totalDamageDealt": 0, "totalDamageDealtToChampions" : 0, "totalDamageTaken" : 0, "totalHeal" : 0, "towerKills" : 0, "tripleKills" : 0, "trueDamageDealt" : 0, "trueDamageDealtToChampions": 0, "trueDamageTaken" : 0, "visionWardsBoughtInGame" : 0, "wardsKilled" : 0, "wardsPlaced" : 0, "Wins" : 0, "Losses": 0};
	$.each( json.matches, function(key, val){
		statCollection( this, totals );
	});
	renderStats( totals );
}

// Returns/Assigns relevant statistics from the given match to the Total Statistics Object
function statCollection( match, totals ){
	var location = match.participants['0'].stats;

	totals.games++;
	if( location.firstBloodKill === true)
			totals.firstBloods++;
	if( location.winner === true )
		totals.Wins++;
	else
		totals.Losses++;

	$.each( location, function ( key, val ){
		$.each( totals, function( i, j){
			if( i.toString() === key.toString() ){
				totals[i] += location[key];
			}
		})
	})
}

// Displays Stats to User
function renderStats( totals ){
	$('#dataDump').html("");
		
	//temporary functionality; definitely not final implementation
	$.each( totals, function( key, val){
		var html;
		try{
			key = key.split(/(?=[A-Z])/);
			key = key.toString().replace(/,/g, " ").toUpperCase();
		}catch( e ){
			console.log(e);
		}
		if( key === "GAMES")
			html =  "<span>" + key + ": " + val + "</span><br>";
		else if( key === "WINS" || key === "LOSSES" ) 
			html =  "<span>" + key + ": " + val + " (" + ((val/totals.games) * 100) + "%)</span><br>";
		else
			html = "<span>" + key + ": " + val + "  (" + (val/totals.games) + " per game)</span><br>";

		$('#dataDump').append(html);
	});

	$('#dataDump').css({"margin-left" : "20px"});
	
}