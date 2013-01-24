define(['utilities'], function(util) {
	var REQUEST_URL = 'http://www.ellechina.com/mini/13awfashionweek/index.php/common/article';
	
	return fashionView: {
		_isBuiltPaging: false,
		_category: {
			'11': 'comments',
			'12': 'viewpoint',
			'13': 'makeup',
			'14': 'pophit'
		},
		_pageIndex: 1,
		pageCount: 0,
		_buildStreet: function() {
			var _self = this,
				pageItemsCount = 9,
				pageIndex = this._pageIndex;
				categoryId = util.getQueryString().cid;
			
			////////////////////////////////////////////
			if (typeof this._category[categoryId] === 'undefined') {
				categoryId = '';
			}
			
			if ( this._displayType === 'paging' ) {
				$( '#fashion-city' ).block({
					message: null,
					overlayCSS: {
						background: '#fff',
						cursor: 'default'
					}
				});
			}
			
			$.getJSON(REQUEST_URL, {
				    city: _self._city,
				    num: pageItemsCount,
				    page: pageIndex,
				    category: categoryId
				}, function( data ) {
					var pagingItems = [];
					
					if ( $.type( data ) === 'object' ) {
						if ( data.list.length ) {
							var $street = $( '#fashion-city .fashion-street' );
							
							if ( self._displayType === 'paging' ) {
								$street.html( '' );
								if ( !self._isBuiltPaging ) {
									self.buildPaging( data.pageCount );
									self.pageCount = data.pageCount;
									self._isBuiltPaging = true;
								}
							}
							
							$.each( data.list, function( index, item ) {
								$street.eq( index % 3 ).append( self.buildShop(item) );
							});
						}
				    }
				    
				}, 'jsonp')
				
				.always(function() {
					if ( self._displayType === 'paging' ) {
						$( '#fashion-city' ).unblock();
					}
					
					self._buildStreet.isBuilding = false;
				});
		},
		
		
		buildShop: function( item ) {
			var shareTitle = encodeURIComponent(item.title) + '-' + encodeURIComponent(item.description),
				shareUrl = encodeURIComponent(item.url),
				sharePic = encodeURIComponent(item.thumb),
				shareDesc = encodeURIComponent(item.description),
				
				url = {
					elle: 'http://club.ellechina.com/home.php?mod=spacecp&ac=share&type=elle&link=' + shareUrl + '&title=' + shareTitle + '&rcontent=' + shareDesc,
					qqSpace: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + shareUrl + '&title=' + shareTitle + '&pics=' + sharePic + '&summary=' + shareDesc,
					qq: 'http://v.t.qq.com/share/share.php?title=' + shareTitle + '&source=' + shareUrl,
					sina: 'http://v.t.sina.com.cn/share/share.php?title=' + shareTitle + '&url=' + shareUrl + '&pic=' + sharePic,
					renren: 'http://share.renren.com/share/buttonshare.do?link=' + shareUrl + '&title=' + shareTitle
				};
			
			return '<div class="fashion-shop">' +
						'<h2 class="fashion-shop-header ' + this._category[ item.category ] + ' sprite-parts">' + 
							'<a href="http://www.ellechina.com/mini/13ssfashionweek/index.php/city/newyorklist?cid=' + item.category + '" target="_blank"></a>' + 
						'</h2>' +
						'<div class="fashion-shop-content">' +
							'<a target="_blank" href="' + item.url + '"><img width="300" src="' + item.thumb + '" alt="" /></a>' +
							'<a target="_blank" class="fashion-shop-title" href="' + item.url + '">' + item.title + '</a>' +
							'<p class="fashion-shop-desc">' + item.description + '</p>' +
							'<dl class="fashion-shop-share">' +
								'<dt>分享：</dt>' +
								'<dd><a target="_blank" class="elle sprite-icons cleartext" href="' + url.elle + '">elle</a></dd>' +
								'<dd><a target="_blank" class="space sprite-icons cleartext" href="' + url.qqSpace + '">tengxun space</a></dd>' +
								'<dd><a target="_blank" class="tengxun sprite-icons cleartext" href="' + url.qq + '">tengxun</a></dd>' +
								'<dd><a target="_blank" class="sina sprite-icons cleartext" href="' + url.sina + '">sina</a></dd>' +
								'<dd><a target="_blank" class="renren sprite-icons cleartext" href="' + url.renren + '">renren</a></dd>' +
							'</dl>' +
							'<div class="clearfix"></div>' +
						'</div>' +
					'</div>';
		},
		buildPaging: function( pageCount ) {
			var items = [],
				self = this,
				className, pageIndex;
			
			for ( var i = 0; i < pageCount; i++ ) {
				selectClass = i == 0 ? ' fashion-paging-selected' : '';
				pageIndex = i + 1;
				
	    		items.push( '<li><a data-page-index="' + pageIndex + '" class="fashion-paging-item' + selectClass + '" href="">' + pageIndex + '</a></li>' );
	    	}
	    	
	    	$( '#fashion-paging' )
	    		.find( 'li:first' ).after( items.join('') ).end()
	    		
	    		.delegate( 'a', 'click', function( e ) {
	    			var pageIndex = $( this ).data().pageIndex,
	    				isOriginal = true;
	    					
	    			e.preventDefault();
	    			
	    			if ( pageIndex ) {
	    				if ( pageIndex !== self._pageIndex ) {
	    					self._pageIndex = pageIndex;
	    					isOriginal = false;
	    				}
	    			} else {
	    				if ( $( this ).is( '.fashion-paging-prev' ) ) {
	    					if ( self._pageIndex > 1 ) {
	    						self._pageIndex--;
	    						isOriginal = false;
	    					}
	    				} else if ( $( this ).is( '.fashion-paging-next' ) ) {
	    					if ( self._pageIndex < self.pageCount ) {
	    						self._pageIndex++;
	    						isOriginal = false;
	    					}
	    				}
	    			}
	    			
	    			if ( !isOriginal ) {
	    				self._buildStreet();
	    				
	    				$( '#fashion-paging' )
							.find( '.fashion-paging-selected' ).removeClass( 'fashion-paging-selected' ).end()
							.find( 'li' ).eq( self._pageIndex )
							.find( 'a' ).addClass( 'fashion-paging-selected' );
	    			}
	    		});
		},
		buildStreetByScroll: function() {
			var self = this;
			
			if ( this._displayType === 'waterfall' ) {
				this._buildStreet.isBuilding = false;
				$( document ).scrollTop(0);
					
				$( window ).bind( 'scroll', function() {
					utilities.throttle(function() {
						if ( $( document ).scrollTop() + $( window ).height() > $( document ).height() - 200 ) {
							if ( !this._buildStreet.isBuilding ) {
								this._buildStreet.isBuilding = true;
								this._pageIndex++;
								this._buildStreet();
							}
						}
					}, self );
				});
			}
		},
		
		name: 'fashion-city',
		init: function() {
			this._city = $('body').data('city');
			this._type = $('#fashion-city').data('type');
			
			this._buildStreet();
			
			
			
			this.buildStreetByScroll();
		}
	};
});
