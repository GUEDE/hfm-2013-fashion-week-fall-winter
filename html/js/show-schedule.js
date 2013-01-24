define(['libs/globalize', 'libs/jquery.simpleslide'], function(Globalize) {
	var REQUEST_URL = 'http://www.ellechina.com/mini/13awfashionweek/index.php/common/show';
	
	return {
		_initSlide: function(date) {
			var $items = $('#show-schedule').find('.show-date'),
				start = 0;
			
			// en-US: d/m/yy
			date = Globalize.format(date, 'd');
			
			$items.each(function(i) {
				if ( !$(this).hasClass('show-date-disabled') && $.trim($('a', this).text()) === date ) {
					$(this).addClass('show-date-active');
					start = i;
					return false;
				}
			});
				
			if (!start) {
				date = $.trim( $items.eq(0).addClass('show-date-active').find('a').text() );
			}
			
			start = start < 7 ? 0 : start;
			
			$('#show-schedule')
				.simpleslide({
					visible: 7,
					auto: 0,
					circular: false,
					prevClass: 'show-schedule-prev',
					nextClass: 'show-schedule-next',
					start: start
				})
				.find('.show-schedule-prev, .show-schedule-next').css('top', 15);
				
			this._refresh(date);
		},
		_refresh: function(date) {
			var _self = this, shows = [], $loading;
			
			$loading = $('#show .loading').fadeIn();
			$.get(REQUEST_URL, {
				city: _self._city,
				date: date
			}, function(res) {
				if (res && $.type(res) === 'array' && res.length >= 6) {
					$.each(res, function(index, show) {
						if (index < 6) {
							shows.push( _self._buildShow(show) );
						}
					});
				}
				
				$('#show-content').html( shows.join('') )
					.find('.show-name span').each(function() {
						var h = $(this).height();
						$(this).css({
							'position': 'relative',
							'top': '50%',
							'height': h,
							'margin-top': -(h / 2)
						});
					})
				.end()
					.find('li:last').addClass('show-item-last');
				
				$loading.delay(800).fadeOut();
				
			}, 'jsonp');
		},
		_buildShow: function(show) {
			return '<li>' + 
					'<span class="show-time"><span>Time:</span>' + show.time + '</span>' + 
					'<a class="show-gallery" href="' + show.url + '">' + 
						'<img width="154" height="427" alt="" src="' + show.thumb + '" />' + 
						'<span></span>' + 
					'</a>' + 
					'<span class="show-name"><span>' + show.title + '</span></span>' + 
				'</li>';
		},
		
		name: 'show-schedule',
		init: function() {
			var _self = this;
			
			this._city = $('body').data('city');
			this._initSlide(new Date(2013, 0, 1));
			
			$('#show-schedule').on('click', '.show-date', function(event) {
				var date = $.trim( $('a', this).text() );
				
				if ( !$(this).hasClass('show-date-disabled') ) {
					$(this).addClass('show-date-active').siblings().removeClass('show-date-active');
					_self._refresh(date);
				}
				
				event.preventDefault();
			});
			
			$('#show-content').on('mouseenter mouseleave', '.show-gallery', function() {
				$(this).find('span').toggle();
			});
		}
	};
});