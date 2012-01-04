(function($){
  function caroize($elem, opts) {
    var $slideContainer = $elem.find('.slides');
    var $slides = $slideContainer.children().append($('<div>'));
    var $wrapper = $('<div>').append($slides).appendTo($slideContainer);
    var delay = opts.delay;
    var pos = 0;
    var amount = $slides.length;
    var $navi = $elem.find('.navi');

    $slideContainer.css('overflow', 'hidden');
    $wrapper.css({
      position: 'relative',
      width: (amount * 100) + '%'
    });

    $slides.each(function(i, e) {
      $(e).css({
        display: 'inline-block',
        width: (100 / amount) + '%',
        'vertical-align': 'top'
      });
    });
    
    function move() {
      $wrapper.animate({left: (pos * 100) + '%'}, delay);
    }
    
    $elem.find('.left').on('click', function() {
      pos++;
      
      if(pos > 0) {
        pos = 0;
      }
      else {
        move();
      }
    });
    
    $elem.find('.right').on('click', function() {
      pos--;
      
      if(pos <= -amount) {
        pos = -amount + 1;
      }
      else {
        move();
      }
    });

    function moveTo(i) {
      pos = pos - (i + pos);
      move();
    }
    
    $pages = $slides.each(function(i, k) {
      $('<div>').css('display', 'inline').text(i + 1).on('click', function() {
        moveTo(i);
      }).appendTo($navi).addClass('button');
    });
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

