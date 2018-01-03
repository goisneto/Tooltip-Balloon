(function($) {
    $.fn.balloon = function(options) {
        var timeout = null,
            margin = 5;

        // Defaults
        var defaults = {
            delay: 350,
            balloon: '',
            position: 'bottom',
            html: false
        };

        // Remove balloon from the activator
        if (options === "remove") {
            this.each(function() {
                $('#' + $(this).attr('data-balloon-id')).remove();
                $(this).removeAttr('data-balloon-id');
                $(this).off('focus.balloon blur.balloon');
            });
            return false;
        }

        options = $.extend(defaults, options);

        return this.each(function() {
            var balloonId = Materialize.guid();
            var origin = $(this);

            // Destroy old balloon
            if (origin.attr('data-balloon-id')) {
                $('#' + origin.attr('data-balloon-id')).remove();
            }

            origin.attr('data-balloon-id', balloonId);

            // Get attributes.
            var allowHtml,
                balloonDelay,
                balloonPosition,
                balloonText,
                balloonEl,
                backdrop,
                fab,
                container;
            var setAttributes = function() {
                allowHtml = origin.attr('data-html') ? origin.attr('data-html') === 'true' : options.html;
                balloonDelay = origin.attr('data-delay');
                balloonDelay = (balloonDelay === undefined || balloonDelay === '') ?
                    options.delay : balloonDelay;
                balloonPosition = origin.attr('data-position');
                balloonPosition = (balloonPosition === undefined || balloonPosition === '') ?
                    options.position : balloonPosition;
                balloonText = origin.attr('data-balloon');
                balloonText = (balloonText === undefined || balloonText === '') ?
                    options.balloon : balloonText;
            };
            setAttributes();

            var renderballoonEl = function() {
                balloonEl = $('<a href="#!" class="material-balloon"></a>'),
                    fab = $('<div></div>'),
                    container = $('<div class="container-balloon"></div>');
                fab.css({
                    "background-color": "#323232",
                    "position": "absolute",
                    "width": "10px",
                    "height": "10px"
                }).appendTo(balloonEl);
                balloonEl.click(function(e) {
                    e.preventDefault();
                    return false;
                });
                // Create Text span
                if (allowHtml) {
                    balloonText = $('<span></span>').html(balloonText);
                } else {
                    balloonText = $('<span></span>').text(balloonText);
                }

                container.append(balloonText);
                // Create balloon
                balloonEl.append(container)
                    .appendTo($('body'))
                    .attr('id', balloonId);
                // Create backdrop
                backdrop = $('<div class="backdrop"></div>');
                backdrop.appendTo(container);
                return balloonEl;
            };
            renderballoonEl();
            origin = origin.add(balloonEl);
            // Destroy previously binded events
            origin.off('focus.balloon blur.balloon');
            // Mouse In
            var started = false,
                timeoutRef;
            origin.on({
                'focus.balloon': function(e) {
                    e.preventDefault();
                    if (started === true)
                        return true;
                    var showballoon = function() {
                        setAttributes();
                        balloonEl.css('height', container.outerHeight());
                        started = true;
                        balloonEl.velocity('stop');
                        backdrop.velocity('stop');
                        balloonEl.css({ visibility: 'visible', left: '0px', top: '0px' });

                        // balloon positioning
                        var originWidth = origin.outerWidth();
                        var originHeight = origin.outerHeight();
                        var balloonHeight = balloonEl.outerHeight();
                        var balloonWidth = balloonEl.outerWidth();
                        var balloonVerticalMovement = '0px';
                        var balloonHorizontalMovement = '0px';
                        var backdropOffsetWidth = backdrop[0].offsetWidth;
                        var backdropOffsetHeight = backdrop[0].offsetHeight;
                        var scaleXFactor = 8;
                        var scaleYFactor = 8;
                        var scaleFactor = 0;
                        var targetTop, targetLeft, newCoordinates;
                        if (balloonPosition === "top") {
                            // Top Position
                            targetTop = origin.offset().top - balloonHeight - margin;
                            targetLeft = origin.offset().left + originWidth / 2 - balloonWidth / 2;
                            newCoordinates = repositionWithinScreen(targetLeft, targetTop, balloonWidth, balloonHeight);
                            balloonVerticalMovement = '-10px';
                            backdrop.css({
                                bottom: 0,
                                left: 0,
                                borderRadius: '14px 14px 0 0',
                                transformOrigin: '50% 100%',
                                marginTop: balloonHeight,
                                marginLeft: (balloonWidth / 2) - (backdropOffsetWidth / 2)
                            });
                            if (newCoordinates.x < (balloonEl.outerWidth() / 2) + 4) {
                                fab.css({
                                    "bottom": "5px",
                                    "margin": ((-(fab.outerWidth() * Math.SQRT2) / 2)) + "px",
                                    "left": (((newCoordinates.x > 4) ? (newCoordinates.x / 2) : -4) + (origin.outerWidth() / 2) + origin.offset().left) + "px",
                                    "transform": "rotate(45deg) translateX(50%)"
                                });
                            } else if (newCoordinates.x >= window.innerWidth - balloonEl.outerWidth() - 4) {
                                fab.css({
                                    "bottom": "5px",
                                    "margin": ((-(fab.outerWidth() * Math.SQRT2) / 2)) + "px",
                                    "right": (((window.innerWidth - balloonEl.outerWidth() - newCoordinates.x > 4) ? ((window.innerWidth - balloonEl.outerWidth() - newCoordinates.x) / 2) : -4) + (origin.outerWidth() / 2) + (window.innerWidth - (origin.offset().left + origin.outerWidth()))) + "px",
                                    "transform": "rotate(45deg) translateX(50%)"
                                });
                            } else {
                                fab.css({
                                    "bottom": ((-(fab.outerWidth() * Math.SQRT2) / 2)) + "px",
                                    "left": "50%",
                                    "transform": "rotate(45deg) translateX(-50%)"
                                });
                            }
                        }
                        // Left Position
                        else if (balloonPosition === "left") {
                            targetTop = origin.offset().top + originHeight / 2 - balloonHeight / 2;
                            targetLeft = origin.offset().left - balloonWidth - margin;
                            newCoordinates = repositionWithinScreen(targetLeft, targetTop, balloonWidth, balloonHeight);

                            balloonHorizontalMovement = '-10px';
                            backdrop.css({
                                top: '-7px',
                                right: 0,
                                width: '14px',
                                height: '14px',
                                borderRadius: '14px 0 0 14px',
                                transformOrigin: '95% 50%',
                                marginTop: balloonHeight / 2,
                                marginLeft: balloonWidth
                            });

                            if (newCoordinates.y < (balloonEl.outerHeight() / 2) + 4) {
                                fab.css({
                                    "right": "-1px",
                                    "margin": ((-(fab.outerHeight() * Math.SQRT2) / 2)) + "px",
                                    "top": (((newCoordinates.y > 4) ? (newCoordinates.y / 2) : -4) + (origin.outerHeight() / 2) + origin.offset().top) + "px",
                                    "transform": "rotate(45deg) translateY(50%)"
                                });
                            } else if (newCoordinates.y >= window.innerHeight - balloonEl.outerHeight() - 4) {
                                fab.css({
                                    "right": "-1px",
                                    "margin": ((-(fab.outerHeight() * Math.SQRT2) / 2)) + "px",
                                    "bottom": (((window.innerHeight - balloonEl.outerHeight() - newCoordinates.y > 4) ? ((window.innerHeight - balloonEl.outerHeight() - newCoordinates.y) / 2) : -4) + (origin.outerHeight() / 2) + (window.innerHeight - (origin.offset().top + origin.outerHeight()))) + "px",
                                    "transform": "rotate(45deg) translateY(50%)"
                                });
                            } else {
                                fab.css({
                                    "right": "-1px",
                                    "top": "50%",
                                    "transform": "rotate(45deg) translateY(-50%)"
                                });
                            }
                        }
                        // Right Position
                        else if (balloonPosition === "right") {
                            targetTop = origin.offset().top + originHeight / 2 - balloonHeight / 2;
                            targetLeft = origin.offset().left + originWidth + margin;
                            newCoordinates = repositionWithinScreen(targetLeft, targetTop, balloonWidth, balloonHeight);

                            balloonHorizontalMovement = '+10px';
                            backdrop.css({
                                top: '-7px',
                                left: 0,
                                width: '14px',
                                height: '14px',
                                borderRadius: '0 14px 14px 0',
                                transformOrigin: '5% 50%',
                                marginTop: balloonHeight / 2,
                                marginLeft: '0px'
                            });
                            if (newCoordinates.y < (balloonEl.outerHeight() / 2) + 4) {
                                fab.css({
                                    "left": "5.5px",
                                    "margin": ((-(fab.outerWidth() * Math.SQRT2) / 2)) + "px",
                                    "top": (((newCoordinates.y > 4) ? (newCoordinates.y / 2) : -4) + (origin.outerHeight() / 2) + origin.offset().top) + "px",
                                    "transform": "rotate(45deg) translateY(50%)"
                                });
                            } else if (newCoordinates.y >= window.innerHeight - balloonEl.outerHeight() - 4) {
                                fab.css({
                                    "left": "5.5px",
                                    "margin": ((-(fab.outerWidth() * Math.SQRT2) / 2)) + "px",
                                    "bottom": (((window.innerHeight - balloonEl.outerHeight() - newCoordinates.y > 4) ? ((window.innerHeight - balloonEl.outerHeight() - newCoordinates.y) / 2) : -4) + (origin.outerHeight() / 2) + (window.innerHeight - (origin.offset().top + origin.outerHeight()))) + "px",
                                    "transform": "rotate(45deg) translateY(50%)"
                                });
                            } else {
                                fab.css({
                                    "left": "0",
                                    "margin": ((-(fab.outerWidth() * Math.SQRT2) / 2)) + "px",
                                    "top": "50%",
                                    "transform": "rotate(45deg) translateY(-50%)"
                                });
                            }
                        } else {
                            // Bottom Position
                            targetTop = origin.offset().top + origin.outerHeight() + margin;
                            targetLeft = origin.offset().left + originWidth / 2 - balloonWidth / 2;
                            newCoordinates = repositionWithinScreen(targetLeft, targetTop, balloonWidth, balloonHeight);
                            balloonVerticalMovement = '+10px';
                            backdrop.css({
                                top: 0,
                                left: 0,
                                marginLeft: (balloonWidth / 2) - (backdropOffsetWidth / 2)
                            });
                            if (newCoordinates.x < (balloonEl.outerWidth() / 2) + 4) {
                                fab.css({
                                    "margin": ((-(fab.outerWidth() * Math.SQRT2) / 2)) + "px",
                                    "left": (((newCoordinates.x > 4) ? (newCoordinates.x / 2) : -4) + (origin.outerWidth() / 2) + origin.offset().left) + "px",
                                    "transform": "rotate(45deg) translateX(50%)"
                                });
                            } else if (newCoordinates.x > window.innerWidth - balloonEl.outerWidth() - 4) {
                                fab.css({
                                    "margin": ((-(fab.outerWidth() * Math.SQRT2) / 2)) + "px",
                                    "right": (((window.innerWidth - balloonEl.outerWidth() - newCoordinates.x > 4) ? ((window.innerWidth - balloonEl.outerWidth() - newCoordinates.x) / 2) : -4) + (origin.outerWidth() / 2) + (window.innerWidth - (origin.offset().left + origin.outerWidth()))) + "px",
                                    "transform": "rotate(45deg) translateX(50%)"
                                });
                            } else {
                                fab.css({
                                    "left": "50%",
                                    "transform": "rotate(45deg) translateX(-50%)"
                                });
                            }
                        }
                        // Set tooptip css placement
                        balloonEl.css({
                            top: newCoordinates.y,
                            left: newCoordinates.x
                        });

                        // Calculate Scale to fill
                        scaleXFactor = Math.SQRT2 * balloonWidth / parseInt(backdropOffsetWidth);
                        scaleYFactor = Math.SQRT2 * balloonHeight / parseInt(backdropOffsetHeight);
                        scaleFactor = Math.max(scaleXFactor, scaleYFactor);

                        balloonEl.velocity({ translateY: balloonVerticalMovement, translateX: balloonHorizontalMovement }, { duration: 350, queue: false })
                            .velocity({ opacity: 1 }, { duration: 300, delay: 50, queue: false });
                        backdrop.css({ visibility: 'visible' })
                            .velocity({ opacity: 1 }, { duration: 55, delay: 0, queue: false })
                            .velocity({ scaleX: scaleFactor, scaleY: scaleFactor }, { duration: 300, delay: 0, queue: false, easing: 'easeInOutQuad' });
                    };

                    timeoutRef = setTimeout(showballoon, balloonDelay); // End Interval

                    // Mouse Out
                },
                'blur.balloon': function(e) {
                    if (origin.is(document.activeElement))
                        return started = true;
                    // Reset State
                    started = false;
                    clearTimeout(timeoutRef);

                    // Animate back
                    setTimeout(function() {
                        if (origin.is(document.activeElement))
                            return started = true;
                        if (started !== true) {
                            balloonEl.velocity({
                                opacity: 0,
                                translateY: 0,
                                translateX: 0
                            }, { duration: 225, queue: false });
                            backdrop.velocity({ opacity: 0, scaleX: 1, scaleY: 1 }, {
                                duration: 225,
                                queue: false,
                                complete: function() {
                                    backdrop.css({ visibility: 'hidden' });
                                    balloonEl.css({ visibility: 'hidden' });
                                    started = false;
                                }
                            });
                        }
                    }, 225);
                }
            });
        });
    };

    var repositionWithinScreen = function(x, y, width, height) {
        var newX = x;
        var newY = y;

        if (newX < 0) {
            newX = 4;
        } else if (newX + width > window.innerWidth) {
            newX -= newX + width - (window.innerWidth - 4);
        }

        if (newY < 0) {
            newY = 4;
        } else if (newY + height > window.innerHeight + $(window).scrollTop()) {
            newY -= newY + height - (window.innerHeight - 4);
        }

        return { x: newX, y: newY };
    };

    $(document).ready(function() {
        $('.ballooned').balloon();
    });
}(jQuery));
