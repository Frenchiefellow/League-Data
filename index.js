
// Pulls User data from Search Page Form
function grabUserForm(){
	// Replace spaces with %20 character spaces otherwise link doesn't work
	var user = $('#userName').val().replace(/ /g, "%20");
	var region = $('#region :selected').val();

	if( user !== undefined)
		location = 'http://localhost:1337/xampp/lol/user.html?user='+ user + "&region=" + region;
	else
		location = 'http://localhost:1337/xampp/lol/';

	return false;


}


