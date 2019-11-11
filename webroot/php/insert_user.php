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
$id = $data['discord_id'];
$name  = $data['discord_name'];

//mysql query
$sql = "INSERT INTO user (name, discord_id) VALUES ('$name', '$id')";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
	http_response_code(200);
} else {
	if($conn->errno == 1062){
		http_response_code(200);
		echo "Exist already";
	}
	else{
		http_response_code(500);	
    	echo "Error: " . $sql . "<br>" . $conn->errno;
    }
}




$conn->close();
?>
