var cityFormEl = $('#city-form');
var cityListEl = $('#city-list');
var searchCityBtnListEl = $('#search-city-btn-list');
var cityItem = "";
var cityResponse = "";

var weatherDashboardAPIKey = "33cc0670166e1f6dfa885d1ff70e5f71";

var cityCurrentWeather  = "http://api.openweathermap.org/data/2.5/weather?q=" + cityItem + "&appid=" + weatherDashboardAPIKey + "&units=imperial";

var cityGeocode = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityItem + "&appid=" + weatherDashboardAPIKey;

var lon = ""
var lat = ""

var cityForecastWeather  = "https://api.openweathermap.org/data/2.5/forecast?lat=" +  lat + "&lon=" + lon + "&appid=" + weatherDashboardAPIKey + "&units=imperial";


var storedWeatherObj = [];
var arrayOfWeatherObj = [];



function init(){

  // retrieve any stored cities 
  storedWeatherObj = JSON.parse(localStorage.getItem("arrayOfWeatherObj"));

  //for each stored city, add item to 
  
  if (storedWeatherObj !== null) {

      for (i = 0; i <= storedWeatherObj.length -1; i++){
        console.log("cityName: " + storedWeatherObj[i].cityName)
        var buttontext = "<button class='search-cty-btn btn btn-info m-0 d-flex justify-content-center' style='width: 100%; max-width: 100%;'>" + storedWeatherObj[i].cityName + "</button>";
        console.log(buttontext)
        //searchCityBtnListEl.append("<li>" + storedWeatherObj[i].cityName + "</li>");
        //searchCityBtnListEl.appendChild("<button class='search-cty-btn btn btn-info m-0 d-flex justify-content-center' style='width: 100%; max-width: 100%;'>" + storedWeatherObj[i].cityName + "</button>");
        // searchCityBtnListEl.append('<li class=list-group-item>' + storedWeatherObj[i].cityName + '</li>');

        const buttonElement = $("<button>Add City</button>");
   
        searchCityBtnListEl.append(buttonElement);




      }
}
}


function getCity(){

  console.log("getCity");
  cityGeocode = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityItem + "&appid=" + weatherDashboardAPIKey;
  cityCurrentWeather  = "http://api.openweathermap.org/data/2.5/weather?q=" + cityItem + "&appid=" + weatherDashboardAPIKey + "&units=imperial";

  fetch(cityGeocode)
  .then(function (response) {
    console.log("cityGeoCode response: " + response)
    if (response.status !== 200){
      window.alert("Bad URL fetch call: " + response.status)
      return;
    }
    return response.json();
  })
  .then(function (data) {
    console.log('getCity city geocode \n----------');
    console.log(data);
    // TODO: Loop through the 
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
          //cityResponse = "good" 
          //return  "good";
            // <li class="list-group-item">An item</li>
          cityListEl.append('<li class=list-group-item>' + cityItem + '</li>');

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
          getCurrentWeather();
        }

    }
    
    
  });

}

function getCurrentWeather(){
  fetch(cityCurrentWeather)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log('open  current weather map \n----------');
    console.log(data);
    
    var currentH3 = $("#current-weather-h3");
    var currentIcon = $("#current-weather-icon");
    var currentTemp = $("#current-weather-temp");
    var currentWind = $("#current-weather-wind");
    var currentHumid = $("#current-weather-humid");

    
    //const iconURL = `https://openweathermap.org/img/wn/${weather.icon}.png`;


    //var currentTemp = document.getElementById("#current-weather-temp")
    //currentTemp.text(data.main.temp);
    currentH3.text(cityItem);
    //var iconAttr = "src="https://openweathermap.org/img/wn/" + iconURL + ".png" alt="Weather icon">
    currentIcon.attr("src", "https://openweathermap.org/img/wn/" + data.weather[0].icon +".png")
    
    currentTemp.text("Temp: " + data.main.temp + " F");
    currentWind.text("Wind: " + data.wind.speed + " MPH");
    currentHumid.text("Humidity: " + data.main.humidity + " %");

    getForecastWeather();

  })


}

function getForecastWeather(){
  fetch(cityForecastWeather)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log('open  forecast weather map \n----------');
    console.log(data);


    var dayCount = 7;
    //var currentCard = 0;
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


    foreCastDateEl.text(data.list[dayCount].dt_txt);
    foreCastIconEl.attr("src", "https://openweathermap.org/img/wn/" + data.list[dayCount].weather[0].icon +".png")
    //foreCastIconEl.text(data.list[dayCount].weather[0].icon);
    foreCastTempEl.text("Temp: " + data.list[dayCount].main.temp + " F");
    foreCastWindEl.text("Wind: " + data.list[dayCount].wind.speed + " MPH");
    foreCastHumidEl.text("Humidity: "+ data.list[dayCount].main.humidity + " %");
    
    dayCount = dayCount + 8;
    

  }

  })
  
}


// create function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault();

  // select form element by its `name` attribute and get its value
  cityItem = $('input[name="city-input"]').val();
  console.log("cityItem: " + cityItem)

  // if there's nothing in the form entered, don't print to the page
  if (cityItem.length == 0) {
    window.alert('No city filled out on form!');
    return;
  }


  getCity();
  $('input[name="city-input"]').val("");

}

//initialize screen
init();
// Create a submit event listener on the form element
cityFormEl.on('submit', handleFormSubmit);






