(function ($) {
	var	aux = {
		
		navigate: function (dir, $el, $wrapper, opts, cache) {
			
			var scroll = opts.scroll,
				circle = opts.circle;
			
			var scrl = ((cache.pagination) ? (cache.pagination) : scroll );
			
			if ( dir === 1 ) {
				if ( circle ) {
					$wrapper.children(':last').after($wrapper.children().slice(0, scrl).clone(true));
				} 
				else {
					$el.find('.prev').removeClass('disabled');
				}
			}
			
			if ( dir === -1) {
				if ( circle ) {
					$wrapper.children(':first').before($wrapper.children().slice(cache.totalItems - scrl, cache.totalItems).clone(true));
					$wrapper.css('left', -cache.itemW * scrl + 'px');
				} 
				else {
					$el.find('.next').removeClass('disabled');
				}
			}
			
			$wrapper.each(function (){
				var $item = $(this);
								
				$item.stop().animate({
					left	:  ( dir === 1 ) ? '-=' + ( cache.itemW * scrl)  + 'px' : '+=' + ( cache.itemW * scrl) + 'px'
				}, opts.slideSpeed, /*opts.sliderEasing,*/ function (){
					if ( dir === 1 && circle) {
						$wrapper.children().slice(0, scrl).remove()
						$item.css('left', 0);
					}
					if ( dir === -1 && circle) {
						$wrapper.children().slice(cache.totalItems, cache.totalItems  + scrl ).remove();
						$item.css('left', 0);
					}
					
					if ( dir === 1 && !circle && $item.position().left <= -(cache.totalItems * cache.itemW - cache.itemW) ) {
						$el.find('.next').addClass('disabled');
						$item.css('left', -(cache.totalItems * cache.itemW - cache.itemW));
					}
					
					if ( dir === -1 && !circle && $item.position().left >= 0 ) {
						$el.find('.prev').addClass('disabled');
						$item.css('left', 0);
					}
					
					if ( dir === 1 && !cache.pagination ) {
						if ($el.find('.pagination a').last().hasClass('active') ){
							$el.find('.pagination .active').removeAttr('class');
							$el.find('.pagination a').first().addClass('active');
						} else {
							$el.find('.pagination .active').removeAttr('class').next().addClass('active');
						}
					}
					if ( dir === -1 && !cache.pagination ){
						if ($el.find('.pagination a').first().hasClass('active') ){
							$el.find('.pagination .active').removeAttr('class');
							$el.find('.pagination a').last().addClass('active');
						} else {
							$el.find('.pagination .active').removeAttr('class').prev().addClass('active');
						}
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
					
									
						cache.itemW			= $items.width();
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
						cache.pagination 	= false;
						aux.navigate (-1, $el, $wrapper, settings, cache);
					});
					
					$navNext.bind ('click.carousel', function (){
						if( cache.isAnimating ) return false;
						cache.isAnimating	= true;
						cache.pagination 	= false;
						aux.navigate (1, $el, $wrapper, settings, cache);
					});
					
					$pagination.bind ('click.carousel', function (event){
						event.preventDefault();
						
						cache.text = Number($(this).text());
						//cache.index = Number(($wrapper.find('li:first').attr('class')).replace(/\D+/g,""));
						cache.index = Number($el.find('.pagination .active').text());
						
						$el.find('.pagination .active').removeAttr('class');
						
						$(this).addClass('active');
						
						if ( cache.text > cache.index) {
							var direction = 1;
							cache.pagination = settings.scroll * cache.text - settings.scroll * cache.index;
						} else if ( cache.text < cache.index) {
							var direction = -1;
							cache.pagination = settings.scroll * cache.index - settings.scroll * cache.text;
						} else {
							return false;
						}
						
						if( cache.isAnimating ) return false;
						cache.isAnimating	= true;
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