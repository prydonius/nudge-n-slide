/*  Copyright 2011 Adnan Abdulhussein (email : adnan@prydoni.us)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as 
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

(function($){
	var methods = {
		init: function(options) {

			var o =  $.extend({}, $.fn.nudgeNSlide.initDefaults, options);
 
            return this.each(function() {
            	var slides = $(this).children(),
            		noSlides = slides.size(),
            		lastSlideIndex = noSlides - 1,
            		currentSlideIndex = sanitizeIndex(o.showSlide, noSlides),
            		sliderLoop = null,
            		marginTop;
            		conf = $(this).data('nns-init');
            	if (!conf) {
		            $(this).data('nns-init', {
		            	slides: slides,
		            	noSlides: noSlides,
		            	lastSlideIndex: lastSlideIndex,
		            	currentSlideIndex: currentSlideIndex,
		            	sliderLoop: sliderLoop
		            });
		            conf = $(this).data('nns-init');
		        }
		        $(this).wrap('<div id="nns-wrapper" />').parent('#nns-wrapper').css({
		        	'overflow': 'hidden'
		        });
		        conf.slides.each(function(i) {
		        	$(this).css({
		        		'width': $(this).outerWidth(true),
		        		'height': $(this).outerHeight(true)
		        	});
		        });
	            moveImageSet($(this), conf.currentSlideIndex, 0, '');
        	});
		},
		
		play: function(options) {
		
			var defaults = {
				startAt: null,
				stopAt: null,
				slideInterval: 10000,
				animDuration: 1000,
				animEasing: 'easeInOutCirc',
				exclude: null,
				useSaved: false
			};
			var o =  $.extend({}, defaults, options);
			
			return this.each(function() {
				var conf = $(this).data('nns-init'),
					saved = $(this).data('nns-loop'),
					$this = $(this),
					exclude = null,
					index,
					stopAt;
				if (!conf) {
					$(this).nudgeNSlide();
					conf = $(this).data('nns-init');
				}
				if ((!o.useSaved) || (!saved)) {
					$(this).data('nns-loop', {
						stopAt: o.stopAt,
						slideInterval: o.slideInterval,
						animDuration: o.animDuration,
						animEasing: o.animEasing,
						exclude: o.exclude
					});
					saved = $(this).data('nns-loop');
				}
				if (conf.sliderLoop) clearInterval(conf.sliderLoop);
				if (o.startAt) {
					index = sanitizeIndex(o.startAt, conf.noSlides);
					moveImageSet($(this), index, 500, 'easeOutElastic');
				}
				else index = conf.currentSlideIndex;
				if (saved.stopAt) stopAt = sanitizeIndex(saved.stopAt, conf.noSlides);
				if (saved.exclude) exclude = getExcludeIndexes(saved.exclude, conf.noSlides);
				if (saved.slideInterval < 2000) saved.slideInterval = 2000;
				index = getPendingIndex('next', index, conf.lastSlideIndex, exclude);
				conf.sliderLoop = setInterval(function() {
					moveImageSet($this, index, saved.animDuration, saved.animEasing);
					if (stopAt) {
						if (index == stopAt) clearInterval(conf.sliderLoop);
					}
					index = getPendingIndex('next', index, conf.lastSlideIndex, exclude);
				}, saved.slideInterval);
			});
		},
		
		pause: function(options) {
		
			var defaults = {
				direction: 'next',
				animDuration: 500,
				animEasing: 'easeOutElastic',
				exclude: null,
				playAfter: true
			};
			var o =  $.extend({}, defaults, options);
			
			return this.each(function() {
				var conf = $(this).data('nns-init');
				if (!conf) {
					$(this).nudgeNSlide();
					conf = $(this).data('nns-init');
				}
				if (conf.sliderLoop) clearInterval(conf.sliderLoop);
				$(this).stop();
				moveImageSet($(this), conf.currentSlideIndex, 0, '');
			});
		},
				
		nudge: function(options) {
		
			var defaults = {
				direction: 'next',
				animDuration: 500,
				animEasing: 'easeOutElastic',
				exclude: null,
				playAfter: true
			};
			var o =  $.extend({}, defaults, options);
			
			return this.each(function() {
				var conf = $(this).data('nns-init'),
					index = null,
					exclude = null,
					$this = $(this);
				if (!conf) {
					$(this).nudgeNSlide();
					conf = $(this).data('nns-init');
				}
				if (conf.sliderLoop) clearInterval(conf.sliderLoop);
				$(this).stop();
				moveImageSet($(this), conf.currentSlideIndex, 0, '');
				if (typeof(o.direction) == 'string') {
					if (o.exclude) exclude = getExcludeIndexes(o.exclude, conf.noSlides);
					index = getPendingIndex(o.direction, conf.currentSlideIndex, conf.lastSlideIndex, exclude);
				}
				else if (typeof(o.direction) == 'number') {
					index = sanitizeIndex(o.direction, conf.noSlides);
				}
				if (typeof(index) != 'undefined') {
					moveImageSet($(this), index, o.animDuration, o.animEasing, true);
					if (o.playAfter) $(this).nudgeNSlide('play', { useSaved: true });
				}
				else $(this).nudgeNSlide('play', { useSaved: true });
			});
		}
		
	};
	
	function getExcludeIndexes(array, noSlides) {
		var newArray = new Array();
		array = array.split(',');
		jQuery.each(array, function(i, val) {
			if (!(val < 1 || val > noSlides)) {
				newArray.push(val - 1);
			}
		});
		return newArray;
	}
	
	function sanitizeIndex(slideNo, noSlides) {
		if (!(slideNo < 1 || slideNo > noSlides)) {
			return slideNo - 1;
		}
		else return undefined;
	}
	
	function getMarginTop(index, slides) {
		var marginTop = 0;
		if (index == 0) return marginTop;
		else {
			slides.each(function(i, elem) {
				if (i == index) return false;
				else marginTop = marginTop - $(elem).outerHeight(true);
			});
			return marginTop + 'px';
		}
	}
	
	function moveImageSet(set, index, duration, easing, nudge) {
		var conf = set.data('nns-init'),
			marginTop = getMarginTop(index, conf.slides),
			xyDuration = duration;
		if (nudge) xyDuration = 0;
    	set.filter(':not(:animated)').animate({ 'margin-top': marginTop }, duration, easing).parent('#nns-wrapper').animate({
    		'width': conf.slides.eq(index).outerWidth(true)+'px',
    		'height': conf.slides.eq(index).outerHeight(true)+'px'
    	}, xyDuration, easing);
    	conf.currentSlideIndex = index;
    	$.fn.nudgeNSlide.afterMove();
	}
	
	function getPendingIndex(direction, index, lastSlideIndex, exclude) {
		if (direction == 'next') {
			if (index >= lastSlideIndex) index = 0;
			else index++;
			if (exclude) {
				jQuery.each(exclude, function(i, val) {
					if (index == val) {
						index = getPendingIndex('next', index, lastSlideIndex, exclude);
						return false;
					}
				});
			}
			return index;
		}
		else if (direction == 'prev') {
			if (index <= 0) index = lastSlideIndex;
			else index--;
			if (exclude) {
				jQuery.each(exclude, function(i, val) {
					if (index == val) {
						index = getPendingIndex('prev', index, lastSlideIndex, exclude);
						return false;
					}
				});
			}
			return index;
		}
	}
			
	$.fn.nudgeNSlide = function(method) {

	    if ( methods[method] ) {
	      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	      return methods.init.apply( this, arguments );
	    } else {
	      $.error( 'Method ' +  method + ' does not exist on jQuery.JumpSlider' );
	    }    

	};
		
	$.fn.nudgeNSlide.initDefaults = {
		showSlide: 1
	};
	
	$.fn.nudgeNSlide.afterMove = function() {
		// Customisable method to do things after the slider has moved.
	};
     
})(jQuery);