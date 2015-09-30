(function ($) {
	var	aux = {
		
		navigate: function (dir, $el, $wrapper, opts, cache) {
			
			var scroll = opts.scroll,
				circle = opts.circle;
			
			if ( dir === 1 ) {
				if ( circle ) {
					$wrapper.children(':last').after($wrapper.children().slice(0,scroll).clone(true));
				} 
				else {
					$el.find('.prev').removeClass('disabled');
				}
			}
			
			if ( dir === -1) {
				if ( circle ) {
					$wrapper.children(':first').before($wrapper.children().slice(cache.totalItems - scroll, cache.totalItems).clone(true));
					$wrapper.css('left', -cache.itemW * scroll + 'px');
				} 
				else {
					$el.find('.next').removeClass('disabled');
				}
			}
			
			$wrapper.each(function (){
				var $item = $(this);
				
				//alert (scroll * cache.text);
				
				$item.stop().animate({
					left	:  ( dir === 1 ) ? '-=' + ( cache.itemW * scroll)  + 'px' : '+=' + ( cache.itemW * scroll) + 'px'
				}, opts.slideSpeed, /*opts.sliderEasing,*/ function (){
					if ( dir === 1 && circle) {
						$wrapper.children().slice(0, scroll).remove()
						$item.css('left', 0);
					}
					if ( dir === -1 && circle) {
						$wrapper.children().slice(cache.totalItems, cache.totalItems  + scroll ).remove();
					}
					
					if ( dir === 1 && !circle && $item.position().left <= -(cache.totalItems * cache.itemW - cache.itemW) ) {
						$el.find('.next').addClass('disabled');
						$item.css('left', -(cache.totalItems * cache.itemW - cache.itemW));
					}
					
					if ( dir === -1 && !circle && $item.position().left >= 0 ) {
						$el.find('.prev').addClass('disabled');
						$item.css('left', 0);
					}
					
					cache.isAnimating	= false;
					
				});
				
			});			
		}
		
	},
	methods = {
		init: function ( options ){
			
			if ( this.length ){
				
				var settings = {
					slideSpeed: 500,
					scroll: 1,
					showImage: 0,
					circle: true,
					autoScroll: false,
					autoScrollTimeOut: 2000,
					autoScrollDir: 1,
					pagination: true
					/*sliderEasing: 'easeInQuart'*/
				};
				
				return this.each (function(){
					
					if ( options ) {
						$.extend(settings, options);
					}
					
					var $el 			= $(this),
						$wrapper 		= $el.find(".carousel").find('ul'),
						$items 			= $wrapper.find(".item"),
						cache 			= {};
						
					/*$wrapper.find('img').load(function(){*/
						cache.itemW			= $items.width();
					/*});*/
					cache.totalItems 	= $items.length;
					
					if ( cache.totalItems > settings.scroll ) {
						
						var disabled = ((!settings.circle) ? " disabled" : "");
						
						var paginations = function (){
							var pagin = '';
							var quantity = Math.ceil(cache.totalItems / settings.scroll);
					
							for ( i = 1; i <= quantity; i++) {
								pagin += '<a href = "">' + i + '</a>';
							}
							
							return  '<div class="pagination">' + pagin + '</div>';							
						}
					
						$el.append('<div class="nav"><span class="prev' + disabled + '">prev</span><span class="next">next</span>'+  ((settings.pagination) ? paginations() : "") + '</div>');
						
						$el.find('.pagination a:first').addClass('active');
					}
					
					/*if (settings.scroll < 1) {
						settings.scroll = 1;
					} else if (settings.scroll > 3) {
						settings.scroll = 3;
					}*/
					
					if ( settings.showImage > 0 ) {
						$el.css({'width': cache.itemW * settings.showImage });
					}
					
					var $navPrev 		= $el.find(".prev"),
						$navNext 		= $el.find(".next"),
						$pagination     = $el.find(".pagination a");
						
						
					$navPrev.bind ('click.carousel', function (){
						if( cache.isAnimating ) return false;
						cache.isAnimating	= true;
						aux.navigate (-1, $el, $wrapper, settings, cache);
					});
					
					$navNext.bind ('click.carousel', function (){
						if( cache.isAnimating ) return false;
						cache.isAnimating	= true;
						aux.navigate (1, $el, $wrapper, settings, cache);
					});
					
					$pagination.bind ('click.carousel', function (event){
						event.preventDefault();
						cache.text = $(this).text();
						cache.index = Number(($wrapper.find('li:first').attr('class')).replace(/\D+/g,""));
						
						$el.find('.pagination .active').removeAttr('class');
						$(this).addClass('active');
						
						if (cache.text > cache.index) {
							var direction = 1;
						}
						else {
							var direction = -1;
						}
						aux.navigate (direction, $el, $wrapper, settings, cache);
					});
					
					if (settings.autoScroll) {
						setInterval(function(){
							aux.navigate (settings.autoScrollDir, $el, $wrapper, settings, cache); 
						}, settings.autoScrollTimeOut + settings.slideSpeed);	
					}

				});
				
			}
			
		}
	};

	$.fn.carousel = function( method ) {
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Метод с именем ' +  method + ' не существует для jQuery.carousel' );
		} 
	};
})(jQuery);