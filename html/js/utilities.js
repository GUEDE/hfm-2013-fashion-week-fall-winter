var utilities = {
	getQueryString: function() {
		var qs = (location.search.length > 0 ? location.search.substring(1) : '');
		var args = {};
		var items = qs.split('&');
		var item = null, name = null, value = null;

		for (var i = 0, len = items.length; i < len; i++) {
			item = items[i].split('=');
			name = decodeURIComponent(item[0]);
			value = decodeURIComponent(item[1]);
			args[name] = value;
		}

		return args;
	},
	
	throttle: function( method, context ){
	    clearTimeout( method.tId );
	    
	    method.tId = setTimeout(function() {
	        method.call( context );
	    }, 100 );
	},
	
	isSupportFixed: function() {
		var outer = document.createElement( 'div' ), 
			inner = document.createElement( 'div' );

		outer.style.position = 'absolute';
		outer.style.top = '200px';

		inner.style.position = 'fixed';
		inner.style.top = '100px';

		outer.appendChild(inner);
		document.body.appendChild(outer);

		if ( inner.getBoundingClientRect && inner.getBoundingClientRect().top 
			== outer.getBoundingClientRect().top ) {
				
			return false;
		}
		
		return true;
	},
	
	dateFormat: function( date, format ) {
	
		var _zeroPad = function( num ) {
			var s = '0' + num;
			return s.substring( s.length - 2 );
		};
		
		return format.replace( 'yy', date.getFullYear() )
			.replace( 'mm', _zeroPad(date.getMonth() + 1) )
			.replace( 'dd', _zeroPad(date.getDate()) );
	},
	
	modules: {
		add: function( module ) {
			this.__modules = this.__modules || [];
			this.__modules.push( module );
		},
		exec: function() {
			var module;
			
			while ( this.__modules.length ) {
				var module = this.__modules.shift();
				module.init();
			}
		}
	}
};