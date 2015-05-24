function grabChampionJSON(){
	var url = "http://ddragon.leagueoflegends.com/cdn/5.2.1/data/en_US/champion.json";
	return grabData( url, {} );	
}

function extractChampName( champID, champData ){
	var cName;
	$.each( champData.data, function( name, val ){
		if( this.key === champID.toString() ){
			cName = this.name;
		}
	});
	return cName;
}