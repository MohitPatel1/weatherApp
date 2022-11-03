const APIkey = "473fcbe90fdb1548ba72bb972c691feb";

const getCurrentWeatherData = async () => {
    const cityName = "pune";
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIkey}&units=metric`);
    return response.json()
}

const formatTemerature = (temp) => `${temp?.toFixed(1)}°`;
const createIconUrl = (icon) => `http://openweathermap.org/img/wn/${icon}@2x.png`;
const timeIndent = (time) => time.slice(0,5);

const loadCurrentForecast = ({name ,main:{temp, temp_max, temp_min}, weather:[{description}]}) =>{
    const currentForecastElement = document.querySelector("#current-forecast")
    currentForecastElement.querySelector(".cityName").textContent = name;
    currentForecastElement.querySelector(".temprature").textContent = formatTemerature(temp);
    currentForecastElement.querySelector(".description").textContent = description;
    currentForecastElement.querySelector(".max-temp").textContent = `H: ${formatTemerature(temp_max)}`;
    currentForecastElement.querySelector(".min-temp").textContent = `L: ${formatTemerature(temp_min)}`;
}

const getHourlyForecastData = async({name : city}) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIkey}&units=metric`)
    const data = await response.json();
    return data.list.map(forecast =>{
        const {main:{temp,temp_max ,temp_min}, dt , dt_txt, weather:[{description, icon}] } = forecast;
        return {temp, temp_max, temp_min, dt, dt_txt, description, icon}
    }) 
}

const loadHourlyForecast = (hourlyForecast) => {
    let dataFor12Hours = hourlyForecast.slice(1,13);
    const hourlyContainer = document.querySelector(".hourly-container");
    let innerHTMLString = ``;

    for(let {temp, icon, dt_txt} of dataFor12Hours){
        let time = dt_txt.split(" ")[1]
        innerHTMLString += `<article>
        <h2 class="time">${timeIndent(time)}</h2>
        <img class= "icon" src="${createIconUrl(icon)}"/> 
        <p class="hourly-temp">${formatTemerature(temp)}</p>
    </article>`
    }
    hourlyContainer.innerHTML = innerHTMLString;  
}

document.addEventListener("DOMContentLoaded" , async () => {
    const currentWeather = await getCurrentWeatherData();
    loadCurrentForecast(currentWeather);
    const hourlyForecast = await getHourlyForecastData(currentWeather);
    loadHourlyForecast(hourlyForecast);
    
});

// console.log(hourlyForecast);
// console.log(getCurrentWeatherData());