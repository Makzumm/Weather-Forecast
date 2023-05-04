let buttonEl = document.querySelector('.search-button');
let inputEl = document.querySelector('.search-input');
let cityName = document.querySelector('.name');
let temp = document.querySelector('.temp');
let feelsLike = document.querySelector('.feels-like');
let windSpeed = document.querySelector('.wind-speed');
let description = document.querySelector('.description');
let weatherWrapper = document.querySelector('.weather-block');
let errorField = document.querySelector('.error-field');
let errorInputField = document.querySelector('.error-input-field');

//////////////////////////////////////////////////////////////////

buttonEl.addEventListener('click', fetchTown);

document.getElementById('search-input').addEventListener('keyup', function (e) {
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
})

function fetchTown() {
    if (inputEl.value === '') {
        errorInputField.innerHTML = 'Please, type the city name!';
    } else {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputEl.value}&appid=5161531edb6939420a9faddefc0dd57d&units=metric`)
            .then(response => response.json())
            .then(data => {
                cityName.innerHTML = `<p class="weather-block__txt">City : <span class="weather-block__txt--marked">${inputEl.value.charAt(0).toUpperCase() + inputEl.value.slice(1).toLowerCase()}</span></p>`;
                temp.innerHTML = `<p class="weather-block__txt">Temperature : <span class="weather-block__txt--marked">${Math.round(data['main']['temp'])}&#176;C</span></p>`;
                feelsLike.innerHTML = `<p class="weather-block__txt">Feels like : <span class="weather-block__txt--marked">${Math.round(data['main']['feels_like'])}&#176;C</span></p>`;
                windSpeed.innerHTML = `<p class="weather-block__txt">Wind speed : <span class="weather-block__txt--marked">${data['wind']['speed']}km/h</span></p>`;
                description.innerHTML = `<p class="weather-block__txt">Weather : <span class="weather-block__txt--marked">${data['weather'][0]['description'].charAt(0).toUpperCase() + data['weather'][0]['description'].slice(1)}</span></p><img src='http://openweathermap.org/img/w/${data["weather"][0]["icon"]}.png' width='65' height='65'>`;
                console.log(data)
            })
            .catch(error => {
                errorField.innerHTML = error;
                errorInputField.innerHTML = '';
            });
    }
}