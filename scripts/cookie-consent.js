// Cookie Consent Banner
document.addEventListener('DOMContentLoaded', function() {
    // Function to load non-essential resources
    function loadNonEssentialResources() {
        // Load weather widget if on capabilities page
        if (window.location.pathname.endsWith('capabilities.html')) {
            if (!document.querySelector('script[src="scripts/weather-widget.js"]')) {
                const script = document.createElement('script');
                script.src = 'scripts/weather-widget.js';
                script.defer = true;
                document.body.appendChild(script);
            }
        }

        // Enable social media tracking
        document.querySelectorAll('.social-links a').forEach(link => {
            link.setAttribute('data-consent', 'accepted');
        });
    }

    // Function to remove non-essential resources
    function removeNonEssentialResources() {
        // Remove weather widget if on capabilities page
        const weatherScript = document.querySelector('script[src="scripts/weather-widget.js"]');
        if (weatherScript) {
            weatherScript.remove();
        }

        // Disable social media tracking
        document.querySelectorAll('.social-links a').forEach(link => {
            link.removeAttribute('data-consent');
        });
    }

    // Check if consent has been given
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'accepted') {
        loadNonEssentialResources();
    } else if (consent === 'essential') {
        removeNonEssentialResources();
    }

    // Create cookie consent banner if no consent has been given
    if (!consent) {
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
                <div class="cookie-buttons">
                    <button class="accept-all">Accept All</button>
                    <button class="essential-only">Essential Only</button>
                    <a href="legal/cookie-policy.html" class="learn-more">Learn More</a>
                </div>
            </div>
        `;
        document.body.appendChild(banner);

        // Add event listeners to buttons
        banner.querySelector('.accept-all').addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            banner.remove();
            loadNonEssentialResources();
        });

        banner.querySelector('.essential-only').addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'essential');
            banner.remove();
            removeNonEssentialResources();
        });
    }
}); 