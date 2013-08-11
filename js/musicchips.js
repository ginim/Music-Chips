$("body").delegate(".cover", "click", function(){
	console.log('clicked cover');
	$("img").removeClass("thiscover");
	$(this).addClass("thiscover");
});