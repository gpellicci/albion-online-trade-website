
$(document).ready(function () {
	$('#btn').click(function(){		
		$.ajax({
			type: 'POST',
			url: 'http://localhost:50451/pog',
			data: JSON.stringify({
				item: "212632176754163713",
				price: 2,
				quality: 3
			}),
			success: function(data) { 
				console.log(data);
			},
			contentType: "application/json",
			dataType: 'json'
		});
	});
});