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

class CanvasImage extends Shape {
    constructor(x, y, imageID) {
        super(x, y, 0, 0, 0);

        this.imageElement = document.getElementById(imageID);
        this.width = this.imageElement.width;
        this.height = this.imageElement.height;
    }

    Draw(context) {
        context.drawImage(this.imageElement, this.x, this.y, this.width, this.height);
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
    constructor(x, y, width, height, fillColor, strokeColor, borderWidth, sliderDescription, defaultValue, minValue, maxValue) {
        super(x, y, width, height, fillColor, strokeColor, borderWidth);
        this.box = new Rectangle(x, y, 10, height, "black", "black", 0);
        this.description = new CanvasText(x - sliderDescription.length, y + height, sliderDescription, "30px Arial", "right", "white", "#00000000", 0);
        this.text = new CanvasText(x + width + 20, y + height, defaultValue, "30px Arial", "left", "white", "#00000000", 0);

        this.minValue = minValue;
        this.maxValue = maxValue - 1;
        this.value = defaultValue;

        this._UpdatePosition();
    }

    Draw(context) {
        super.Draw(context);
        this.box.Draw(context);
        this.text.Draw(context);
        this.description.Draw(context);
    }

    UpdateValue(xCoord) {
        this.box.x = xCoord;
        if (this.box.x < this.x) this.box.x = this.x;
        else if (this.box.x + this.box.width > this.x + this.width) this.box.x = this.x + this.width - this.box.width;

        this._UpdateSliderValue();
        this._UpdatePosition();
    }

    SetValue(newValue) {
        this.value = newValue;
        this.text.SetText(this.value);
        this._UpdatePosition();
    }

    _UpdateSliderValue() {
        this.value = ((this.box.x - this.x) / (this.width - this.box.width)) * this.maxValue + this.minValue;
        this.value = parseInt(this.value);
        this.text.SetText(this.value);
    }

    _UpdatePosition() {
        this.box.x = ((this.value - this.minValue) * (this.width - this.box.width)) / (this.maxValue) + this.x;
    }
}

class Button extends Rectangle {
    constructor(x, y, width, height, text, fontSize, font, fillColor, strokeColor, borderWidth) {
        super(x - width / 2, y - height / 2, width, height, fillColor, strokeColor, borderWidth);

        this.text = new CanvasText(x, this.y + this.height / 2 + fontSize / 3, text, fontSize + "px " + font, "center", "white", "white", 0);
    }

    Draw(context) {
        super.Draw(context);
        this.text.Draw(context);
    }
}

class Bug extends Arc {
    constructor(x, y, deltaTime) {
        super(x, y, 0, 0, 0, Math.PI * 2, false, "yellow", "#00000000", 3);
        this._ghost_x = x;
        this._ghost_y = y;

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
    }

    UpdatePosition() {
        this.timeAlive += this.deltaTime;

        if (this.timeAlive <= 1) this.radius += 4 * this.deltaTime;
        else if (this.timeAlive <= 2) {}
        else if (this.timeAlive <= 5) {
            // changing colour and growing
            this.currentColour.add(this.colourStep);
            this.radius += this.sizeStep;
            this.fillColor = this.currentColour.toHex();
        } else if (this.timeAlive <= 9) {
            // idly moving around in the spot
            this._IdleMovement();
        } else if (this.timeAlive <= 15) {
            this._IdleMovement();
            this._ghost_y -= this.y_velocity;
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

class Player extends CanvasImage {
    constructor(screenUpdatePeriod, imageID, flippedImageID) {
        super(20, 20, imageID);
        this.flipped = document.getElementById(flippedImageID);
        this.normal = document.getElementById(imageID);

        this.deltaTime = screenUpdatePeriod;

        this.xSpeed = 500 * screenUpdatePeriod;
        this.ySpeed = 500 * screenUpdatePeriod;

        this.isFlipped = true;

        this.net = new CanvasImage(0, -5, "playerNet");
        this.net.rightOffset = this.width + this.xSpeed / 2;
        this.net.leftOffset = -(this.net.rightOffset + this.width) + this.xSpeed;
        this.net.yOffset = this.height / 2 - this.net.height / 2;

        this.tail = new CanvasImage(this.x, this.y, "playerTail");
        this.tail.normal = document.getElementById("playerTail");
        this.tail.flipped = document.getElementById("playerTailFlipped");
        this.tail.leftOffset = -this.tail.width + this.width / 2;
        this.tail.rightOffset = this.width / 2;
        this.tail.yOffset = this.height / 2 - this.tail.height / 2;

        this.catchNet = new Rectangle(this.x, this.y, this.net.width - this.width / 2, this.net.height * 2, "blue", "blue", 0);
        this.catchNet.rightOffset = this.catchNet.width + this.xSpeed / 2;
        this.catchNet.leftOffset = -(this.catchNet.width + this.xSpeed / 2);
        this.catchNet.yOffset = this.height / 2 - this.catchNet.height / 2;

        this.leftEye = new Arc(this.x + 2 * this.width / 5, this.y, 2, 0, 0, Math.PI * 2, false, "black", "black", 0);
        this.leftEye.leftOffset = 2 * this.width / 5;
        this.leftEye.rightOffset = this.width - this.leftEye.leftOffset;
        this.leftEye.yOffset = this.height / 3 - 2;

        this.rightEye = new Arc(this.x + 2 * this.width / 5, this.y, 2, 0, 0, Math.PI * 2, false, "black", "black", 0);
        this.rightEye.leftOffset = 7 * this.width / 10;
        this.rightEye.rightOffset = this.width - this.rightEye.leftOffset;
        this.rightEye.yOffset = this.height / 3 - 7;

        this.timeSinceLastSwing = 3.1;
        this.baseNetRotation = Math.PI / 4;
        this.netRotation = -this.baseNetRotation;

        this.CanCatchBugs = false;
    }

    Draw(context) {
        if (!this.isFlipped) {
            this.imageElement = this.flipped;
            this.tail.imageElement = this.tail.flipped;
            this.tail.Draw(context);
            super.Draw(context);
        } else {
            this.imageElement = this.normal;
            this.tail.imageElement = this.tail.normal;
            this.tail.Draw(context);
            super.Draw(context);
        }

        this.leftEye.Draw(context);
        this.rightEye.Draw(context);

        var contextXOffset = this.x + this.width / 2;
        var contextYOffset = this.y + this.height / 1.4;
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

        if (this.isFlipped) {
            this.tail.x = this.x + this.tail.leftOffset;
            this.catchNet.x = this.x + this.catchNet.rightOffset;
            this.leftEye.x = this.x + this.leftEye.leftOffset + this.netRotation * 2;
            this.rightEye.x = this.x + this.rightEye.leftOffset + this.netRotation * 2;
        }
        else {
            this.tail.x = this.x + this.tail.rightOffset;
            this.catchNet.x = this.x + this.catchNet.leftOffset;
            this.leftEye.x = this.x + this.leftEye.rightOffset + this.netRotation * 2;
            this.rightEye.x = this.x + this.rightEye.rightOffset + this.netRotation * 2;
        }
        this.tail.y = this.y + this.tail.yOffset;
        this.catchNet.y = this.y + this.catchNet.yOffset;
        this.leftEye.y = this.y + this.leftEye.yOffset;
        this.rightEye.y = this.y + this.rightEye.yOffset;
    }


    SwingNet() {
        if (this.timeSinceLastSwing >= 1) this.timeSinceLastSwing = 0;
    }

    Restart() {
        this.x = 20;
        this.y = 20;
        this.isFlipped = false;

        this.timeSinceLastSwing = 3.1;
        this.netRotation = -this.baseNetRotation;

        this.CanCatchBugs = false;
    }
}