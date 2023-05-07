let buttonEl = document.querySelector('.search-button');
let inputEl = document.querySelector('.search-input');
let cityName = document.querySelector('.name');
let temp = document.querySelector('.temp');
let feelsLike = document.querySelector('.feels-like');
let windSpeed = document.querySelector('.wind-speed');
let description = document.querySelector('.description');
let weatherWrapper = document.querySelector('.weather-block');
let weatherWrapperEls = document.querySelectorAll('.child-block')
let errorField = document.querySelector('.error-field');
let errorInputField = document.querySelector('.error-input-field');
let formSubm = document.querySelector('.form-subm')

const API_KEY = "5161531edb6939420a9faddefc0dd57d";
const FETCH_LINK = "https://api.openweathermap.org/data/2.5/weather?";

//////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////
let reverseGeocoder = new BDCReverseGeocode();

let geoLocatCityName = undefined

reverseGeocoder.getClientLocation(function (result) {
    geoLocatCityName = result.city;
    // console.log(geoLocatCityName)
});

reverseGeocoder.localityLanguage = 'es';

/////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
let townValue = undefined;

buttonEl.addEventListener('click', fetchTown);

inputEl.addEventListener('keyup', function (e) {

    if (inputEl.value === '') {
        return null
    } else {
        townValue = inputEl.value

        if (e.code === 'Enter') {

            buttonEl.click();

            setTimeout(() => {

                if (cityName.value !== '') {
                    inputEl.value = '';
                }
            }, 200)

            errorField.innerHTML = '';
            errorInputField.innerHTML = '';
        }
    }
})

function errorFilter(error) {
    let errorEl = error.name

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
    console.log(data)
}

function fetchTown() {

    errorField.innerHTML = ""

    setTimeout(() => {

        if (cityName.value !== '') {
            inputEl.value = '';
        }
    }, 200)

    if (inputEl.value === '') {

        errorInputField.innerHTML = 'Please, type the city name!';

    } else {

        fetch(`${FETCH_LINK}q=${townValue}&appid=${API_KEY}&units=metric`)
            .then(response => response.json())
            .then(data => {
                townMarkUp(data);
            })
            .catch(error => {
                errorFilter(error)
            });

    }
}


///////////////////////////////////////////////////////////////////////////////////

// const message = document.querySelector('#message');

// let messageEl = undefined;

// function success() {
//     return true;
// }

// function failure() {
//     return false;
// }

// check if the Geolocation API is supported
if (!navigator.geolocation) {

    console.log("Error")

} else {
    setTimeout(() => {

        inputEl.value = geoLocatCityName

    }, 1100)

    document.addEventListener("DOMContentLoaded", function () {
        // Wait for the DOM to be fully loaded before executing this

        // Set the focus on the input field
        inputEl.focus();

        // Create a new KeyboardEvent with the desired key code and options
        const keyboardEvent = new KeyboardEvent("keyup", {
            key: "Enter", // Replace "Enter" with the desired key code
            bubbles: true,
            cancelable: true
        });

        // Dispatch the keyboard event on the input field
        inputEl.dispatchEvent(keyboardEvent);
    });
}


