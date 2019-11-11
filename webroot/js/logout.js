$(document).ready(function () {
	$("#logout").click(function(){
		$.ajax({
			type: 'POST',
			url: 'https://albion-trade.com/php/logout.php',	
			contentType: "application/json",
			dataType: 'json'
		});
		document.getElementById('login').innerText = 'Login';
		document.getElementById('login').onclick = "location.href='https://discordapp.com/api/oauth2/authorize?client_id=628944784739926046&redirect_uri=http%3A%2F%2Fec2-35-180-111-238.eu-west-3.compute.amazonaws.com%2Findex.html&response_type=token&scope=identify';"
		$(location).attr('href', 'index.html');
	});
});