function getInputs(){
    //page1
    document.getElementById("DtName").innerHTML = (document.getElementById("fName").value + ' ' + document.getElementById("lName").value);
    document.getElementById("DtEmail").innerHTML = document.getElementById("email").value;
    document.getElementById("DtNumber").innerHTML = document.getElementById("contactNumber").value;
    if (document.getElementById("selected-boat").value == "tere"){
        document.getElementById("DtBoat").innerHTML = "Tere Boat";
    } else{document.getElementById("DtBoat").innerHTML = "Nui Boat";}
    
    document.getElementById("DtDate").innerHTML = document.getElementById("trip-date").value;
    
}