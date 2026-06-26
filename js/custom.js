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

        // Live HUD clock for realism
        const clockEl = document.getElementById('hud-clock');
        function tickClock() {
            if(!clockEl) return;
            const n = new Date();
            const p = (v) => String(v).padStart(2, '0');
            clockEl.textContent = p(n.getHours()) + ':' + p(n.getMinutes()) + ':' + p(n.getSeconds());
        }
        tickClock();
        const clockTimer = setInterval(tickClock, 1000);

        const container = $('.topology-container');
        const fingerprint = $('#splash-fingerprint');
        const fpStatus = document.getElementById('fp-status');
        const fpBar = document.querySelector('.fp-bar');
        const readout = document.getElementById('controller-readout');

        const setReadout = (txt) => { if(readout) readout.textContent = '\u25CF ' + txt; };

        fingerprint.on('click', function() {
            if(fingerprint.hasClass('clicked')) return;
            fingerprint.addClass('clicked');

            const SCAN_MS = 1900;   // fingerprint scan duration
            const PROC_MS = 950;    // controller verification

            // ── 1. Biometric scan: scan line sweeps + progress fills ──
            container.addClass('scanning');
            setReadout('ANALYZING');

            const start = performance.now();
            (function scanFrame(now) {
                let p = Math.min((now - start) / SCAN_MS, 1);
                // ease-out so it feels like a real read settling
                const eased = 1 - Math.pow(1 - p, 2);
                const pct = Math.round(eased * 100);
                if(fpBar) fpBar.style.width = pct + '%';
                if(fpStatus) fpStatus.textContent = 'SCANNING \u00B7 ' + pct + '%';
                if(p < 1) requestAnimationFrame(scanFrame);
            })(start);

            // ── 2. Scan complete → identity verified flash ──
            setTimeout(() => {
                fingerprint.addClass('verified');
                if(fpStatus) fpStatus.textContent = 'IDENTITY VERIFIED \u2713';
                container.removeClass('scanning').addClass('processing');
                setReadout('VERIFYING\u2026');
            }, SCAN_MS);

            // ── 3. Controller grants access, signal travels to door ──
            setTimeout(() => {
                container.removeClass('processing').addClass('granted');
                splash.addClass('granted');
                container.addClass('door-unlocking');
                setReadout('ACCESS GRANTED');
                if(fpStatus) fpStatus.textContent = 'ACCESS GRANTED';
                // remove the unlock "thunk" so doors can slide open
                setTimeout(() => container.removeClass('door-unlocking'), 460);
            }, SCAN_MS + PROC_MS);

            // ── 4. Bright access flash, then fade the splash away ──
            setTimeout(() => {
                splash.addClass('flash');
            }, SCAN_MS + PROC_MS + 2100);

            setTimeout(() => {
                splash.addClass('fade-out');
                $('body').removeClass('splash-active');
                clearInterval(clockTimer);
            }, SCAN_MS + PROC_MS + 2700);

            // ── 5. Remove from DOM ──
            setTimeout(() => {
                splash.remove();
            }, SCAN_MS + PROC_MS + 4000);
        });
    });

})(jQuery);
