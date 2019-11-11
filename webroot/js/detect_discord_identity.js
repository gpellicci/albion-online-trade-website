$(document).ready(function () {
	$.ajax({
		type: 'POST',
		url: 'https://albion-trade.com/php/login_status.php',
		success: function(data) {
			document.getElementById('login').innerText = data.discord_name;
			document.getElementById('login').onclick = null;
		},
		contentType: "application/json",
		dataType: 'json'
	});

	const fragment = new URLSearchParams(window.location.hash.slice(1));		
	if (fragment.has("access_token")) {
		console.log("logging!");
		//if url has access_token -> get access_token and token_type
		const accessToken = fragment.get("access_token");
		const tokenType = fragment.get("token_type");

		//retrieve user info providing access_token
		fetch('https://discordapp.com/api/users/@me', {
			headers: {
				authorization: `${tokenType} ${accessToken}`
			}
		})
		.then(res => res.json())
		.then(response => {
				//console.log(response);	//use this for all infos (check api doc for user)
				loggedInfo = response;
				const { username, discriminator } = response;
				console.log("logged!")
				document.getElementById('login').innerText = username;
				document.getElementById('login').onclick = null;
				
				$.ajax({
					type: 'POST',
					url: 'https://albion-trade.com/php/insert_user.php',
					//crossDomain: true,	//important!!!
					data: JSON.stringify({
						discord_id: loggedInfo.id,
						discord_name: loggedInfo.username + "#" + loggedInfo.discriminator
					}),
					success: function(data) { 
						//console.log(data);
					},
					contentType: "application/json",
					dataType: 'json'
				});

				$.ajax({
					type: 'POST',
					url: 'https://albion-trade.com/php/login_cookie.php',
					data: JSON.stringify({
						discord_id: loggedInfo.id,
						discord_name: loggedInfo.username
					}),
					success: function(data) { 
						document.getElementById('info').innerText = loggedInfo.username;						
					},
					contentType: "application/json",
					dataType: 'json'
				});
			})
		.catch(console.error);
	}
});
