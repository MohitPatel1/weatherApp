const APIkey = "473fcbe90fdb1548ba72bb972c691feb";

// getting json via APIs

const getCitiesUsingGeoLocation = async(searchText) =>{
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${searchText}&limit=5&appid=${APIkey}`);
    return response.json();
}

const getCurrentWeatherData = async ({lat = 23.0216238 , lon = 72.5797068, name : cityName}) => {
    const url = (lat && lon) ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIkey}&units=metric`;
    const response = await fetch(url);
    return response.json();
}

const getHourlyForecastData = async({name : city}) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIkey}&units=metric`);
    const data = await response.json();
    return data.list.map(forecast =>{
        const {main:{temp,temp_max ,temp_min}, dt , dt_txt, weather:[{description, icon}] } = forecast;
        return {temp, temp_max, temp_min, dt, dt_txt, description, icon}
    }) 
}

// search functions

let selectedCityText;
let selectedCity = "ahmedabad";

function debounce(func) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this,args)
        } ,300)
    }
} 

const onSearchChange = async (event) => {
    let { value } = event.target;
    if(!value){
        selectedCityText = null;
        selectedCity = "";
    }
    let option = ""
    if(value && (selectedCityText !== value)){
        let listOfCities = await getCitiesUsingGeoLocation(value);
        console.log(listOfCities);
        let options = ""
        for (let {lat , lon , name , state , country} of listOfCities){
            options += `<option data-city-details='${JSON.stringify({lat , lon , name})}' value="${name}, ${state}, ${country}"></option>`
        }
        document.querySelector("#cities").innerHTML = options;
    }
}

const debounceSearch = debounce((event) => onSearchChange(event)); // delay = 300 ms

const handleCitySelection = (event) => {
    selectedCityText = event.target.value ;
    let options = document.querySelectorAll("#cities > option");
    if (options?.length) {
        let selectedOption = Array.from(options).find(opt => opt.value === selectedCityText);
        selectedCity = JSON.parse(selectedOption.getAttribute("data-city-details"));
    }
    loadData();
};

// function definations 

const formatTemerature = (temp) => `${temp?.toFixed(1)}°`;
const createIconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`;
const daysOfTheWeek = ["Sun", "Mon" , "Tue" , "Wed" ,"Thu" , "Fri" , "Sat"];
const dailyIcon = (iconFrontList) => {
    let counts = [];
    let maxCount = 0; 
    let maxCountIcon = "";
    for (word of iconFrontList){
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

// loading content 

const loadData = async() => {
    const currentWeather = await getCurrentWeatherData(selectedCity);
    loadCurrentForecast(currentWeather);
    const hourlyForecast = await getHourlyForecastData(currentWeather);
    loadHourlyForecast(currentWeather, hourlyForecast);
    loadFiveDayForecast(hourlyForecast);
    loadFeelsLike(currentWeather);
    loadHumidity(currentWeather);
}

// const loadForecastUsingGeoLocation = () => {
//     navigator.geolocation.getCurrentPosition(({coords}) => {
//         const {latitude : lat , longitude : lon} = coords;
//         selectedCity = {lat , lon};
//         loadData();
//     } , error => console.log(error))
// }

const loadCurrentForecast = ({name ,main:{temp, temp_max, temp_min}, weather:[{description}]}) =>{
    const currentForecastElement = document.querySelector("#current-forecast")
    currentForecastElement.querySelector(".cityName").textContent = name;
    currentForecastElement.querySelector(".temprature").textContent = formatTemerature(temp);
    currentForecastElement.querySelector(".description").textContent = description;
    currentForecastElement.querySelector(".max-temp").textContent = `H: ${formatTemerature(temp_max)}`;
    currentForecastElement.querySelector(".min-temp").textContent = `L: ${formatTemerature(temp_min)}`;
}

const loadHourlyForecast = ({main:{temp : tempNow} , weather:[{icon : iconNow}]}, hourlyForecast) => {
    let dataFor12Hours = hourlyForecast.slice(2,14);
    const hourlyContainer = document.querySelector(".hourly-container");
    const timeFormater = Intl.DateTimeFormat("en", {
        hour12:true , hour: "numeric"
    })
    let innerHTMLString = `<article>
    <h3 class="time">Now</h3>
    <img class= "icon" src="${createIconUrl(iconNow)}"/> 
    <p class="hourly-temp">${formatTemerature(tempNow)}</p>
    </article>`;
    
    for(let {temp, icon, dt_txt} of dataFor12Hours){
        innerHTMLString += `<article>
        <h3 class="time">${timeFormater.format(new Date(dt_txt))}</h3>
        <img class= "icon" src="${createIconUrl(icon)}"/> 
        <p class="hourly-temp">${formatTemerature(temp)}</p>
        </article>`
    }
    hourlyContainer.innerHTML = innerHTMLString;
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
    let index = 0;
    for( let [key, value] of dayWiseForecast){
        if (index == 0) key = "Today";
        if (index > 4) break ;
        let min_temprature = Math.min(...Array.from(value , val => val.temp_min));
        let max_temprature = Math.max(...Array.from(value , val => val.temp_min));
        let iconFrontList = (Array.from(value , (val) => val.icon.slice(0,2)));
        
        innerHTMLString += `<article class="per-day-forecast-container">
                <h3 class="day-of-forecast">${key}</h3>
                <img class="icon" src="${createIconUrl(dailyIcon(iconFrontList))}">
                <p class="min-temp">${formatTemerature(min_temprature)}</p>
                <p class="max-temp">${formatTemerature(max_temprature)}</p>
            </article>`
        index += 1;
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

// DOM content loaded

document.addEventListener("DOMContentLoaded" , async () => {
    getCurrentWeatherData(23.0216238 , 72.5797068);
    loadData();

    const searchInput = document.querySelector("#search");
    searchInput.addEventListener("input", debounceSearch);
    searchInput.addEventListener("change", handleCitySelection);
    // loadForecastUsingGeoLocation();
});