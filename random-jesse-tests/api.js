var outResponse;

function loadData() {
    var request = new XMLHttpRequest()

    request.open('GET', 'https://api.weatherapi.com/v1/forecast.json?key=8343b55b2d784e9a97271629222505&q=Auckland&days=4&aqi=no&alerts=no', true);
    // request.open('GET', 'https://ghibliapi.herokuapp.com/films', true)
    request.onload = function () {
      outResponse = JSON.parse(this.response)
    
      if (request.status >= 200 && request.status < 400) {
          handleOutput();
      } else {
          console.log("Failed to get data!");
          console.log(request);
      }
    }
    
    request.send()
}

function handleOutput() {
    for (var day = 0; day < 3; day++) {
        var dayForcast = outResponse.forecast.forecastday[day];
        console.log(`---- DATA FOR ${dayForcast.date}----`)
        for (var hour = 10; hour <= 14; hour++) {
            var temp = dayForcast.hour[hour].temp_c;
            var will_rain = dayForcast.hour[hour].will_it_rain;
            console.log("=======");
            if (temp < 16) console.log("not advised to go out on this day as it is too cold");
            if (will_rain == 1) console.log("not advised to go out on this day as it may rain");
            console.log(`Displaying data for ${dayForcast.hour[hour].time}\nThe temperature on this day will be: ${temp}\nIt is predicted to ${will_rain}`);
        }
        
    }
}

// test code
//https://www.taniarascia.com/how-to-connect-to-an-api-with-javascript/
//https://www.weatherapi.com/api-explorer.aspx#forecast