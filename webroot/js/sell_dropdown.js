
$(document).ready(function () {
	$('#quality').on('change', function(){		
    	updatePic(selectedItemUniqueName);
	});
	$('#enchant').on('change', function(){
    	updatePic(selectedItemUniqueName);
	});
	$('#quantity, #price').on('change', function(){
    	v = $(this).val();
    	if(v == "")
    		return;
    	v = parseFloat(v);
    	if(v < 1){
    		alert("No zero or negative quantities");
    		$(this).val("");
    		$(location).attr('href', 'sell.html');
    		return;
    	}
    	else if(v > 0){
    		$(this).val(Math.ceil(v));
    	}
	});
	var item;
	var quality;
	var index;
	var price;


	const url = 'json/items.json';
	// Populate dropdown 
	nameSrc = [];
	selectedItemUniqueName = "";
	selectedItemLocalizedName = "";
	selectedItemDescription = "";
	$.getJSON(url, function (data) {
		i=0;
	  $.each(data, function (index, entry) {	 
	  	//if(index == 3962)
	  		//console.log(nameSrc);
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
			selectedItemUniqueName = ui.item.value;
			myChoice = nameSrc.find(x => x.value === selectedItemUniqueName);
			selectedItemLocalizedName = myChoice.label;
			selectedItemDescription = myChoice.usage;

			$(this).val(ui.item.label);
			newTier = mapTier(selectedItemUniqueName);
			$("#tier").val(newTier).prop('disabled', true);		
			$("#enchant").val("").prop('disabled', false);
			console.log(selectedItemUniqueName);
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
				//$("#enchant").val("");
				//$("#quality").val("");
				//$("#price").val("");
			}


			updatePic(selectedItemUniqueName);   	
		}
	  });
  
	});

	$('#sell').click(function(){		
		tier = $("#tier").val();
		enchant = $("#enchant").val();
		quality = $("#quality").val();
		price = $("#price").val();
		quantity = $("#quantity").val();
		if(enchant == "" || tier == "" || quality == "" || price == ""){
			alert("Please fill all fields.");
			return;
		}
		if(quantity == ""){
			quantity = 1;
		}
		
		//ajax INSERT query with POST

		target = {
			name: selectedItemUniqueName,
			tier: tier,
			enchant: enchant,
			quality: quality,
			price: price,
			localized_name: selectedItemLocalizedName,
			item_description: selectedItemDescription,
			quantity: quantity
		};

		console.log(target);

		$.ajax({
   			type: 'POST',
   			url: 'https://albion-trade.com/php/sell.php',
   			data: JSON.stringify(target),
   			success: function(data) {    				
   				console.log(data);
				resetSearchPanel();
				alert(selectedItemLocalizedName + " is now on sale for " + price + " silver.");	
   			},
   			error: function(){
   				alert("You have to login to sell item");
   				$(location).attr('href', 'index.html');
   			},
   			contentType: "application/json",
   			dataType: 'text'
   		});

	});

	$('#reset_search').click(function(){
		resetSearchPanel();
	});
	
});

function updatePic(uniqueName){
	console.log("update");
	if(uniqueName == ""){
		return;
	}

	tier = $("#tier").val();
	if(tier == null)
		return;
	
	enchant = $("#enchant").val();
	if(enchant != "")
		enchant = "@" + enchant;
	else
		enchant = "";

	quality = $("#quality").val();
	if(quality != "")
		quality = "quality=" + quality;
	else
		quality = "";

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

function isTradable(uniquename){
	return !(uniquename.includes("_NONTRADABLE") || uniquename.includes("QUESTITEM_") || uniquename.includes("_ADC_"))
;}

function resetSearchPanel(){
	selectedItemUniqueName = "";
	$("#dropdown").val("");
	$("#tier").val("").prop('disabled', false);
	$("#enchant").val("").prop('disabled', false);
	$("#quality").val("");
	$("#search-preview").attr("src", "");
	$("#price").val("");
}