var currentPageIndex = 0;
var windowElements, numberOfWindows;

function init() {
    windowElements = document.querySelectorAll(".window");
    numberOfWindows = windowElements.length;

    setVisibility(windowElements[0], true);
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

    setVisibility(windowElements[currentPageIndex], false);
    currentPageIndex++;
    setVisibility(windowElements[currentPageIndex], true);
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