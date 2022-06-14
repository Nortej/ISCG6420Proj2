var gameObject;

var _TARGET_FPS = 50;
var _SCREEN_UPDATE_INTERVAL = (1 / _TARGET_FPS); 

var left_pressed = false;
var right_pressed = false;
var up_pressed = false;
var down_pressed = false;
var pause_pressed = false;

var left_key = "ArrowLeft";
var right_key = "ArrowRight";
var up_key = "ArrowUp";
var down_key = "ArrowDown";
var swing_key = "Space";
var pause_key = "Escape";

function init() {
    gameObject = new CanvasObject("canvas_area");
}

class CanvasObject {
    constructor(canvasID) {
        this.canvas = document.getElementById(canvasID);
        this.context = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.isPaused = false;

        this.initKeyEvents();
        this.initMouseEvents();
        this.pauseWindow = new PauseWindow(this.context, this.width, this.height);
        this.gameWindow = new GameWindow(canvasID, this.context, this.width, this.height);

        this.start();
    }

    initKeyEvents() {
        document.addEventListener("keydown", event => {
            if (event.code == left_key) left_pressed = true;
            else if (event.code == right_key) right_pressed = true;
            else if (event.code == up_key) up_pressed = true;
            else if (event.code == down_key) down_pressed = true;
            else if (event.code == pause_key && !pause_pressed) {
                this.isPaused = !this.isPaused;
                this.pause_pressed = true;
            }
        });
        document.addEventListener("keyup", event => {
            if (event.code == left_key) left_pressed = false;
            else if (event.code == right_key) right_pressed = false;
            else if (event.code == up_key) up_pressed = false;
            else if (event.code == down_key) down_pressed = false;
            else if (event.code == pause_key && !pause_pressed) {
                pause_pressed = false;
            }
        });
        document.addEventListener("keypress", event => {
            if (event.code == swing_key) this.gameWindow.playerObject.SwingNet();
        });
    }
    initMouseEvents() {
        this.canvas.addEventListener("mousedown", event => {
            if (this.isPaused) this.gameWindow.pauseWindow.ClickEvent(event.layerX, event.layerY);
        });
    }

    start() { setInterval(this.updateFrame.bind(this), _SCREEN_UPDATE_INTERVAL * 1000); }

    updateFrame() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.draw();
        this.updatePosition();
    }

    draw() {
        this.gameWindow.Draw();
        if (this.isPaused) this.pauseWindow.Draw();
    }

    updatePosition() {
        if (!this.isPaused) this.gameWindow.UpdatePosition();
    }
}

class BugManager {
    constructor(max_bugs_allowed, deltaTime) {
        this.max_bugs_allowed = max_bugs_allowed;
        this.deltaTime = deltaTime;
        this.timeSinceLastSpawn = deltaTime;
        
        this.bugs = [];
    }

    Draw(context) {
        this.bugs.forEach(bug => {
            bug.Draw(context);
        });
    }

    GenerateBug() {
        this.timeSinceLastSpawn += this.deltaTime;

        if (this.bugs.length < this.max_bugs_allowed && this.timeSinceLastSpawn > 1) {
            this.bugs.push(new Bug(RandomNumber(100, 600), 480, this.deltaTime));
            this.timeSinceLastSpawn = 0;
        }
    }

    UpdatePosition(playerObject) {
        for (var i = 0; i < this.bugs.length; i++) {
            var bug = this.bugs[i];
            var bugCollision = bug.CheckCollision(playerObject);
            // 0 = no collision, -1 = collision with player, 1 = colission with net
            if (bugCollision != 0) {
                this.bugs.splice(i, 1);
                i--;

                if (bugCollision == 1) {
                    gameObject.gameWindow.Score();
                } else if (bugCollision == -1) {
                    gameObject.gameWindow.Unscore();
                }
            } else {
                bug.UpdatePosition();
                if (bug.StillInBounds()) {
                    this.bugs.splice(i, 1);
                    i--;
                }
            }
        }
    }
}

class IWindow {
    constructor(context, width, height) {
        this.context = context;
        this.width = width;
        this.height = height;
    }
    Draw() {}
    Update() {}
}

class GameWindow extends IWindow {
    constructor(canvasID, context, width, height) {
        super(context, width, height);

        this.shapes = [];
        this.movingShapes = [];
        this.bugManager = new BugManager(28, _SCREEN_UPDATE_INTERVAL);
        this.score = 0;

        this.collectSound = new Sound("collect.mp3", canvasID);
        this.hitSound = new Sound("bug_hit.mp3", canvasID);

        this.createShapes();
    }

    createShapes() {
        this.playerObject = new Player(_SCREEN_UPDATE_INTERVAL);
        this.playerObject.xBound = this.width - this.playerObject.width;
        this.playerObject.yBound = this.height - this.playerObject.height - 75;

        this.playerObject.UpdatePosition = function() {
            if (left_pressed) {
                this.x -= this.xSpeed;
                this.isFlipped = false;
            }
            if (right_pressed) {
                this.x += this.xSpeed;
                this.isFlipped = true;
            }
            if (up_pressed) this.y -= this.ySpeed;
            if (down_pressed) this.y += this.ySpeed;

            if (this.x > this.xBound) this.x = this.xBound;
            else if (this.x < 0) this.x = 0;

            if (this.y > this.yBound) this.y = this.yBound;
            else if (this.y < 0) this.y = 0;

            this.UpdateOtherFeatures();
        }
        this.movingShapes.push(this.playerObject);

        this.scoreText = new CanvasText(this.width / 2, 100, "Score: 0", "30px Arial", "center", "black", "black", 0);
        this.shapes.push(this.scoreText);
    }

    Draw() {
        this.movingShapes.forEach(shape => {
            shape.Draw(this.context);
        });
        this.bugManager.Draw(this.context);
        this.shapes.forEach(shape => {
            shape.Draw(this.context);
        });
    }

    UpdatePosition() {
        this.movingShapes.forEach(shape => {
            shape.UpdatePosition();
        });
        this.bugManager.UpdatePosition(this.playerObject);
        this.bugManager.GenerateBug();
    }

    Score() {
        this.score += 1;
        this.collectSound.Play();
        this.scoreText.SetText("Score: " + this.score);
    }

    Unscore() {
        this.score -= 1;
        this.hitSound.Play();
        this.scoreText.SetText("Score: " + this.score);
    }
}

class PauseWindow extends IWindow {
    constructor(context, width, height) {
        super(context, width, height);
        this.shapes = [];

        this.createShapes();
    }

    createShapes() {
        this.shapes.push(new Rectangle(this.width / 5, -5, 3 * this.width / 5, this.height + 10, "#000000aa", "black", 5));
        this.shapes.push(new CanvasText(this.width / 2, 100, "Paused", "60px Arial", "center", "white", "black", 0));
    }

    Draw() {
        this.shapes.forEach(shape => {
            shape.Draw(this.context);
        });
    }
}