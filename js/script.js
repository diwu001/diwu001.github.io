$(document).ready(function(){	
	$("#more-content").find("span").mouseover(function() {
		c1=Math.floor(Math.random()*256);
		c2=Math.floor(Math.random()*256);
		c3=Math.floor(Math.random()*256);
		$(this).css("color","rgb("+c1+","+c2+","+c3+")");
		$(this).css("fontSize",16+Math.floor(Math.random()*24));	
	});
});
