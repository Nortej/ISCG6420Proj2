var outResponse;
var maxDays = 4;
var dateSelectionNode, timeSelectionNode;

function onPageLoad() {
    var currentDate = new Date();

    // setting the date so that it represents the dates of all available boat trips
    currentDate.setHours(currentDate.getHours() + 1);
    currentDate.setMinutes(0);

    // testing if it is after the boat operating hours
    if (currentDate.getHours() >= 14) {
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(10);
        currentDate.setMinutes(0);
        maxDays++;
    }

    // getting the end date of booking trips
    var endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 3, 14, 0, 0, 1);
    
    // setting the min/max values of the date picker
    var dateField = document.getElementById("trip-date");
    dateField.min = currentDate.toLocaleDateString("en-CA");
    dateField.max = endDate.toLocaleDateString("en-CA");

    // creating a request to the api
    // var request = new XMLHttpRequest()
    // request.open('GET', 'https://api.openweathermap.org/data/2.5/onecall?lat=36.8509&lon=174.7645&exclude=current,minutely&units=metric&appid=45f2d50e94b2d080f51f04b56560cb33', true);    
    // request.onload = function () {
    //     // setting the response data to a variable
    //     outResponse = JSON.parse(this.response)
    
    //     // tests if the request was successful
    //     if (request.status >= 200 && request.status < 400) {
    //         handleOutput(currentDate, endDate);
    //     } else {
    //         console.log("Failed to get data!");
    //         console.log(request);
    //     }
    // }
    
    // // sends the request
    // request.send();

    //
    timeSelectionNode = document.getElementById("trip-time-count");
    dateSelectionNode = document.getElementById("trip-date");
    
    dateSelectionNode.addEventListener("change", event => {
        console.log(dateSelectionNode.value);
    });
}

function handleOutput(currentDate, endDate) {
    var currentDay = maxDays - 4;

    while (currentDate < endDate) {
        var dayOutput = outResponse.daily[currentDay];

        var temperature = dayOutput.temp.day;
        var isRaining = false;
        var dailyWeather = dayOutput.weather;
        dailyWeather.forEach(weatherState => {
            if (weatherState.main != "Clouds" || weatherState.main != "Clear") {
                isRaining = true;
                return;
            } else if (weatherState.id == 804) {
                isRaining = true;
                return;
            }
        });

        currentDate.setDate(currentDate.getDate() + 1);
        currentDay++;
    }
}