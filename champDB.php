<?php 
$connection =  @new mysqli("localhost", "root", "", "lol", "3306");

if (mysqli_connect_errno())
	echo "Failed to connect to MySQL: " . mysqli_connect_error();

/********************************************************************************************/
if( isset($_POST['mID'])){ // If matchID is set
	$match = $_POST['mID'];
	$champ = $_POST['champ'];
	$ID = $_POST['ID'];
	$win = $_POST['win'];
	$div = $_POST['div'];
	$sumID = $_POST['sumID'];
	$games = 1;
	$tableID = $champ . $div;
	$exists = 0; 
	$recorded = 0;
	$overall = 0;

/********************************************************************************************/
	// Check if Champ-Division relationship Exists in DB
	$qString = ("SELECT * FROM `champs` WHERE `Table` = '{$tableID}'" ); //Table in `` as it's a protected variable name
	$query = mysqli_query( $connection, $qString );
	$count = mysqli_num_rows( $query );
	if( $count > 0 )
		$exists = 1;
	else
		$exists = 0;

/********************************************************************************************/
	// Check if Champ-Overall relationship Exists in DB
	$qString = ("SELECT * FROM `overallwin` WHERE `Name` = '{$champ}'" ); //Table in `` as it's a protected variable name
	$query = mysqli_query( $connection, $qString );
	$count = mysqli_num_rows( $query );
	if( $count > 0 )
		$overall = 1;
	else
		$overall = 0;

/********************************************************************************************/
	//  Checks to see if User has most recently updated matchID
	$qString = ("SELECT * FROM `recorded` WHERE `sumID` = '{$sumID}'" );
	$query = mysqli_query( $connection, $qString );
	$count = mysqli_num_rows( $query );
	if( $count > 0 )
		$recorded = 1;
	else
		$recorded = 0;


/********************************************************************************************/
	// If Champ-Division relationship does not exist, add it
	if( $exists == 0){
		$stmt = $connection->prepare( 'INSERT INTO champs (`Table`, ChampID, Games, Wins, Winrate, Division, Name) VALUES ( ?, ?, ?, ?, ?, ?, ? )' );
		$stmt->bind_param( 'siiidss', $tableID, $ID, $games, $win, $win, $div, $champ );
		$stmt->execute();
		$stmt->close();

		echo $champ . " added!";
	}
	// Else, update it
	else{
			$stmt = $connection->prepare( 'UPDATE champs SET Games = Games + 1, Wins = Wins + ?, Winrate = (Wins / Games)  WHERE `Table` = ?' );
			$stmt->bind_param( 'is', $win, $tableID);
			$stmt->execute();
			$stmt->close();

			echo $champ . " updated!";
		
	}

/*********************************************************************************************/
	//If Champ doesn't have overall-winrate, Add Overall Champ Winrate to overallwin table
	if( $overall == 0){
		$stmt = $connection->prepare( 'INSERT INTO overallwin (Name, ChampID, Games, Wins, Winrate) VALUES ( ?, ?, ?, ?, ?)' );
		$stmt->bind_param( 'siiid', $champ, $ID, $games, $win, $win);
		$stmt->execute();
		$stmt->close();
		echo " " . $champ . " overall added!";
	}
	//Else, update overall-winrate
	else{
		$stmt = $connection->prepare( 'UPDATE overallwin SET Games = Games + 1, Wins = Wins + ?, Winrate = (Wins / Games) WHERE Name = ?');
		$stmt->bind_param( 'is', $win, $champ);
		$stmt->execute();
		$stmt->close();
		echo " " . $champ . " overall updated!";
	}

/********************************************************************************************/
	// If User has no recently updated matchID, associate the User with most recent matchID
	if( $recorded == 0){
			$stmt = $connection->prepare( 'INSERT INTO recorded (MatchID, sumID) VALUES (?, ?)');
			$stmt->bind_param( 'ii', $match, $sumID );
			$stmt->execute();
			$stmt->close();
			echo " User Recorded added!";
	}

	// Else, update the User's most recent matchID
	else{
			$stmt = $connection->prepare( 'UPDATE recorded SET MatchID = ? WHERE sumID = ?' );
			$stmt->bind_param( 'ii', $match, $sumID );
			$stmt->execute();
			$stmt->close();
			echo " User Recorded updated!";
	}
}

/********************************************************************************************/
// Retrieve User's most recent match result, if it exists
if(isset($_GET['check'])){ // If "redundancy" check is set 
	$sumID = $_GET['sumID'];
	$qString = ("SELECT MatchID FROM `recorded` WHERE `sumID` = '{$sumID}'" );
	$query = mysqli_query( $connection, $qString );
	$row = mysqli_fetch_row( $query );
	$count = mysqli_num_rows( $query );
	if( $count == 0)
		echo "No Value";
	else
		echo $row[0]; //MatchID
}

/********************************************************************************************/
$connection->close();

?>