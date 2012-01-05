/* MIT (c) Juho Vepsalainen */
(function($){
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

    initCSS($slideContainer, axis, $wrapper, dir, $slides);
    initTitles($slides, $wrapper, $navi, dir, opts.delay);
    initNavi($elem, $wrapper, $navi, dir, opts.delay, $slides.length);
  }

  function initCSS($slideContainer, axis, $wrapper, dir, $slides) {
    var wrapperOpts;
    var slideOpts;
    var displayMode;

    $slideContainer.css('overflow', 'hidden');
    wrapperOpts = {
      position: 'relative'
    };
    wrapperOpts[axis] = $slides.length * 100 + '%';
    wrapperOpts[dir] = 0 + '%';
    $wrapper.css(wrapperOpts);

    displayMode = dir == 'top'? 'auto': 'inline-block';
    slideOpts = {
      display: displayMode,
      'vertical-align': 'top'
    };
    slideOpts[axis] = (100 / $slides.length) + '%';
    $slides.each(function(i, e) {$(e).css(slideOpts);});  
  }

  function initTitles($slides, $wrapper, $navi, dir, delay) {
    $slides.each(function(i, k) {
      var title = $(k).attr('title') || i + 1;

      $('<div>').css('display', 'inline').text(title).bind('click', function() {
        var pos = moveTo(function() {return i;}, $wrapper, $slides.length, dir, delay);

        updateNavi(pos, $navi);
      }).appendTo($navi).addClass('title button');
    });

    updateNavi(0, $navi);
  }

  function initNavi($elem, $wrapper, $navi, dir, delay, amount) {
    $elem.find('.left,.up').bind('click', function() {
      var pos = moveTo(function(a) {return a - 1;}, $wrapper, amount, dir, delay);

      updateNavi(pos, $navi);
    });

    $elem.find('.right,.down').bind('click', function() {
      var pos = moveTo(function(a) {return a + 1;}, $wrapper, amount, dir, delay);

      updateNavi(pos, $navi);
    });
  }

  function moveTo(indexCb, $wrapper, amount, dir, delay) {
    var animProps = {};
    var i = indexCb(-parseInt($wrapper.css(dir)) / 100);
    var pos = Math.min(Math.max(i, 0), amount - 1);

    animProps[dir] = (pos * -100) + '%';
    $wrapper.animate(animProps, delay);

    return pos;
  }

  function updateNavi(i, $navi) {
    var $titles = $navi.find('.title.button');

    $titles.removeClass('selected');
    $titles.eq(i).addClass('selected');
  }

  $.fn.caro = function (options) {
    return this.each(function () {
      var $elem = $(this);
      var opts = $.extend({
        delay: 300 // in ms
      }, options);

      var caro = $elem.find('.up').length? verticalCaro: horizontalCaro;
      caro($elem, opts);
    });
  };
})(jQuery);

