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

//mysql query
$sql = "UPDATE visit_counter SET counter = counter + 1";

if ($conn->query($sql) === TRUE) {
	echo "++";
	http_response_code(200);
} else {
	http_response_code(500);
    echo "Error: " . $sql . "<br>" . $conn->error;
    //conn->errno errorcode
}




$conn->close();
?>