
let KEY = "0360863dc8154c8e94172204231105"
let $location = document.getElementById("location-out");
let $country = document.getElementById("country");
let $curDate = document.getElementById("date");
let $curTime = document.getElementById("time");
let $temp = document.getElementById("temp");
let $conditions = document.getElementById("conditions");
let $icon = document.getElementById("icon");
let $windSpeed = document.getElementById("windSpeed");
let $windDir = document.getElementById("windDir");
let $lastUpdate = document.getElementById("update");
let $location_input = document.getElementById("location-in");
let $searchBtn = document.querySelector(".searchBtn");
let $toggle = document.getElementById("toggle");
let $refreshBtn = document.querySelector(".refreshBtn");

// function to set the current data received from the get function on the DOM elements
function setWeatherData(data) {
    $location.textContent = data.location;
    $country.textContent = data.country;
    $curDate.textContent = data.localTime.split(" ")[0];
    $curTime.textContent = data.localTime.split(" ")[1];
    $temp.textContent = data.tempC + " °C";
    $conditions.textContent = data.condition;
    $windSpeed.textContent = data.windKph + " km/h";
    $windDir.textContent = data.windDir;
    $icon.src = data.icon;
    $lastUpdate.textContent = data.lastUpdate;
    let body = document.body;
    let currentBg = body.style.backgroundImage;
    let newBg;

    if (data.isDay === 1) {
        if (data.code < 1006) {
            console.log("sunny");
            newBg = "url('assets/sunny.jpg')";
        } 
        else if ((data.code > 1149 && data.code < 1202) ||  (data.code > 1239 && data.code < 1250)) {
            console.log("rain");
            newBg = "url('assets/rain.jpg')";
        } 
        else if (data.code === 1087 || data.code > 1270) {
            console.log("thunder");
            newBg = "url('assets/thunder.jpg')";
        } 
        else if (data.code > 1005 && data.code < 1100) {
            console.log("clouds");
            newBg = "url('assets/overcast.jpg')";
        } 
        else {
            console.log("snow");
            newBg = "url('assets/snow.jpg')";
        }
    } 
    else {
        console.log("night");
        newBg = "url('assets/night.jpg')";
    }

    if (currentBg !== newBg) {
        body.style.transition = "background-image 1s ease-in-out";
        body.style.backgroundImage = newBg;
        setTimeout(() => {
        body.style.transition = "";
        }, 1000);
    }

    $toggle.addEventListener("click", () => {
        if ($toggle.checked) {
        $temp.textContent = data.tempF + " °F";
        $windSpeed.textContent = data.windMph + " mph";
    } else {
        $temp.textContent = data.tempC + " °C";
        $windSpeed.textContent = data.windKph + " km/h";
    }
    });
}

// async function to get the current weather data
async function getWeatherData(location){
    let URLtext = `https://api.weatherapi.com/v1/current.json?key=${KEY}&q=${location}`;
    try {
        let response = await fetch(URLtext, {mode:"cors"});
        let data = await response.json();
        console.log(data)
        let weatherData = {
            location: data.location.name,
            country: data.location.country,
            localTime: data.location.localtime,
            lastUpdate: data.current.last_updated,
            tempC: data.current.temp_c,
            tempF: data.current.temp_f,
            condition: data.current.condition.text,
            icon: data.current.condition.icon,
            code: data.current.condition.code,
            isDay: data.current.is_day,
            windKph: data.current.wind_kph,
            windMph: data.current.wind_mph,
            windDir: data.current.wind_dir
        }
        localStorage.setItem("lastLocation", location);
        return weatherData;
    } 
    catch (error) {
        console.error("Not Found", error)
    }
}

// search button functionality that operates on user input.
$searchBtn.addEventListener("click", () => {
    getWeatherData($location_input.value).then(weatherData => {
        setWeatherData(weatherData);
    })
    $location_input.value = "";
});

// refresh button functionality, calls the stored last location and refreshes the data values.
$refreshBtn.addEventListener("click", () => {
    const lastLocation = localStorage.getItem("lastLocation");
    if (lastLocation) {
        getWeatherData(lastLocation).then(weatherData => {
            setWeatherData(weatherData);
        })
        .catch(error => {
            console.error("Error refreshing weather data:", error)
        })
        alert("Data Refreshed");
    }
});

// default location on start up.
getWeatherData("Pretoria").then(weatherData => {
    setWeatherData(weatherData);
});

