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

        // variables to store what state the game is in.
        this.isPaused = false;
        this.isInMenu = true;
        this.isInOptionsMenu = false;
        this.isInGameOverMenu = false;

        // sounds and volume
        this.volume = 99;
        this.collectSound = new Sound("collect.mp3", canvasID);
        this.hitSound = new Sound("bug_hit.mp3", canvasID);
        this.startSound = new Sound("start_sound.mp3", canvasID);
        this.endSound = new Sound("end_sound.mp3", canvasID);

        this.gameLength = 4;

        // mouse and keyboard events
        this._InitKeyEvents();
        this._InitMouseEvents();

        // creating the different windows
        this.startWindow = new StartWindow(this.context, this.width, this.height);
        this.pauseWindow = new PauseWindow(this.context, this.width, this.height);
        this.optionWindow = new OptionWindow(this.context, this.width, this.height);
        this.gameOverWindow = new GameOverWindow(this.context, this.width, this.height);
        this.gameWindow = new GameWindow(this.context, this.width, this.height);

        // starting the interval to update the screen every period of time
        setInterval(this._UpdateFrame.bind(this), _SCREEN_UPDATE_INTERVAL * 1000);
    }

    // creates the key press events for player movement
    _InitKeyEvents() {
        document.addEventListener("keydown", event => {
            if (event.code == left_key) left_pressed = true;
            else if (event.code == right_key) right_pressed = true;
            else if (event.code == up_key) up_pressed = true;
            else if (event.code == down_key) down_pressed = true;
            else if (event.code == pause_key && !pause_pressed) {
                if (this.isInOptionsMenu) {
                    this.isInMenu = true;
                    this.isInOptionsMenu = false;
                } else if (this.isInGameOverMenu) {
                    this.isInGameOverMenu = false;
                    this.isInMenu = true;
                }
                else this.isPaused = !this.isPaused;
                
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

    // creates the mouse events for clicking on the canvas
    _InitMouseEvents() {
        this.canvas.addEventListener("mousedown", event => {
            if (this.isInMenu) this.startWindow.ClickEvent(event.offsetX, event.offsetY);
            else if (this.isInOptionsMenu) this.optionWindow.ClickEvent(event.offsetX, event.offsetY);
            else if (this.isPaused) this.pauseWindow.ClickEvent(event.offsetX, event.offsetY);
            else if (this.isInGameOverMenu) this.gameOverWindow.ClickEvent(event.offsetX, event.offsetY);
            else this.gameWindow.ClickEvent(event.offsetX, event.offsetY);
        });
    }

    // updates the volume of all sounds
    UpdateVolume(newVolume) {
        this.volume = newVolume;
        this.collectSound.SetVolume(this.volume);
        this.hitSound.SetVolume(this.volume);
        this.startSound.SetVolume(this.volume);
        this.endSound.SetVolume(this.volume);
    }

    // updates the length of the game
    UpdateGameLength(newGameLength) {
        this.gameLength = newGameLength;
    }

    // starts the game
    StartGame() {
        this.isInMenu = false;
        this.isPaused = false;
        this.isInGameOverMenu = false;
        this.startSound.Play();
        this.gameWindow.Restart();
    }

    // updates the frame by clearing the screen and redrawing all elements
    _UpdateFrame() {
        this.context.clearRect(0, 0, this.width, this.height);
        this._Draw();
        this._UpdatePosition();
    }

    // Draws the correct screen to the window
    _Draw() {
        if (this.isInOptionsMenu) this.optionWindow.Draw();
        else if (this.isInMenu) this.startWindow.Draw();
        else {
            this.gameWindow.Draw();
            if (this.isInGameOverMenu) this.gameOverWindow.Draw();
            if (this.isPaused) this.pauseWindow.Draw();
        }
    }
    
    // Updates the position of elements on screen
    _UpdatePosition() {
        if (!this.isPaused && !this.isInMenu && !this.isInGameOverMenu && !this.isInOptionsMenu) this.gameWindow.UpdatePosition();
    }
}

class BugManager {
    constructor(max_bugs_allowed, deltaTime) {
        this.max_bugs_allowed = max_bugs_allowed;
        this.deltaTime = deltaTime;
        this.timeSinceLastSpawn = 1;
        
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

    Restart() {
        this.bugs = [];
        this.timeSinceLastSpawn = 1;
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
    constructor(context, width, height) {
        super(context, width, height);

        this.shapes = [];
        this.movingShapes = [];
        this.bugCount = 28
        this.bugManager = new BugManager(this.bugCount, _SCREEN_UPDATE_INTERVAL);
        this.score = 0;
        this.highScore = 0;
        this.time = 0;

        this.createShapes();
    }

    createShapes() {
        this.playerObject = new Player(_SCREEN_UPDATE_INTERVAL, "player", "playerFlipped");
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

        this.scoreText = new CanvasText(30, 70, "Score: 0", "20px Arial", "left", "black", "black", 0);
        this.shapes.push(this.scoreText);
        this.timeText = new CanvasText(30, 50, "Time: 0", "20px Arial", "left", "black", "black", 0);
        this.shapes.push(this.timeText);
        this.pauseButton = new Button(this.width - 50, 50, 50, 80, "||", 30, "Arial", "#000000aa", "white", 5);
        this.shapes.push(this.pauseButton); 
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

        this.UpdateTime();
    }

    ClickEvent(xCoord, yCoord) {
        if (RectContains(this.pauseButton, xCoord, yCoord)) gameObject.isPaused = true;
    }

    Score() {
        this.score += 1;
        gameObject.collectSound.Play();
        this.scoreText.SetText("Score: " + this.score);
    }

    Unscore() {
        this.score -= 1;
        gameObject.hitSound.Play();
        this.scoreText.SetText("Score: " + this.score);
    }

    UpdateTime() {
        this.time -= _SCREEN_UPDATE_INTERVAL;
        
        if (this.time > 0.1) {
            var parsedTime = parseInt(this.time);
            var minutes = Math.floor(parsedTime / 60);
            var seconds = Math.floor(parsedTime - minutes * 60);
            this.timeText.SetText("Time: " + minutes + ":" + seconds.toString().padStart(2, "0"));
        } else {
            gameObject.isInGameOverMenu = true;
            gameObject.gameOverWindow.SetScore(this.score, this.highScore);
            gameObject.endSound.Play();
            if (this.highScore < this.score) this.highScore = this.score;
        }
    }

    Restart() {
        this.scoreText.SetText("Score: 0");
        this.score = 0;
        this.time = gameObject.gameLength * 60 + 10;
        this.playerObject.Restart();
        this.bugManager.Restart();
    }
}

class StartWindow extends IWindow {
    constructor(context, width, height) {
        super(context, width, height);

        this.shapes = [];
        
        this.createShapes();
    }

    createShapes() {
        this.shapes.push(new CanvasText(this.width / 2, 100, " Bugz Catchin'", "80px Arial", "center", "white", "white", 0));
        this.shapes.push(new CanvasText(this.width / 2, 190, "Simulator", "80px Arial", "center", "white", "white", 0));
        this.startButton = new Button(this.width / 2, 300, 200, 80, "Start", 60, "Arial", "black", "white", 5);
        this.shapes.push(this.startButton);
        this.optionsButton = new Button(this.width / 2, 400, 250, 80, "Options", 60, "Arial", "black", "white", 5);
        this.shapes.push(this.optionsButton);
    }

    Draw() {
        this.shapes.forEach(shape => {
            shape.Draw(this.context);
        });
    }

    ClickEvent(xCoord, yCoord) {
        if (RectContains(this.startButton, xCoord, yCoord)) {
            gameObject.StartGame();
        } else if (RectContains(this.optionsButton, xCoord, yCoord)) {
            gameObject.isInOptionsMenu = true;
            gameObject.isInMenu = false;
        }
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
        
        this.title = new CanvasText(this.width / 2, 100, "Paused", "60px Arial", "center", "white", "black", 0);
        this.shapes.push(this.title);

        this.volumeSlider = new Slider(this.width / 2 - 50, 150, this.width / 5, 20, "yellow", "yellow", 0, "Volume: ", 100, 0, 100);
        this.shapes.push(this.volumeSlider);

        this.resumeButton = new Button(this.width / 2, this.height - 225, 250, 100, "Resume", 40, "Arial", "black", "white", "5");
        this.shapes.push(this.resumeButton);
        this.quitButton = new Button(this.width / 2, this.height - 100, 250, 100, "Quit", 40, "Arial", "black", "white", 5);
        this.shapes.push(this.quitButton);
    }

    Draw() {
        this.shapes.forEach(shape => {
            shape.Draw(this.context);
        });
    }

    ClickEvent(xCoord, yCoord) {
        if (RectContains(this.volumeSlider, xCoord, yCoord)) {
            this.volumeSlider.UpdateValue(xCoord);
            gameObject.optionWindow.volumeSlider.SetValue(this.volumeSlider.value);
            gameObject.UpdateVolume(this.volumeSlider.value);
        } else if (RectContains(this.resumeButton, xCoord, yCoord)) {
            gameObject.isPaused = false;
        } else if (RectContains(this.quitButton, xCoord, yCoord)) {
            gameObject.isPaused = false;
            gameObject.isInMenu = true;
        }
    }
}

class OptionWindow extends IWindow {
    constructor(context, width, height) {
        super(context, width, height);

        this.shapes = [];

        this.createShapes();
    }

    createShapes() {
        this.shapes.push(new Rectangle(this.width / 5, -5, 3 * this.width / 5, this.height + 10, "#000000aa", "black", 5));
        
        this.shapes.push(new CanvasText(this.width / 2, 100, "Options", "60px Arial", "center", "white", "black", 0));

        this.volumeSlider = new Slider(this.width / 2, 125, this.width / 5, 20, "yellow", "yellow", 0, "Volume: ", 100, 0, 100);
        this.shapes.push(this.volumeSlider);

        this.gameLengthSlider = new Slider(this.width / 2, 175, this.width / 5, 20, "yellow", "yellow", 0, "Game Length: ", 4, 1, 6);
        this.shapes.push(this.gameLengthSlider);

        this.backButton = new Button(50, 50, 50, 50, "<", 30, "Arial", "#000000aa", "white", 5);
        this.shapes.push(this.backButton);

        var controlsLeftX = this.width / 5 + 30;
        this.shapes.push(new CanvasText(this.width / 2, 275, "Controls", "45px Arial", "center", "white", "black", 2));
        this.shapes.push(new CanvasText(controlsLeftX + 25, 325, "   W  ", "30px Arial", "left", "white", "white", 0));
        this.shapes.push(new CanvasText(controlsLeftX + 25, 350, "A S D", "30px Arial", "left", "white", "white", 0))
        this.shapes.push(new CanvasText(2 * controlsLeftX, 332, "Mr X Movement", "30px Arial", "left", "white", "white", 0));
        this.shapes.push(new CanvasText(controlsLeftX, 400, "Spacebar", "30px Arial", "left", "white", "white", 0));
        this.shapes.push(new CanvasText(2 * controlsLeftX, 400, "Swing Net", "30px Arial", "left", "white", "white", 0));
        this.shapes.push(new CanvasText(controlsLeftX, 450, "  Escape", "30px Arial", "left", "white", "white", 0));
        this.shapes.push(new CanvasText(2 * controlsLeftX, 450, "Pause Menu", "30px Arial", "left", "white", "white", 0));
    }

    Draw() {
        this.shapes.forEach(shape => {
            shape.Draw(this.context);
        });
    }

    ClickEvent(xCoord, yCoord) {
        if (RectContains(this.volumeSlider, xCoord, yCoord)) {
            this.volumeSlider.UpdateValue(xCoord);
            gameObject.pauseWindow.volumeSlider.SetValue(this.volumeSlider.value);
            gameObject.UpdateVolume(this.volumeSlider.value);
        } else if (RectContains(this.gameLengthSlider, xCoord, yCoord)) {
            this.gameLengthSlider.UpdateValue(xCoord);
            gameObject.UpdateGameLength(this.gameLengthSlider.value);
        } else if (RectContains(this.backButton, xCoord, yCoord)) {
            gameObject.isInMenu = true;
            gameObject.isInOptionsMenu = false;
        }
    }
}

class GameOverWindow extends IWindow {
    constructor(context, width, height) {
        super(context, width, height);

        this.shapes = [];
        
        this.createShapes();
    }

    createShapes() {
        this.shapes.push(new Rectangle(this.width / 5, -5, 3 * this.width / 5, this.height + 10, "#000000aa", "black", 5));
        
        this.shapes.push(new CanvasText(this.width / 2, 100, "Game Over", "60px Arial", "center", "white", "black", 0));

        this.score = new CanvasText(this.width / 2, 150, "Score: 0", "30px Arial", "center", "white", "white", 0);
        this.shapes.push(this.score);
        this.highScore = new CanvasText(this.width / 2, 180, "High Score: 0", "30px Arial", "center", "white", "white", 0);
        this.shapes.push(this.highScore);
        this.newHighScoreText = new CanvasText(this.width / 2, 225, "New High Score!", "34px Arial", "center", "white", "white", 0);
        this.shapes.push(this.newHighScoreText);

        this.restartButton = new Button(this.width / 2, this.height - 200, 250, 100, "New Game", 40, "Arial", "black", "white", "5");
        this.shapes.push(this.restartButton);
        this.quitButton = new Button(this.width / 2, this.height - 75, 250, 100, "Quit", 40, "Arial", "black", "white", 5);
        this.shapes.push(this.quitButton);
    }

    SetScore(newScore, newHighScore) {
        this.score.SetText("Score: " + newScore);
        

        if (newHighScore < newScore) {
            this.newHighScoreText.fillColor = "white";
            this.highScore.SetText("Old High Score: " + newHighScore);
        } else {
            this.newHighScoreText.fillColor = "#00000000";
            this.highScore.SetText("High Score: " + newHighScore);
        }
    }

    Draw() {
        this.shapes.forEach(shape => {
            shape.Draw(this.context);
        });
    }
    ClickEvent(xCoord, yCoord) {
        if (RectContains(this.restartButton, xCoord, yCoord)) {
            gameObject.StartGame();
        } else if (RectContains(this.quitButton, xCoord, yCoord)) {
            gameObject.isInGameOverMenu = false;
            gameObject.isInMenu = true;
        }
    }
}