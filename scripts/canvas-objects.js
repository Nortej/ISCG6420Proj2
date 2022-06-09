class Shape {
    constructor(x, y, fillColor, strokeColor, borderWidth) {
        this.x = x;
        this.y = y;
        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.borderWidth = borderWidth;
    }

    Draw() {}
    UpdatePosition() {}
    Move(x, y) {
        this.x += x;
        this.y += y;
    }
    Teleport(x, y) {
        this.x = x;
        this.y = y;
    }

    _SetProperties(context) {
        context.fillStyle = this.fillColor;
        context.strokeStyle = this.strokeColor;
        context.lineWidth = this.borderWidth;
        context.beginPath();
    }

    _Display(context) {
        context.fill();
        context.stroke();
        context.closePath();
    } 
}

class Rectangle extends Shape {
    constructor(x, y, width, height, fillColor, strokeColor, borderWidth) {
        super(x, y, fillColor, strokeColor, borderWidth);
        this.width = width;
        this.height = height;
    }

    Draw(context) {
        this._SetProperties(context);
        context.rect(this.x, this.y, this.width, this.height);
        this._Display(context)
    }
}

class Ellipse extends Shape {
    constructor(x, y, xRadius, yRadius, rotation, startAngle, endAngle, isCounterClockwise, fillColor, strokeColor, borderWidth) {
        super(x, y, fillColor, strokeColor, borderWidth);
        this.xRadius = xRadius;
        this.yRadius = yRadius;
        this.rotation = rotation;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.isCounterClockwise = isCounterClockwise;
    }

    Draw(context) {
        this._SetProperties(context);
        context.ellipse(this.x, this.y, this.xRadius, this.yRadius, this.rotation, this.startAngle, this.endAngle, this.isCounterClockwise);
        this._Display(context);
    }
}

class CanvasText extends Shape {
    constructor(x, y, text, font, textAlign,  fillColor, strokeColor, borderWidth) {
        super(x, y, fillColor, strokeColor, borderWidth);
        this.text = text;
        this.font = font;
        this.textAlign = textAlign;
    }

    SetText(newText) {
        this.text = newText;
    }

    _SetProperties(context) {
        super._SetProperties(context);
        context.font = this.font;
        context.textAlign = this.textAlign;
    }

    Draw(context) {
        this._SetProperties(context);
        context.fillText(this.text, this.x, this.y);
        this._Display(context);
    }
}

class Arc extends Shape {
    constructor(x, y, radius, rotation, startAngle, endAngle, isCounterClockwise, fillColor, strokeColor, borderWidth) {
        super(x, y, fillColor, strokeColor, borderWidth);
        this.radius = radius;
        this.rotation = rotation;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.isCounterClockwise = isCounterClockwise;
    }

    Draw(context) {
        this._SetProperties(context);
        context.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.isCounterClockwise);
        this._Display(context);
    }
}

class Bug extends Arc {
    constructor(x, y, deltaTime) {
        super(x, y, 0, 0, 0, Math.PI * 2, false, "yellow", "#00000000", 3);
        this._ghost_x = x;
        this._ghost_y = y;

        // 50 seems good
        this.y_velocity = 100 * deltaTime;

        this._x_multiplier = 2 * Math.PI / 2;
        this._y_multiplier = 4 * Math.PI / 2;

        this.deltaTime = deltaTime;
        this.timeAlive = 0;

        // current rgb values for the bug
        this.targetColour = new Colour(255, 0, 0);
        this.currentColour = new Colour(255, 255, 0);
        this.colourStep = new Colour((this.targetColour.r - this.currentColour.r) / (deltaTime * 6000), 
                                     (this.targetColour.g - this.currentColour.g) / (deltaTime * 6000), 
                                     (this.targetColour.b - this.currentColour.b) / (deltaTime * 6000));
        this.sizeStep = (15 - this.radius) / (deltaTime * 6000);


        // debug stuff
        // this.radius = 20;
        // this.timeAlive = 9;
    }

    UpdatePosition() {
        this.timeAlive += this.deltaTime;

        if (this.timeAlive <= 1) this.radius += 4 * this.deltaTime;
        else if (this.timeAlive <= 2) {}
        else if (this.timeAlive <= 5) {
            // changing colour and growing
            // console.log("changing colour and growing");
            this.currentColour.add(this.colourStep);
            this.radius += this.sizeStep;
            this.fillColor = this.currentColour.toHex();
        } else if (this.timeAlive <= 9) {
            // idly moving around in the spot
            this._IdleMovement();
        } else if (this.timeAlive <= 15) {
            this._IdleMovement();
            this._ghost_y -= this.y_velocity;
            // console.log("flying pretty good");
        } else {
            console.log("guess ill die");
        }
    }

    StillInBounds() {
        return this._ghost_y + 2 * this.radius <= 0;
    }

    CheckCollision(playerObject) {
        if (TestPlayerBugCollision(playerObject.x, playerObject.y, playerObject.width, playerObject.height, this))
            return -1;
        else if (TestPlayerBugCollision(playerObject.net.x, playerObject.net.y, playerObject.net.width, playerObject.net.height, this))
            return 1;
        return 0;
    }

    _IdleMovement() {
        this.x = this._ghost_x + 20 * Math.sin((this.timeAlive - 5) * this._x_multiplier);
        this.y = this._ghost_y + 5 * Math.sin((this.timeAlive - 5) * this._y_multiplier);
    }
}

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

class Player extends Rectangle {
    constructor(screenUpdatePeriod) {
        super(20, 20, 50, 50, "red", "red", 5);

        this.deltaTime = screenUpdatePeriod;

        this.xSpeed = 500 * screenUpdatePeriod;
        this.ySpeed = 500 * screenUpdatePeriod;

        this.isFlipped = true;

        this.net = new Rectangle(this.x, this.y, 90, 10, "yellow", "yellow", 0);
        this.net.rightOffset = this.width + this.xSpeed / 2;
        this.net.leftOffset = - (this.net.rightOffset + this.width) + this.xSpeed;
        this.net.yOffset = this.height / 2 - this.net.height / 2;

        this.timeSinceLastSwing = 0;
    }

    Draw(context) {
        super.Draw(context);
        if (this.isFlipped) this.net.xOffset = this.net.rightOffset;
        else this.net.xOffset = this.net.leftOffset;

        this.net.Draw(context);
    }

    UpdateOtherFeatures() {
        this.net.x = this.x + this.net.xOffset;
        this.net.y = this.y + this.net.yOffset;

        this.timeSinceLastSwing += this.deltaTime;
    }

    SwingNet() {
        console.log(this.timeSinceLastSwing);
        if (this.timeSinceLastSwing >= 2) {
            console.log("swong");
            this.timeSinceLastSwing = 0;
        }
    }
}

// other functions
function TestPlayerBugCollision(playerX, playerY, playerWidth, playerHeight, bug) {
    var horizontal_edge = !(playerX + playerWidth < bug.x - bug.radius || playerX > bug.x + bug.radius);
    var vertical_edge = !(playerY + playerHeight < bug.y - bug.radius || playerY > bug.y + bug.radius);
    return horizontal_edge && vertical_edge;
}