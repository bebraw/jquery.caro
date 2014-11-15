$(function() {
    var $e = $('#horizontalDemo').caro({cycle: true, initialSlide: 2});

    $e.on('beforeSlide', function(e, slideIndex) {
        console.log('horizontalDemo - beforeSlide triggered. Current slide:', slideIndex);

        // in case this is set to false, it won't proceed
        return true;
    });
    $e.on('updateSlide', function(e, slideIndex) {
        console.log('horizontalDemo - updateSlide triggered. Current slide:', slideIndex);
    });

    $('#verticalDemo').caro({
        delay: 500,
        direction: 'vertical'
    });

    $("#photoDemo").caro({
        autoNavigation: true,
        cycle: true
    });
    $('.innerDemo').caro();
});
