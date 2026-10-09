/**
 * Google Analytics 4 with Consent Mode
 * 
 * Respects the cookie consent banner:
 * - Uses Consent Mode defaults (denied) until user accepts
 * - Only enables analytics tracking after "Accept All" is clicked
 * - Fires begin_checkout events on Stripe payment links
 */
const GA_MEASUREMENT_ID = 'G-HES40P6VTE';

(function() {
    'use strict';

    if (!GA_MEASUREMENT_ID) {
        return;
    }

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }

    gtag('consent', 'default', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'wait_for_update': 500
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(script);

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
        'anonymize_ip': true
    });

    function updateConsent(granted) {
        gtag('consent', 'update', {
            'analytics_storage': granted ? 'granted' : 'denied'
        });
    }

    function checkAndApplyConsent() {
        const consent = localStorage.getItem('cookieConsent');
        if (consent === 'accepted') {
            updateConsent(true);
        } else {
            updateConsent(false);
        }
    }

    checkAndApplyConsent();

    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        originalSetItem.apply(this, arguments);
        if (key === 'cookieConsent') {
            if (value === 'accepted') {
                updateConsent(true);
            } else {
                updateConsent(false);
            }
        }
    };

    function trackBeginCheckout(productName, productValue) {
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

    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href*="buy.stripe.com"]');
        if (link) {
            const productName = link.dataset.product || 'Unknown Product';
            const productValue = link.dataset.value || '0';
            trackBeginCheckout(productName, productValue);
        }
    });
})();
