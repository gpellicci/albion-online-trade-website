
$(document).ready(function () {

	$("#preview-row").hide();		//updatePic and it's html field is disabled (preview was confusing ppl)

	$('#quality').on('change', function(){
    	//updatePic(selectedItemUniqueName);
	});
	$('#enchant').on('change', function(){
    	//updatePic(selectedItemUniqueName);
	});
	var item;
	var quality;
	var index;
	var price;



	const url = 'json/items.json';
	// Populate dropdown 
	nameSrc = [];
	selectedItemUniqueName = "";
	$.getJSON(url, function (data) {
		i=0;
	  $.each(data, function (index, entry) {
	  	if(entry.LocalizedNames != null && entry.LocalizedDescriptions != null){
	  		//only add if not yet contained

		   	tmp = entry.LocalizedNames.EN_US;
		   	tmp_usage = entry.LocalizedDescriptions.EN_US;
	  		contained = false;
	  		containedTimes = 0;
	  		nameSrc.forEach(function(item){
	  			if(item.label == tmp && item.usage == tmp_usage){	  				
	  				containedTimes++;
	  				if(containedTimes > 0){
	  					contained = true;
	  					return;
	  				}	  				
	  			}
  			});

		    if(contained == false && isTradable(entry.UniqueName)){
		    	locName = entry.LocalizedNames.EN_US;
		    	if(isArtefact(entry.UniqueName))
		    		locName = "ARTEFACT " + locName;
		    	nameSrc[i] = {
		    		label: locName,
					value: entry.UniqueName,
					usage: entry.LocalizedDescriptions.EN_US
			   	};
			    i++;
			}
		}
	  })
	  itemjson = data;

	  $("#dropdown").autocomplete({
		source: nameSrc,
		minLength: 3,
		select: function( event, ui ) {
			event.preventDefault();
			if(ui.item.value != ""){			
				$("#tier").prop('disabled', false);
				$("#enchant").prop('disabled', false);
			}
			selectedItemUniqueName = ui.item.value;
			$(this).val(ui.item.label);	
			newTier = mapTier(selectedItemUniqueName);
			//console.log(newTier);			
			$("#tier").val(newTier).prop("disabled", true);

			if(isArtefact(selectedItemUniqueName)){
				$("#enchant").val("0");
				$("#quality").val("1");
			}
			else if(selectedItemUniqueName.includes("@1")){
				$("#enchant").val("1").prop('disabled', true);	
				selectedItemUniqueName = selectedItemUniqueName.replace("@1", "");			
			}
			else if(selectedItemUniqueName.includes("@2")){				
				$("#enchant").val("2").prop('disabled', true);
				selectedItemUniqueName = selectedItemUniqueName.replace("@2", "");			
			}
			else if(selectedItemUniqueName.includes("@3")){
				$("#enchant").val("3").prop('disabled', true);
				selectedItemUniqueName = selectedItemUniqueName.replace("@3", "");			
			}
			else{
				$("#enchant").val("0");
				$("#quality").val("1");
			}
			$("#price").val("");
			console.log(selectedItemUniqueName);
			//updatePic(selectedItemUniqueName);   		
		}
	  });
  
	});

	$('#search').click(function(){		
		tier = $("#tier").val();
		enchant = $("#enchant").val();
		quality = $("#quality").val();
		//ajax SELECT query with POST
		$("#search-preview").attr("src", "");
		//POST info about item to search
		target = {
			name: selectedItemUniqueName,
			tier: tier,
			enchant: enchant,
			quality: quality
		};


		$.ajax({
   			type: 'POST',
   			url: 'https://albion-trade.com/php/search.php',
   			data: JSON.stringify(target),
   			success: function(data) { 
	   			$("#results").empty();
   				if(!$.isArray(data)){
   					buildEmptyAnnounce();   					
   				}
   				else{
	   				data.forEach(function (item, index){
	   					buildAnnounce(item, index);   					
	   				});

	   				$(".contact-seller-now").click(function(){
	   					myBtn = $(this);
	   					buttonValue = $(this).val();
	   					thisInfo = data[buttonValue];   					
	   					$.ajax({
							type: 'POST',
							url: 'https://albion-trade.com/php/login_status.php',
							success: function(data) {
								console.log("----");
								if(data.discord_id != ""){
									if(data.discord_id == thisInfo.seller_discord_id){
										alert("You are selling this item. Can't contact yourself");
									}
									else{
										console.log("wtb: "+ data.discord_id);
										console.log("wts: "+thisInfo.seller_discord_id);
										$.ajax({
											type: 'POST',
											url: 'https://albion-trade.com:50451/pog',
											//crossDomain: true,	//important!!!										
											data: JSON.stringify({
												wtb: data.discord_id,
												wts: thisInfo.seller_discord_id,				
												item: thisInfo.item_localized_name,
												tier: thisInfo.item_tier,
												enchant: thisInfo.item_enchant,
												quality: thisInfo.item_quality				
											}),
											complete: function() { 
												myBtn.prop("disabled",true);
												setTimeout(function() { 
													myBtn.prop("disabled",false);
												}, 60000);
											},
											contentType: "application/json",
											dataType: 'json'
										});
									}
								}
								//loginName = data.
							},
							error: function(){
								console.log("error!!");								
			   					alert("You have to login before contacting a user");
			   					$(location).attr('href', 'index.html');
							},
							contentType: "application/json",
							dataType: 'json'
						});
	   				});
   				}
   			},
   			error: function(){
   				console.log("no items");
   			},
   			contentType: "application/json",
   			dataType: 'json'
   		});





	});

	$('#reset_search').click(function(){
		selectedItemUniqueName = "";
		$("#dropdown").val("");
		$("#tier").val("").prop("disabled", false);
		$("#enchant").val("").prop("disabled", false);
		$("#quality").val("");
		$("#search-preview").attr("src", "");
	});

});

function updatePic(uniqueName){
	if(uniqueName == ""){
		alert("Please select an Item and try again.");
		return;
	}

	tier = $("#tier").val();
	if(tier == -1)
		tier = "";
	
	enchant = $("#enchant").val();
	if(enchant == -1)
		enchant = "";
	else
		enchant = "@" + enchant;

	quality = $("#quality").val();
	if(quality == -1)
		quality = "";
	else
		quality = "quality=" + quality;

	item_url = "https://gameinfo.albiononline.com/api/gameinfo/items/" + uniqueName + enchant + ".png?" + quality;   	
	$("#search-preview").attr("src",item_url);
}

function inThatRange(index){
	if(inRange(index, 1044, 1595) || inRange(index, 1879, 3639) || inRange(index, 3773, 5591))
		return true;
	else
		return false;
}

function inRange(n, nStart, nEnd){
    if(n>=nStart && n<=nEnd) 
    	return true;
    else 
    	return false;
}

function mapQuality(quality){
	if(quality==1)
		return "Normal";
	else if(quality==2)
		return "Good";
	else if(quality==3)
		return "Outstanding";
	else if(quality==4)
		return "Excellent";
	else if(quality==5)
		return "Masterpiece";
}

function mapTier(uniqueName){
	MAX_TIER = 8;
	//tier mapping, t0 is dummy
	//tier = ["", "Beginner's", "Novice's", "Journeyman's", "Adept's", "Expert's", "Master's", "Grandmaster's", "Elder's"];
	tier = ["", "T1_", "T2_", "T3_", "T4_", "T5_", "T6_", "T7_", "T8_"];
	for(i=1; i<=8; i++){
		if(uniqueName.startsWith(tier[i]))
			return i;
	}
	return -1;
}

function isArtefact(name){
	if(name.includes("_ARTEFACT_"))
		return true;
	else
		return false;
}

function getNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function buildAnnounce(item, index){
	//build the box saying i'm selling this item	
	itempicURL = item.item_uniquename;
	if(item.item_enchant != 0)
		itempicURL += "@" + item.item_enchant;
	itempicURL += ".png?"
	if(item.item_quality != 1)
		itempicURL += "quality=" +item.item_quality;

	myAnnounce = "<div class='row justify-content-center'><div class='col-md-5 col-lg-4'><div class='clean-pricing-item'><div class='heading'><h3>"+ item.item_localized_name + "</h3></div><div><img src='https://gameinfo.albiononline.com/api/gameinfo/items/"+itempicURL+"' class='center'></div><p>"+item.item_description+"<br></p><div class='features'><h4><span class='feature'>Quantity:&nbsp;</span><span>"+item.item_quantity+"</span></h4><h4><span class='feature'>Time left:&nbsp;</span><span>" + parseTime(2678400 - item.announce_age) + "</span></h4></div><div class='price'><h4>"+ getNumberWithCommas(item.item_price) +" silver</h4></div><button class='btn btn-outline-primary btn-block contact-seller-now' type='button' value='"+index+"'>CONTACT SELLER NOW</button></div></div></div>";

	$("#results").append(myAnnounce);
}

function buildEmptyAnnounce(){
	//build the box saying noone selling this item	

	myAnnounce = "<div class='row justify-content-center'><div class='col-md-5 col-lg-4'><div class='clean-pricing-item'><div class='heading'><h3>No results!</h3></div></div></div></div>";

	$("#results").append(myAnnounce);
}


function isTradable(uniquename){
	return !(uniquename.includes("_NONTRADABLE") || uniquename.includes("QUESTITEM_") || uniquename.includes("_ADC_"));
}

function parseTime(seconds){
	days = Math.floor(seconds/86400);
	hours = Math.floor((seconds%86400)/3600);

	d = "day";
	if(days > 1)
		d += "s";
	h = "hour";
	if(hours > 1)
		h += "s";
	return days + " "+d +", "+hours+" "+h+".";
}
