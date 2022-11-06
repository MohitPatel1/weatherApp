const APIkey = "473fcbe90fdb1548ba72bb972c691feb";

const getCurrentWeatherData = async () => {
    const cityName = "ahmedabad";
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIkey}&units=metric`);
    return response.json()
}

const formatTemerature = (temp) => `${temp?.toFixed(1)}°`;
const createIconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`;
const timeIndent = (time) => time.slice(0,5);
const daysOfTheWeek = ["Sun", "Mon" , "Tue" , "Wed" ,"Thu" , "Fri" , "Sat"];

const getHourlyForecastData = async({name : city}) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIkey}&units=metric`)
    const data = await response.json();
    return data.list.map(forecast =>{
        const {main:{temp,temp_max ,temp_min}, dt , dt_txt, weather:[{description, icon}] } = forecast;
        return {temp, temp_max, temp_min, dt, dt_txt, description, icon}
    }) 
}

const dailyIcon = (iconFrontList) => {
    let counts = [];
    let maxCount = 0; 
    let maxCountIcon = "";
    for (word of iconFrontList){
        console.log(word);
        if(counts[word] === undefined){ 
            counts[word] = 1;  
         }else{                
            counts[word] += 1;
         }
         if(counts[word] > maxCount){ 
            maxCount = counts[word];  
            maxCountIcon = word;  
         }
    }
    return maxCountIcon + "d";
}

const loadCurrentForecast = ({name ,main:{temp, temp_max, temp_min}, weather:[{description}]}) =>{
    const currentForecastElement = document.querySelector("#current-forecast")
    currentForecastElement.querySelector(".cityName").textContent = name;
    currentForecastElement.querySelector(".temprature").textContent = formatTemerature(temp);
    currentForecastElement.querySelector(".description").textContent = description;
    currentForecastElement.querySelector(".max-temp").textContent = `H: ${formatTemerature(temp_max)}`;
    currentForecastElement.querySelector(".min-temp").textContent = `L: ${formatTemerature(temp_min)}`;
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
    // console.log(hourlyForecast);
}

const loadFiveDayForecast = (hourlyForecast) =>{
    const dayWiseForecast = new Map();
    for(let forecast of hourlyForecast){
        let [date] = forecast.dt_txt.split(" ");
        let day = daysOfTheWeek[new Date(date).getDay()];

        if(dayWiseForecast.has(day)){
            let forecastForTheDay = dayWiseForecast.get(day);
            forecastForTheDay.push(forecast);
            dayWiseForecast.set(day , forecastForTheDay);
        }
        else{
            dayWiseForecast.set(day , [forecast]);
        }
    }
 
    const fiveDayForecastElement = document.querySelector(".five-day-forecast-container");
    let innerHTMLString = ``;
    for( let [key, value] of dayWiseForecast){
        let min_temprature = Math.min(...Array.from(value , val => val.temp_min));
        let max_temprature = Math.max(...Array.from(value , val => val.temp_min));
        let iconFrontList = (Array.from(value , (val) => val.icon.slice(0,2)));
        
        innerHTMLString += `<article class="per-day-forecast-container">
                <h3 class="day-of-forecast">${key}</h3>
                <img class="icon" src="${createIconUrl(dailyIcon(iconFrontList))}">
                <p class="min-temp">${formatTemerature(min_temprature)}</p>
                <p class="max-temp">${formatTemerature(max_temprature)}</p>
            </article>`
            console.log(1);
        
            // fiveDayForecastElement.querySelector(".day-of-forecast").textContent = key ;
            // fiveDayForecastElement.querySelector(".min-temp").textContent = min_temprature ;
        // fiveDayForecastElement.querySelector(".max-temp").textContent = max_temprature ;
        // fiveDayForecastElement.querySelector(".icon").src = `${createIconUrl(dailyIcon(iconFrontList))}`;
        
    // let allMin = value.map((val) => val.temp_min);
    // let min_temprature =(Math.min(test));  gives the same result  
    }
    fiveDayForecastElement.innerHTML = innerHTMLString;
}

const loadFeelsLike = ({main:{feels_like}}) => {
    const feelsLikeElement = document.querySelector("#feels-like");
    feelsLikeElement.querySelector(".feels-like-temp").textContent = formatTemerature(feels_like);
}

const loadHumidity = ({main:{humidity}}) => {
    const humidityElement = document.querySelector("#humidity");
    humidityElement.querySelector(".humidity-value").textContent = `${humidity}%`;
}

document.addEventListener("DOMContentLoaded" , async () => {
    const currentWeather = await getCurrentWeatherData();
    loadCurrentForecast(currentWeather);
    const hourlyForecast = await getHourlyForecastData(currentWeather);
    loadHourlyForecast(hourlyForecast);
    loadFiveDayForecast(hourlyForecast);
    loadFeelsLike(currentWeather);
    loadHumidity(currentWeather);
    
});

// console.log(getCurrentWeatherData());