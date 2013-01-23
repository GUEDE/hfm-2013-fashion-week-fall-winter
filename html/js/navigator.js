define(['utilities'], function(util) {
	return {
		_isSupportFixed: false,
		setPosition: function() {
			var pos = {
				left: ($(document).width() - $('#container').width()) / 2 - $('#nav-quick').outerWidth(),
				top: this._isSupportFixed ? 0 : $(document).scrollTop()
			};
			
			if (this._isSupportFixed) {
				
			}
				
			$('#nav-quick').css(pos);
		},
		setPositionProperties: function() {
			if (this._isSupportFixed) {
				$('#nav-quick').css({
					'position': 'fixed',
					'right': 'auto'
				});
			}
		},
		init: function() {
			var _self = this;
			
			this._isSupportFixed = util.isSupportFixed();
			this.setPositionProperties();
			this.setPosition();
			
			$(window).bind('scroll', function() {
				utilities.throttle(_self.setPosition, _self);
			});
		}
	};
});
