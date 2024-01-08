import getVars from "./get-vars.js";
const refs = getVars();
/////////////////////////////////////////////////////////////////
// GEOLOCATION 
////////////////////////////////////////////////////////////////

refs.locationBtn.addEventListener('click', () => {
    if (!"geolocation" in navigator) {
        console.log("navigator is not supported");

    } else {                                        ///// CHECK IF THE GEOLOCATION IS SUPPORTED
        refs.inputEl.focus();
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
            refs.geoLocatCityName = data['address']['city']; //// GETTING CONVERTED COORDINATES
            refs.townValue = refs.geoLocatCityName;
            refs.inputEl.value = refs.townValue;
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
    refs.errorField.innerHTML = '';
    refs.errorInputField.innerHTML = ''; /// ERROR FIELDS CLEANING FUNCTION
}

function dataBlockCleaner() {
    for (const el of refs.weatherWrapperEls) {
        el.innerHTML = '';
    }
}

function inputCleaner() {
    setTimeout(() => {
        if (refs.cityName.value !== '') {
            refs.inputEl.value = '';
        }
    }, 100);
}

function allInfoCleaner() {
    dataBlockCleaner();
    errorFieldsCleaner();
    inputCleaner();
}

function errorFilter(error) {
    if (error) {
        refs.errorField.innerHTML = 'Something went wrong, please, try again.';
        dataBlockCleaner();
    }
}

function capitalizeFirstLetter(str) {
    const words = str.split(' ');
    const capitalizedWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    return capitalizedWords.join(' ');
}

function buildWeatherInfo(title, value) {
    return `<p class="weather-block__txt">${title} : <span class="weather-block__txt--marked">${value}</span></p>`;
}

function townMarkUp(data) {
    refs.cityName.innerHTML = buildWeatherInfo('City', capitalizeFirstLetter(refs.townValue));
    refs.temp.innerHTML = buildWeatherInfo('Temperature', `${Math.round(data['main']['temp'])}&#176;C`);
    refs.feelsLike.innerHTML = buildWeatherInfo('Feels like', `${Math.round(data['main']['feels_like'])}&#176;C`);
    refs.windSpeed.innerHTML = buildWeatherInfo('Wind speed', `${data['wind']['speed']}km/h`);
    refs.description.innerHTML = buildWeatherInfo('Weather', capitalizeFirstLetter(data['weather'][0]['description'])) + `<img class='icon-weather' src='http://openweathermap.org/img/w/${data["weather"][0]["icon"]}.png' width='65' height='65'>`;
}

async function fetchTown() {
    const response = await fetch(`${refs.FETCH_LINK}q=${refs.townValue.trim()}&appid=${refs.API_KEY}&units=metric`); // THE WEATHER DATA FETCHING AND SHOWING THE LOADING GIF AND CLEANING ALL THE UNNECESSARY STUFF
    if (!response.ok) {
        throw new Error(response.status);
    }
    return await response.json();

}

refs.buttonEl.addEventListener('click', async () => {
    allInfoCleaner();

    if (refs.inputEl.value === '') {
        refs.errorInputField.innerHTML = 'Please, type the city name!';
        return;
    }

    refs.loadingGif.classList.remove('loading_gif--hidden');

    try {
        const data = await fetchTown();
        townMarkUp(data);
        mediaQueriesFunc(refs.mediaSize);
    } catch (error) {
        errorFilter(error);
    } finally {
        refs.loadingGif.classList.add('loading_gif--hidden');
    }
});

refs.inputEl.addEventListener('keyup', function (e) {
    if (refs.inputEl.value === '') {
        return null;

    } else {
        refs.townValue = refs.inputEl.value;

        if (e.code === 'Enter') {
            refs.buttonEl.click();
            // CHECKING THE INPUT IF IT'S EMPTY
            refs.inputEl.blur();
        }
    }
})

/////////////////////////////////////////////////////////////////

// MEDIA QUERIES

function mediaQueriesFunc(mediaSize) {
    if (refs.mediaSize.matches) { // If media query matches

        refs.allElsWrapper.style.height = "600px";
        //CHECKING THE SIZE OF BROWESER IN SMALL MOBILES TO SHOW THE DATA IN PROPER WAY
    } else {
        refs.allElsWrapper.style.height = null
    }
}

/////////////////////////////////////////////////////////////////
