<?php 
$connection =  @new mysqli("localhost", "root", "", "lol", "3306");

if (mysqli_connect_errno())
	echo "Failed to connect to MySQL: " . mysqli_connect_error();

if( isset($_POST['mID'])){
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


	// Check if Champ Exists in DB
	$qString = ("SELECT * FROM `champs` WHERE `Table` = '{$tableID}'" );
	$query = mysqli_query( $connection, $qString );
	$count = mysqli_num_rows( $query );
	if( $count > 0 )
		$exists = 1;
	else
		$exists = 0;


	$qString = ("SELECT * FROM `recorded` WHERE `sumID` = '{$sumID}'" );
	$query = mysqli_query( $connection, $qString );
	$count = mysqli_num_rows( $query );
	if( $count > 0 )
		$recorded = 1;
	else
		$recorded = 0;



	// If Champ does not exist, add it
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

	if( $recorded == 0){
			$stmt = $connection->prepare( 'INSERT INTO recorded (MatchID, sumID) VALUES (?, ?)');
			$stmt->bind_param( 'ii', $match, $sumID );
			$stmt->execute();
			$stmt->close();
			echo " User Recorded added!";
	}
	else{
			$stmt = $connection->prepare( 'UPDATE recorded SET MatchID = ? WHERE sumID = ?' );
			$stmt->bind_param( 'ii', $match, $sumID );
			$stmt->execute();
			$stmt->close();
			echo " User Recorded updated!";
	}
}

if(isset($_GET['check'])){
	$sumID = $_GET['sumID'];
	$qString = ("SELECT MatchID FROM `recorded` WHERE `sumID` = '{$sumID}'" );
	$query = mysqli_query( $connection, $qString );
	$row = mysqli_fetch_row( $query );
	$count = mysqli_num_rows( $query );
	if( $count == 0)
		echo "No Value";
	else
		echo $row[0];
}


$connection->close();

?>