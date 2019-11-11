<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ao-db";
$cookie_name = "user";

if(!isset($_COOKIE[$cookie_name])){
	http_response_code(500);
}
else{
	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	// Check connection
	if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	}

	//retrieve data received through POST request (what to search)
	$data = json_decode($_COOKIE[$cookie_name], true);
	$discord_id = $data['discord_id'];

	//mysql query
	$sql = "SELECT '$discord_id' as my_id, u.discord_id as discord_id, s.sale_id as sale_id, s.item as item_uniquename, s.tier as item_tier, s.enchant as item_enchant, s.quality as item_quality, s.price as item_price, s.item_localized_name as item_localized_name, s.quantity as item_quantity, s.ts as announce_birth FROM user u inner join sale s on u.user_id=s.user_id ORDER BY s.ts DESC LIMIT 200";
	$result = $conn->query($sql);


	$json_array = array();
	if ($result->num_rows > 0) {
	    // output data of each row
	    while($row = mysqli_fetch_assoc($result)) {
	    	$json_array[] = $row;
	    }
	    echo json_encode($json_array);
	} else {
	    echo json_encode("{}");
	}
	http_response_code(200);



	$conn->close();
}
?>