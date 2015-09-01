/* app.js
 * This file implemets game entities, such as Player, Enemies, Game and Collectives. 
 * These entities are developed using JavaScript's object-oriented pseudo-classical style. 
 *
 * Author: Tina D. Wu
 * Date: August 31, 2015
 */

'use strict'; //strict mode

var gameWidth = 5; // width of the game canvas
var gameHeight = 6; // height of the game canvas

var score = 0; // Set initial value of score
var lives = 3; // Set initial value of lives


// Set x position
function enemyInitialX(direction) { 
    if(direction == 1) {
        // Set initial x in the range of column -3 and -1
        return Math.round(-1 - 2 * Math.random()); 
    } else {
        // Set initial x in the range of column 5 and 7
        return Math.round(5 + 2 * Math.random()); 
    }
}

// Set y position in the range of row 1 and 3
function enemyInitialY() {
    return Math.round(2 * Math.random()) + 1;
} 

// Set speed in the range of 2 and 4
function randomSpeed() {
    return Math.random() * 3 + 1;
} 

// Set direction to 1 or -1
function randomDirection() {
    return Math.round(Math.random()) * 2 - 1;
} 

// Define Enemies class
var Enemy = function() {
    // Set the enemy direction to be random
    this.direction = randomDirection(); 
    // Set the initial x of the enemy
    this.x = enemyInitialX(this.direction); 
    // Set the initial y of the enemy
    this.y = enemyInitialY(); 
    // Set the initial speed
    this.speed = randomSpeed() * this.direction; 
    // The sprite for enemy
    this.sprite = 'images/Rock.png'; 
};

/* Update the enemy's position, required method for game
 * Parameter: dt, a time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    // If game isn't paused, update enemies position. 
    if(!game.pause) {       
        /* Multiply any movement by the dt parameter which will ensure 
         * the game runs at the same speed for all computers.
         */
        this.x = this.x + this.speed * dt; 
        
        // If any enemy is moving out of the game canvas, reset its direction, x, y and speed.
        if ((this.x >= 5 && this.direction == 1) || (this.x <= -4 && this.direction == -1)) { 
            this.direction = randomDirection(); 
            this.x = enemyInitialX(this.direction); 
            this.y = enemyInitialY(); 
            this.speed = randomSpeed() * this.direction; 
        }
        
        // Detect collision between enemy and player
        if (Math.round(this.y) == player.y && Math.round(this.x) == player.x) {    
            lives--;
            player.x = player.playerInitialX;
            player.y = player.playerInitialY;
        }           
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 84 - 25); 
};


// Defince player class
var Player = function(){
    // Initialize a player object using Enemy class
    Enemy.call(this); 
    // Set image of the player
    this.sprite = 'images/char-cat-girl.png'; 
    // Set the initial x of the player
    this.playerInitialX = 2; 
    // Set the initial y of the player
    this.playerInitialY = 5; 
    // Set the current x of the player
    this.x = this.playerInitialX;
    // Set the current y of the player
    this.y = this.playerInitialY;
};

// Inherience from Enemy class
Player.prototype = Object.create(Enemy.prototype); 
Player.prototype.constructor = Player; 

// Handles direction key input and change the position of player
Player.prototype.handleInput = function (input){ 
    if (input == 'up' && this.y > 0){
        this.y = this.y - 1;
    }
    if (input == 'left' && this.x > 0){
        this.x = this.x - 1;
    }
    if (input == 'right' && this.x < gameWidth - 1){
        this.x = this.x + 1;
    }
    if (input == 'down' && this.y < gameHeight - 1){
        this.y = this.y + 1;
    }
};

/* Update the player's status
 * If the player successfully reaches the river, he gains a score.
 * If the player hits an enemy, he loses a life.
 * If the player loses all his lives, game is over.
 */
Player.prototype.update = function() {
    if (this.y === 0) { 
        score++;
        this.x = this.playerInitialX;
        this.y = this.playerInitialY;
    }
    
    if(lives == 0) {
        this.x = this.playerInitialX;
        this.y = this.playerInitialY;
        game.end();
    }    
};


// Define Game Class 
var Game = function(enemyNumbers) {
    // first is true if it's the first time for user to play the game.
    this.first = true;
    
    // If it's the first time, game is paused.      
    this.pause = true;
        
    // Sets the current state of the game to 'game over'.
    this.over = false;
    
    // Set the initial score to be 0. Set the initial lives to be 3.
    score = 0;
    lives = 3;

};

// If the game ends, the game is paused and the status is game over.
Game.prototype.end = function() {
    this.pause = true;
    this.over = true;
};

// Handle "Space" key input.
Game.prototype.handleInput = function(key) {
    if(key == 'space') {
        // Toggle between pause and unpause.
        this.pause = !this.pause;
        
        // Set first to be false, if it's not the first time to play the game.
        if (this.first) {
            this.first = false;
            // Reset collectives to random values
            for (var i = 0; i < numCollectives; i++){ 
                allCollectives[i].reset();
            }           
        }
        
        /* If game is over, restart the game 
         * Set pause to be false, so the game is restarted.
         */ 
        if (this.over) {
            this.pause = false;
            this.over = false;
            score = 0;
            lives = 3;
            
            // Reset collectives to random values
            for (var i = 0; i < numCollectives; i++){ 
                allCollectives[i].reset();
            }  
        } 
    }
};


// Defince Collective Class
var Collective = function() {
    // Initialize a collective object using Enemy class
    Enemy.call(this); 
    // Initially the collective is placed out of canvas
    this.x = -1;
    this.y = -1; 
};

// Inherience from Enemy class
Collective.prototype = Object.create(Enemy.prototype); 
Collective.prototype.constructor = Collective;

// Reset x, y position and sprite of the collective
Collective.prototype.reset = function() {
    // Set x in the range of column 0 to 4
    this.x =  Math.round(4 * Math.random());
    // Set y in the range of row 1 to 3
    this.y = Math.round((2 * Math.random() + 1));

    // Set a random image for the Collective
    var randomImage = Math.round(Math.random() * 2) + 1;
    switch(randomImage) {
        case 1: this.sprite = 'images/Gem Blue.png'; break;
        case 2: this.sprite = 'images/Gem Green.png'; break;
        default: this.sprite = 'images/Gem Orange.png'; 
    }
};

// Collect the collective
Collective.prototype.collect = function() {  
    if (Math.round(player.y) == this.y && Math.round(player.x) == this.x) {    
        score++;
        this.reset();
    }
};

// Draw the collective on the screen
Collective.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101 + 8, this.y * 84 - 5); 
};


/* This function listens for key presses.
 * If key "Space" is pressed, it sends the key to Game.handleInput() method.
 * If one of the direction key is pressed, it sends the key to Player.handleInput() method. 
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    var controlKey = {
        32: 'space'  
    };

    if(e.keyCode == 32) {
        game.handleInput(controlKey[e.keyCode]);
    } else if(e.keyCode >= 37 && e.keyCode <= 40){
        player.handleInput(allowedKeys[e.keyCode]);
    }
});


// Set a random number of enemies between 4 and 6. Place all enemy objects in allEnemies array.
var numEnemies = Math.round(Math.random()) * 2 + 4;
var allEnemies = [];
for (var i = 0; i < numEnemies; i++){ 
    allEnemies.push(new Enemy());
}

// Set the number of collectives to 2. Place all collectives object in allCollectives array.
var allCollectives = [];
var numCollectives = 2;
for (var i = 0; i < numCollectives; i++) { 
    allCollectives.push(new Collective());
}

// Instantiate the player object.
var player = new Player();

// Instantiate the game object.
var game = new Game(numEnemies);