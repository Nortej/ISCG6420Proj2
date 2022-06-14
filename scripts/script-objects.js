class Colour {
    constructor(r, g, b) {
        this.r = Math.round(r);
        this.g = Math.round(g);
        this.b = Math.round(b);
    }

    add(anotherColour) {
        this.r += anotherColour.r;
        if (this.r > 255) this.r = 255;
        else if (this.r < 0) this.r = 0;
        
        this.g += anotherColour.g;
        if (this.g > 255) this.g = 255;
        else if (this.g < 0) this.g = 0;

        this.b += anotherColour.b;
        if (this.b > 255) this.b = 255;
        else if (this.b < 0) this.b = 0;
    }

    toHex() {
        return "#" + this.r.toString(16).padStart(2, "0") + this.g.toString(16).padStart(2, "0") + this.b.toString(16).padStart(2, "0")
    }
}

class Sound {
    constructor(fileName, canvasID) {
        this.sound = document.createElement("audio");
        this.sound.src = "sounds/" + fileName;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";

        document.getElementById(canvasID).appendChild(this.sound);
    }

    Play() {
        this.sound.currentTime = 0;
        this.sound.play();
    }

    Pause() {
        this.sound.pause();
    }
}

// other functions
function TestPlayerBugCollision(playerX, playerY, playerWidth, playerHeight, bug) {
    var horizontal_edge = !(playerX + playerWidth < bug.x - bug.radius || playerX > bug.x + bug.radius);
    var vertical_edge = !(playerY + playerHeight < bug.y - bug.radius || playerY > bug.y + bug.radius);
    return horizontal_edge && vertical_edge;
}

function RandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}