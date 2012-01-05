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
    var amount = $slides.length;
    var $navi = $elem.find('.navi');

    initCSS($slideContainer, axis, amount, $wrapper, dir, $slides);
    initTitles($slides, $wrapper, $navi, amount, dir, opts.delay);
    initNavi($elem, $wrapper, $navi, amount, dir, opts.delay);
  }

  function initCSS($slideContainer, axis, amount, $wrapper, dir, $slides) {
    var wrapperOpts;
    var slideOpts;
    var displayMode;

    $slideContainer.css('overflow', 'hidden');
    wrapperOpts = {
      position: 'relative'
    };
    wrapperOpts[axis] = amount * 100 + '%';
    wrapperOpts[dir] = 0 + '%';
    $wrapper.css(wrapperOpts);

    displayMode = dir == 'top'? 'auto': 'inline-block';
    slideOpts = {
      display: displayMode,
      'vertical-align': 'top'
    };
    slideOpts[axis] = (100 / amount) + '%';
    $slides.each(function(i, e) {$(e).css(slideOpts);});  
  }

  function initTitles($slides, $wrapper, $navi, amount, dir, delay) {
    $slides.each(function(i, k) {
      var title = $(k).attr('title') || i + 1;

      $('<div>').css('display', 'inline').text(title).bind('click', function() {
        moveTo(function() {return i;}, $wrapper, $navi, amount, dir, delay);
      }).appendTo($navi).addClass('title button');
    });
    updateNavi(0, $navi);
  }

  function initNavi($elem, $wrapper, $navi, amount, dir, delay) {
    $elem.find('.left,.up').bind('click', function() {
      moveTo(function(a) {return a - 1;}, $wrapper, $navi, amount, dir, delay);
    });

    $elem.find('.right,.down').bind('click', function() {
      moveTo(function(a) {return a + 1;}, $wrapper, $navi, amount, dir, delay);
    });  
  }

  function moveTo(indexCb, $wrapper, $navi, amount, dir, delay) {
    var animProps = {};
    var i = indexCb(-parseInt($wrapper.css(dir)) / 100);
    var pos = Math.min(Math.max(i, 0), amount - 1);

    animProps[dir] = (pos * -100) + '%';
    $wrapper.animate(animProps, delay);

    updateNavi(pos, $navi);
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

