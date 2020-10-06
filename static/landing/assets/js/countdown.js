$(function () {

    /* =========================================
        COUNTDOWN 3
     ========================================= */
    $('#clock-b').countdown('2020/10/9').on('update.countdown', function(event) {
      var $this = $(this).html(event.strftime(''
        + '<div class="holder m-2"><span class="h1 font-weight-bold">%D</span> Day%!d</div>'
        + '<div class="holder m-2"><span class="h1 font-weight-bold">%H</span> Hr</div>'
        + '<div class="holder m-2"><span class="h1 font-weight-bold">%M</span> Min</div>'
        + '<div class="holder m-2"><span class="h1 font-weight-bold">%S</span> Sec</div>'));
    });

});