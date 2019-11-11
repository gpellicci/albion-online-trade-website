$(document).ready(function () {
	$.ajax({
		type: 'POST',
		url: 'https://albion-trade.com/php/show_my_items.php',
		success: function(data) { 
			myTableBody = $("#my-items-body");
			if(data != "{}"){
				data.forEach(function (item, index){
					buildRow(item, index, myTableBody);
				});

				$(".delete-item").click(function(){
					sale_id = $(this).attr("value");
					$.ajax({
						type: 'POST',
						url: 'https://albion-trade.com/php/delete_sale.php',
						data: JSON.stringify({
							sale_id: sale_id
						}),
						complete: function(){
							$(location).attr('href', 'my-items.html');
						},
						contentType: "application/json",
						dataType: 'json'
					});
				});
			}
			else{
				$("#no-result").text("Currently you don't have any listed items. Go to the sell panel and start selling now!");
			}
		},
		error: function(){
			alert("You have to login to use this functionality");
			$(location).attr('href', 'index.html');
		},
		contentType: "application/json",
		dataType: 'json'
	});
});


function buildRow(item, index, element){

	//build the box saying i'm selling this item	
	itempicURL = item.item_uniquename;
	if(item.item_enchant != 0)
		itempicURL += "@" + item.item_enchant;
	itempicURL += ".png?"
	if(item.item_quality != 1)
		itempicURL += "quality=" +item.item_quality;

	myRow = "<tr id='"+index+"'><td>"+ replaceTier(item.item_localized_name, item.item_enchant, item.item_quality) + "</td><td style='text-align:center!important'>"+item.item_quantity+"</td><td>"+item.announce_birth+"</td><td>"+getNumberWithCommas(item.item_price) +"</td><td><img style='height: 35%;'src='https://gameinfo.albiononline.com/api/gameinfo/items/"+itempicURL+"' class='center'></td><td><img value='" + item.sale_id + "' src='assets/img/delete.png' class='center delete-item'></td></tr>";

	element.append(myRow);
}



function replaceTier(name, enchant, quality){
	if(enchant == null)
		enchant = 0;
	if(quality == null)
		quality = 1;
	prefix = ["", "Beginner's ", "Novice's ", "Journeyman's ", "Adept's ", "Expert's ", "Master's ", "Grandmaster's ", "Elder's "];
	quality_name = ["", " Normal", " Good", " Outstanding", " Excellent", " Masterpiece"];
	enchant_name = ["", ".1", ".2", ".3"];
	q = quality_name[quality];	
	e = enchant_name[enchant];



	for(i=1; i<prefix.length; i++){
		if(name.includes("ARTEFACT ")){
			name = "ARTEFACT " + name.replace("ARTEFACT ", "");
		}
		
		if(name.includes(prefix[i])){
			tmp = name.replace(prefix[i], "");
			return "T" + i + e + " " + tmp + q;
		}
	}
	return name;
}

function getNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
