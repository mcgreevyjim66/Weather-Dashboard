var cityFormEl = $('#city-form');
var cityListEl = $('#city-list');
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
        cityListEl.append('<li class=list-group-item>' + storedWeatherObj[i].cityName + '</li>');

      }
}
}


function getWeather(){

      cityGeocode = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityItem + "&appid=" + weatherDashboardAPIKey;
     
      
      fetch(cityGeocode)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log('open  weather map city geocode \n----------');
        console.log(data);
        // TODO: Loop through the response
        for (i=0; i<= data.length - 1; i++){
          console.log("lon: " + data[i].lon);
          console.log("lat: " + data[i].lat);
          lon = data[i].lon;
          lat = data[i].lat;
          cityForecastWeather  = "https://api.openweathermap.org/data/2.5/forecast?lat=" +  lat + "&lon=" + lon + "&appid=" + weatherDashboardAPIKey + "&units=imperial";
           console.log("city forecast weather url " + cityForecastWeather);      
        }
        
        fetch(cityForecastWeather)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log('open  forecast weather map \n----------');
          console.log(data);
          cityCurrentWeather  = "http://api.openweathermap.org/data/2.5/weather?q=" + cityItem + "&appid=" + weatherDashboardAPIKey + "&units=imperial";


          fetch(cityCurrentWeather)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            console.log('open  current weather map \n----------');
            console.log(data);
  
          })

        })
      });



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
    
    var currentTemp = $("#current-weather-temp");
    //var currentTemp = document.getElementById("#current-weather-temp")
    currentTemp.textContent = data.main.temp;


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

}

//initialize screen
init();
// Create a submit event listener on the form element
cityFormEl.on('submit', handleFormSubmit);






