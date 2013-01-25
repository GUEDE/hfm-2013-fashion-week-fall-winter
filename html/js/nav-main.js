define(['libs/swfobject'], function(swfobject) {
	
	return {
		name: 'nav-main',
		init: function() {
			var city = $('body').data('city');
			
			swfobject.embedSWF('swf/nav-main-' + city + '.swf', 'nav-main', '932', '517', '9.0.0');
		}
	};
});
