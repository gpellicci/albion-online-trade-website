$(document).ready(function () {
	$("#send-bug").click(function(){		
		name = $("#name").val();
		msg = $("#bug").val();
		if(name == "" || msg == ""){
			alert("Fill the form.");
			return;
		}

		$.ajax({
			type: 'POST',
			url: 'https://albion-trade.com/php/send_bug.php',			
			data: JSON.stringify({
				name: name,
				msg: msg
			}),
			contentType: "application/json",
			dataType: 'json'
		});
		alert("Thanks for your feedback.");
		$(location).attr('href', 'index.html');		
	});
});