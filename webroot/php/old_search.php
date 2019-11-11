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

//build where clause depending on item, quality, tier, enchant -> concat with .

$tmp_query = "SELECT u.name as seller_name, u.discord_id as seller_discord_id, s.item as item_uniquename, s.tier as item_tier, s.enchant as item_enchant, s.quality as item_quality, s.price as item_price, s.item_localized_name as item_localized_name, s.item_description as item_description, s.quantity as item_quantity, (unix_timestamp() - unix_timestamp(s.ts)) as announce_age FROM user u inner join sale s on u.user_id=s.user_id WHERE 1 ";

if($item != "")
	$tmp_query .= "AND s.item = '$item' ";

if($tier != "")
	$tmp_query .= "AND s.tier = '$tier' ";

if($enchant != "")
	$tmp_query .= "AND s.enchant = '$enchant' ";

if($quality != "")
	$tmp_query .= "AND s.quality = '$quality' ";

$sql = $tmp_query;

/*

//mysql query
$sql = "SELECT u.name as seller_name, u.discord_id as seller_discord_id, s.item as item_uniquename, s.tier as item_tier, s.enchant as item_enchant, s.quality as item_quality, s.price as item_price, s.item_localized_name as item_localized_name, s.item_description as item_description, s.quantity as item_quantity, (unix_timestamp() - unix_timestamp(s.ts)) as announce_age FROM user u inner join sale s on u.user_id=s.user_id WHERE s.item = '$item' ORDER BY s.price LIMIT 30";

*/
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