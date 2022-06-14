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

    //page3 menu
    var table = document.getElementsByTagName("table")[0];
    var newTable = document.getElementById('menuConfirm');
    for(i = 0; i < table.rows.length; i++){
        var row = newTable.insertRow(i);
        var nameCell = row.insertCell(0);
        var quantityCell = row.insertCell(1);

        nameCell.innerHTML = table.rows[i].cells[1].innerHTML;
        quantityCell.innerHTML = document.getElementById("sliderValue" + i).innerHTML;
        document.getElementById("finalMenuTotal").innerHTML = document.getElementById("menuTotal").innerHTML;
    }
}