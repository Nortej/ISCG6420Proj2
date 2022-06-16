function getInputs(){
    //page1 booking info
    document.getElementById("DtName").innerHTML = (document.getElementById("fName").value + ' ' + document.getElementById("lName").value);
    document.getElementById("DtEmail").innerHTML = document.getElementById("email").value;
    document.getElementById("DtNumber").innerHTML = document.getElementById("contactNumber").value;
    if (document.getElementById("selected-boat").value == "tere"){
        document.getElementById("DtBoat").innerHTML = "Tere Boat";
    } else{document.getElementById("DtBoat").innerHTML = "Nui Boat";}
    document.getElementById("DtPeopleCount").innerHTML = document.getElementById("seat-count").value;
    document.getElementById("DtDateTime").innerHTML = document.getElementById("trip-time-count").value + ':00, ' + document.getElementById("trip-date").value;
    
    //page2 seats
    //loop to display seat numbers
    var selected_seats = Object.keys(currentlySelectedSeats);
    for(i=2; i< selected_seats.length; i++){
        document.getElementById("DtSeats").innerHTML = ""; //set to nothing in case user goes back
        document.getElementById("DtSeats").innerHTML += selected_seats[i];
        if (i != (selected_seats.length -1) ){
            document.getElementById("DtSeats").innerHTML += ", ";
        }
    }

    //loop to get price of each seat
    var seatCost = 0;
    for(i=2; i<selected_seats.length; i++){
        var seatA = selected_seats[i];
        var seatRow = parseInt(currentlySelectedSeats[seatA].row);
        var seatCol = parseInt(currentlySelectedSeats[seatA].col);
        var seat = selected_boat_layout[seatRow][seatCol];
        seatCost += parseFloat(seat.price);
        document.getElementById("DtSeatCost").innerHTML = "$" + seatCost;
    }

    //page3 menu
    var menuTable = document.getElementsByTagName("table")[2];
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
    var stringSeatCost = document.getElementById("DtSeatCost").innerHTML;
    var stringFoodCost = document.getElementById("finalMenuTotal").innerHTML;
    document.getElementById("DtTotalCost").innerHTML = 
    '$' + (parseFloat(stringSeatCost.substring(1, stringSeatCost.length)) + parseFloat(stringFoodCost.substring(1, stringFoodCost.length)));
}

//this checks if the inputs on page 1 are filled out
function validatePage1(){
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
function validatePage2(){
    var valid = true;
    var selected_seats = Object.keys(currentlySelectedSeats);
    if (!(selected_seats.length -2 == currentlySelectedSeats.max_seat_count)){
        valid = false;
    }
    return valid;
}

function clearInputs(){
    //clear page 1
    var inputFields = document.querySelectorAll("#fName, #lName, #email, #contactNumber, #seat-count, #trip-date, #trip-time-count");
    for(var i = 0; i < inputFields.length; i++){
        inputFields[i].value = '';
    }

    //clear seats

    //clear menu
    var menuTable = document.getElementsByTagName("table")[2];
    for(var i =0; i<menuTable.rows.length; i++){
        document.getElementById("sliderValue" + i).innerHTML = "0";
        document.getElementById("slider" + i).value = 0;
    }
}