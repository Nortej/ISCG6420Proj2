var currentPageIndex = 0;
var windowElements, numberOfWindows;
var currentSelectedHour, currentSelectedDay;

function init() {
    windowElements = document.querySelectorAll(".window");
    numberOfWindows = windowElements.length;

    setVisibility(windowElements[currentPageIndex], true);
}

// returns to the previous page
function goBack() {
    if (currentPageIndex <= 0) return;

    setVisibility(windowElements[currentPageIndex], false);
    currentPageIndex--;
    setVisibility(windowElements[currentPageIndex], true);

    if (currentPageIndex != 3){document.getElementById("forward").innerHTML = "Forwards"}
    if (currentPageIndex == 0) {
        setSelectedSeatsTo("Clear");
        document.querySelectorAll(".table-visible").forEach(element => {
            element.classList.remove("table-visible");
        });
    }
}

// moves forward to the next page
function goForwards() {
    if (currentPageIndex != 3){document.getElementById("forward").innerHTML = "Forwards"}
    //doesn't let user continue if page 1 inputs are incomplete
    if (currentPageIndex == 0){
        if (!validatePage1()) {
            alert("The inputs are incomplete!");
            return;
        }
    }
    //doesn't let user continue if too few seats are selected
    if (currentPageIndex==1){
        if(!validatePage2()){
            alert("You must select enough seats for those on the trip!");
            return;
        }
    }

    //display booked message and send user back to page1
    if(currentPageIndex == 3){
        clearInputs();
        alert("You have successfully booked! Payment is required on site before you board.");
        //sends user to page one
        document.getElementById("forward").innerHTML = "Forwards"
        setVisibility(windowElements[currentPageIndex], false);
        currentPageIndex = 0;
        setVisibility(windowElements[currentPageIndex], true);
        return;
    }
    
    setVisibility(windowElements[currentPageIndex], false);
    currentPageIndex++;
    setVisibility(windowElements[currentPageIndex], true);

    //sets the displayed boat layout to the selected boat
    if(currentPageIndex == 1){
        var boat_selection = document.getElementById("selected-boat").value;
        var date_selection = document.getElementById("trip-date");
       
        var timeBetween = new Date(date_selection.value) - new Date(date_selection.min);
        timeBetween /= (1000 * 60 * 60 * 24);
        var time_selection = document.getElementById("trip-time-count").value;
        currentSelectedDay = timeBetween;
        currentSelectedHour = time_selection;

        if(boat_selection == 'tere'){
            selected_boat_layout = tere_boat_layout_objects;
            document.getElementById("tere_table").style.display = "block";
            document.getElementById("tere_table_" + timeBetween + "_" + time_selection).classList.add("table-visible");
            document.getElementById("nui_table").style.display = "none";
        }
        else if (boat_selection == 'nui'){
            selected_boat_layout = nui_boat_layout_objects;
            document.getElementById("nui_table").style.display = "block";
            document.getElementById("nui_table_" + timeBetween + "_" + time_selection).classList.add("table-visible");
            document.getElementById("tere_table").style.display = "none";
        }
        //sets the max seats selectable to that of the seat-count input
        currentlySelectedSeats.max_seat_count = parseInt(document.getElementById("seat-count").value);
    }
    //gets inputs of all pages for confirmation
    if(currentPageIndex == 3){
        getInputs();
        document.getElementById("forward").innerHTML = "Submit";
    }
}

// sets the visibility of the element provided to being visible or invisible
function setVisibility(window, visibility) {
    if (visibility) {
        window.classList.remove("hidden");
        window.classList.add("visible");
    } else {
        window.classList.remove("visible");
        window.classList.add("hidden");
    }
}