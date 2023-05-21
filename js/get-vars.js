export default function getVars() {
    const refs = {
        allElsWrapper: document.querySelector('.data-wrapper'),
        buttonEl: document.querySelector('.search-button'),
        inputEl: document.querySelector('.search-input'),
        cityName: document.querySelector('.name'),
        temp: document.querySelector('.temp'),
        feelsLike: document.querySelector('.feels-like'),
        windSpeed: document.querySelector('.wind-speed'),
        description: document.querySelector('.description'),
        weatherWrapper: document.querySelector('.weather-block'),
        weatherWrapperEls: document.querySelectorAll('.child-block'),
        errorField: document.querySelector('.error-field'),
        errorInputField: document.querySelector('.error-input-field'),
        locationBtn: document.querySelector('.location-button'),
        loadingGif: document.querySelector('.loading_gif'),

        townValue: undefined,
        geoLocatCityName: undefined,

        mediaSize: window.matchMedia("(max-width: 399px)"),

        API_KEY: "5161531edb6939420a9faddefc0dd57d",
        FETCH_LINK: "https://api.openweathermap.org/data/2.5/weather?",
    }

    return refs
}