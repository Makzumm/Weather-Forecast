////////////////////////////////////////////////////////////////////
let allElsWrapper = document.querySelector('.data-wrapper')
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

let mediaSize = window.matchMedia("(max-width: 399px)");
let mediaBiggerSize = window.matchMedia("(min-width: 400px)")

const API_KEY = "5161531edb6939420a9faddefc0dd57d";
const FETCH_LINK = "https://api.openweathermap.org/data/2.5/weather?";

//////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////
// GEOLOCATION 
////////////////////////////////////////////////////////////////

locationBtn.addEventListener('click', () => {
    if (!"geolocation" in navigator) {

        console.log("navigator is not supported");

    } else {                                        ///// CHECK IF THE GEOLOCATION IS SUPPORTED

        inputEl.focus();
        navigatorPermissionCheck();
    }

})

function navigatorPermissionCheck() {
    navigator.permissions.query({ name: 'geolocation' }).then(function (permissionStatus) {

        if (permissionStatus.state === "denied") { //////////// CHECKING IF USER DENIED OR ACCEPTED THE GEOLOCATION

            console.log('denied');

        } else {

            navigator.geolocation.getCurrentPosition(showPosition);
        }
    });
}

function showPosition(position) {

    fetch(`https://geocode.maps.co/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
        .then(response => response.json())
        .then(data => {
            geoLocatCityName = data['address']['city']; //// GETTING CONVERTED COORDINATES

            console.log(data);

            townValue = String(geoLocatCityName);

            inputEl.value = townValue;

        })
        .catch(error => {
            errorFilter(error);
        });;
}

/////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
// WEATHER FETCH AND SOME ERROR/FUNC HANDLERS
////////////////////////////////////////////////////////////////

function errorFieldsCleaner() {
    errorField.innerHTML = '';
    errorInputField.innerHTML = ''; /// ERROR FIELDS CLEANING FUNCTION
}

function dataBlockCleaner() {
    for (const el of weatherWrapperEls) {
        el.innerHTML = '';
    }
}

function errorFilter(error) {
    if (error) {
        dataBlockCleaner();
    }

    errorField.innerHTML = 'Something went wrong, please, try again.';
    errorInputField.innerHTML = '';
}

function townMarkUp(data) { // THE WEATHER MARKUP (KINDA BIG, YEAH?)
    cityName.innerHTML = `<p class="weather-block__txt">City : <span class="weather-block__txt--marked">${townValue.charAt(0).toUpperCase() + townValue.slice(1).toLowerCase()}</span></p>`;
    temp.innerHTML = `<p class="weather-block__txt">Temperature : <span class="weather-block__txt--marked">${Math.round(data['main']['temp'])}&#176;C</span></p>`;
    feelsLike.innerHTML = `<p class="weather-block__txt">Feels like : <span class="weather-block__txt--marked">${Math.round(data['main']['feels_like'])}&#176;C</span></p>`;
    windSpeed.innerHTML = `<p class="weather-block__txt">Wind speed : <span class="weather-block__txt--marked">${data['wind']['speed']}km/h</span></p>`;
    description.innerHTML = `<p class="weather-block__txt">Weather : <span class="weather-block__txt--marked">${data['weather'][0]['description'].charAt(0).toUpperCase() + data['weather'][0]['description'].slice(1)}</span></p><img class='icon-weather' src='http://openweathermap.org/img/w/${data["weather"][0]["icon"]}.png' width='65' height='65'>`;
}

function inputCleaner() {
    setTimeout(() => {

        if (cityName.value !== '') {    // INPUT CLEANING AFTER USER'S CLICK ON BUTTON BROWSE OR PRESSING THE ENTER ON INPUT 
            inputEl.value = '';
        }
    }, 200)

}

function fetchTown() {

    dataBlockCleaner();

    errorFieldsCleaner();

    inputCleaner();

    if (inputEl.value === '') {
        errorInputField.innerHTML = 'Please, type the city name!';

    } else {
        loadingGif.classList.remove('loading_gif--hidden');

        return fetch(`${FETCH_LINK}q=${townValue}&appid=${API_KEY}&units=metric`) // THE WEATHER DATA FETCHING AND SHOWING THE LOADING GIF AND CLEANING ALL THE UNNECESSARY STUFF
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json()
            })
    }
}

buttonEl.addEventListener('click', () => { // BUTTON "BROWSE" THAT MAKING THE MAGIC OF FETCH
    fetchTown()
        .then(data => {
            townMarkUp(data);

            mediaQueriesFunc(mediaSize);    //IDK, MAYBE I'LL MAKE THIS FUNC MORE EASIER CUZ IT'S ACCPETING A LOT OF SH*T, ANYWAY, IT WORKS)))

            loadingGif.classList.add('loading_gif--hidden');
        })
        .catch(error => {
            errorFilter(error);

            loadingGif.classList.add('loading_gif--hidden');
        })
})

inputEl.addEventListener('keyup', function (e) {
    if (inputEl.value === '') {
        return null;

    } else {
        townValue = inputEl.value;

        if (e.code === 'Enter') {
            buttonEl.click();

            // CHECKING THE INPUT IF IT'S EMPTY AND SOMETHING ELSE XD

            inputEl.blur();
        }
    }
})

/////////////////////////////////////////////////////////////////

// MEDIA QUERIES

function mediaQueriesFunc(mediaSize) {
    if (mediaSize.matches) { // If media query matches

        allElsWrapper.style.height = "600px";
        //CHECKING THE SIZE OF BROWESER IN SMALL MOBILES TO SHOW THE DATA ON PROPER WAY
    } else {
        allElsWrapper.style.height = null
    }
}

/////////////////////////////////////////////////////////////////
