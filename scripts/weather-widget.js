// Weather Demo Integration
(function() {
    const apiKey = 'b6dc43f2204198293a1e7719ddff42ae';
    const weatherStatus = document.querySelector('.weather-status');
    const FALLBACK_CITY = 'Orlando,FL,US';

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function showError(message) {
        weatherStatus.textContent = message;
    }

    function showWeather(data) {
        if (!data || !data.weather || !data.main) {
            showError('Weather data unavailable.');
            return;
        }
        if (data.cod && data.cod !== 200) {
            showError('Unable to load weather. Please try again later.');
            return;
        }
        const icon = escapeHtml(data.weather[0].icon);
        const temp = Math.round(data.main.temp);
        const desc = escapeHtml(data.weather[0].description);
        const city = escapeHtml(data.name);
        weatherStatus.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" style="vertical-align:middle;width:40px;height:40px;"> 
            <span style="font-size:1.2rem;font-weight:600;">${temp}&deg;F</span> 
            <span style="text-transform:capitalize;">${desc}</span><br>
            <span style="font-size:0.95rem;color:#8b5cf6;">${city}</span>
        `;
    }

    function handleApiResponse(res) {
        if (!res.ok) {
            if (res.status === 401) {
                showError('Weather service temporarily unavailable.');
            } else {
                showError('Unable to load weather. Please try again later.');
            }
            return null;
        }
        return res.json();
    }

    function fetchWeatherByCoords(lat, lon) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
            .then(handleApiResponse)
            .then(data => { if (data) showWeather(data); })
            .catch(() => showError('Unable to fetch weather.'));
    }

    function fetchWeatherByCity(city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=imperial&appid=${apiKey}`)
            .then(handleApiResponse)
            .then(data => { if (data) showWeather(data); })
            .catch(() => showError('Unable to fetch weather.'));
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
            () => fetchWeatherByCity(FALLBACK_CITY),
            { timeout: 8000 }
        );
    } else {
        fetchWeatherByCity(FALLBACK_CITY);
    }
})(); 