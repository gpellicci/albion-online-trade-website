<?php
	$cookie_name = "user";
	//retrieve data received through POST request (what to search)
	
	if(isset($_COOKIE[$cookie_name])) {
		echo "Cookie " . $cookie_name . " is set!<br>";
	    echo "Value is: " . $_COOKIE[$cookie_name] . "<br>";	    	    
	    setcookie($cookie_name, "", time() - 3600, "/");	    
	    echo "unset";
	} else {
	    echo "notset";
	}
	http_response_code(200);
?>