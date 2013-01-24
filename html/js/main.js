require.config({
	shim: {
		'libs/swfobject': {
			exports: 'swfobject'
		},
		'libs/globalize': {
			exports: 'Globalize'
		}
	}
});

require(['utilities',
	'nav-main' , 
	'nav-quick',
	'focus-slideshow', 
	'show-schedule',
	'weibo-logs'], function(util, mainNav, subNav, slide, schedule, scrollbar) {
		
	$(function() {
		if (document.body.id === 'home') {
			util.modules.add(mainNav);
			util.modules.add(subNav);
			util.modules.add(slide);
			util.modules.add(schedule);
		}
		util.modules.exec();
	});
	
	var _load = function() {
		if (document.body.id === 'home') {
			util.modules.add(scrollbar);
			util.modules.exec();
		}
	};
	
	if (window._onloaded) {
		_load();
	} else {
		$(window).on('load', _load);
	}
});

// for IE
window.onload = function () {
	window._onloaded = true;
};
