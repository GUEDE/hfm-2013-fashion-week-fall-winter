define(['utilities'], function(util) {
	
	return {
		_isSupportFixed: false,
		_setPosition: function() {
			var $nav = $('#nav-quick'),
				scrollTop = $(document).scrollTop();
			
			if (scrollTop > $('#header').height() - 100) {
				$nav.fadeIn().css(
					this._isSupportFixed ? 'left' : 'top',
					this._isSupportFixed ? 
						( $(document).width() - $('#container').width() ) / 2 - $('#nav-quick').outerWidth() :
						scrollTop
				);
			} else {
				$nav.fadeOut();
			}
		},
		_setPositionProperties: function() {
			if (this._isSupportFixed) {
				$('#nav-quick').css({
					'position': 'fixed',
					'right': 'auto'
				});
			}
		},
		
		name: 'nav-quick',
		init: function() {
			var _self = this;
			
			this._isSupportFixed = util.isSupportFixed();
			this._setPositionProperties();
			this._setPosition();
			
			$(window).bind('resize scroll', function() {
				util.throttle(_self._setPosition, _self);
			});
		}
	};
});
