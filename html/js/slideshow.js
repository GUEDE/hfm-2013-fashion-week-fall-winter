define(['libs/jquery.cycle.all.min'], function() {
	return {
		_before: function() {
			$('#focus-slideshow-title').find('span, strong').fadeOut();
		},
		_pager: function(id) {
			return '<li><a href="#">' + id + '</a></li>'; 
		},
		_after: function(curr, next) {
	    	var text = $(next).find('img')
	    		.attr('alt').split('-');
	    		
	    	$('#focus-slideshow-title')
	    		.html('<span>' + text[0] + '</span><strong>' + text[1] + '</strong>')
	    		.fadeIn();
	   	},
		init: function() {
			$('#focus-slideshow').cycle({
		        fx: 'scrollHorz',
		        pager: '#focus-slideshow-nav',
		        activePagerClass: 'focus-slideshow-nav-active',
		        pagerAnchorBuilder: this._pager,
			    before: this._before,
			    after: this._after
		    }); 
		}
	};
});
