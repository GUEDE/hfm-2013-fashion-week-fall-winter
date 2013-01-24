/**
 * description: slide plugin
 * author: Nicolas.Z
 * date: Aug 29, 2012
 * requires: jQuery v1.4+
 */
(function( $ ) {

var Slide = function( $target, options ) {
	this.options = options;
	
	this.$target = $target;
	this.$slide = this.$target.wrapInner( '<div class="simpleslide" />' ).find( '.simpleslide' );
	this.$container = this.$slide.wrapInner( '<div class="simpleslide-container">' ).find( '.simpleslide-container' );
	this.$items = this._getItems();
	
	this.itemWidth = this.$items.outerWidth(true);
	this.itemHeight = this.$items.outerHeight(true);
	this.length = this.$items.length;
	
	this.animCss = this.options.vertical ? 'top' : 'left';
	this.current = this.options.circular ? this.options.visible : 0;
	this.current = this.current + this.options.start;
	if ( !this.options.circular && (this.current + this.options.visible > this.length) ) {
		this.current = this.length - this.options.visible;
	}
	
	this.running = false;
	this.autoTimeId = null;
	
	this._setStyle();
	this._createButton();
	if ( this.options.auto ) {
		this._auto();
		this.stopSlide();
	}
};

Slide.prototype = {
	constructor: Slide,
	_getItems: function() {
		var $items = this.$container.children(), len = $items.length, v = this.options.visible;
		
		if ( this.options.circular ) {
			this.$container.prepend( $items.slice(len - v).clone() )
				.append( $items.slice(0, v).clone() );
				
			$items = this.$container.children();
		}
		
		return $items;
	},
	_getMergedMargin: function( length, isAnim ) {
		var margin = 0;
		
		if ( this.options.vertical && length ) {
			length = isAnim ? length : length - 1;
			margin = Math.min(parseInt(this.$items.css( 'margin-top' )), parseInt(this.$items.css( 'margin-bottom' )));
			margin = margin * length;
		}
		
		return margin;
	},
	_getSize: function( length, isAnim ) {
		var itemSize = this.options.vertical ? this.itemHeight : this.itemWidth;
		return itemSize * length - this._getMergedMargin( length, isAnim );
	},
	_setStyle: function() {
		var sizeCss = this.options.vertical ? 'height' : 'width';
		
		this.$items.css({
			overflow: 'hidden',
			width: this.$items.width(),
			height: this.$items.height(),
			'float': this.options.vertical ? 'none' : 'left'
		});
		
		this.$container.css( {position: 'relative', 'z-index': 1} )
			.css( sizeCss, this._getSize( this.length ) )
			.css( this.animCss, -(this._getSize( this.current, true )) );
		
		this.$slide.css( {position: 'relative', overflow: 'hidden', 'z-index': 2} )
			.css( sizeCss, this._getSize( this.options.visible ) );
		
		this.$target.css({
			width: this.options.vertical ? this.itemWidth : this.$slide.width(),
			position: 'relative'
		});
	},
	_createButton: function() {
		var slide = this, vertical = this.options.vertical, $target = this.$target, $prev, $next;
		
		if ( !this.options.auto ) {
			$target.prepend( '<a class="' + this.options.prevClass + '" href="">prev</a>' )
				.append( '<a class="' + this.options.nextClass + '" href="">next</a>' );
				
			$prev = $target.find( '.' + this.options.prevClass );
			$next = $target.find( '.' + this.options.nextClass );

			$prev.add( $next ).css( 'position', 'absolute' );
			
			$prev.css({
				top: vertical ? -$prev.outerHeight() : ( $target.innerHeight() - $prev.outerHeight() ) / 2,
				left: vertical ? ( $target.innerWidth() - $prev.outerWidth() ) / 2 : -$prev.outerWidth()
			});
			
			if ( vertical ) {
				$next.css({
					bottom: -$next.outerHeight(),
					left: ( $target.innerWidth() - $next.outerWidth() ) / 2
				});
			} else {
				$next.css({
					top: ( $target.innerHeight() - $next.outerHeight() ) / 2,
					right: -$next.outerWidth()
				});
			}
			
			$next.bind( 'click.simpleslide', function( e ) {
				e.preventDefault();
				slide.toNext();
			});
			
			$prev.bind( 'click.simpleslide', function( e ) {
				e.preventDefault();
				slide.toPrevious();
			});
		}
	},
	_auto: function() {
		var slide = this;
		this.autoTimeId = setTimeout( function() {
			slide.toNext();
			slide.autoTimeId = setTimeout( arguments.callee, slide.options.auto + slide.options.duration );
		}, this.options.auto );
	},
	_run: function( to ) {
		var slide = this, len = this.length, v = this.options.visible, c = this.options.scroll, index;
		
		if ( !this.running ) {
			if ( this.options.circular ) {
				if ( to + v > len || to + v < v ) {
					if ( to + v > len ) {
						index = v * 2 - (len - to + c);
						to = index + c;
					} else {
						index = (len - v * 2) + to + c;
						to = index - c;
					}
					this.$container.css( this.animCss, -(this._getSize( index )) );
				}
			} else {
				if ( to + c == 0 || to - c + v == len ) {
					return;
				}
				if ( len - to < v ) {
					to = len - v;
				}
				if ( to < 0 ) {
					to = 0;
				}
			}
			
			this.current = to;	
			this.running = true;
			this.$container.animate(
				this.options.vertical ? { top:  -(this._getSize( to, true ))} : { left: -(this._getSize( to, true )) },
				this.options.duration,
				this.options.easing, 
				function() {
					slide.running = false;
				});
		}
	},
	
	toNext: function() {
		this._run( this.current + this.options.scroll );
	},
	toPrevious: function() {
		this._run( this.current - this.options.scroll );
	},
	stopSlide: function() {
		var slide = this;
		
		this.$target
			.bind( 'mouseenter', function() {
				clearTimeout( slide.autoTimeId );
			})
			.bind( 'mouseleave', function() {
				slide._auto();
			});
	}
};

$.fn.simpleslide = function( options ) {
	var settings = $.extend({
		visible: 3,
		scroll: 1,
		
		// animation time
		duration: 800,
		circular: true,
		vertical: false,
		
		// millisecond
		auto: 1000,
		prevClass: 'simpleslide-prev',
		nextClass: 'simpleslide-next',
		easing: null,
		
		start: 0
	}, options );
	
	return this.each(function() {
		new Slide( $( this ), settings );
	});
};

})( jQuery );