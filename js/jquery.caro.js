/* MIT (c) Juho Vepsalainen */
(function ($) {
    function horizontalCaro($elem, opts) {
        caroize($elem, opts, 'left', 'width');
    }

    function verticalCaro($elem, opts) {
        caroize($elem, opts, 'top', 'height');
    }

    function caroize($elem, opts, dir, axis) {
        var $slideContainer = $elem.find('.slides');
        var $slides = $slideContainer.children().append($('<div>'));
        var $wrapper = $('<div>').append($slides).appendTo($slideContainer);
        var $navi = $elem.find('.navi');
        var amount = $slides.length;

        initCSS($slideContainer, axis, $wrapper, dir, $slides);
        initTitles($slides, $navi, moveTemplate);
        initNavi($elem, $wrapper, moveTemplate);
        initPlayback($elem, $wrapper, moveTemplate, opts.autoPlay, opts.still);
        updateNavi($navi, 0);
        updateButtons($elem, 0, amount);

        function moveTemplate(indexCb, animCb) {
            return function () {
                var oldI = -parseInt($wrapper.css(dir)) / 100;
                var newI = Math.min(Math.max(indexCb(oldI, amount - 1), 0), amount - 1);
                var animProps = {};

                animProps[dir] = (newI * -100) + '%';
                $wrapper.animate(animProps, opts.delay, animCb);

                updateNavi($navi, newI);
                updateButtons($elem, newI, amount);
            }
        }
    }

    function initCSS($slideContainer, axis, $wrapper, dir, $slides) {
        var displayMode;

        $slideContainer.css('overflow', 'hidden');
        var wrapperOpts = {
            position:'relative'
        };
        wrapperOpts[axis] = $slides.length * 100 + '%';
        wrapperOpts[dir] = 0 + '%';
        $wrapper.css(wrapperOpts);

        displayMode = dir == 'top' ? 'auto' : 'inline-block';
        var slideOpts = {
            display:displayMode,
            'vertical-align':'top'
        };
        slideOpts[axis] = (100 / $slides.length) + '%';
        $slides.each(function (i, e) {
            $(e).css(slideOpts);
        });
    }

    function initTitles($slides, $navi, move) {
        $slides.each(function (i, k) {
            var title = $(k).attr('title') || i + 1;

            $('<div>').css('display', 'inline').text(title).bind('click',
                move(function () {
                    return i;
                })).appendTo($navi).addClass('title button');
        });
    }

    function initNavi($elem, $wrapper, move) {
        function bind(sel, cb) {
            $elem.find(sel).bind('click', function () {
                $wrapper.clearQueue(); // make sure these stop anim
                move(cb)();
            });
        }

        ;

        bind('.prev', function (a) {
            return a - 1;
        });
        bind('.next', function (a) {
            return a + 1;
        });
        bind('.first', function () {
            return 0;
        });
        bind('.last', function (a, len) {
            return len;
        });
    }

    function initPlayback($elem, $wrapper, move, autoPlay, still) {
        var anim = move(function (a, len) {
            return a == len ? 0 : a + 1;
        }, function () {
            $(this).delay(still).queue(function () {
                anim();
                $(this).dequeue();
            });
        });

        $elem.find('.play').bind('click', anim);
        $elem.find('.stop').bind('click', function () {
            $wrapper.clearQueue();
        });
    }

    function updateNavi($navi, i) {
        var $titles = $navi.find('.title.button');

        $titles.removeClass('selected');
        $titles.eq(i).addClass('selected');
    }

    function updateButtons($elem, i, amount) {
        var $begin = $elem.find('.first,.prev');
        var $end = $elem.find('.last,.next');

        i == 0 ? $begin.addClass('disabled') : $begin.removeClass('disabled');
        i == amount - 1 ? $end.addClass('disabled') : $end.removeClass('disabled');
    }

    $.fn.caro = function (options) {
        return this.each(function () {
            var $elem = $(this);
            var opts = $.extend({
                dir:'horizontal', // either 'horizontal' or 'vertical'
                delay:300, // in ms
                still:1000, // how long slide stays still in playback mode
                autoPlay:false
            }, options);

            var caro = opts.dir == 'horizontal' ? horizontalCaro : verticalCaro;
            caro($elem, opts);
        });
    };
})(jQuery);

