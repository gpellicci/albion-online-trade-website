<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ao-db";
$cookie_name = "user";

if(!isset($_COOKIE[$cookie_name])){
	http_response_code(500);
	echo "or there";
}
else{
	echo "you there";
	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	// Check connection
	if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	}

	//retrieve data received through POST request (what to search)
	$data = json_decode(file_get_contents('php://input'), true);
	$user_cookie = json_decode($_COOKIE[$cookie_name], true);
	$discord_id = $user_cookie["discord_id"];
	$item = $data['name'];
	$tier  = $data['tier'];
	$enchant = $data['enchant'];
	$quality  = $data['quality'];
	$price = $data['price'];
	$item_localized_name = mysql_real_escape_string($data['localized_name']);
	$item_description = mysql_real_escape_string($data['item_description']); 
	$quantity = $data['quantity']; 

	$user_array = array();
	$user_id = "";

	$sql = "SELECT user_id FROM user WHERE discord_id = '$discord_id'";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
	    // output data of each row
	    while($row = $result->fetch_assoc()) {
	        $user_id = $row["user_id"];
	    }
	} else {
	    echo "0 results";
	}






	//mysql query
	$sql = "INSERT INTO sale (user_id, item, tier, enchant, quality, price, item_localized_name, item_description, quantity) VALUES ('$user_id', '$item', '$tier', '$enchant', '$quality', '$price', '$item_localized_name', '$item_description', '$quantity')";

	if ($conn->query($sql) === TRUE) {
	    echo "New record created successfully";
		http_response_code(200);
	} else {
		http_response_code(500);
	    echo "Error: " . $sql . "<br>" . $conn->error;
	    //conn->errno errorcode
	}
	$conn->close();
}
?>