$(document).ready(function () {
	$.ajax({
		type: 'POST',
		url: 'https://albion-trade.com/php/recent.php',
		success: function(data) { 
			myTableBody = $("#my-items-body");
			data.forEach(function (item, index){
				buildRow(item, index, myTableBody, item.discord_id);				
			});

			$(".contact-seller-now").click(function(){
				myBtn = $(this);
				index = $(this).attr("value");				
				thisInfo = data[index];
				if(thisInfo.my_id == thisInfo.discord_id){
					alert("You are selling this item. Can't contact yourself");
				}
				else{
					$.ajax({
						type: 'POST',
						url: 'https://albion-trade.com:50451/pog',
						//crossDomain: true,	//important!!!
						data: JSON.stringify({
							wtb: thisInfo.my_id,
							wts: thisInfo.discord_id,				
							item: thisInfo.item_localized_name,
							tier: thisInfo.item_tier,
							enchant: thisInfo.item_enchant,
							quality: thisInfo.item_quality				
						}),
						complete: function() { 
							//console.log("contact function");
							myBtn.prop("disabled",true);
							setTimeout(function() { 
								myBtn.prop("disabled",false);
							}, 60000);
						},
						contentType: "application/json",
						dataType: 'json'
					});
				}
			});
		},
		error: function(){
			alert("You have to login to use this functionality");
			$(location).attr('href', 'index.html');
		},
		contentType: "application/json",
		dataType: 'json'
	});
});


function buildRow(item, index, element, id){

	//build the box saying i'm selling this item	
	itempicURL = item.item_uniquename;
	if(item.item_enchant != 0)
		itempicURL += "@" + item.item_enchant;
	itempicURL += ".png?"
	if(item.item_quality != 1)
		itempicURL += "quality=" +item.item_quality;

	

	myRow = "<tr id='"+index+"'><td>"+ replaceTier(item.item_localized_name, item.item_enchant, item.item_quality) + "</td><td style='text-align:center!important'>"+item.item_quantity+"</td><td>"+item.announce_birth+"</td><td>"+getNumberWithCommas(item.item_price)+"</td><td><img style='height: 35%;'src='https://gameinfo.albiononline.com/api/gameinfo/items/"+itempicURL+"' class='center'></td><td><button class='btn btn-outline-primary btn-block contact-seller-now' type='button' value='"+index+"'>CONTACT SELLER NOW <img style='vertical-align: text-top; width: 20px;' id='preview" + index + "'></img></button></td></tr>";

	element.append(myRow);	

	$.ajax({
		type: 'POST',
		url: 'https://albion-trade.com:50451/userstatus',
		//crossDomain: true,	//important!!!										
		data: JSON.stringify({
			userid: id
		}),
		success: function(txt) {
			statusLink = "assets/img/statusicon/" + txt.status + ".png"; 
			domID = "#preview" + index;
			$(domID).attr("src", statusLink);
		},
		contentType: "application/json",
		dataType: 'json'
	});	
}

function replaceTier(name, enchant, quality){
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