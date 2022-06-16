var currentPageIndex = 0;
var windowElements, numberOfWindows;

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
}

// moves forward to the next page
function goForwards() {
    if (currentPageIndex >= numberOfWindows - 1) return;
    //doesn't let user continue if page 1 inputs are incomplete//
    if (currentPageIndex == 0){
        if (!validatePage1()) {
            alert("The inputs are incomplete!");
            return;
        }
    }
    //doesn't let user continue if too few seats are selected//
    if (currentPageIndex==1){
        if(!validatePage2()){
            alert("You must select enough seats for those on the trip!");
            return;
        }
    }
    
    setVisibility(windowElements[currentPageIndex], false);
    currentPageIndex++;
    setVisibility(windowElements[currentPageIndex], true);

    //sets the displayed boat layout to the selected boat
    if(currentPageIndex == 1){
        var boat_selection = document.getElementById("selected-boat").value;
        if(boat_selection == 'tere'){
            selected_boat_layout = tere_boat_layout_objects;
            document.getElementById("tere_table").style.display = "block";
            document.getElementById("nui_table").style.display = "none";
        }
        else if (boat_selection == 'nui'){
            selected_boat_layout = nui_boat_layout_objects;
            document.getElementById("nui_table").style.display = "block";
            document.getElementById("tere_table").style.display = "none";
        }
        //sets the max seats selectable to that of the seat-count input
        currentlySelectedSeats.max_seat_count = parseInt(document.getElementById("seat-count").value);
    }
    //gets inputs of all pages for confirmation
    if(currentPageIndex == 3){
        getInputs();
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