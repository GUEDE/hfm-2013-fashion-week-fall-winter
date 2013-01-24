define(['libs/jquery.jscrollpane.min', 'libs/jquery.mousewheel.min'], function() {
	
	return {
		name: 'weibo-logs',
		init: function() {
			$('.weibo-logs .weibo-log:last-child').addClass('weibo-log-last');
			$('.weibo-logs-content' ).jScrollPane();
		}
	};
});
