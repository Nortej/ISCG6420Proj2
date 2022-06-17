var hoverElementStatusField, hoverElementCostField, hoverElementLocationField, remainingSeatsField;
var seatCountError, seatTakenError;
var currentlySelectedSeats = {seat_count: 0, max_seat_count: 10};
var letterMap = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];

/*layout of boats:
    0=no seat
    1=available
    2=booked

boat_layouts are predefined with all seats as "available" as they do not change.
The booked seats are then dynamically added from the xml file instead. 
This makes the site load faster as less data is being pulled from external files.
*/
var nui_boat_layout, tere_boat_layout;

function loadBoatLayout(fileName) {
    var specific_layout = [];
    var xmlobject;

    if(window.XMLHttpRequest) xmlobject = new XMLHttpRequest();
    else xmlobject = new ActiveXObject("Microsoft.XMLHTTP");

    xmlobject.open("GET", "/xml/" + fileName, false);
    xmlobject.send();

    var boatResponse = xmlobject.responseXML;
    var boat_data = boatResponse.getElementsByTagName("boat")[0].children;

    for (var index = 0; index < boat_data.length; index++) {
        var row_array = [];
        var seats = boat_data[index].children;
        for (var secondIndex = 0; secondIndex < seats.length; secondIndex++) {
            var item = parseInt(seats[secondIndex].innerHTML);
            row_array.push(item);
        }
        specific_layout.push(row_array);
    }

    return specific_layout;
}

//boat booked seats xml stuff
function boatXML(){
    var xmlhttp;
    //getting xml for tere-boat
    if(window.XMLHttpRequest){
        xmlhttp = new XMLHttpRequest();
    }
    else{
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    //get tere boat xml
    xmlhttp.open("GET", "/xml/tere-boat-booked.xml", false);
    xmlhttp.send();
    XMLDoc = xmlhttp.responseXML;
    var tere_booked = XMLDoc.getElementsByTagName("booked-seat");
    addBookedSeats(tere_booked, tere_boat_layout);

    //get nui boat xml
    xmlhttp.open("GET", "/xml/nui-boat-booked.xml", false);
    xmlhttp.send();
    XMLDoc = xmlhttp.responseXML;
    var nui_booked = XMLDoc.getElementsByTagName("booked-seat");
    addBookedSeats(nui_booked, nui_boat_layout);
}

//adds the booked seats from xml to boat layouts
function addBookedSeats(booked_seats, booked_boat_layout){
    var SRow = 0;
    var SCol = 0;

    //adding booked info to the tere-boat layout
    for (var i=0; i<booked_seats.length; i++){
        SRow = parseInt(booked_seats[i].getElementsByTagName("row")[0].childNodes[0].nodeValue);
        SCol = parseInt(booked_seats[i].getElementsByTagName("col")[0].childNodes[0].nodeValue);
        var times = booked_seats[i].getElementsByTagName("booked-times");
        if (times.length == 0) booked_boat_layout[SRow][SCol] = 2;
        else {
            var timesBooked = times[0].children;
            var booked_times = {1: {}, 2: {}, 3: {}, 4: {}};

            for (var timeSelected = 0; timeSelected < timesBooked.length; timeSelected++) {
                var currentXMLTime = timesBooked[timeSelected];
                var indexedDate = parseInt(currentXMLTime.getAttribute("dayIndex"));
                var indexedTime = parseInt(currentXMLTime.innerHTML);
                booked_times[indexedDate][indexedTime] = true;
            }

            booked_boat_layout[SRow][SCol] = new Seat(SRow + 1, SCol + 1, booked_times);
        }
    }
}

class Seat {
    constructor(row, column, booked_times) {
        this.row = row;
        this.column = column;

        if (row <= 2) this.price = 30;
        else if (row <= 5) this.price = 25;
        else this.price = 20;

        this.fancy_name = letterMap[this.row - 1] + (this.column);

        this.booked_times = booked_times;
    }
}

function seatSelectionInit() {
    hoverElementStatusField = document.getElementById("hover_status");
    hoverElementCostField = document.getElementById("hover_cost");
    hoverElementLocationField = document.getElementById("hover_location");
    remainingSeatsField = document.getElementById("remaining_seats");
    seatTakenError = document.getElementById("already_booked_seat");
    seatCountError = document.getElementById("max_booked_seat");

    var tere_existing_tables = document.getElementById("tere_table");
    var nui_existing_tables = document.getElementById("nui_table");

    nui_boat_layout = loadBoatLayout("nui-boat-layout.xml");
    tere_boat_layout = loadBoatLayout("tere-boat-layout.xml");

    boatXML();

    var hours = [10, 11, 12, 1, 2];
    tere_boat_layout_objects = createFromXML(tere_boat_layout);
    for (var dayIndex = 1; dayIndex <= 4; dayIndex++) {
        hours.forEach(hour => {
            var tere_table = document.createElement("table");
            tere_table.setAttribute("id", "tere_table_" + dayIndex + "_" + hour);
            tere_table.classList.add("seat-table");
            createBoatLayout(tere_boat_layout_objects, tere_table, dayIndex, hour);
            tere_existing_tables.appendChild(tere_table);
        })
    }

    nui_boat_layout_objects = createFromXML(nui_boat_layout);
    for (var dayIndex = 1; dayIndex <= 4; dayIndex++) {
        hours.forEach(hour => {
            var nui_table = document.createElement("table");
            nui_table.setAttribute("id", "nui_table_" + dayIndex + "_" + hour);
            nui_table.classList.add("seat-table");
            createBoatLayout(nui_boat_layout_objects, nui_table, dayIndex, hour);
            nui_existing_tables.appendChild(nui_table);
        })
    }

    // adding the event to show the information about the selected seat
    document.querySelectorAll(".booked_seat, .empty_seat").forEach(selectedSeat => {
        selectedSeat.addEventListener('mouseover', event => {
            setHoveredContent(selectedSeat);
        });
    });

    // adding the event to select a specific seat for booking
    document.querySelectorAll(".empty_seat").forEach(buttonObject => {
        buttonObject.addEventListener("click", emptySeatEventHandler);
    });

    // displays that the seat has already been booked by someone
    document.querySelectorAll(".booked_seat").forEach(buttonObject => {
        buttonObject.addEventListener("click", event => {
            seatTakenError.classList.remove("display_animation");
            seatTakenError.offsetWidth;
            seatTakenError.classList.add("display_animation");
        });
    });
}

// sets the side details to the hovered content
function setHoveredContent(selectedSeat) {
    var row = parseInt(selectedSeat.getAttribute("row"));
    var column = parseInt(selectedSeat.getAttribute("column"));
    var seat = selected_boat_layout[row - 1][column - 1];
    
    if (seat.booked_times[currentSelectedDay][currentSelectedHour]) {
        hoverElementStatusField.innerHTML = "Booked";
    } else {
        hoverElementStatusField.innerHTML = "Available";
    }

    hoverElementCostField.innerHTML = seat.price;
    hoverElementLocationField.innerHTML = letterMap[row - 1] + column;
}

// function to create the seat objects from html most likely a temporary method
function createFromXML(selected_boat) {
    var boat_layout =[];
    for (var row = 0; row < selected_boat.length; row++) {
        var row_data = [];
        for (var col = 0; col < 9; col++) {
            var current_seat;
            if (!Number.isInteger(selected_boat[row][col])) current_seat = selected_boat[row][col];
            else {
                if (selected_boat[row][col] == 0) current_seat = new Seat(row + 1, col + 1, undefined);
                else current_seat = new Seat(row + 1, col + 1, {1: {}, 2: {}, 3: {}, 4: {}});
            }
            row_data.push(current_seat);
        }
        boat_layout.push(row_data);
    }
    return boat_layout;
}

function emptySeatEventHandler(event) {
    var buttonObject = event.currentTarget;
    var id = buttonObject.id;

    var seatRow = parseInt(buttonObject.getAttribute("row")) - 1;
    var seatColumn = parseInt(buttonObject.getAttribute("column")) - 1;

    var data = {row: seatRow, col: seatColumn, cost: selected_boat_layout[seatRow][seatColumn].price};
    // testing if the user has already selected the seat
    if (currentlySelectedSeats[id] == undefined) {
        // testing that the user can select another seat
        if (currentlySelectedSeats.seat_count + 1 <= currentlySelectedSeats.max_seat_count) {
            currentlySelectedSeats[id] = data;
            currentlySelectedSeats.seat_count++;
            buttonObject.classList.toggle("selected_seat");

            // updating the count within the element
            remainingSeatsField.innerHTML = currentlySelectedSeats.max_seat_count - currentlySelectedSeats.seat_count;
            seatTakenError.classList.remove("display_animation");
            seatCountError.classList.remove("display_animation");
        } else {
            // display error
            seatCountError.classList.remove("display_animation");
            seatCountError.offsetWidth;
            seatCountError.classList.add("display_animation");
        }
    } else {
        delete currentlySelectedSeats[id];
        currentlySelectedSeats.seat_count--;
        buttonObject.classList.toggle("selected_seat");
        remainingSeatsField.innerHTML = currentlySelectedSeats.max_seat_count - currentlySelectedSeats.seat_count;
        seatCountError.classList.remove("display_animation");
        seatTakenError.classList.remove("display_animation");
    }
}

// function to create the boat structure with html dynamically
function createBoatLayout(boatStructure, table, dayIndex, hour) {
    var no_seat = document.createElement("td");
    no_seat.classList.add("seat");

    // creates an empty seat which can be cloned
    var empty_seat = no_seat.cloneNode(true);
    var empty_seat_button = document.createElement("button");
    empty_seat_button.classList.add("empty_seat");
    empty_seat.appendChild(empty_seat_button);

    // creates a booked seat which can be cloned
    var booked_seat = no_seat.cloneNode(true);
    var booked_seat_button = document.createElement("button");
    booked_seat_button.classList.add("booked_seat");
    booked_seat.appendChild(booked_seat_button);
    
    // for each seat in the boat structure, create a seat element
    boatStructure.forEach(row => {
        var tableRow = document.createElement("tr");
        row.forEach(cell => {
            var table_cell;
            if (cell.booked_times == undefined) table_cell = no_seat.cloneNode(true);
            else {
                if (cell.booked_times[dayIndex][hour] != undefined) table_cell = booked_seat.cloneNode(true);
                else table_cell = empty_seat.cloneNode(true);

                var childButton = table_cell.childNodes[0];
                childButton.setAttribute("row", cell.row);
                childButton.setAttribute("column", cell.column);
                childButton.innerHTML = cell.fancy_name;
                childButton.id = letterMap[cell.row - 1] + cell.column;
            }
            
            tableRow.appendChild(table_cell);
        })
        table.appendChild(tableRow);
    });
}

function setSelectedSeatsTo(newStatus) {
    currentlySelectedSeats = {seat_count: 0, max_seat_count: 0};
    
    if (newStatus == "Booked") {
        document.querySelectorAll(".selected_seat").forEach(seat => {
            var row = parseInt(seat.getAttribute("row")) - 1;
            var col = parseInt(seat.getAttribute("column")) - 1;
            selected_boat_layout[row][col].status = "Booked";
            seat.classList.remove("selected_seat");
            seat.classList.remove("empty_seat");
            seat.classList.add("booked_seat");

            seat.removeEventListener("click", emptySeatEventHandler);
            seat.addEventListener("click", event => {
                seatTakenError.classList.remove("display_animation");
                seatTakenError.offsetWidth;
                seatTakenError.classList.add("display_animation");
            });
        });
    } else if (newStatus == "Clear") {
        document.querySelectorAll(".selected_seat").forEach(seat => {
            seat.classList.remove("selected_seat");
        });
    }
}