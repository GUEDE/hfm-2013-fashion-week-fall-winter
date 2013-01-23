require.config({
	paths: {
		'jquery': 'libs/jquery-1.8.3.min'
	}
});

require(['jquery', 'utilities', 'navigator', 'slideshow'], function($, util, nav, slide) {
	$(function() {
		var page = document.body.id;
		
		if (page === 'home') {
			util.modules.add(nav);
			util.modules.add(slide)
		}
		util.modules.exec();
		
		$('.show-gallery').hover(function() {
			$(this).find('span').toggle();
		});
		//swfobject.embedSWF('swf/nav-main-newyork.swf', 'nav-main', '932', '517', '9.0.0');
	});
});
