<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ao-db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//retrieve data received through POST request (what to search)
$data = json_decode(file_get_contents('php://input'), true);
$item = $data['name'];
$quality  = $data['quality'];
$tier  = $data['tier'];
$enchant = $data['enchant'];
$city = $data['city'];

//build where clause depending on item, quality, tier, enchant -> concat with .

$tmp_query = "SELECT u.name as seller_name, u.discord_id as seller_discord_id, b.item as item_uniquename, b.tier as item_tier, b.enchant as item_enchant, b.quality as item_quality, b.price as item_price, b.item_localized_name as item_localized_name, b.item_description as item_description, b.quantity as item_quantity, (unix_timestamp() - unix_timestamp(b.ts)) as announce_age, b.city as city FROM user u inner join buyorder b on u.user_id=b.user_id WHERE 1 ";

if($item != "")
	$tmp_query .= "AND b.item LIKE '%$item%' ";

if($tier != "")
	$tmp_query .= "AND b.tier = '$tier' ";

if($enchant != "")
	$tmp_query .= "AND b.enchant = '$enchant' ";

if($quality != "")
	$tmp_query .= "AND b.quality = '$quality' ";

if($city == "Royal city only"){
    $tmp_query .= "AND b.city <> 'Caerleon' ";
}
else if($city != "All city"){
    $tmp_query .= "AND b.city = '$city' ";
}


$sql = $tmp_query;


$result = $conn->query($sql);


$json_array = array();
if ($result->num_rows > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
    	$json_array[] = $row;
    }
    echo json_encode($json_array);
} else {
    echo json_encode (json_decode ("{}"));
}
http_response_code(200);



$conn->close();
?>