define(['libs/swfobject'], function(swfobject) {
	
	return {
		name: 'nav-main',
		init: function() {
			swfobject.embedSWF('swf/nav-main-newyork.swf', 'nav-main', '932', '517', '9.0.0');
		}
	};
});
