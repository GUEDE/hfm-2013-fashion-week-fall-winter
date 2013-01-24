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
	'fashion-city',
	'weibo-logs',
	'nav-main' , 
	'nav-quick',
	'focus-slideshow', 
	'show-schedule'], function(util, fashion, scrollbar, mainNav, subNav, slide, schedule) {
		
	var modules = Array.prototype.slice.call(arguments, 3);
	
	$(function() {
		util.modules.add(fashion);
		if (document.body.id === 'home') {
			util.modules.add(modules);
		}
		util.modules.exec();
	});
	
	var _load = function() {
		if (document.body.id === 'home') {
			util.modules.add(scrollbar);
			util.modules.exec();
		}
	};
	
	if (window._loaded) {
		_load();
	} else {
		$(window).on('load', _load);
	}
});

// for IE
$(window).on('load', function() {
	window._loaded = true;
});
