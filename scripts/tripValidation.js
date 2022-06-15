function getInputs(){
    //page1 booking info
    document.getElementById("DtName").innerHTML = (document.getElementById("fName").value + ' ' + document.getElementById("lName").value);
    document.getElementById("DtEmail").innerHTML = document.getElementById("email").value;
    document.getElementById("DtNumber").innerHTML = document.getElementById("contactNumber").value;
    if (document.getElementById("selected-boat").value == "tere"){
        document.getElementById("DtBoat").innerHTML = "Tere Boat";
    } else{document.getElementById("DtBoat").innerHTML = "Nui Boat";}
    
    document.getElementById("DtDateTime").innerHTML = document.getElementById("trip-time-count").value + ':00, ' + document.getElementById("trip-date").value;
    
    //page2 seats
    var selected_seats = Object.keys(currentlySelectedSeats);
    for(i=2; i< selected_seats.length; i++){
        document.getElementById("DtSeats").innerHTML += selected_seats[i];
        if (i != (selected_seats.length -1) ){
            document.getElementById("DtSeats").innerHTML += ", ";
        }
    }

    //page3 menu
    var menuTable = document.getElementsByTagName("table")[2];
    var confirmTable = document.getElementById('menuConfirm');
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
}