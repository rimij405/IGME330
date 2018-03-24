/*
    main.js
    Dependencies: 
        - config.js
    Description: singleton object
    Most likely will be our main, "controller," for most objects in the game.
    ---
    (C) 2018 - Ian Effendi
*/

"use strict";

// create global object literal
// if it doesn't already exist.
var app = app || {};

// create the main module.
app.main = (function (title) {
    
    // name of the module.
    let name = title || "main";
    
    // current frame ID.
    let animationID = 0;
    
    // State of the class.
    let state = undefined;
    
    // initialize the class.
    function init() {
        this.debug = app.debug;        
        this.config = app.config;        
        this.graphics = app.graphics;        
        this.graphics.init();        
        
        this.main = this.graphics.getCanvas("#mainCanvas");
        this.main.setWidth(this.config.DEFAULTS.WIDTH);
        this.main.setHeight(this.config.DEFAULTS.HEIGHT);
        this.ctx = this.main.getContext();
        
        this.state = new State(this.config.STATE.INIT, function(){
            
        });
        
        this.debug.print(`${this.main.canvas}: (${this.main.getWidth()}px by ${this.main.getHeight()}px)`);
        this.debug.print(`${this.ctx}: (${this.ctx.fillStyle}, ${this.main.getAlpha() * 100}%)`);
        this.debug.print(`Initialized module ${name}.`);
    }
        
    // reset the game loop to start.
    function reset() {
        
    }
        
    // update the game loop.
    function update() {
        // Loop the game by calling the appropriate method to get the animation bonus.
        this.animationID = requestAnimationFrame(this.update.bind(this));
        
        
    }
        
    return {
        init
    };    
}());