require.config({
	paths: {
		'jquery': 'libs/jquery-1.8.3.min'
	}
});

require(['jquery', 'navigator'], function($, nav) {
	$(function() {
		nav.init();
		$('.show-gallery').hover(function() {
			$(this).find('span').toggle();
		});
		//swfobject.embedSWF('swf/nav-main-newyork.swf', 'nav-main', '932', '517', '9.0.0');
	});
});
