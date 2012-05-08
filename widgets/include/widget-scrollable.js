/* 
	element: DOM element that needs to be scrollable
	
	Notes:
	1. The scrollable element's immediate parent should be its frame (viewport) with a fixed height and width (and overflow:hidden)
	2. A scrollbar will be created and appended to the scrollable element's parent
*/
function Scrollable(element) {
	var $element, $frame;
	var $scrollbar, scrollbar;
	
	(function init() {
		var supportsTouch = ('createTouch' in document);
		var tap = supportsTouch ? 'touchstart' : 'mousedown';
		var untap = supportsTouch ? 'touchend' : 'mouseup';
		var move = supportsTouch ? 'touchmove' : 'mousemove';
	
		$element = $(element);
		$frame = $element.parent();
		
		var hElement = $element.height();
		var hFrame = $frame.height();
		var hScrollBarMod = hFrame / hElement;
		var hScrollBar = hScrollBarMod * hFrame;
		
		var isScrollable = (hElement > hFrame);
		
		var x = {
			start: 0,
			move: 0,
			delta: 0
		}
		
		var y = {
			start: 0,
			move: 0,
			end: 0,
			delta: 0,
			max: -(hElement - hFrame + 10)
		}
		
		var yScrollBar = {
			end: 0,
			delta: 0,
			max: hFrame - hScrollBar
		}
		
		/*
		var time = {
			start: undefined,
			end: undefined,
			delta: 0
		}
		*/
		
		$scrollbar = $('<div />', {
			className: 'scrollable-scrollbar',
			style: 'height:' + hScrollBar + 'px'
		});
		scrollbar = $scrollbar.get(0);
		$frame.append($scrollbar);
		
		/*
		var $debugStart = $('.debug-start');
		var $debugMove = $('.debug-move');
		var $debugEnd = $('.debug-end');
		var $debugDelta = $('.debug-delta');
		var $debugTime = $('.debug-time');
		var $debugMY = $('.debug-my');
		*/	
	
		$element.bind(tap, function(e) {			
			x.start = e.originalEvent.touches[0].pageX;
			
			// time.start =  new Date();
			element.style.webkitTransition = scrollbar.style.webkitTransition = '';
			y.start = e.originalEvent.touches[0].pageY;
			// $debugStart.text(y.start);
			
			$scrollbar.addClass('scrollable-scrollbar-visible');
		});

		$element.bind(move, function(e) {
			e.stopPropagation();
			e.preventDefault();
			
			x.move = e.originalEvent.touches[0].pageX;
			x.delta = x.move - x.start;
			
			y.move = e.originalEvent.touches[0].pageY;
			y.delta = y.move - y.start;
			
			element.style.webkitTransform = 'translate3d(0, ' + (y.end + y.delta) + 'px, 0)';
			// $debugDelta.text(y.delta);
			// $debugMove.text(y.move);
			yScrollBar.delta = y.delta * hScrollBarMod;
			scrollbar.style.webkitTransform = 'translate3d(0, ' + (yScrollBar.end - yScrollBar.delta) + 'px, 0)';
		});
		
		$element.bind(untap, function(e) {
			if (x.delta > -100 && x.delta < 100) {
				e.stopPropagation();
				e.preventDefault();
			}
			
			/*
			time.end =  new Date();
			time.delta = time.end.getTime() - time.start.getTime();
			var velocity = y.delta / time.delta;
			var acceleration = velocity < 0 ? 0.0005 : -0.0005;
			var displacement = - (velocity * velocity) / (2 * acceleration);
			var mtime = - velocity / acceleration;
			*/
			
			y.end = y.end + y.delta/*  + displacement */;
			yScrollBar.end = yScrollBar.end - yScrollBar.delta;
			
			element.style.webkitTransition = '-webkit-transform 0.5s ease-out';
			scrollbar.style.webkitTransitionProperty ='-webkit-transform, opacity';
			scrollbar.style.webkitTransitionDuration ='0.5s, 0.25s';
			scrollbar.style.webkitTransitionTimingFunction ='ease-in-out, ease-in-out';
			scrollbar.style.webkitTransitionDelay ='0, 0.5s';
			
			// Bounce
			if (y.end > 0 || !isScrollable) { // <- top
				element.style.webkitTransform = scrollbar.style.webkitTransform = 'translate3d(0, 0, 0)';
				y.end = yScrollBar.end = 0;
			} else if (y.end < y.max) { // <- bottom
				element.style.webkitTransform = 'translate3d(0, ' + y.max + 'px, 0)';
				y.end = y.max;
				
				scrollbar.style.webkitTransform = 'translate3d(0, ' + yScrollBar.max + 'px, 0)';
				yScrollBar.end = yScrollBar.max;
			}
			/*
			 else { // <- momentum
				element.style.webkitTransform = 'translate3d(0, ' + (y.end + displacement) + 'px, 0)';
				element.style.webkitTransition = '-webkit-transform ' + mtime + 'ms cubic-bezier(0.33, 0.66, 0.66, 1)';
			}
			*/
			
			// $debugEnd.text(y.end);
			
			$scrollbar.removeClass('scrollable-scrollbar-visible');
		});
				
		console.log('Scrollable widget initialised');
		
		return true;
	})();
}