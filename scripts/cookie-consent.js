// Cookie Consent Banner
document.addEventListener('DOMContentLoaded', function() {
    // Check if user has already made a choice
    if (!localStorage.getItem('cookieConsent')) {
        // Create banner
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
                <div class="cookie-buttons">
                    <button class="cookie-accept-all">Accept All</button>
                    <button class="cookie-accept-essential">Essential Only</button>
                    <a href="legal/cookie-policy.html" class="cookie-learn-more">Learn More</a>
                </div>
            </div>
        `;

        // Add banner to page
        document.body.appendChild(banner);

        // Add event listeners
        banner.querySelector('.cookie-accept-all').addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'all');
            banner.remove();
        });

        banner.querySelector('.cookie-accept-essential').addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'essential');
            banner.remove();
        });
    }
}); 