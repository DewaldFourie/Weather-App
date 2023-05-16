
let KEY = "0360863dc8154c8e94172204231105"
let $location = document.getElementById("location-out");
let $country = document.getElementById("country");
let $curDate = document.getElementById("date");
let $curTime = document.getElementById("time");
let $temp = document.getElementById("temp");
let $conditions = document.getElementById("conditions");
let $icon = document.getElementById("icon");
let $location_input = document.getElementById("location-in");
let $searchBtn = document.querySelector(".searchBtn");
let $toggle = document.getElementById("toggle");

function setWeatherData(data){
    $location.textContent = data.location;
    $country.textContent = data.country;
    $curDate.textContent = data.localTime.split(" ")[0];
    $curTime.textContent = data.localTime.split(" ")[1];
    $temp.textContent = data.tempC + " °C";
    $conditions.textContent = data.condition;
    $icon.src = data.icon;
    if (data.isDay === 1){
        if(data.code === 1000){
            console.log("sunny");
        }
        else {
            console.log("oops");
        }
    }
    else{
        console.log("night");
    }   
    $toggle.addEventListener("click", () => {
        if($toggle.checked) {
            $temp.textContent = data.tempF + " °F";
        }
        else{
            $temp.textContent = data.tempC + " °C";
        }
    })   
}

async function getWeatherData(location){
    let URLtext = `https://api.weatherapi.com/v1/current.json?key=${KEY}&q=${location}`;
    console.log(location)
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
            isDay: data.current.is_day
        }
        return weatherData;
    } 
    catch (error) {
        console.error("Not Found", error)
    }
}

$searchBtn.addEventListener("click", () => {
    getWeatherData($location_input.value).then(weatherData => {
        setWeatherData(weatherData);
    })
    $location_input.value = "";
});

getWeatherData("Dublin").then(weatherData => {
    console.log(weatherData);
    setWeatherData(weatherData);
})

