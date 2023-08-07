
//define global variables used throughout application
var cityFormEl = $('#city-form');
var cityListEl = $('#city-list');
var searchCityBtnListEl = $('#search-city-btn-list');

var cityItem = "Berea";
var cityResponse = "";

var weatherDashboardAPIKey = "33cc0670166e1f6dfa885d1ff70e5f71";

var cityCurrentWeather  = "https://api.openweathermap.org/data/2.5/weather?q=" + cityItem + "&appid=" + weatherDashboardAPIKey + "&units=imperial";

var cityGeocode = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityItem + "&appid=" + weatherDashboardAPIKey;

var lon = ""
var lat = ""

var cityForecastWeather  = "https://api.openweathermap.org/data/2.5/forecast?lat=" +  lat + "&lon=" + lon + "&appid=" + weatherDashboardAPIKey + "&units=imperial";


var storedWeatherObj = [];
var arrayOfWeatherObj = [];

var todaysDate = dayjs().format("MMM D, YYYY");


//initialize html page, used default cityItem is no saved cities
function init(){

  // dayjs object for today
  //console.log(todaysDate);

  // retrieve any stored cities 
  storedWeatherObj = JSON.parse(localStorage.getItem("arrayOfWeatherObj"));

  //for each stored city, create city button and add city to arrayOfWeatherObj
  if (storedWeatherObj !== null) {

      for (i = 0; i <= storedWeatherObj.length -1; i++){
        console.log("cityName: " + storedWeatherObj[i].cityName)
        var buttonText = "<button class='search-city-btn btn btn-secondary m-1 d-flex justify-content-center' ";
        buttonText = buttonText + "style='width: 100%; max-width: 100%;' "
        buttonText = buttonText + "data-city-btn='" + storedWeatherObj[i].cityName 
        buttonText = buttonText + "'>";
        buttonText = buttonText + storedWeatherObj[i].cityName + "</button>";
        //console.log("init: " + buttonText)
        searchCityBtnListEl.append(buttonText);

        //push save city to our arrayOfWeatherObj array
        var cityWeatherObj = {
          cityName: "",
          cityLat: "",
          citLon: ""
        }
      
      //save city to current array of searched cities
        cityWeatherObj.cityName = storedWeatherObj[i].cityName;
        cityWeatherObj.cityLat = storedWeatherObj[i].lat;
        cityWeatherObj.citLon = storedWeatherObj[i].lon;      
        arrayOfWeatherObj.push(cityWeatherObj);
        
        //set default city to load on init
        cityItem = storedWeatherObj[i].cityName;
      }
}
    // load default city
    getCity();
}

// fetch the city id'd by global variable cityItem
function getCity(){

  console.log("getCity");
  //set url to retrieve longitude and latitude of cityItem
  cityGeocode = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityItem + "&appid=" + weatherDashboardAPIKey;
  cityCurrentWeather  = "https://api.openweathermap.org/data/2.5/weather?q=" + cityItem + "&appid=" + weatherDashboardAPIKey + "&units=imperial";

  //fetch the city geocode
  fetch(cityGeocode)
  .then(function (response) {
    console.log("cityGeoCode response: " + response)
    if (response.status !== 200){
      window.alert("Bad URL fetch call: " + response.status)
      return;
    }
    return response.json();
  })
  // if successful, retrieve the lon and lat of the city, fetch the forecast weather, then the current weather
  .then(function (data) {
    console.log('getCity city geocode \n----------');
    console.log(data);
 
    if (!data || data.length == 0){
      window.alert("Bad city name! ")
        return;
    } else {
        for (i=0; i<= data.length - 1; i++){
          console.log("lon: " + data[i].lon);
          console.log("lat: " + data[i].lat);
          lon = data[i].lon;
          lat = data[i].lat;
          cityForecastWeather  = "https://api.openweathermap.org/data/2.5/forecast?lat=" +  lat + "&lon=" + lon + "&appid=" + weatherDashboardAPIKey + "&units=imperial";
          console.log("city forecast weather url " + cityForecastWeather); 
          cityItem = data[i].name;
          // Check if the city is already in the array
            const isCityInArray = arrayOfWeatherObj.some(function(weatherObj) {
              return weatherObj.cityName === cityItem;
            });
            // if wwe have stored cities, create a button for each, add to page, then store in cityWeatherObi array
            if (!isCityInArray) {

                        var buttonText = "<button class='search-city-btn btn btn-secondary m-1 d-flex justify-content-center' ";
                        buttonText = buttonText + "style='width: 100%; max-width: 100%;' "
                        buttonText = buttonText + "data-city-btn='" + cityItem 
                        buttonText = buttonText + "'>";
                        buttonText = buttonText + cityItem + "</button>";
                        console.log("getcty button " + buttonText)
                        searchCityBtnListEl.append(buttonText);
            
                      var cityWeatherObj = {
                        cityName: "",
                        cityLat: "",
                        citLon: ""
                      }
                    
            
                      //save city to local storage
                      cityWeatherObj.cityName = cityItem;
                      cityWeatherObj.cityLat = lat;
                      cityWeatherObj.citLon = lon;      
                                                    
                      arrayOfWeatherObj.push(cityWeatherObj);
                      localStorage.setItem("arrayOfWeatherObj", JSON.stringify(arrayOfWeatherObj));

            }

          //get the cityItem's current weather
          getCurrentWeather();
        }

    }
    
    
  });

}
// fetch the current city weather, update current weather section on html, then get city forecast weather
function getCurrentWeather(){
  fetch(cityCurrentWeather)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log('open  current weather map \n----------');
    console.log(data);
    
    var currentCity = $("#current-weather-city");
    var currentIcon = $("#current-weather-icon");
    var currentTemp = $("#current-weather-temp");
    var currentWind = $("#current-weather-wind");
    var currentHumid = $("#current-weather-humid");

    currentCity.text(data.name + " (" + todaysDate + ") ");
    currentIcon.attr("src", "https://openweathermap.org/img/wn/" + data.weather[0].icon +".png")
    
    currentTemp.text("Temp: " + data.main.temp + "\u00B0 F");
    currentWind.text("Wind: " + data.wind.speed + " MPH");
    currentHumid.text("Humidity: " + data.main.humidity + " %");
    //fetch the cityItem's 5 day forecast
    getForecastWeather();

  })


}
// fetch the cityItem's 5 day forecast, then update the forecast cards on the html for each forecast day
function getForecastWeather(){
  fetch(cityForecastWeather)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log('open  forecast weather map \n----------');
    console.log(data);


    var dayCount = 7;
  // for each day of forecast, create element ids, update the element id's, skip to next day
  for (i=0; i <= 4; i++){

    var foreCastDate = "#forecast-date-" + i;
    var foreCastIcon = "#forecast-icon-" + i;
    var foreCastTemp = "#forecast-temp-" + i;
    var foreCastWind = "#forecast-wind-" + i;
    var foreCastHumid = "#forecast-humid-" + i;

    var foreCastDateEl = $(foreCastDate);
    var foreCastIconEl = $(foreCastIcon);
    var foreCastTempEl = $(foreCastTemp);
    var foreCastWindEl = $(foreCastWind);
    var foreCastHumidEl = $(foreCastHumid);

    var forecastDate = dayjs(data.list[dayCount].dt_txt).format('MM-DD-YYYY'); 
  

   foreCastDateEl.text(forecastDate);
    foreCastIconEl.attr("src", "https://openweathermap.org/img/wn/" + data.list[dayCount].weather[0].icon +".png")
    //foreCastIconEl.text(data.list[dayCount].weather[0].icon);
    foreCastTempEl.text("Temp: " + data.list[dayCount].main.temp + "\u00B0 F");
    foreCastWindEl.text("Wind: " + data.list[dayCount].wind.speed + " MPH");
    foreCastHumidEl.text("Humidity: "+ data.list[dayCount].main.humidity + " %");
    
    dayCount = dayCount + 8;
    

  }

  })
  
}

// create function to handle clicking on city search history
function handleCityClick(event) {
    // convert button we pressed (`event.target`) to a to the cityItem global
    cityItem = $(event.target).attr("data-city-btn");
    console.log("cityClick: " + cityItem)
 
   // get city current and forecast weather info
    getCity();

    $('input[name="city-input"]').val("");

}

// create function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault();

  // select form element by its `name` attribute and get its value
  cityItem = $('input[name="city-input"]').val();
  console.log("cityItem: " + cityItem)

  // if there's nothing in the form entered, don't print to the page, return from function
  if (cityItem.length == 0) {
    window.alert('No city filled out on form!');
    return;
  }

// get cityIem's current and forecast weather report
  getCity();
  $('input[name="city-input"]').val("");

}

//initialize screen
init();
// Create a submit event listener on the form element
cityFormEl.on("submit", handleFormSubmit);
searchCityBtnListEl.on("click", ".search-city-btn", handleCityClick);






