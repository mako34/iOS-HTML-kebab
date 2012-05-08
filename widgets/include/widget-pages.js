/* 
	container: DOM element containing the pages (pages are immediate DIV children of the container)
	nav: DOM element containing anchors, one for each page (optional)
	prev: DOM element to trigger animation to previous page (optional)
	next: DOM element to trigger animation to next page (optional)
	disableSwipe: boolean, disables swipe gestures (optional, default: false)
	swipeThreshold: numeric value of the required delta in pixels during swipes to show the next/prev page (optional, default: 200)
*/
function Pages(container, nav, prev, next, disableSwipe, swipeThreshold) {
	(function init() {
		if (!container) {
			console.log('Unable to initialise Pages widget - container not provided');
			return;
		}
	
		var supportsTouch = ('createTouch' in document);
		var tap = supportsTouch ? 'touchstart' : 'mousedown';
		var untap = supportsTouch ? 'touchend' : 'mouseup';
		var move = supportsTouch ? 'touchmove' : 'mousemove';
	
		var $container = $(container);
		var $pages = $container.find('> div');
		var $prev = prev ? $(prev) : null;
		var $next = next ? $(next) : null;
		
		var $nav = nav ? $(nav) : null;
		var hasNav = false;
		var $anchors;
		
		var width = {};
		width.page = $pages.eq(0).width();
		width.container = $pages.length * width.page;
		$container.width(width.container);
		
		var x = {
			current: 0,
			max: -(width.container - width.page),
			start: 0,
			move: 0,
			delta: 0,
			threshold: (swipeThreshold) ? swipeThreshold : 200
		}

		if (disableSwipe) { }
		else {
			$container.bind(tap, function(e) {
				container.style.webkitTransitionDuration = 0;
				x.start = e.originalEvent.touches[0].pageX;
			});
	
			$container.bind(move, function(e) {
				x.move = e.originalEvent.touches[0].pageX;
				x.delta = x.move - x.start;
				container.style.webkitTransform = 'translate3d(' + (x.current + x.delta) + 'px, 0, 0)';
			});
			
			$container.bind(untap, function(e) {
				x.move = e.originalEvent.changedTouches[0].pageX;
				x.delta = x.move - x.start;
				if (x.delta > 0) {
					if (x.delta >= x.threshold) animatePrev();
					else animateContainer();
				} else {
					if (x.delta <= -x.threshold) animateNext();
					else animateContainer(); 
				}
				container.style.webkitTransitionDuration = '0.5s';
			});
		}
		
		if ($nav) {
			$anchors = $nav.find('a');
			if ($anchors.length) {
				$anchors.bind(untap, function() {
					x.current = -($anchors.index(this) * width.page);
					animateContainer();
				}).eq(0).addClass('pages-nav-current');
				hasNav = true;
			}
		}
		
		if ($prev)
			$prev.bind(untap, function() {
				animatePrev();
			});
		
		if ($next)
			$next.bind(untap, function() {
				animateNext();
			});
		
		function animateNext() {
			if (x.current - width.page < x.max) { }
			else x.current -= width.page;
			animateContainer();
		}
		
		function animatePrev() {
			if (x.current == 0) { }
			else x.current += width.page;
			animateContainer();
		}
		
		function animateContainer() {
			container.style.webkitTransform = 'translate3d(' + x.current + 'px, 0, 0)';
			if (hasNav) $anchors.removeClass('pages-nav-current').eq(-(x.current / width.page)).addClass('pages-nav-current');
		}
		
		console.log('Pages widget initialised');
		
		return true;
	})();
}