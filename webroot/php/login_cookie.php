<?php
	$cookie_name = "user";
	//retrieve data received through POST request (what to search)
	$data = json_decode(file_get_contents('php://input'), true);
	
	setcookie($cookie_name, json_encode($data), time() + (86400 * 30), "/"); // 86400 = 1 day
	//echo $data["discord_id"];
	if(!isset($_COOKIE[$cookie_name])) {
	    //echo "Cookie named '" . $cookie_name . "' is not set!";
	} else {
	    //echo "Cookie '" . $cookie_name . "' is set!<br>";
	    //echo "Value is: " . $_COOKIE[$cookie_name];
	}
	
?>