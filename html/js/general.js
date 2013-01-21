$(function() {
	window.pageName = $( 'body' ).attr( 'id' );
	
	//utilities.modules.add( modules.player );
	//utilities.modules.add( modules.menu );
	//utilities.modules.add( modules.fashionView );
	
	if ( window.pageName === 'home' ) {
		//utilities.modules.add( modules.slideshow );
		utilities.modules.add( modules.schedule );
	}
	
	utilities.modules.exec();
});

$(window).bind( 'load', function() {
	if ( window.pageName === 'home' ) {
		utilities.modules.add( modules.weiboEditorsScrollbar );
		utilities.modules.exec();
	}
});
