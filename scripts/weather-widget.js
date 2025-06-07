// Weather Demo Integration
(function() {
    const apiKey = 'b6dc43f2204198293a1e7719ddff42ae';
    const weatherStatus = document.querySelector('.weather-status');
    function showWeather(data) {
        if (!data || !data.weather || !data.main) {
            weatherStatus.textContent = 'Weather data unavailable.';
            return;
        }
        const icon = data.weather[0].icon;
        const temp = Math.round(data.main.temp);
        const desc = data.weather[0].description;
        const city = data.name;
        weatherStatus.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" style="vertical-align:middle;width:40px;height:40px;"> 
            <span style="font-size:1.2rem;font-weight:600;">${temp}&deg;C</span> 
            <span style="text-transform:capitalize;">${desc}</span><br>
            <span style="font-size:0.95rem;color:#8b5cf6;">${city}</span>
        `;
    }
    function fetchWeatherByCoords(lat, lon) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
            .then(res => res.json())
            .then(showWeather)
            .catch(() => { weatherStatus.textContent = 'Unable to fetch weather.'; });
    }
    function fetchWeatherByCity(city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`)
            .then(res => res.json())
            .then(showWeather)
            .catch(() => { weatherStatus.textContent = 'Unable to fetch weather.'; });
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
            () => fetchWeatherByCity('London'),
            { timeout: 8000 }
        );
    } else {
        fetchWeatherByCity('London');
    }
})(); 