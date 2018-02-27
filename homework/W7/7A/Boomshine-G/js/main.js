// main.js
// Dependencies: 
// Description: singleton object
// This object will be our main "controller" class and will contain references
// to most of the other objects in the game.

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

/*
 .main is an object literal that is a property of the app global
 This object literal has its own properties and methods (functions)
 
 */
app.main = {
	//  properties
    Game: Object.freeze({
        WIDTH : 640, 
        HEIGHT: 480 
    }),
    
    CIRCLE: Object.freeze({        
        NUM_CIRCLES_START: 5,
        NUM_CIRCLES_END: 20,
        START_RADIUS: 12,
        MAX_RADIUS: 45,
        MIN_RADIUS: 2,
        MAX_LIFETIME: 2.5,
        MAX_SPEED: 100,
        EXPLOSION_SPEED: 60,
        IMPLOSION_SPEED: 84
    }),
    
    colors: [
        '#FD5B78',
        '#FF6037',
        '#FF9966',
        '#FFFF66',
        '#66FF66',
        '#50BFE6',
        '#FF6EFF',
        '#EE34D2',
    ],
    
    /* bgAudio: undefined,
     currentEffect: 0,
     currentDirection: 1,
     effectSounds: [
        '1.mp3',
        '2.mp3',
        '3.mp3',
        '4.mp3',
        '5.mp3',
        '6.mp3',
        '7.mp3',
        '8.mp3',
    ], */
    
    sound: undefined, // required - loaded by main.js
    myKeys: undefined, // required - loaded by main.js
    Emitter: undefined, // required - loaded by main.js
    
    pulsar: undefined,
    exhaust: undefined,
    
    canvas: undefined,
    ctx: undefined,
   	lastTime: 0, // used by calculateDeltaTime() 
    debug: true,
    paused: false,
    animationID: 0,  
    
    CIRCLE_STATE: Object.freeze({
        NORMAL: 0,
        EXPLODING: 1,
        MAX_SIZE: 2,
        IMPLODING: 3,
        DONE: 4        
    }),
    
    GAME_STATE: Object.freeze({
        BEGIN: 0,
        DEFAULT: 1,
        EXPLODING: 2,
        ROUND_OVER: 3,
        REPEAT_LEVEL: 4,
        END: 5        
    }),
    
    circles: [],
    numCircles: this.NUM_CIRCLES_START,    
    gameState: undefined,
    roundScore: 0,
    totalScore: 0,
        
    // methods
	init : function() {
		console.log("app.main.init() called");
		// initialize properties
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.Game.WIDTH;
		this.canvas.height = this.Game.HEIGHT;
		this.ctx = this.canvas.getContext('2d');
        this.gameState = this.GAME_STATE.BEGIN;
		this.bgAudio = document.querySelector("#bgAudio");
        this.bgAudio.volume = 0.25;
        
        // set up emitter.
        this.exhaust = new this.Emitter();
        this.exhaust.numParticles = 100;
        this.exhaust.red = 255;
        this.exhaust.green = 150;
        this.exhaust.createParticles({x: 100, y: 100});
        
        this.pulsar = new this.Emitter();
        this.pulsar.red = 255;
        this.pulsar.minXspeed = this.pulsar.minYspeed = -0.25;
        this.pulsar.maxXspeed = this.pulsar.maxYspeed = 0.25;
        this.pulsar.lifetime = 500;
        this.pulsar.expansionRate = 0.05;
        this.pulsar.numParticles = 100;
        this.pulsar.xRange = 1;
        this.pulsar.yRange = 1;
        this.pulsar.useCircles = false;
        this.pulsar.useSquares = true;
        this.pulsar.createParticles({x:540, y:100});
        
        // create circles
        this.numCircles = this.CIRCLE.NUM_CIRCLES_START;
        this.circles = this.makeCircles(this.numCircles);
        console.log("this.circles = " + this.circles);
        
        // hook up events.
        this.canvas.onmousedown = this.doMousedown.bind(this);
        
        // load level.
        this.reset();
        
		// start the game loop
		this.update();
	},
	
    reset: function() {
        this.numCircles += 5;
        this.roundScore = 0;
        this.circles = this.makeCircles(this.numCircles);        
    },
    
	update: function(){
		// 1) LOOP
		// schedule a call to update()
	 	this.animationID = requestAnimationFrame(this.update.bind(this));
	 	
	 	// 2) PAUSED?
	 	// if so, bail out of loop
        if(this.paused) {
            this.drawPauseScreen(this.ctx);
            return;
        }
	 	
	 	// 3) HOW MUCH TIME HAS GONE BY?
	 	var dt = this.calculateDeltaTime();
	 	 
	 	// 4) UPDATE
	 	// move circles        
        this.moveCircles(dt);
        
        // CHECK FOR COLLISIONS
        this.checkForCollisions();
        
		// 5) DRAW	
		// i) draw background
		this.ctx.fillStyle = "black"; 
		this.ctx.fillRect(0,0,this.Game.WIDTH,this.Game.HEIGHT); 
	
		// ii) draw circles
        this.ctx.globalAlpha = 0.9;
		this.drawCircles(this.ctx);
        
		// iii) draw HUD
		this.ctx.globalAlpha = 1.0;
        this.drawHUD(this.ctx);
		
		// iv) draw debug info
		if (this.debug){
			// draw dt in bottom right corner
			this.fillText(this.ctx, "dt: " + dt.toFixed(3), this.Game.WIDTH - 150, this.Game.HEIGHT - 10, "18pt courier", "white");
		}
        
        // 6) Check for da cheats.
        // if we are on the start screen or a round over screen.
        if(this.gameState == this.GAME_STATE.BEGIN || this.gameState == this.GAME_STATE.ROUND_OVER){
            // if the shift key and up arrow are both down.
            if(this.myKeys.keydown[this.myKeys.KEYBOARD.KEY_UP] && this.myKeys.keydown[this.myKeys.KEYBOARD.KEY_SHIFT]){
                this.totalScore++;
                this.sound.playEffect();
            }
        }
		
	},
	
	fillText: function(ctx, string, x, y, css, color) {
		ctx.save();
		// https://developer.mozilla.org/en-US/docs/Web/CSS/font
		ctx.font = css;
		ctx.fillStyle = color;
		ctx.fillText(string, x, y);
		ctx.restore();
	},
	
	calculateDeltaTime: function(){
		var now,fps;
		now = performance.now(); 
		fps = 1000 / (now - this.lastTime);
		fps = clamp(fps, 12, 60);
		this.lastTime = now; 
		return 1/fps;
	},
	
    circleHitLeftRight: function(circle) {
        if(circle.x < circle.radius || circle.x > this.Game.WIDTH - circle.radius) {
            return true;
        } 
    },
    
    circleHitTopBottom: function(circle) {
        if(circle.y < circle.radius || circle.y > this.Game.HEIGHT - circle.radius) {
            return true;
        } 
    },
    
    drawHUD: function(ctx) {
		ctx.save(); // NEW
		// draw score
      	// fillText(string, x, y, css, color)
		this.fillText(this.ctx, "This Round: " + this.roundScore + " of " + this.numCircles, 20, 20, "14pt courier", "#ddd");
		this.fillText(this.ctx, "Total Score: " + this.totalScore, this.Game.WIDTH - 200, 20, "14pt courier", "#ddd");

		// NEW
		if(this.gameState == this.GAME_STATE.BEGIN){
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			this.fillText(this.ctx, "To begin, click a circle", this.Game.WIDTH/2, this.Game.HEIGHT/2, "30pt courier", "white");
            this.exhaust.updateAndDraw(this.ctx, {x:100, y:100});
            this.pulsar.updateAndDraw(this.ctx, {x: 540, y:100});
		} // end if
	
		// NEW
		if(this.gameState == this.GAME_STATE.ROUND_OVER){
			ctx.save();
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			this.fillText(this.ctx, "Round Over", this.Game.WIDTH/2, this.Game.HEIGHT/2 - 40, "30pt courier", "red");
			this.fillText(this.ctx, "Click to continue", this.Game.WIDTH/2, this.Game.HEIGHT/2, "30pt courier", "red");
			this.fillText(this.ctx, "Next round there are " + (this.numCircles + 5) + " circles", this.Game.WIDTH/2 , this.Game.HEIGHT/2 + 35, "20pt courier", "#ddd");
		} // end if
		
        ctx.fillStyle = 'yellow';
        ctx.fillRect(295, 215, 50, 50);        
        
		ctx.restore(); // NEW
    },
    
    drawCircles: function(ctx) {
        if(this.gameState == this.GAME_STATE.ROUND_OVER){ this.ctx.globalAlpha = 0.25; }
        for(let i = 0; i < this.circles.length; i++){
            let c = this.circles[i];
            if(c.state === this.CIRCLE_STATE.DONE) { continue; }
            if(c.pulsar) {
                c.pulsar.updateAndDraw(ctx, {x:c.x, y:c.y});
            }
            c.draw(ctx);
        }
    },
    
    moveCircles: function(dt){
        for(let i = 0; i < this.circles.length; i++){
            let c = this.circles[i];
            
            if(c.state === this.CIRCLE_STATE.DONE) continue;
            if(c.state === this.CIRCLE_STATE.EXPLODING) {
                c.radius += this.CIRCLE.EXPLOSION_SPEED * dt;
                if(c.radius >= this.CIRCLE.MAX_RADIUS) {
                    c.state = this.CIRCLE_STATE.MAX_SIZE;
                    console.log("circle #" + i + " hit CIRCLE.MAX_RADIUS");                    
                }
                continue;
            }
            
            if(c.state === this.CIRCLE_STATE.MAX_SIZE) {
                c.lifetime += dt;
                if(c.lifetime >= this.CIRCLE.MAX_LIFETIME){
                    c.state = this.CIRCLE_STATE.IMPLODING;   
                    console.log("circle #" + i + " hit CIRCLE.MAX_LIFETIME");
                }                
                continue;
            }
            
            if(c.state === this.CIRCLE_STATE.IMPLODING) {
                c.radius -= this.CIRCLE.IMPLOSION_SPEED * dt;
                if(c.radius <= this.CIRCLE.MIN_RADIUS) {
                    console.log("circle #" + i + " hit CIRCLE.MIN_RADIUS and is gone");
                    c.state = this.CIRCLE_STATE.DONE;
                    continue;
                }                
            }
            
            c.move(dt);
            
            if(this.circleHitLeftRight(c)) {
                c.xSpeed *= -1;
                c.move(dt); // extra move.
            }

            if(this.circleHitTopBottom(c)) {
                c.ySpeed *= -1;
                c.move(dt); // extra move.
            }        
        }
    },
    
    makeCircles: function(num) {
        
        let circleMove = function(dt) {
            this.x += this.xSpeed * this.speed * dt;
            this.y += this.ySpeed * this.speed * dt;
        };
        
        let circleDraw = function(ctx) {
            // draw circle
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
            ctx.closePath();
            ctx.fillStyle = this.fillStyle;
            ctx.fill();
            ctx.restore();
        };
        
        let array = [];
        for(let i = 0; i < num; i++){
            let c = {};
            
            c.x = getRandom(this.CIRCLE.START_RADIUS * 2, this.Game.WIDTH - this.CIRCLE.START_RADIUS * 2);
            c.y = getRandom(this.CIRCLE.START_RADIUS * 2, this.Game.HEIGHT - this.CIRCLE.START_RADIUS * 2);
            
            c.radius = this.CIRCLE.START_RADIUS;
            
            let randomVector = getRandomUnitVector();
            c.xSpeed = randomVector.x;
            c.ySpeed = randomVector.y;
            
            c.speed = this.CIRCLE.MAX_SPEED;
            c.fillStyle = this.colors[i % this.colors.length]; // getRandomColor();
            c.state = this.CIRCLE_STATE.NORMAL;
            c.lifetime = 0;
            
            c.move = circleMove;
            c.draw = circleDraw;
            
            let pulsar = new this.Emitter();
            pulsar.red = 255;
            pulsar.green = Math.floor(getRandom(0, 255));
            pulsar.blue = Math.floor(getRandom(0, 255));
            pulsar.minXspeed = pulsar.minYspeed = -0.25;
            pulsar.maxXspeed = pulsar.maxYspeed = 0.25;
            pulsar.lifetime = 500;
            pulsar.expansionRate = 0.05;
            pulsar.numParticles = 25;
            pulsar.xRange = 1;
            pulsar.yRange = 1;
            pulsar.useCircles = false;
            pulsar.useSquares = true;
            pulsar.createParticles({x:540, y:100});
            c.pulsar = pulsar;
            
            Object.seal(c);
            array.push(c);
        }
        return array;
    },
    
    drawPauseScreen: function(ctx) {
        ctx.save();
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.Game.WIDTH, this.Game.HEIGHT);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        this.fillText(this.ctx, "...PAUSED...", this.Game.WIDTH/2, this.Game.HEIGHT/2, "40pt courier", "white");
        ctx.restore();
    },
    
    doMousedown: function(e) {  
        this.sound.playBGAudio();
        
        let mouse = getMouse(e);
        
        let rect = {
            x: 295,
            y: 215,
            width: 50,
            height: 50
        };
        
        if (this.paused) {
            this.paused = false;
            this.update();
            return;
        }
        
        if(this.gameState == this.GAME_STATE.EXPLODING) { return; }
        
        if (this.gameState == this.GAME_STATE.ROUND_OVER           
          && rectangleContainsPoint(rect, mouse)) {
            this.gameState = this.GAME_STATE.DEFAULT;
            this.reset();
            return;            
        }
        
        console.log("e=" + e);
        console.log("e.target=" + e.target);
        console.log("this=" + this);
        console.log("e.pageX=" + e.pageX);
        console.log("e.pageY=" + e.pageY);
        
        console.log("(mouse.x,mouse.y)=" + mouse.x + ", " + mouse.y);
        this.checkCircleClicked(mouse);
    
    },
    
    checkCircleClicked: function(mouse) {
        for(let i = this.circles.length - 1; i >= 0; i--){
            let c = this.circles[i];
            if(pointInsideCircle(mouse.x, mouse.y, c)) {
                // c.fillStyle = "red";
                c.xSpeed = c.ySpeed = 0;
                c.state = this.CIRCLE_STATE.EXPLODING;
                this.gameState = this.GAME_STATE.EXPLODING;
                this.roundScore++;
                this.sound.playEffect();
                break;
            }
            
        }
        
    },
    
    checkForCollisions: function() {
		if(this.gameState == this.GAME_STATE.EXPLODING){
			// check for collisions between circles
			for(var i=0;i<this.circles.length; i++){
				var c1 = this.circles[i];
				// only check for collisions if c1 is exploding
				if (c1.state === this.CIRCLE_STATE.NORMAL) continue;   
				if (c1.state === this.CIRCLE_STATE.DONE) continue;
				for(var j=0;j<this.circles.length; j++){
					var c2 = this.circles[j];
				// don't check for collisions if c2 is the same circle
					if (c1 === c2) continue; 
				// don't check for collisions if c2 is already exploding 
					if (c2.state != this.CIRCLE_STATE.NORMAL ) continue;  
					if (c2.state === this.CIRCLE_STATE.DONE) continue;
				
					// Now you finally can check for a collision
					if(circlesIntersect(c1,c2) ){
						c2.state = this.CIRCLE_STATE.EXPLODING;
						c2.xSpeed = c2.ySpeed = 0;
						this.roundScore ++;
                        this.sound.playEffect();
					}
				}
			} // end for
			
			// round over?
			var isOver = true;
			for(var i=0;i<this.circles.length; i++){
				var c = this.circles[i];
				if(c.state != this.CIRCLE_STATE.NORMAL && c.state != this.CIRCLE_STATE.DONE){
				 isOver = false;
				 break;
				}
			} // end for
		
			if(isOver){
                this.stopBGAudio();
				this.gameState = this.GAME_STATE.ROUND_OVER;
				this.totalScore += this.roundScore;
			 }
				
		} // end if GAME_STATE_EXPLODING
    },
    
    pauseGame: function() {
        this.paused = true;
        cancelAnimationFrame(this.animationID);
        this.update();
        this.stopBGAudio();
    },
    
    resumeGame: function() {
        cancelAnimationFrame(this.animationID);
        this.paused = false;
        this.update();
        this.sound.playBGAudio();
    },
    
    stopBGAudio: function() {
        // this.bgAudio.pause();
        // this.bgAudio.currentTime = 0;
        this.sound.stopBGAudio();
    },
    
    /* playEffect: function() {
        let sfx = document.createElement('audio');
        sfx.volume = 0.3;
        sfx.src = "media/" + this.effectSounds[this.currentEffect];
        sfx.play();
        this.currentEffect += this.currentDirection;
        if(this.currentEffect == this.effectSounds.length || this.currentEffect == -1){
            this.currentDirection *= -1;
            this.currentEffect += this.currentDirection;
        }
    } */
    
}; // end app.main