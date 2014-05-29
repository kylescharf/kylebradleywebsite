// Ready stuff
	jQuery(function() {

		var $window = $(window),
			$body = $('body'),
			$header = $('#header'),
			_IEVersion = (navigator.userAgent.match(/MSIE ([0-9]+)\./) ? parseInt(RegExp.$1) : 99),
			_isTouch = !!('ontouchstart' in window),
			_isMobile = !!(navigator.userAgent.match(/(iPod|iPhone|iPad|Android|IEMobile)/));

		// Pause CSS transitions until the page has loaded (prevents "flickering")
			$body.addClass('paused');
			$window.load(function() {
				$body.removeClass('paused');
			});

		// Add input "placeholder" support to IE <= 9
			if (_IEVersion < 10)
				$('form').n33_formerize();

		// Initialize scrolly links
			$('.scrolly').n33_scrolly();

		// Initialize dropotron
			$('#nav > ul').dropotron(helios_settings.dropotron);

		// Initialize carousels
			$('.carousel').each(function() {
				
				var	$t = $(this),
					$forward = $('<span class="forward"></span>'),
					$backward = $('<span class="backward"></span>'),
					$reel = $t.children('.reel'),
					$items = $reel.children('article');
				
				var	pos = 0,
					leftLimit,
					rightLimit,
					itemWidth,
					reelWidth,
					timerId;

				// Items
					if (helios_settings.carousels.fadeIn)
					{
						$items.addClass('loading');

						$t.n33_onVisible(function() {
							var	timerId,
								limit = $items.length - Math.ceil($window.width() / itemWidth);
							
							timerId = window.setInterval(function() {
								var x = $items.filter('.loading'), xf = x.first();
								
								if (x.length <= limit)
								{
									window.clearInterval(timerId);
									$items.removeClass('loading');
									return;
								}
								
								if (_IEVersion < 10)
								{
									xf.fadeTo(750, 1.0);
									window.setTimeout(function() {
										xf.removeClass('loading');
									}, 50);
								}
								else
									xf.removeClass('loading');
								
							}, helios_settings.carousels.fadeDelay);
						}, 50);
					}
				
				// Main
					$t._update = function() {
						pos = 0;
						rightLimit = (-1 * reelWidth) + $window.width();
						leftLimit = 0;
						$t._updatePos();
					};
				
					if (_IEVersion < 9)
						$t._updatePos = function() { $reel.css('left', pos); };
					else
						$t._updatePos = function() { $reel.css('transform', 'translate(' + pos + 'px, 0)'); };
					
				// Forward
					$forward
						.appendTo($t)
						.hide()
						.mouseenter(function(e) {
							timerId = window.setInterval(function() {
								pos -= helios_settings.carousels.speed;

								if (pos <= rightLimit)
								{
									window.clearInterval(timerId);
									pos = rightLimit;
								}
								
								$t._updatePos();
							}, 10);
						})
						.mouseleave(function(e) {
							window.clearInterval(timerId);
						});
				
				// Backward	
					$backward
						.appendTo($t)
						.hide()
						.mouseenter(function(e) {
							timerId = window.setInterval(function() {
								pos += helios_settings.carousels.speed;

								if (pos >= leftLimit)
								{
									window.clearInterval(timerId);
									pos = leftLimit;
								}
								
								$t._updatePos();
							}, 10);
						})
						.mouseleave(function(e) {
							window.clearInterval(timerId);
						});
						
				// Init
					$window.load(function() {

						reelWidth = $reel[0].scrollWidth;

						skel.onStateChange(function() {
				
							if (_isTouch)
							{
								$reel
									.css('overflow-y', 'hidden')
									.css('overflow-x', 'scroll')
									.scrollLeft(0);
								$forward.hide();
								$backward.hide();
							}
							else
							{
								$reel
									.css('overflow', 'visible')
									.scrollLeft(0);
								$forward.show();
								$backward.show();
							}

							$t._update();
						});

						$window.resize(function() {
							reelWidth = $reel[0].scrollWidth;
							$t._update();
						}).trigger('resize');

					});
				
			});

		// Initialize header

			// Mobile devices don't do so well with fixed backgrounds and the fullscreen header :/
				if (_isMobile)
				{
					$header.css('background-attachment', 'scroll');
					helios_settings.header.fullScreen = false;
				}

			// Homepage header
				if ($body.hasClass('homepage'))
				{
					if (helios_settings.header.fullScreen)
					{
						$window.bind('resize.helios', function() {
							window.setTimeout(function() {
								var s = $header.children('.inner');
								var sh = s.outerHeight(), hh = $window.height(), h = Math.ceil((hh - sh) / 2) + 1;

								$header
									.css('padding-top', h)
									.css('padding-bottom', h);
							}, 0);
						}).trigger('resize');
					}

					if (helios_settings.header.fadeIn)
					{
						$('<div class="overlay" />').appendTo($header);
						
						$window
							.load(function() {
								var imageURL = $header.css('background-image').replace(/"/g,"").replace(/url\(|\)$/ig, "");

								$.n33_preloadImage(imageURL, function() {
									
									if (_IEVersion < 10)
										$header.children('.overlay').fadeOut(2000);
									else
										window.setTimeout(function() {
											$header.addClass('ready');
										}, helios_settings.header.fadeDelay);
								
								});
							});
					}

				}

	});