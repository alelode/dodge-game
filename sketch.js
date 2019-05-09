let generation = 1;
let players = [];
let totalPopulation = 200;

let bestPlayer;
let tiles = [];
let activePlayers = [];
let allPlayers = [];

let counter = 0;

let widthSlider;
let widthSpan;
let speedSlider;
let speedSpan;
let levelSlider;
let levelSpan;
let highScoreSpan;
let allTimeHighScoreSpan;
let generationSpan;
let highScore = 0;

let runBest = false;
let runBestButton;
let level = 1;
let tileSpace = 300;

function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent('canvascontainer');

    // Access the interface elements
    speedSlider = select('#speedSlider');
    widthSlider = select('#widthSlider');
    widthSpan = select('#width');
    levelSlider = select('#levelSlider');
    levelSpan = select('#level');
    speedSpan = select('#speed');
    highScoreSpan = select('#hs');
    allTimeHighScoreSpan = select('#ahs');
    generationSpan = select('#gen');
    runBestButton = select('#best');
    runBestButton.mousePressed(toggleState);

    // Create a population
    for (let i = 0; i < totalPopulation; i++) {
        let player = new Player();
        activePlayers[i] = player;
        allPlayers[i] = player;
    }
}

function toggleState() {
    runBest = !runBest;
    if (runBest) {
        resetGame();
        runBestButton.html('continue training');
    } else {
        nextGeneration();
        runBestButton.html('run best');
    }
}

function draw() {
    background(235);

    let cycles = speedSlider.value();
    speedSpan.html(cycles);

    this.level = levelSlider.value();
    this.tileSpace = widthSlider.value();
    widthSpan.html(this.tileSpace);
    levelSpan.html(this.level);


    for (let n = 0; n < cycles; n++) {
        for (let i = tiles.length - 1; i >= 0; i--) {
            tiles[i].update(this.level);
            if (tiles[i].offscreen()) {
                tiles.splice(i, 1);
            }
        }

        if (runBest) {
            bestPlayer.think(tiles);
            bestPlayer.update();
            for (let j = 0; j < tiles.length; j++) {
                if (tiles[j].hits(bestPlayer)) {
                    resetGame();
                    break;
                }
            }
        } else {
            for (let i = activePlayers.length - 1; i >= 0; i--) {
                let player = activePlayers[i];
                player.think(tiles);
                player.update();

                for (let j = 0; j < tiles.length; j++) {
                    if (tiles[j].hits(activePlayers[i])) {
                        activePlayers.splice(i, 1);
                        break;
                    }
                }

                if (player.x < 0 || player.x > width) {
                    activePlayers.splice(i, 1);
                    break;
                }
            }
        }

        if (counter % (500 - this.level) == 0) {
            tiles.push(new Tile(this.tileSpace));
        }
        counter++;
    }

    let tempHighScore = 0;
    if (!runBest) {
        let tempBestPlayer = null;
        for (let i = 0; i < activePlayers.length; i++) {
            let s = activePlayers[i].score;
            if (s > tempHighScore) {
                tempHighScore = s;
                tempBestPlayer = activePlayers[i];
            }
        }

        // Is it the all time high scorer?
        if (tempHighScore > highScore) {
            highScore = tempHighScore;
            bestPlayer = tempBestPlayer;
        }
    } else {
        tempHighScore = bestPlayer.score;
        if (tempHighScore > highScore) {
            highScore = tempHighScore;
        }
    }

    // Update DOM Elements
    highScoreSpan.html(tempHighScore);
    allTimeHighScoreSpan.html(highScore);

    // Draw everything!
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].show();
    }

    if (runBest) {
        bestPlayer.show();
    } else {
        for (let i = 0; i < activePlayers.length; i++) {
            activePlayers[i].show();
        }
        if (activePlayers.length == 0) {
            nextGeneration();
            generation++;
            generationSpan.html(generation);
        }
    }
}

