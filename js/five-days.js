let buttonEl = document.querySelector('.search-button--five-days');
let inputEl = document.querySelector('.search-input');
let cityName = document.querySelector('.city-name');
let temp = document.querySelector('.temp');
let feelsLike = document.querySelector('.feels-like');
let windSpeed = document.querySelector('.wind-speed');
let description = document.querySelector('.description')
let weatherWrapper = document.querySelector('.weather-block')
let errorField = document.querySelector('.error-field')
let listEl = document.querySelector('.weather-five-days-list__item');

buttonEl.addEventListener('click', fetchTown);
buttonEl.addEventListener('click', () => {
    inputEl.textContent = '';
})

document.getElementById('search-input').addEventListener('keyup', function (e) {
    if (e.code === 'Enter') {
        buttonEl.click()
    }
})

function fetchTown() {

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${inputEl.value}&appid=5161531edb6939420a9faddefc0dd57d&units=metric`)
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < 5; i += 1) {
                let newDay = new Date();
                cityName.innerHTML = `Weather in ${data.city.name}`
                document.querySelector(`.day-date${i + 1}`).innerHTML = `${newDay.toDateString()}`
                document.querySelector(`.day${i + 1}Min`).innerHTML = `Min ${Number(data.list[i].main.temp_min).toFixed()} C°`
                document.querySelector(`.day${i + 1}Max`).innerHTML = `Max ${Number(data.list[i].main.temp_max).toFixed()} C°`
                document.querySelector(".weather-icon" + (i + 1)).src = "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png";
                document.querySelector(`.windSpeedDay${i + 1}`).innerHTML = `${Number(data.list[i].wind.speed).toFixed()} km/h`
            }
            console.log(data)
        })
        .catch(error => { console.log(error) });
}
