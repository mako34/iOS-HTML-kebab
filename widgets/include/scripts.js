/*
 * Utility
 */
var utility = utility || {};
utility.setHashLocation = function(hash) {
	window.location = '#!' + hash;
}

var detailer = detailer || {};

function Detailer() {
	var supportsTouch = ('createTouch' in document);
	var tap = supportsTouch ? 'touchstart' : 'mousedown';
	var untap = supportsTouch ? 'touchend' : 'mouseup';

	// Cached DOM elements
	var $body;
	var $overlay;
	var $currentPopup;
	var cachedPopups;
	
	function base() {
		$body = $('body');
		
		$body.bind('touchmove', function(e) {
			e.preventDefault();
		});
		
		$('a').bind('click', function(e) {
			return false;
		});
	}

	function animate() {
		$('.animate').addClass('animate-start');
	}

	function taps() {
		var $tappable = $('.tappable');
		if (!$tappable.length) return;
				
		$tappable.bind(tap, function() {
			$(this).addClass('tapped');
		}).bind(untap, function() {
			$(this).removeClass('tapped');
		}).bind('click', function() {
			return false;
		});
	}
	
	function nav() {
		var $nav = $('.nav');
		if (!$nav.length) return;
		
		$nav.find('a').unbind(untap);
	}
	
	function links() {
		var $link = $('.link');
		if (!$link.length) return;
				
		$link.bind(untap, function() {
			window.location = $(this).attr('href');
		});
	}
	
	function popups() {
		var $popup = $('.popup');
		if (!$popup.length) return;
		
		// Save reference to overlay
		$overlay = $('.overlay');
		
		// Save reference to popups
		cachedPopups = new Array();
		$popup.each(function() {
			var $p = $(this);
			cachedPopups[$(this).attr('data-popup')] = $p;
		});
		
		var $openers = $('.popup-action-open');
		$openers.bind(untap, function() {
			var p = $(this).attr('data-popup');
			detailer.showPopup(p);
			utility.setHashLocation('detailer.showPopup(\'' + p + '\')');
		});
		
		var $closers = $('.popup-action-close');
		$closers.bind(untap, function(e) {
			e.stopPropagation();
			detailer.hidePopup();
			utility.setHashLocation('detailer.hidePopup()');
		});
		
		$overlay.bind(untap, function() {
			detailer.hidePopup();
			utility.setHashLocation('detailer.hidePopup()');
		});
	}
	
	function videos() {
		var $video = $('video');
		if (!$video.length) return;
		
		$video.bind('play', function() {
			utility.setHashLocation('playVideo()');
		});
		
		$video.bind('ended', function() {
			utility.setHashLocation('endVideo()');
		});
	}
	
	function preload() {
		var $body = $('body');
		if (!$body.hasClass('index')) return;
		
		var assets = '';
		assets = '<div class="offpage">' + assets + '</div>';
		
		$body.append(assets);
	}

	function init() {
		base();
		animate();
		taps();
		nav();
		links();
		popups();
		videos();
		preload();
	}
	
	init();
	
	this.showPopup = function(target) {
		var $popup = cachedPopups[target];
		
		$popup.show(function() {
			$popup.addClass('visible');
		});
		
		$overlay.show(function() {
			$overlay.addClass('visible');
		});
		
		$currentPopup = $popup;
	}
	
	this.hidePopup = function() {	
		$currentPopup.removeClass('visible');
		setTimeout(function() {
			$currentPopup.hide();
			var v = $currentPopup.find('video').get(0);
			if (v) {
				v.pause();
				v.currentTime = 0;
			}
		}, 300);
		
		$overlay.removeClass('visible');
		setTimeout(function() {
			$overlay.hide();
		}, 300);
	}
	
	return true;
}

$(document).ready(function() {
	detailer = new Detailer();

	// Scrollable widget: Page may contain multiple scrollable items
	var $scrollable = $('.scrollable');
	if ($scrollable.length) {
		$scrollable.each(function() {
			new Scrollable(this);
		});
	}
	
	// Pages widget: Page may only contain one pages widget
	var $pages = $('.pages-viewport');
	if ($pages.length) {
		var container = $('.pages-container').get(0);
		var nav = $('.pages-nav').get(0);
		var prev = $('.pages-prev').get(0);
		var next = $('.pages-next').get(0);
		new Pages(container, nav, prev, next);
	}
});