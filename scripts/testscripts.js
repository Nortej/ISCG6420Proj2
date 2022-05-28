var hoverElement;
var one = [[0, 1, 1, 1, 0, 1, 1, 1, 0],
                     [0, 1, 1, 1, 0, 1, 1, 1, 0], 
                     [1, 1, 1, 1, 0, 1, 1, 1, 1],
                     [1, 1, 1, 1, 0, 1, 1, 1, 1],
                     [1, 1, 1, 1, 0, 1, 1, 1, 1],
                     [1, 1, 1, 1, 0, 1, 1, 1, 1],
                     [1, 1, 1, 1, 0, 1, 1, 1, 1],
                     [1, 1, 1, 1, 0, 1, 1, 1, 1],
                     [0, 1, 1, 1, 0, 1, 1, 1, 0]
                    ];

var two = [[0, 0, 1, 1, 0, 1, 1, 0, 0],
                      [0, 0, 1, 1, 0, 1, 1, 0, 0],
                      [0, 1, 1, 1, 0, 1, 1, 1, 0],
                      [1, 1, 1, 1, 0, 1, 1, 1, 1],
                      [1, 1, 1, 1, 0, 1, 1, 1, 1],
                      [1, 1, 1, 1, 0, 1, 1, 1, 1],
                      [1, 1, 1, 1, 0, 1, 1, 1, 1],
                      [1, 1, 1, 1, 0, 1, 1, 1, 1],
                      [1, 1, 1, 1, 0, 1, 1, 1, 1],
                      [1, 1, 1, 1, 0, 1, 1, 1, 1],
                      [0, 1, 1, 1, 0, 1, 1, 1, 0],
                      [0, 1, 1, 1, 0, 1, 1, 1, 0]];

var table;

function init() {
    hoverElement = document.getElementById("hover_element");
    table = document.getElementById("table_thing");

    // createBoatLayout(one);
    // createBoatLayout(two);

    // document.addEventListener('mousemove', event => {
    //     hoverElement.style.left = event.x + "px";
    //     hoverElement.style.top = event.y + "px";
    // })
}

function createBoatLayout(boatStructure) {
    var blankCell = document.createElement("td");
    blankCell.innerHTML = "0";
    var filledCell = document.createElement("td");
    filledCell.innerHTML = "1";

    boatStructure.forEach(row => {
        var tableRow = document.createElement("tr");
        row.forEach(cell => {
            if (cell == 1) tableRow.appendChild(filledCell.cloneNode(true))
            else tableRow.appendChild(blankCell.cloneNode(true));
        })
        table.appendChild(tableRow);
    });
}