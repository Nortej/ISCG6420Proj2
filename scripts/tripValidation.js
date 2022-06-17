function getInputs() {
    //page1 booking info
    document.getElementById("DtName").innerHTML = (document.getElementById("fName").value + ' ' + document.getElementById("lName").value);
    document.getElementById("DtEmail").innerHTML = document.getElementById("email").value;
    document.getElementById("DtNumber").innerHTML = document.getElementById("contactNumber").value;
    if (document.getElementById("selected-boat").value == "tere"){
        document.getElementById("DtBoat").innerHTML = "Tere Boat";
    } else{document.getElementById("DtBoat").innerHTML = "Nui Boat";}
    document.getElementById("DtPeopleCount").innerHTML = document.getElementById("seat-count").value;
    var time = document.getElementById("trip-time-count").value;
    if (time == '1' || time == '2' || time == '12'){
        document.getElementById("DtDateTime").innerHTML = time + 'pm, ' + document.getElementById("trip-date").value;
    }
    else{document.getElementById("DtDateTime").innerHTML = time + 'am, ' + document.getElementById("trip-date").value;}
    //document.getElementById("DtDateTime").innerHTML = document.getElementById("trip-time-count").value + ':00, ' + document.getElementById("trip-date").value;
    
    //page2 seats
    //loop to display seat numbers
    var selected_seats = Object.keys(currentlySelectedSeats);
    var seatCosts = 0;
    document.getElementById("DtSeats").innerHTML = ""; //set to nothing in case user goes back
    selected_seats.forEach(seat => {
        if (seat != "seat_count" && seat != "max_seat_count") {
            currentSeat = currentlySelectedSeats[seat];
            document.getElementById("DtSeats").innerHTML += seat + " ";
            seatCosts += currentSeat.cost;
        }
    });

    document.getElementById("DtSeatCost").innerHTML = seatCosts;

    //page3 menu
    var menuTable = document.getElementById("menu");
    var confirmTable = document.getElementById('menuConfirm');
    if (confirmTable.rows.length == 6){
        //delete any previous table rows in case user goes back
        for(i = 0; i < 6; i++){
            confirmTable.deleteRow(0);
        }
    }
    //add table rows from menuTable
    for(i = 0; i < menuTable.rows.length; i++){
        var row = confirmTable.insertRow(i);
        var nameCell = row.insertCell(0);
        var quantityCell = row.insertCell(1);

        //inserts values from menu table into menuConfirm table
        nameCell.innerHTML = menuTable.rows[i].cells[1].innerHTML;
        quantityCell.innerHTML = document.getElementById("sliderValue" + i).innerHTML;
        //takes calculated menu total value and applies it to the confirmation page
        document.getElementById("finalMenuTotal").innerHTML = document.getElementById("menuTotal").innerHTML;
    }

    //total cost
    var stringFoodCost = document.getElementById("finalMenuTotal").innerHTML;
    var totalBookingCost = seatCosts + parseFloat(stringFoodCost.substring(1, stringFoodCost.length));
    document.getElementById("DtTotalCost").innerHTML = totalBookingCost;
}

//this checks if the inputs on page 1 are filled out
function validatePage1() {
    var y, i, valid = true;
    y = windowElements[currentPageIndex].querySelectorAll("select, input");
    for(i=0; i<y.length; i++){
        y[i].classList.remove("invalid");
        if(y[i].value==''){
            y[i].classList.add("invalid");
            valid = false;
        }
    }
    return valid;
}
//this checks that the inputs of page 2 are filled out
function validatePage2() {
    var valid = true;
    var selected_seats = Object.keys(currentlySelectedSeats);
    if (!(selected_seats.length -2 == currentlySelectedSeats.max_seat_count)){
        valid = false;
    }
    return valid;
}

//this clears all user-made inputs from each window
function clearInputs() {
    //clear page 1
    var inputFields = document.querySelectorAll("#fName, #lName, #email, #contactNumber, #seat-count, #trip-date, #trip-time-count");
    for(var i = 0; i < inputFields.length; i++){
        inputFields[i].value = '';
    }

    //clear seats - saved locally and refreshed on browser reset
    setSelectedSeatsTo("Booked");

    // setting the weather to not be visible
    document.getElementById("weather").style.display = "none";

    //clear menu
    var menuTable = document.getElementById("menu");
    for(var i =0; i<menuTable.rows.length; i++){
        document.getElementById("sliderValue" + i).innerHTML = "0";
        document.getElementById("slider" + i).value = 0;
    }
    document.getElementById("menuTotal").innerHTML = "$0";
}