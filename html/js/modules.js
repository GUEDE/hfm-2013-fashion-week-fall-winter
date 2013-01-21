var modules = {
	player: {
		init: function() {
			flowplayer( 'fashionshow-player', 'coms/flowplayer-3.2.14.swf', {
				clip: {
					autoPlay: false,
					autoBuffering: true
				}
			});
		}
	},
	
	menu: {
		_isSupportFixed: false,
		
		setPosition: function() {
			var pos = {
				left: ( $( document ).width() - $( '#container' ).width() ) / 2 - $( '#sub-nav' ).outerWidth(),
				top: 100 + ( this._isSupportFixed ? 0 : $( document ).scrollTop() )
			};
				
			$( '#sub-nav' ).css( pos );
		},
		setPositionProperty: function() {
			if ( !this._isSupportFixed ) {
				$( '#sub-nav' ).css( 'position', 'absolute' );
			}
		},
		init: function() {
			var self = this;
			
			this._isSupportFixed = utilities.isSupportFixed();
			this.setPositionProperty();
			this.setPosition();
			
			$( window ).bind( 'scroll', function() {
				utilities.throttle( self.setPosition, self );
			});
		}
	},
	
	slideshow: {
		setTitle: function( slide ) {
			var title = $( slide ).find( 'img' ).attr( 'alt' );
	        	
	    	title = title.split( '-' );
	    	$( '#focus-slideshow-text' ).html( '<strong>' + title[0] + '</strong>' + title[1] );
		},
		init: function() {
			var self = this,
				$firstSlide = $( '#focus-slideshow :first' );
			
			this.setTitle( $firstSlide );
			$( '#focus-slideshow' ).cycle({
		        fx: 'scrollHorz',
		        prev:    '#focus-slideshow-prev', 
		        next:    '#focus-slideshow-next',
		        after: function( curr, next ) {
		        	self.setTitle( next );
		        }
		    }); 
		}
	},
	
	schedule: {
		_city: '',
		
		_buildInfoItem: function( item ) {
			return '<li>' +
						'<a href="' + (typeof item.url === 'string' ? item.url : '') + '">' +
							'<span class="show-name"> ' + item.name + ' </span>' +
							'<span class="show-time">' +
								'<span>Time:</span>' + item.time + 
							'</span>' +
						'</a>' +
					'</li>';
		},
		
		selectDate: function( date ) {
			var $items = $( '#show-schedule-date' ).find( '.show-schedule-date-item' ),
				start = 0;
			
			date = utilities.dateFormat( date, 'yy-mm-dd' );
			
			$items.each(function(i) {
				if ( !$( this ).hasClass( 'show-schedule-date-disabled' ) && $( this ).data( 'schedule-date' ) === date ) {
					$( this ).addClass( 'show-schedule-date-selected' );
					start = i;
					return false;
				}
			});
				
			if ( !$( '#show-schedule-date' ).find( '.show-schedule-date-selected' ).length ) {
				date = $items.eq(0).addClass( 'show-schedule-date-selected' ).data( 'schedule-date' );
			}
			
			this.slideDate( start < 7 ? 0 : start );
			this.refreshInfo( this._city, date );
		},
		
		slideDate: function( start ) {
			$( '#show-schedule' )
				.simpleslide({
					visible: 7,
					auto: 0,
					circular: false,
					prevClass: 'show-schedule-prev',
					nextClass: 'show-schedule-next',
					start: start
				})
				.find( '.show-schedule-prev, .show-schedule-next' )
				.addClass( 'sprite-buttons' )
				.css( 'top', 15 );
		},
		
		refreshInfo: function( city, date ) {
			var requestUrl = 'data/' + city + '/schedule/' + date + '.json',
				self = this;
			
			$.getJSON( requestUrl ).done(function( data ) {
				var items = [];
				
				$.each( data, function( index, item ) {
					items.push( self._buildInfoItem( item ) );
				});
				
				$( '#show-schedule-time ul' ).html( items.join('') );
			});
		},
		
		refreshInfoBySelectDate: function() {
			var self = this;
			
			$( '#show-schedule-date' ).find( '.show-schedule-date-item' )
				.bind( 'click', function( e ) {
					var date = $( this ).data( 'schedule-date' );
					
					if ( $( this ).hasClass( 'show-schedule-date-disabled' ) ) {
						return false;
					}
					
					e.preventDefault();
					
					$( this )
						.addClass( 'show-schedule-date-selected' )
						.siblings().removeClass( 'show-schedule-date-selected' );
					
					self.refreshInfo( self._city, date );
				});
		},
		
		init: function() {
			this._city = $( 'body' ).data( 'city' );
			this.selectDate( new Date() );
			this.refreshInfoBySelectDate();
		}
	},
	
	weiboEditorsScrollbar: {
		init: function() {
			$( '.weibo-editors-content' ).jScrollPane();
		}
	},
	
	fashionView: {
		_city: '',
		_displayType: 'paging',
		_isBuiltPaging: false,
		_blockCategoryClassName: {
			'11': 'fashion-shop-comment',
			'12': 'fashion-shop-video',
			'13': 'fashion-shop-picture',
			'14': 'fashion-shop-makeup',
			'15': 'fashion-shop-aee'
		},
		
		pageIndex: 1,
		pageCount: 0,
		
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
						'<h2 class="fashion-shop-header ' + this._blockCategoryClassName[ item.category ] + ' sprite-parts">' + 
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
	    				if ( pageIndex !== self.pageIndex ) {
	    					self.pageIndex = pageIndex;
	    					isOriginal = false;
	    				}
	    			} else {
	    				if ( $( this ).is( '.fashion-paging-prev' ) ) {
	    					if ( self.pageIndex > 1 ) {
	    						self.pageIndex--;
	    						isOriginal = false;
	    					}
	    				} else if ( $( this ).is( '.fashion-paging-next' ) ) {
	    					if ( self.pageIndex < self.pageCount ) {
	    						self.pageIndex++;
	    						isOriginal = false;
	    					}
	    				}
	    			}
	    			
	    			if ( !isOriginal ) {
	    				self.buildStreet();
	    				
	    				$( '#fashion-paging' )
							.find( '.fashion-paging-selected' ).removeClass( 'fashion-paging-selected' ).end()
							.find( 'li' ).eq( self.pageIndex )
							.find( 'a' ).addClass( 'fashion-paging-selected' );
	    			}
	    		});
		},
		buildStreet: function() {
			var requestUrl = 'server/data.php',
				self = this,
				pageItemsCount = 9,
				pageIndex = this.pageIndex;
				categoryId = utilities.getQueryString().cid;
			
			if ( typeof categoryId === 'undefined' ) {
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
			
			$.getJSON( requestUrl, {
				    city: this._city,
				    num: pageItemsCount,
				    page: pageIndex,
				    category: categoryId
				})
				.done(function( data ) {
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
				    
				})
				.always(function() {
					if ( self._displayType === 'paging' ) {
						$( '#fashion-city' ).unblock();
					}
					
					self.buildStreet.isBuilding = false;
				});
		},
		buildStreetByScroll: function() {
			var self = this;
			
			if ( this._displayType === 'waterfall' ) {
				this.buildStreet.isBuilding = false;
				$( document ).scrollTop(0);
					
				$( window ).bind( 'scroll', function() {
					utilities.throttle(function() {
						if ( $( document ).scrollTop() + $( window ).height() > $( document ).height() - 200 ) {
							if ( !this.buildStreet.isBuilding ) {
								this.buildStreet.isBuilding = true;
								this.pageIndex++;
								this.buildStreet();
							}
						}
					}, self );
				});
			}
		},
		init: function() {
			this._city = $( 'body' ).data( 'city' );
			this._displayType = $( '#fashion-city' ).data().displayType;
			
			this.buildStreet();
			this.buildStreetByScroll();
		}
	}
};