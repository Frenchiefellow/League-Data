//Retrives fully updated Champion.JSON from Riot Data Dragon
function grabChampionJSON(){
	var url = "http://ddragon.leagueoflegends.com/cdn/5.2.1/data/en_US/champion.json";
	return grabData( url, {} );	
}

//Returns Champion Name based on ID parameter
function extractChampName( champID, champData ){
	var cName;
	$.each( champData.data, function( name, val ){
		if( this.key === champID.toString() ){
			cName = this.name;
		}
	});
	return cName.toString();
}