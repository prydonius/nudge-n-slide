/*  Copyright 2011 Adnan Abdulhussein (email : me@adnan.mx)

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
		
			var o =  $.extend({}, $.fn.JumpSlider.defaults, options);
 
            return this.each(function() {
            
            // Initialisation:
                
      			// Store the image set to be slided so it can be used in the functions
      			var slidesSet = $(this),
      				
      			// Determine how many slides there are in the set
      			    noSlides = slidesSet.children('.'+o.slideClass).size(),
      			    
      			// Thus find the greatest index in the set
      			    lastSlideIndex = noSlides -1,
      			    
      			// Variable to refer to the interval
      			    sliderLoop;
      			
      			// Get and set the description of the first slide
      			setDesc(getDesc(0));
      			
      			// Start the slider
      			// Must start at the index 1, as it is the index for the second slide
      			// The first slide is already displayed on page load and the next one
      			// will show after the delay
      			loopSlides(1);
      			      			
      		// Script Functions:
      			
      			function getDesc(index) {
      				return $('.'+o.slideClass+':eq('+index+')').attr(o.descAttribute);
      			}
      			
      			function setDesc(desc) {
      				$('#'+o.descElementId).text(desc);
      			}
      			
      			function loopSlides(index) {
      				// Perform this loop only if there is more than one slide
      				if (!(noSlides == 1)) {
      					sliderLoop = setInterval(function() {
      						// Move slides set to slide at the index
      						moveSlidesSet(index, o.animationDuration, o.animationEasing);
      						
      						// Increment index
      						// If the slide is the last in the set the index is reset to 0
      						// Otherwise the index is incremented
      						if (index == lastSlideIndex) index = 0;
      						else index++;
      					}, o.slideInterval);
      				}
      			}
      			
      			function moveSlidesSet(index, duration, easing) {
      				// Calculate how much the margin must be moved up by
      				// Each slide is at a given height, so a particular slide is shown
      				// by moving the set up the height of the slides times the index
      				var margintop = -(index*o.slidesHeight);
      				
      				// Perform the animation to the calculated margin-top
      				// The filter stops animations queueing up if the user is using a different tab (bug found in testing)
      				slidesSet.filter(':not(:animated)').animate({'margin-top': margintop}, duration, easing);
      				
      				// Get and set description for new slide
      				setDesc(getDesc(index));
      			}
      			
      			function getCurrentIndex() {
      				// Get a positive value of margin-top without units
      				var margintop = slidesSet.css('margin-top').replace(/[^\d\.]/g, ''),
      				
      				// Divide by height of slides to get the index
      				    index = (margintop/o.slidesHeight);
      				
      				// Round to get the closest whole number index
      				// The previous line can give a fractional index if the margin-top has
      				// stopped at a point during the animation. This will get the closest index
      				index = Math.round(index);
      				
      				return index;
      			}
      			
      		// User Interface Functions:
      			
      			$('.'+o.hoverZoneClass).hover(function() {
      				// Stop any current animations
      				slidesSet.stop();
      				
      				// Stop the loop
      				clearInterval(sliderLoop);
      				
      				// Move to the set to the current index (hover jump as I like to call it)
      				// If the animation was stopped half way, this will take it to the nearest slide
      				moveSlidesSet(getCurrentIndex(), o.hoverJumpDuration, o.hoverJumpEasing);
      				
      				// Display the element that contains the description text
      				$('#'+o.descElementId).slideDown(o.descDuration, o.descEasing);
      			}, function() {
      				// Get the current index
      				var index = getCurrentIndex();
      				
      				// Determine the index of the next slide
      				// If the current index is also the greatest index the index is reset to 0
      				// Otherwise it is incremented
      				if (index == lastSlideIndex) index = 0;
      				else index++;
      				
      				// Restart the loop
      				loopSlides(index);
      				
      				// Hide the element containing the description text
      				$('#'+o.descElementId).slideUp(o.descDuration, o.descEasing);
      			});
      			
      			$('#'+o.nudgePrevId).click(function() {
      				// Stop any current animations
      				slidesSet.stop();
      				
      				// Stop the loop
      				clearInterval(sliderLoop);
      				
      				// Get the current index
      				var index = getCurrentIndex(),
      				
      				// Determine the previous index
      				// If the current index is 0, then the index is set to the last index in the set
      				    prev;
      				if (index == 0) prev = lastSlideIndex;
      				else prev = index - 1;
      				
      				// Move the set to this previous index
      				moveSlidesSet(prev, o.nudgeDuration, o.nudgeEasing);
      				
      				// Restart the loop at the next index (which happens to just be index)
      				loopSlides(index);
      			});
      			
				$('#'+o.nudgeNextId).click(function() {
      				// Stop animations
      				slidesSet.stop();
      				
      				// Stop loop
      				clearInterval(sliderLoop);
      				
      				// Get the current index
      				var index = getCurrentIndex();
      				
      				// Determine the next index
      				// If the index is the last in the set it is reset to 0
      				// Otherwise it is incremented
      				if (index == lastSlideIndex) index = 0;
      				else index++;
      				
      				// Move the set to this index
      				moveSlidesSet(index, o.nudgeDuration, o.nudgeEasing);
      				
      				// Determine index to follow
      				// If the index is the last in the set it is reset to 0
      				// Otherwise it is incremented
      				if (index == lastSlideIndex) index = 0;
      				else index++;
      				
      				// Restart the loop
      				loopSlides(index);
      			});
            });
		},
		
		nudge: function(options) {
		
			var defaults = {
				// Can be next, previous, first, last or the number of the image to go to
				direction: 'next',
				// How long the animation will last
				duration: 500,
				// Type of easing
				easing: 'easeOutElastic'
			};
			var o =  $.extend({}, defaults, options);
			
			return this.each(function() {
				alert ($(this).attr('title'));
			});
		}
		
	};
			
	$.fn.JumpSlider = function(method) {

	    if ( methods[method] ) {
	      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	      return methods.init.apply( this, arguments );
	    } else {
	      $.error( 'Method ' +  method + ' does not exist on jQuery.JumpSlider' );
	    }    

	};
		
	$.fn.JumpSlider.defaults = {
		slideClass: 'slide',
        slidesHeight: 300,
        slideInterval: 10000,
        animationDuration: 1000,
        animationEasing: 'easeInOutCirc',
        nudgePrevId: 'prevSlide',
        nudgeNextId: 'nextSlide',
        nudgeDuration: 500,
        nudgeEasing: 'easeOutElastic',
        descAttribute: 'data-slideDesc',
        descElementId: 'slideDesc',
        descDuration: 500,
        descEasing: 'easeOutBounce',
        hoverZoneClass: 'slide',
        hoverJumpDuration: 500,
        hoverJumpEasing: 'easeOutElastic'
	};
     
})(jQuery);