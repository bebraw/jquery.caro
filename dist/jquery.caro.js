/*! jquery.caro - v1.0.2 - Juho Vepsalainen - MIT
https://github.com/bebraw/jquery.caro - 2020-12-09 */
(function ($) {
    function caroize($elem, opts, direction, axis) {
        var $slideContainer = $elem.find('.' + opts.classes.slides).first();
        var $slides = $slideContainer.children().append($('<div>'));
        var $wrapper = $('<div>').append($slides).appendTo($slideContainer);
        var $navigation = $elem.children('.' + opts.classes.navigation).last();
        var amount = $slides.length;
        var pos = opts.initialSlide;

        initCSS($slideContainer, axis, $wrapper, direction, $slides);
        initTitles($slides, $navigation, moveTemplate, opts.autoNavigation, opts.classes.button);
        initNavigation($elem, $wrapper, moveTemplate, opts.classes);
        initPlayback($elem, $wrapper, moveTemplate, opts.autoPlay, opts.still);

        if(opts.resize) {
            updateHeight(pos, opts.classes);
        }

        disableSelection($elem.children().not('.' + opts.classes.slides));

        $(window).resize(function() {
            updateHeight(pos, opts.classes);
        });

        if($.isNumeric(pos)) {
            $wrapper.css(direction, (pos * -100) + '%');
            $slideContainer.css('height', $slides.eq(pos).height());
        }

        update(pos, opts.classes);

        function moveTemplate(indexCb, animCb) {
            return function() {
                if(opts.cycle) {
                    pos = indexCb(pos, amount - 1);
                    if(pos < 0) pos = amount - 1;
                    if(pos > amount - 1) pos = 0;
                }
                else pos = clamp(indexCb(pos, amount - 1), 0, amount - 1);

                var animProps = {};
                animProps[direction] = (pos * -100) + '%';
                $wrapper.animate(animProps, opts.delay, animCb);

                update(pos, opts.classes);
                updateHeight(pos, opts.classes);

                $elem.trigger('updateSlide', [pos]);
            };
        }

        function update(i, classes) {
            updateNavigation($navigation, i, classes.button);

            if(!opts.cycle) {
                updateButtons($elem, i, amount, classes);
            }

            updateSlides($slides, i);

            $elem.find('.' + classes.currentAmount).text(pos + 1);
            $elem.find('.' + classes.totalAmount).text(amount);
        }

        function updateHeight(i, classes) {
            $slideContainer.css('height', $slides.eq(i).height());

            // TODO: figure out why this doesn't animate
            if(opts.resize) {
                $slideContainer.animate({
                    'height': $slides.eq(i).height() || undefined
                }, opts.resizeDelay, function() {
                    $elem.parents('.' + classes.slides).siblings('.' + classes.navigation).
                        find('.selected.' + classes.button).first().trigger('click');
                });
            }
        }
    }

    function clamp(i, min, max) {
        return Math.min(Math.max(i, min), max);
    }

    function initCSS($slideContainer, axis, $wrapper, direction, $slides) {
        $slideContainer.css('overflow', 'hidden');
        var wrapperOpts = {
            position:'relative'
        };
        wrapperOpts[axis] = $slides.length * 100 + '%';
        wrapperOpts[direction] = 0 + '%';
        $wrapper.css(wrapperOpts);

        var slideOpts = {
            display: direction == 'top'? 'auto': 'inline-block',
            'vertical-align':'top'
        };
        var len = 100 / $slides.length;
        slideOpts[axis] = parseInt(len, 10) + '%';

        // opera hack! opera rounds width so we need to deal with that using some
        // padding
        var half = ((len - parseInt(len, 10)) / 2) + '%';
        if(axis == 'width') {
            slideOpts['margin-left'] = half;
            slideOpts['margin-right'] = half;
        }
        else {
            slideOpts['margin-top'] = half;
            slideOpts['margin-bottom'] = half;
        }
        $slides.each(function (i, e) {
            $(e).css(slideOpts).addClass('slide');
        });
    }

    function initTitles($slides, $navigation, move, autoNavigation, buttonClass) {
        $slides.each(function (i, k) {
            var $e = $('<a>', {href: '#'}).css('display', 'inline').bind('click',
                function(e) {
                    e.preventDefault();

                    move(function () {
                        return i;
                    })();
                }).appendTo($navigation).addClass('title ' + buttonClass);

            if(autoNavigation) {
                $(k).clone().appendTo($e);
            }
            else {
                $e.text($(k).attr('title') || i + 1);
            }
        });
    }

    function initNavigation($elem, $wrapper, move, classes) {
        function bind(sel, cb) {
            $('[data-caro="' + sel + '"]').bind('click', fn);
            $elem.find('.' + sel).bind('click', preventDefault(fn));

            function preventDefault(f) {
                return function(e) {
                    e.preventDefault();

                    f(e);
                };
            }

            function fn(e) {
                $wrapper.clearQueue();
                move(function(a, len) {
                    var val = $elem.triggerHandler('beforeSlide', [a]);

                    if(!isDefined(val) || val) {
                        return cb(a, len);
                    }
                })();
            }
        }

        bind(classes.previous, function (a) {
            var ret = a - 1;

            $elem.trigger('previousSlide', [ret]);

            return ret;
        });
        bind(classes.next, function (a) {
            var ret = a + 1;

            $elem.trigger('nextSlide', [ret]);

            return ret;
        });
        bind(classes.first, function () {
            var ret = 0;

            $elem.trigger('firstSlide', [ret]);

            return ret;
        });
        bind(classes.last, function (a, len) {
            var ret = len;

            $elem.trigger('lastSlide', [ret]);

            return ret;
        });
    }

    function isDefined(a) {
        return typeof a !== 'undefined';
    }

    function initPlayback($elem, $wrapper, move, autoPlay, still) {
        var anim = move(function (a, len) {
            return a == len ? 0 : a + 1;
        }, function () {
            $(this).delay(still).queue(function() {
                anim();
                $(this).dequeue();
            });
        });

        $elem.find('.play').bind('click', function(e) {
            e.preventDefault();

            anim();
        });
        $elem.find('.stop').bind('click', function(e) {
            e.preventDefault();

            $wrapper.clearQueue();
        });

        if (autoPlay) {
            anim();
        }
    }

    function updateNavigation($navi, i, buttonClass) {
        var $titles = $navi.find('.title.' + buttonClass);

        $titles.removeClass('selected');
        $titles.eq(i).addClass('selected');
    }

    function updateButtons($elem, i, amount, classes) {
        var $begin = $elem.find('.' + classes.first + ', .' + classes.previous);
        var $end = $elem.find('.' + classes.last + ', .' + classes.next);

        if(i === 0) {
            $begin.addClass('disabled');
        }
        else {
            $begin.removeClass('disabled');
        }

        if(i == amount - 1) {
            $end.addClass('disabled');
        }
        else {
            $end.removeClass('disabled');
        }
    }

    function updateSlides($slides, i) {
        $slides.each(function(j, e) {
            var $e = $(e);

            $e.removeClass('previous current next');

            if(j == i - 1) {
                $e.addClass('previous');
            }

            if(j == i) {
                $e.addClass('current');
            }

            if(j == i + 1) {
                $e.addClass('next');
            }
        });
    }

    function disableSelection($e) {
        // http://stackoverflow.com/questions/2700000/how-to-disable-text-selection-using-jquery
        return $e.each(function() {
            $(this).attr('unselectable', 'on').css({
                   '-moz-user-select':'none',
                   '-webkit-user-select':'none',
                   'user-select':'none'
               }).each(function() {
                   this.onselectstart = function() { return false; };
               });
        });
    }

    $.fn.caro = function (options) {
        return this.each(function () {
            var $elem = $(this);
            var opts = $.extend(true, {
                direction: 'horizontal', // either 'horizontal' or 'vertical'
                delay: 300, // in ms
                still: 1000, // how long slide stays still in playback mode
                autoPlay: false,
                classes: {
                    slides: 'slides',
                    button: 'button',
                    navigation: 'navigation',
                    previous: 'previous',
                    next: 'next',
                    first: 'first',
                    last: 'last',
                    currentAmount: 'currentAmount',
                    totalAmount: 'totalAmount'
                },
                autoNavigation: false,
                cycle: false,
                resize: true,
                resizeDelay: 300, // in ms
                initialSlide: 0
            }, options);

            if(opts.direction === 'horizontal') {
                caroize($elem, opts, 'left', 'width');
            }
            else {
                caroize($elem, opts, 'top', 'height');
            }
        });
    };
})(jQuery);
