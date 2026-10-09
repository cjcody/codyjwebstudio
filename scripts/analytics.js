/**
 * Google Analytics 4 Placeholder
 * 
 * To enable GA4:
 * 1. Get your Measurement ID from Google Analytics (format: G-XXXXXXXXXX)
 * 2. Replace the empty string below with your Measurement ID
 * 3. The script will automatically initialize and track page views
 */
const GA_MEASUREMENT_ID = '';

(function() {
    'use strict';

    if (!GA_MEASUREMENT_ID) {
        return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);

    function trackBeginCheckout(productName, productValue) {
        if (typeof gtag === 'function') {
            gtag('event', 'begin_checkout', {
                currency: 'USD',
                value: parseFloat(productValue) || 0,
                items: [{
                    item_name: productName,
                    price: parseFloat(productValue) || 0,
                    quantity: 1
                }]
            });
        }
    }

    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href*="buy.stripe.com"]');
        if (link) {
            const productName = link.dataset.product || 'Unknown Product';
            const productValue = link.dataset.value || '0';
            trackBeginCheckout(productName, productValue);
        }
    });
})();
