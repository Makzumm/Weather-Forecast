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

//////////////////////////////////////////////////////////////////

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

    setTimeout(() => {

        if (cityName.value !== '') {
            inputEl.value = '';
        }
    }, 200)

    if (inputEl.value === '') {

        errorInputField.innerHTML = 'Please, type the city name!';

    } else {

        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${townValue}&appid=5161531edb6939420a9faddefc0dd57d&units=metric`)
            .then(response => response.json())
            .then(data => {
                townMarkUp(data);
            })
            .catch(error => {
                errorFilter(error)
            });

    }
}


