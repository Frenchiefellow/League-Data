<?php 
$connection =  @new mysqli("localhost", "root", "", "lol", "3306");

if (mysqli_connect_errno())
	echo "Failed to connect to MySQL: " . mysqli_connect_error();

// Check if User Exists
if( isset( $_GET[ 'user' ] ) ){
	$name = $_GET[ 'user' ];
	$qString = ("SELECT * FROM `summoners` WHERE `Name` = '{$name}'" );
	$query = mysqli_query( $connection, $qString );
	$count = mysqli_num_rows( $query );
	if( $count > 0 )
		$exists = 1;
	else
		$exists = 0;


	if( $exists == 0)
		echo "false";
	else{
		$arr = array();
		$stmt = $connection->prepare( 'SELECT Name, Region, Level, pRank, cRank, icon FROM summoners WHERE Name = ? ');
		$stmt->bind_param( 's', $_GET[ 'user' ] );
		$stmt->execute();
		$stmt->bind_result( $name, $region, $level, $p, $c, $icon);
		while ( $stmt->fetch() ){
			$arr["Name"] = $name;
			$arr["Region"] = $region;
			$arr["Level"] = $level;
			$arr["pRank"] = $p;
			$arr["cRank"] = $c;	
			$arr["icon"] = $icon;
		
		}
		$stmt->close();
		echo json_encode( $arr ); 
	} 
}


// Insert User if into "Summoners" table
if( isset( $_POST[ 'update'] ) ){
	if($_POST[ 'update' ] == 0 ){
		$stmt = $connection->prepare( 'INSERT INTO summoners (Name, ID, Region, Level, pRank, cRank, icon) VALUES ( ?, ?, ?, ?, ?, ?, ? )' );
		$stmt->bind_param( 'sisissi', $_POST[ 'name'], $_POST[ 'ID' ], $_POST[ 'reg' ], $_POST[ 'level' ], $_POST[ 'p' ], $_POST[ 'c' ], $_POST[ 'icon'] );
		$stmt->execute();
		$stmt->close();
		echo "added";
	}

	// Update User in "Summoners" table
	else{
		$stmt = $connection->prepare( 'UPDATE summoners SET Name = ?, Region = ?, Level = ?, cRank = ?, icon = ? WHERE ID = ?' );
		$stmt->bind_param( 'ssisii', $_POST[ 'name' ], $_POST[ 'reg' ], $_POST[ 'level' ], $_POST[ 'c' ], $_POST[ 'icon' ], $_POST['ID']);
		$stmt->execute();
		$stmt->close();
		echo "updated";
	}
}
$connection->close();
?>