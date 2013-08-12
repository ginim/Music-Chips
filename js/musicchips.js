
// Create palette from selected album cover
var getCover = function() {
	return createPalette($('.thiscover'), 6); // 2nd argument sets # of colors in palette
}

// RGB to HEX base function
// http://stackoverflow.com/questions/1740700/get-hex-value-rather-than-rgb-value-using-jquery
function rgbArray2hex(rgbArray) {
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
	return "#" + hex(rgbArray[0]) + hex(rgbArray[1]) + hex(rgbArray[2]);
}

// Convert RGB Array to Hex Array
var convertPalette = function(rgbArray) {
	var hexArray = [];
	for (var i=0; i < 6; i++) {
		hexArray[i] = rgbArray2hex(rgbArray[i]);
	}
	return hexArray;
}

var showDetails = function(hexArray) {
	for (var i=0; i < 6; i++) {
		$("#mini_palette"+i+" .swatch").css("background", hexArray[i]);
		$("#mini_palette"+i+" span").html(hexArray[i]);
	}
}

var useCover = function(paletteArray) {
	for (var i=0; i < 6; i++) {
		$("#palette"+i).css("background", paletteArray[i]); // Update Swatches
	}
	// Update Example
	$("#palette_example").css("background", paletteArray[0]);
	$("#palette_example").css("color", paletteArray[1]);
	$("#palette_example h2").css("color", paletteArray[2]);
	$("#palette_example h3").css("color", paletteArray[3]);
	$("#palette_example a").css("color", paletteArray[4]);
	$("#palette_example button").css("background", paletteArray[5]);
}

$("body").delegate(".cover", "click", function(){
	console.log('clicked cover');
	$("img").removeClass("thiscover");
	$(this).addClass("thiscover");
	
	var rgbaPalette = getCover();
	// Use RGB palette array from getCover
	
	var hexPalette = convertPalette(rgbaPalette);
	// Get hex palette array by converting RGB array with convertPalette
	
	useCover(hexPalette);
	showDetails(hexPalette);	
	// Run useCover function, using hexPalette array

	$(".palette_link").removeClass("unclickable");
	$(".palette_link").addClass("clickable");
});

$("#details").click(function() {
	if($(".thiscover").length > 0) {
		var rgbaPalette = getCover();
		// Use RGB palette array from getCover
		var hexPalette = convertPalette(rgbaPalette);
		// Get hex palette array by converting RGB array with convertPalette

		showDetails(hexPalette);
		$("#palette_example").hide();
		$("#palette_details").show();
	}
});

$("#example").click(function() {
	if($(".thiscover").length > 0) {
		var rgbaPalette = getCover();
		// Use RGB palette array from getCover
		var hexPalette = convertPalette(rgbaPalette);
		// Get hex palette array by converting RGB array with convertPalette

		showDetails(hexPalette);
		$("#palette_example").show();
		$("#palette_details").hide();
	}
});

$("#reset").click(function() {
	// Reset Swatches, Example, & Album Border
	$("#palette0, #palette1, #palette2, #palette3, #palette4, #palette5, #palette_example, #palette_example button").css("background","");
	$("#palette0, #palette1, #palette2, #palette3, #palette4, #palette5").attr("title", " ");
	$("#palette_example, #palette_example h2, #palette_example h3, #palette_example a").css("color","");
	$("img").removeClass("thiscover");
	$("#palette_example").show();
	$("#palette_details").hide();
	$(".palette_link").removeClass("clickable");
	$(".palette_link").addClass("unclickable");
});

$("#search_submit").click(function() {
	$('#album_covers').html('');

	// Here is where we're using the Last.fm API to grab album covers
	var keywords = $("#search_keyword").val();

	// Thanks to Jons for the help
	var getAlbums = function (callback) {
	 $.ajax({
		url: "http://ws.audioscrobbler.com/2.0/?method=album.search&album="+ keywords +"&api_key=71272e8b7d3a922e2d99f3a823ab16e5&format=json",
		// Replace api_key with your own last.fm api key!
		dataType: "json",
		success: function(json) {
		callback(json);
	   }
	 });
	};

	var albumImages = [];

	var parseAlbumData = function (json) {
		console.log("parse called");
		console.log(json);
		for(var i=0; i < json.results.albummatches.album.length; i++){
			var albumarray = json.results.albummatches.album;
			albumImages.push(albumarray[i].image[3]['#text']);
			console.log(albumImages[i]);
			$.getImageData({
				url: albumImages[i],
				server: "http://ginim.net/music-chips/php/getImageData.php",
				success: function(image){
					console.log("success in getImageData: " + image);
					$('#album_covers').append(image);
					$("#album_covers img").addClass('cover');
				},
			error: function(xhr, text_status){
				console.log("error in getImageData");
			}
			});
		}
	console.log(albumImages);
	//	$(div).html(albumeimage[i])
	};

getAlbums(parseAlbumData);
});