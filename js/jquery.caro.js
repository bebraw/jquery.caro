/* MIT (c) Juho Vepsalainen */
(function($){
  function caroize($elem, opts) {
    var $slideContainer = $elem.find('.slides');
    var $slides = $slideContainer.children().append($('<div>'));
    var $wrapper = $('<div>').append($slides).appendTo($slideContainer);
    var delay = opts.delay;
    var pos = 0;
    var amount = $slides.length;
    var $navi = $elem.find('.navi');
    var dir = $elem.find('.up').length? 'top': 'left';

    $slideContainer.css('overflow', 'hidden');
    $wrapper.css({
      position: 'relative',
      height: (amount * 100) + '%', // vertical case
      width: (amount * 100) + '%' // horizontal case
    });

    var displayMode = dir == 'top'? 'auto': 'inline-block';
    $slides.each(function(i, e) {
      $(e).css({
        display: displayMode,
        height: (100 / amount) + '%', // vertical case
        width: (100 / amount) + '%', // horizontal case
        'vertical-align': 'top'
      });
    });

    $elem.find('.left,.up').on('click', function() {
      moveTo(pos - 1);
    });
    
    $elem.find('.right,.down').on('click', function() {
      moveTo(pos + 1);
    });

    function moveTo(i) {
      var animProps = {};

      pos = Math.min(Math.max(i, 0), amount - 1);
      
      animProps[dir] = (pos * -100) + '%';
      $wrapper.animate(animProps, delay);

      updateNavi(pos);
    }

    function updateNavi(i) {
      var $numberButtons = $navi.find('.number.button');
      
      $numberButtons.removeClass('selected');
      $numberButtons.eq(i).addClass('selected');
    }
    
    $pages = $slides.each(function(i, k) {
      $('<div>').css('display', 'inline').text(i + 1).on('click', function() {
        moveTo(i);
      }).appendTo($navi).addClass('number button');
    });
    updateNavi(0);
  }
  
  $.fn.caro = function (options) {
    return this.each(function () {
      var $elem = $(this);
      var opts = $.extend({
        delay: 300 // in ms
      }, options);
      
      caroize($elem, opts);
    });
  };
})(jQuery);

