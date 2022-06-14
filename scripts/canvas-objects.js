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

class Slider extends Rectangle {
    constructor(x, y, width, height, fillColor, strokeColor, borderWidth) {
        super(x, y, width, height, fillColor, strokeColor, borderWidth);
        this.box = new Rectangle(x, y, 10, 10, "black", "black", 0);
    }

    Draw(context) {
        super.Draw(context);
        this.box.Draw(context);
    }

    UpdateValue(event) {
        console.log(event);
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
        }
    }

    StillInBounds() {
        return this._ghost_y + 2 * this.radius <= 0;
    }

    CheckCollision(playerObject) {
        if (playerObject.CanCatchBugs) {
            if (TestPlayerBugCollision(playerObject.catchNet.x, playerObject.catchNet.y, playerObject.catchNet.width, playerObject.catchNet.height, this))
                return 1;
        }
        else if (TestPlayerBugCollision(playerObject.x, playerObject.y, playerObject.width, playerObject.height, this))
            return -1;
        return 0;
    }

    _IdleMovement() {
        this.x = this._ghost_x + 20 * Math.sin((this.timeAlive - 5) * this._x_multiplier);
        this.y = this._ghost_y + 5 * Math.sin((this.timeAlive - 5) * this._y_multiplier);
    }
}

class Player extends Rectangle {
    constructor(screenUpdatePeriod) {
        super(20, 20, 50, 50, "red", "red", 5);

        this.deltaTime = screenUpdatePeriod;

        this.xSpeed = 500 * screenUpdatePeriod;
        this.ySpeed = 500 * screenUpdatePeriod;

        this.isFlipped = true;

        this.net = new Rectangle(0, -5, 100, 10, "yellow", "yellow", 0);
        this.net.rightOffset = this.width + this.xSpeed / 2;
        this.net.leftOffset = - (this.net.rightOffset + this.width) + this.xSpeed;
        this.net.yOffset = this.height / 2 - this.net.height / 2;

        this.catchNet = new Rectangle(this.x, this.y, this.net.width - 30, this.net.height, "blue", "blue", 0);
        this.catchNet.rightOffset = this.width + this.xSpeed / 2;
        this.catchNet.leftOffset = -(this.catchNet.width + this.xSpeed / 2);
        this.catchNet.yOffset = this.height / 2 - this.catchNet.height / 2;

        this.timeSinceLastSwing = 3.1;
        this.baseNetRotation = Math.PI / 4;
        this.netRotation = -this.baseNetRotation;

        this.CanCatchBugs = false;
    }

    Draw(context) {
        super.Draw(context);
  
        var contextXOffset = this.x + this.width / 2;
        var contextYOffset = this.y + this.height / 2;
        context.translate(contextXOffset, contextYOffset);
        context.rotate(this.netRotation);

        if (!this.isFlipped) {
            context.scale(-1, 1);
            this.net.Draw(context);
            context.scale(-1, 1);
        }  else {
            this.net.Draw(context);
        }
        context.rotate(-this.netRotation);
        context.translate(-contextXOffset, -contextYOffset);
    }

    UpdateOtherFeatures() {
        if (this.timeSinceLastSwing <= 0.785) {
            this.netRotation = (this.baseNetRotation - 0.2) * Math.cos(8 * this.timeSinceLastSwing) + 0.2;

            if (this.netRotation < 0.3) this.CanCatchBugs = true;
            else this.CanCatchBugs = false;

            if (this.isFlipped) this.netRotation = -this.netRotation;
        } else {
            this.netRotation = this.baseNetRotation;
            if (this.isFlipped) this.netRotation = -this.netRotation;
        }
        this.timeSinceLastSwing += this.deltaTime;

        if (this.isFlipped) this.catchNet.x = this.x + this.catchNet.rightOffset;
        else this.catchNet.x = this.x + this.catchNet.leftOffset;
        this.catchNet.y = this.y + this.catchNet.yOffset;
    }


    SwingNet() {
        if (this.timeSinceLastSwing >= 1) this.timeSinceLastSwing = 0;
    }
}