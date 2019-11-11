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
$sale_id = $data['sale_id'];

//mysql query
$sql = "DELETE FROM sale WHERE sale_id = '$sale_id'";

if ($conn->query($sql) === TRUE) {
    echo "Item deleted successfully";
	http_response_code(200);
} else {
	http_response_code(500);	
    echo "Error: " . $sql . "<br>" . $conn->errno; 
}




$conn->close();
?>
