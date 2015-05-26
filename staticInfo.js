//Retrives fully updated Champion.JSON from Riot Data Dragon
function grabChampionJSON( version ){
	var url = "http://ddragon.leagueoflegends.com/cdn/" + version + "/data/en_US/champion.json";
	return grabData( url, {} );	
}

//Returns Champion Name and ID based on ID parameter
function extractChampName( champID, champData ){
	var cName;
	$.each( champData.data, function( name, val ){
		if( this.key === champID.toString() ){
			cName = this.name;
		}
	});
	
	// Remove any characters from the Name for easy DB storage
	return [cName.toString().replace(/'/g, "") , champID] ;
}