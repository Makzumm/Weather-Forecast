import getVars from "./get-vars.js";

const refs = getVars();

//////////////////////////////////////////////////////////////////

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
        if (refs.cityName.value !== '') {    // INPUT CLEANING AFTER USER'S CLICK ON BUTTON BROWSE OR PRESSING THE ENTER ON INPUT 
            refs.inputEl.value = '';
        }
    }, 100)

}

function allCleaner() {
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

function townMarkUp(data) { // THE WEATHER MARKUP (KINDA BIG, YEAH?)
    refs.cityName.innerHTML = `<p class="weather-block__txt">City : <span class="weather-block__txt--marked">${refs.townValue.charAt(0).toUpperCase() + refs.townValue.slice(1).toLowerCase()}</span></p>`;
    refs.temp.innerHTML = `<p class="weather-block__txt">Temperature : <span class="weather-block__txt--marked">${Math.round(data['main']['temp'])}&#176;C</span></p>`;
    refs.feelsLike.innerHTML = `<p class="weather-block__txt">Feels like : <span class="weather-block__txt--marked">${Math.round(data['main']['feels_like'])}&#176;C</span></p>`;
    refs.windSpeed.innerHTML = `<p class="weather-block__txt">Wind speed : <span class="weather-block__txt--marked">${data['wind']['speed']}km/h</span></p>`;
    refs.description.innerHTML = `<p class="weather-block__txt">Weather : <span class="weather-block__txt--marked">${data['weather'][0]['description'].charAt(0).toUpperCase() + data['weather'][0]['description'].slice(1)}</span></p><img class='icon-weather' src='http://openweathermap.org/img/w/${data["weather"][0]["icon"]}.png' width='65' height='65'>`;
}

function fetchTown() {

    return fetch(`${refs.FETCH_LINK}q=${refs.townValue}&appid=${refs.API_KEY}&units=metric`) // THE WEATHER DATA FETCHING AND SHOWING THE LOADING GIF AND CLEANING ALL THE UNNECESSARY STUFF
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json()
        })

}

refs.buttonEl.addEventListener('click', () => { // BUTTON "BROWSE" THAT MAKING THE MAGIC OF FETCH

    allCleaner()

    if (refs.inputEl.value === '') {
        refs.errorInputField.innerHTML = 'Please, type the city name!';

    } else {
        refs.loadingGif.classList.remove('loading_gif--hidden');

        fetchTown()
            .then(data => {
                townMarkUp(data);

                mediaQueriesFunc(refs.mediaSize);    //IDK, MAYBE I'LL MAKE THIS FUNC MORE EASIER CUZ IT'S ACCPETING A LOT OF SH*T, ANYWAY, IT WORKS)))

                refs.loadingGif.classList.add('loading_gif--hidden');
            })
            .catch(error => {
                errorFilter(error);

                refs.loadingGif.classList.add('loading_gif--hidden');
            })
    }
})

refs.inputEl.addEventListener('keyup', function (e) {
    if (refs.inputEl.value === '') {
        return null;

    } else {
        refs.townValue = refs.inputEl.value;

        if (e.code === 'Enter') {
            refs.buttonEl.click();
            // CHECKING THE INPUT IF IT'S EMPTY AND SOMETHING ELSE XD
            refs.inputEl.blur();
        }
    }
})

/////////////////////////////////////////////////////////////////

// MEDIA QUERIES

function mediaQueriesFunc(mediaSize) {
    if (refs.mediaSize.matches) { // If media query matches

        refs.allElsWrapper.style.height = "600px";
        //CHECKING THE SIZE OF BROWESER IN SMALL MOBILES TO SHOW THE DATA ON PROPER WAY
    } else {
        refs.allElsWrapper.style.height = null
    }
}

/////////////////////////////////////////////////////////////////
