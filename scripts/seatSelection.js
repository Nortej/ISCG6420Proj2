var hoverElementStatusField, hoverElementCostField, hoverElementLocationField, remainingSeatsField;
var seatCountError, seatTakenError;
var currentlySelectedSeats = {seat_count: 0, max_seat_count: 10};
var letterMap = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];

var tere_boat_layout = [[0, 1, 1, 1, 0, 1, 1, 1, 0],
                     [0, 1, 1, 1, 0, 1, 1, 1, 0], 
                     [1, 1, 2, 1, 0, 1, 1, 1, 1],
                     [1, 1, 2, 1, 0, 1, 1, 1, 1],
                     [1, 1, 1, 1, 0, 1, 1, 1, 1],
                     [1, 1, 1, 1, 0, 1, 1, 1, 1],
                     [1, 1, 1, 1, 0, 1, 1, 1, 1],
                     [1, 1, 1, 1, 0, 1, 1, 1, 1],
                     [0, 1, 1, 1, 0, 1, 1, 1, 0]
                    ];

var nui_boat_layout = [[0, 0, 1, 1, 0, 1, 1, 0, 0],
                        [0, 0, 1, 1, 0, 1, 1, 0, 0],
                        [0, 1, 1, 1, 0, 1, 1, 1, 0],
                        [0, 2, 2, 2, 0, 1, 1, 2, 0],
                        [1, 1, 1, 1, 0, 1, 1, 2, 1],
                        [2, 1, 2, 2, 0, 1, 1, 2, 1],
                        [2, 1, 1, 1, 0, 2, 2, 2, 2],
                        [2, 1, 1, 1, 0, 1, 1, 1, 1],
                        [1, 1, 1, 1, 0, 1, 1, 1, 1],
                        [2, 2, 1, 1, 0, 1, 1, 1, 1],
                        [1, 1, 1, 1, 0, 1, 1, 1, 1],
                        [0, 1, 1, 1, 0, 1, 1, 1, 0],
                        [0, 1, 1, 1, 0, 1, 1, 1, 0]
                    ];

var boat_layout = [];

/*
XML FORMAT
boat name="boat-name"
    seat row="1", column="1"
        status - booked, not booked
        bookedto - who booked the seat
*/


class Seat {
    constructor(row, column, status, booked_to) {
        this.row = row;
        this.column = column;

        if (row <= 2) this.price = 30;
        else if (row <= 5) this.price = 25;
        else this.price = 20;

        this.status = status;
        this.booked_to = booked_to;
    }
}

function seatSelectionInit() {
    hoverElementStatusField = document.getElementById("hover_status");
    hoverElementCostField = document.getElementById("hover_cost");
    hoverElementLocationField = document.getElementById("hover_location");
    remainingSeatsField = document.getElementById("remaining_seats");
    seatTakenError = document.getElementById("already_booked_seat");
    seatCountError = document.getElementById("max_booked_seat");

    var table_tere = document.getElementById("tere_table");
    var table_nui = document.getElementById("nui_table");

    tere_boat_layout_objects = createFromXML(tere_boat_layout);
    createBoatLayout(tere_boat_layout_objects, table_tere);
    nui_boat_layout_objects = createFromXML(nui_boat_layout);
    createBoatLayout(nui_boat_layout_objects, table_nui);

    // adding the event to show the information about the selected seat
    document.querySelectorAll(".booked_seat, .empty_seat").forEach(selectedSeat => {
        selectedSeat.addEventListener('mouseover', event => {
            setHoveredContent(selectedSeat);
        });
    });

    // adding the event to select a specific seat for booking
    document.querySelectorAll(".empty_seat").forEach(buttonObject => {
        buttonObject.addEventListener("click", event => {
            var id = buttonObject.id;
            // testing if the user has already selected the seat
            if (currentlySelectedSeats[id] == undefined) {
                // testing that the user can select another seat
                if (currentlySelectedSeats.seat_count + 1 <= currentlySelectedSeats.max_seat_count) {
                    currentlySelectedSeats[id] = 1;
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
        });
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
    hoverElementStatusField.innerHTML = seat.status;
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
            if (selected_boat[row][col] == 0) current_seat = new Seat(row + 1, col + 1, "null", "null");
            else if (selected_boat[row][col] == 2) current_seat = new Seat(row + 1, col + 1, "Booked", "null");
            else current_seat = new Seat(row + 1, col + 1, "Available", "null");
            row_data.push(current_seat);
        }
        boat_layout.push(row_data);
    }
    return boat_layout;
}

// function to create the boat structure with html dynamically
function createBoatLayout(boatStructure, table) {
    var no_seat = document.createElement("td");
    no_seat.classList.add("seat");

    // creates an empty seat which can be cloned
    var empty_seat = no_seat.cloneNode(true);
    var empty_seat_button = document.createElement("button");
    empty_seat_button.classList.add("empty_seat");
    empty_seat_button.innerHTML = "!";
    empty_seat.appendChild(empty_seat_button);

    // creates a booked seat which can be cloned
    var booked_seat = no_seat.cloneNode(true);
    var booked_seat_button = document.createElement("button");
    booked_seat_button.classList.add("booked_seat");
    booked_seat_button.innerHTML = "-";
    booked_seat.appendChild(booked_seat_button);
    
    // for each seat in the boat structure, create a seat element
    boatStructure.forEach(row => {
        var tableRow = document.createElement("tr");
        row.forEach(cell => {
            var table_cell;
            if (cell.status == 'null') table_cell = no_seat.cloneNode(true);
            else {
                if (cell.status == 'Booked') table_cell = booked_seat.cloneNode(true);
                else table_cell = empty_seat.cloneNode(true);

                var childButton = table_cell.childNodes[0];
                childButton.setAttribute("row", cell.row);
                childButton.setAttribute("column", cell.column);
                childButton.id = letterMap[cell.row - 1] + cell.column;
            }
            
            tableRow.appendChild(table_cell);
        })
        table.appendChild(tableRow);
    });
}