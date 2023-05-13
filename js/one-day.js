////////////////////////////////////////////////////////////////////

let buttonEl = document.querySelector('.search-button');
let inputEl = document.querySelector('.search-input');
let cityName = document.querySelector('.name');
let temp = document.querySelector('.temp');
let feelsLike = document.querySelector('.feels-like');
let windSpeed = document.querySelector('.wind-speed');
let description = document.querySelector('.description');
let weatherWrapper = document.querySelector('.weather-block');
let weatherWrapperEls = document.querySelectorAll('.child-block');
let errorField = document.querySelector('.error-field');
let errorInputField = document.querySelector('.error-input-field');
let locationBtn = document.querySelector('.location-button');
let loadingGif = document.querySelector('.loading_gif');

let townValue = undefined;
let geoLocatCityName = undefined;


const API_KEY = "5161531edb6939420a9faddefc0dd57d";
const FETCH_LINK = "https://api.openweathermap.org/data/2.5/weather?";

//////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////
// GEOLOCATION 
////////////////////////////////////////////////////////////////

function getLocation() {
    if (!navigator.geolocation) {
        console.log("Geolocation is not supported by this browser.");

    } else {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position) {

    fetch(`https://geocode.maps.co/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
        .then(response => response.json())
        .then(data => {

            geoLocatCityName = data['address']['city']

            townValue = String(geoLocatCityName);

            inputEl.value = townValue

        })
        .catch(error => {
            errorFilter(error);
        });;
}

function navigatorPermissionCheck() {
    navigator.permissions.query({ name: 'geolocation' }).then(function (permissionStatus) {

        if (permissionStatus.state === "denied") {

            console.log('denied');

        } else {

            getLocation()
        }
    });
}

locationBtn.addEventListener('click', () => {
    if (!"geolocation" in navigator) {

        console.log("navigator is not supported");

    } else {

        inputEl.focus()
        navigatorPermissionCheck();
    }

})

/////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
// WEATHER FETCH AND SOME ERROR/FUNC HANDLERS
////////////////////////////////////////////////////////////////

function errorFieldsCleaner() {
    errorField.innerHTML = '';
    errorInputField.innerHTML = '';
}

function errorFilter(error) {
    let errorEl = error.name;

    if (errorEl) {
        for (const el of weatherWrapperEls) {
            el.innerHTML = '';
        }
    }

    errorField.innerHTML = 'Something went wrong, please, try again.';
    errorInputField.innerHTML = '';
}

function townMarkUp(data) {
    cityName.innerHTML = `<p class="weather-block__txt">City : <span class="weather-block__txt--marked">${townValue.charAt(0).toUpperCase() + townValue.slice(1).toLowerCase()}</span></p>`;
    temp.innerHTML = `<p class="weather-block__txt">Temperature : <span class="weather-block__txt--marked">${Math.round(data['main']['temp'])}&#176;C</span></p>`;
    feelsLike.innerHTML = `<p class="weather-block__txt">Feels like : <span class="weather-block__txt--marked">${Math.round(data['main']['feels_like'])}&#176;C</span></p>`;
    windSpeed.innerHTML = `<p class="weather-block__txt">Wind speed : <span class="weather-block__txt--marked">${data['wind']['speed']}km/h</span></p>`;
    description.innerHTML = `<p class="weather-block__txt">Weather : <span class="weather-block__txt--marked">${data['weather'][0]['description'].charAt(0).toUpperCase() + data['weather'][0]['description'].slice(1)}</span></p><img class='icon-weather' src='http://openweathermap.org/img/w/${data["weather"][0]["icon"]}.png' width='65' height='65'>`;
}

function inputCleaner() {
    setTimeout(() => {

        if (cityName.value !== '') {
            inputEl.value = '';
        }
    }, 200)

}

buttonEl.addEventListener('click', fetchTown);

inputEl.addEventListener('keyup', function (e) {
    if (inputEl.value === '') {
        return null;

    } else {
        townValue = inputEl.value

        if (e.code === 'Enter') {
            buttonEl.click();

            setTimeout(() => {

                if (cityName.value !== '') {
                    inputEl.value = '';
                }
            }, 200)

            inputEl.blur()

            errorFieldsCleaner();
        }
    }
})

function fetchTown() {
    for (const el of weatherWrapperEls) {
        el.innerHTML = ''
    }

    errorFieldsCleaner();
    inputCleaner();
    console.clear()

    if (inputEl.value === '') {
        errorInputField.innerHTML = 'Please, type the city name!';

    } else {
        loadingGif.classList.remove('loading_gif--hidden');

        fetch(`${FETCH_LINK}q=${townValue}&appid=${API_KEY}&units=metric`)
            .then(response => response.json())
            .then(data => {

                townMarkUp(data);

                loadingGif.classList.add('loading_gif--hidden');
            })
            .catch(error => {
                errorFilter(error);
                loadingGif.classList.add('loading_gif--hidden');
            });
    }
}

/////////////////////////////////////////////////////////////////
