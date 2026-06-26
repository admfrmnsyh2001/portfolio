(function ($) {

  "use strict";

    // COLOR MODE
    $('.color-mode').click(function(){
        $('.color-mode-icon').toggleClass('active')
        $('body').toggleClass('dark-mode')
    })

    // HEADER
    $(".navbar").headroom();

    // PROJECT CAROUSEL
    $('.owl-carousel').owlCarousel({
    	items: 1,
	    loop:true,
	    margin:10,
	    nav:true
	});

    // SMOOTHSCROLL
    $(function() {
      $('.nav-link, .custom-btn-link').on('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 49
        }, 1000);
        event.preventDefault();
      });
    });  

    // TOOLTIP
    $('.social-links a').tooltip();

    // SECURITY SPLASH SCREEN LOGIC
    $(window).on('load', function() {
        const splash = $('#security-splash');
        if(splash.length === 0) return;

        // Prevent scrolling while splash is active
        $('body').addClass('splash-active');

        $('#splash-fingerprint').on('click', function() {
            if($(this).hasClass('clicked')) return;
            $(this).addClass('clicked');

            const container = $('.topology-container');
            
            // 1. Start scanning (cables flow up)
            container.addClass('scanning');

            // 2. Signal reaches controller (processing)
            setTimeout(() => {
                container.removeClass('scanning').addClass('processing');
            }, 1500); // matches CSS flow-up duration

            // 3. Controller sends signal down to door (granted)
            setTimeout(() => {
                container.removeClass('processing').addClass('granted');
            }, 3000); // wait a bit for processing blink, then grant

            // 4. Fade out splash screen
            setTimeout(() => {
                splash.addClass('fade-out');
                $('body').removeClass('splash-active');
            }, 5000); // allow time for door to open and text to appear

            // 5. Remove from DOM
            setTimeout(() => {
                splash.remove();
            }, 6500);
        });
    });

})(jQuery);
