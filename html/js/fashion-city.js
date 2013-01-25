define(['utilities'], function(util) {
	var REQUEST_URL = 'http://www.ellechina.com/mini/13awfashionweek/index.php/common/article',
		
		DISPLAY_TYPE = {
			PAGING: 'paging',
			WATERFALL: 'waterfall'
		};
	
	return {
		_category: {
			'11': 'comments',
			'12': 'viewpoint',
			'13': 'makeup',
			'14': 'pophit'
		},
		_buildStreet: function() {
			var _self = this,
				categoryId = util.getQueryString().cid,
				$street, $loading;
			
			if (typeof _self._category[categoryId] === 'undefined') {
				categoryId = '';
			}
			
			$loading = $('#fashion .loading').stop(true, true).fadeIn();
			$.get(REQUEST_URL, {
				city: _self._city,
				page: _self._pageIndex,
				num: _self._pageItemsCount,
				category: categoryId
			}, function(res) {
				if ($.type(res) === 'object' && res.list.length) {
					$street = $('#fashion-city .fashion-street');
					if (_self._type === DISPLAY_TYPE.PAGING) {
						$street.html('');
						_self._buildPaging(res.pageCount);
					}
					if (_self._type === DISPLAY_TYPE.WATERFALL) {
						_self._pageIndex++;
					}
					
					$.each(res.list, function(index, shop) {
						$street.eq(index % 4).append( _self._buildShop(shop) );
					});
			    }
			    
			    _self._buildStreet.isBuilding = false;
			    $loading.delay(800).fadeOut();
			}, 'jsonp');
		},
		_rebuildStreet: function() {
			var scrollTop = $(document).scrollTop();
			
			if ( scrollTop + $(window).height() > $(document).height() - 350 ) {
				if (this._scrollTop && this._scrollTop > scrollTop) {
					return;
				}
				this._scrollTop = scrollTop;
				
				if (!this._buildStreet.isBuilding) {
					this._buildStreet.isBuilding = true;
					this._buildStreet();
				}
			}
		},
		_buildShop: function(shop) {
			var headerUrl = 'http://www.ellechina.com/mini/13awfashionweek/index.php/list?city=' + this._city + '&cid=' + shop.category,
				category = this._category[shop.category],
			
				title = encodeURIComponent(shop.title) + '-' + encodeURIComponent(shop.description),
				url = encodeURIComponent(shop.url),
				src = encodeURIComponent(shop.thumb),
				description = encodeURIComponent(shop.description),
				
				url = {
					elle: 'http://club.ellechina.com/home.php?mod=spacecp&ac=share&type=elle&link=' + url + '&title=' + title + '&rcontent=' + description,
					qqSpace: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + url + '&title=' + title + '&pics=' + src + '&summary=' + description,
					qqWeibo: 'http://v.t.qq.com/share/share.php?title=' + title + '&source=' + url,
					sina: 'http://v.t.sina.com.cn/share/share.php?title=' + title + '&url=' + url + '&pic=' + src,
					renren: 'http://share.renren.com/share/buttonshare.do?link=' + url + '&title=' + title
				};
			
			return '<div class="fashion-shop">' + 
					'<h2 class="fashion-shop-header">' + 
						'<a class="cleartext ' + category + '" href="' + shop.caturl + '" target="_blank">' + category + '</a>' + 
					'</h2>' + 
					'<div class="fashion-shop-content">' + 
						'<p><a href="' + shop.url + '"><img width="230" alt="' + shop.title + '" src="' + shop.thumb + '" /></a></p>' + 
						'<div class="fashion-shop-desc">' + 
							'<p>' + shop.description + '</p>' + 
							'<ul class="fashion-shop-share">' + 
								'<li><a class="renren cleartext" href="' + url.renren + '">renren</a></li>' + 
								'<li><a class="sina cleartext" href="' + url.sina + '">sina weibo</a></li>' + 
								'<li><a class="qq-weibo cleartext" href="' + url.qqWeibo + '">qq weibo</a></li>' + 
								'<li><a class="qq-space cleartext" href="' + url.qqSpace + '">qq space</a></li>' + 
								'<li><a class="elle cleartext" href="' + url.elle + '">elle</a></li>' + 
							'</ul>' + 
						'</div>' + 
					'</div>' + 
				'</div>';
		},
		_buildPaging: function(pageCount) {
			var _self = this,
				items = [];
			
			for (var i = 0; i < pageCount; i++) {
	    		items.push('<li><a href="#fashion">' + (i + 1) + '</a></li>');
	    	}
	    	
	    	$('#fashion-paging').html(items.join(''))
	    		.find('li').eq(_self._pageIndex - 1).addClass('fashion-paging-active')
	    		.siblings('li').removeClass('fashion-paging-active');
		},
		
		name: 'fashion-city',
		init: function() {
			var _self = this;
			
			this._city = $('body').data('city');
			this._type = $('#fashion-city').data('type');
			this._pageItemsCount = $('#fashion-city').data('pageItemsCount');
			this._pageIndex = 1;
			this._buildStreet();
			
			$('#fashion-paging').on('click', 'a', function() {
    			var pageIndex = $.trim($(this).text());
    			
    			if (pageIndex === _self._pageIndex) {
    				return false;
    			}
				_self._pageIndex = pageIndex;
    			_self._buildStreet();
    		});
    		
			if (this._type === DISPLAY_TYPE.WATERFALL) {
				this._buildStreet.isBuilding = false;
				
				$(document).scrollTop(0);
				$(window).bind('scroll', function() {
					util.throttle(_self._rebuildStreet, _self);
				});
			}
		}
	};
});
