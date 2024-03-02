import getVars from "./get-vars.js";

const refs = getVars();

// Event listener for location button
refs.locationBtn.addEventListener('click', handleLocationButtonClick);

// Function to handle location button click
function handleLocationButtonClick() {
    if (!("geolocation" in navigator)) {
        console.log("Geolocation is not supported");
    } else {
        refs.inputEl.focus();
        checkGeolocationPermission();
    }
}

// Function to check geolocation permission
function checkGeolocationPermission() {
    if (navigator.geolocation) {
        navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
            if (permissionStatus.state === "granted") {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else if (permissionStatus.state === "prompt") {
                navigator.geolocation.requestPermission().then(result => {
                    if (result === "granted") {
                        navigator.geolocation.getCurrentPosition(showPosition);
                    } else {
                        console.log('Geolocation permission denied');
                    }
                });
            } else {
                console.log('Geolocation permission denied');
            }
        });
    } else {
        console.log('Geolocation is not supported');
    }
}

function showPosition(position) {
    console.log('Latitude:', position.coords.latitude);
    console.log('Longitude:', position.coords.longitude);
    fetchLocationData(position.coords.latitude, position.coords.longitude);
}

async function fetchLocationData(latitude, longitude) {
    try {
        const response = await fetch(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=65e38cc56932f913858260tisf1c967`);
        if (!response.ok) {
            throw new Error(response.status);
        }
        const data = await response.json();
        console.log('Location data:', data);
        updateInputWithLocation(data);
    } catch (error) {
        console.error('Error fetching location data:', error);
    }
}

// Function to update input with location
function updateInputWithLocation(data) {
    const cityName = data['address']['town'];
    if (cityName) {
        refs.inputEl.value = capitalizeFirstLetter(cityName);
        refs.townValue = capitalizeFirstLetter(cityName);
    }
}

// Event listener for button click
refs.buttonEl.addEventListener('click', handleButtonClick);

// Function to handle button click
async function handleButtonClick() {
    clearAllInfo();
    if (refs.inputEl.value === '') {
        refs.errorInputField.innerHTML = 'Please, type the city name!';
        return;
    }
    refs.loadingGif.classList.remove('loading_gif--hidden');
    try {
        const weatherData = await fetchWeatherData(refs.townValue.trim());
        updateWeatherInfo(weatherData);
        handleMediaQueries(refs.mediaSize);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        handleErrors(error);
    } finally {
        refs.loadingGif.classList.add('loading_gif--hidden');
    }
}

// Function to fetch weather data
async function fetchWeatherData(cityName) {
    const response = await fetch(`${refs.FETCH_LINK}q=${cityName}&appid=${refs.API_KEY}&units=metric`);
    if (!response.ok) {
        throw new Error(response.status);
    }
    return await response.json();
}

// Function to handle input keyup event
refs.inputEl.addEventListener('keyup', function (e) {
    if (refs.inputEl.value === '') {
        return;
    } else {
        refs.townValue = refs.inputEl.value;
        if (e.code === 'Enter') {
            refs.buttonEl.click();
            refs.inputEl.blur();
        }
    }
});

// Function to handle media queries
function handleMediaQueries(mediaSize) {
    refs.allElsWrapper.style.height = mediaSize.matches ? "600px" : null;
}

// Function to clear all information
function clearAllInfo() {
    clearDataBlocks();
    clearErrorFields();
    clearInput();
}

// Function to clear data blocks
function clearDataBlocks() {
    for (const el of refs.weatherWrapperEls) {
        el.innerHTML = '';
    }
}

// Function to clear error fields
function clearErrorFields() {
    refs.errorField.innerHTML = '';
    refs.errorInputField.innerHTML = '';
}

// Function to clear input
function clearInput() {
    setTimeout(() => {
        if (refs.cityName.value !== '') {
            refs.inputEl.value = '';
        }
    }, 100);
}

// Function to handle errors
function handleErrors(error) {
    if (error) {
        refs.errorField.innerHTML = 'Something went wrong, please try again.';
        clearDataBlocks();
    }
}

// Function to capitalize first letter of a string
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Function to update weather information
function updateWeatherInfo(data) {
    refs.cityName.innerHTML = buildWeatherInfo('City', capitalizeFirstLetter(refs.townValue));
    refs.temp.innerHTML = buildWeatherInfo('Temperature', `${Math.round(data['main']['temp'])}&#176;C`);
    refs.feelsLike.innerHTML = buildWeatherInfo('Feels like', `${Math.round(data['main']['feels_like'])}&#176;C`);
    refs.windSpeed.innerHTML = buildWeatherInfo('Wind speed', `${data['wind']['speed']}km/h`);
    refs.description.innerHTML = buildWeatherInfo('Weather', capitalizeFirstLetter(data['weather'][0]['description'])) + `<img class='icon-weather' src='http://openweathermap.org/img/w/${data["weather"][0]["icon"]}.png' width='65' height='65'>`;
}

// Function to build weather information markup
function buildWeatherInfo(title, value) {
    return `<p class="weather-block__txt">${title} : <span class="weather-block__txt--marked">${value}</span></p>`;
}