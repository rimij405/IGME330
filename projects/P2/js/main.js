/*
    main.js
    Dependencies: 
        - config.js
        - debug.js
        - graphics.js
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
// check out the destructing assignment format for what i'm doing in my function parameters:
// [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment]
app.main = (function (title = 'Main') {
    
    // fields //
    
    // name of the module.
    const name = title;
    
    // default module settings.
    const options = {
        
        // paused flag.
        paused: false,
        
        // the animation id the loop is currently on.
        animationID: app.config.DEFAULTS.ANIMATION_ID,
        
        // the current state of the application's main loop.
        currentState: app.config.DEFAULTS.STATE,
        
        // time values
        time: {
            delta: 0.0,
            elapsed: 0.0,            
        },
        
        // set the animation ID.
        setAnimationID(animationID) {
            this.animationID = animationID;
            return this; // for chaining.            
        },
        
        // set the state of the module.
        setState(currentState) {
            this.currentState = currentState;
            return this; // for chaining.
        },
        
        // set the paused value.
        setPaused(flag) {
            this.paused = flag;
            return this; // for chaining.
        }
    };
    
    // references //
    
    // components of the module.
    const props = {};
    
    // reference to the debug module.
    const debug = app.debug;        
    
    // reference to the config module.
    const config = app.config;     
                
    // private functions //
    
    // initialize the private methods of the module.
    function initProperties() {        
        
        // private function declarations.
        // this will assign the functions to the props via passed closure.
        
        // Init Methods //
        
        // Initialize the canvas.
        props.initCanvas = function() {            
            // Add the canvas to this module.
            props.canvas = document.querySelector(config.SELECTORS.MAIN_CANVAS);
            return props; // for chaining.            
        }
        
        // Print debug information about the canvas.
        props.debugCanvas = function() {
            debug.dir(props.canvas);
            debug.print(`${props.canvas}: (${props.getCanvasWidth()}px by ${props.getCanvasHeight()}px)`);
            return props; // for chaining.
        }
        
        // Initialize the context.
        props.initContext = function() {            
            // Add the drawing context to this module.
            props.context = props.canvas.getContext("2d");
            return props; // for chaining.           
        }
        
        // Print debug information about the context.
        props.debugContext = function() {
            debug.dir(props.context);   
            debug.print(`${props.context}: (${props.context.fillStyle}, ${props.getAlpha() * 100}%)`);
            return props; // for chaining.
        }
        
        // Initialize the graphics module.
        props.initGraphics = function() {
            // Add the graphics module to this.
            props.graphics = app.graphics;
            return props; // for chaining.  
        }
        
        // Print debug information about the graphics module.
        props.debugGraphics = function() {
            debug.dir(props.graphics);
            return props; // for chaining.
        }
        
        // Initialize the update timer.
        props.initTimer = function() {
            // Add a timer to this.
            props.timer = Timer();
            props.internalTime = 0;
            props.internalAccumulator = 0;
            props.fixedDelta = config.DEFAULTS.FIXED_DELTA; 
            props.deltaTime = 0;
            return props;
        }
        
        // Print debug information about the timer.
        props.debugTimer = function() {
            debug.dir(props.timer);
            debug.print(`${props.timer}`);
            debug.print(`${props.fixedDelta}`);
            return props; // for chaining.
        }
        
        // Service Methods //
        
        // Reset the size.
        props.resetSize = function() {
            // Resize using the defaults.
            return props.resize({height: config.DEFAULTS.HEIGHT, width: config.DEFAULTS.WIDTH});
        }
        
        // Set the dimensions of the canvas.
        props.resize = function({width, height}) 
        {
            // set the values directly to the canvas.
            props.setCanvasHeight(height);
            props.setCanvasWidth(width);
            return props; // for chaining.  
        }     
        
        // Accessor Methods // - No chaining.
        
        props.getCanvasWidth = function() {
            return props.canvas.width;
        }
        
        props.getCanvasHeight = function() {
            return props.canvas.height;
        }
        
        props.getAlpha = function() {
            return props.context.globalAlpha;
        }
        
        // Mutator Methods //
        
        // Set the canvas width.
        props.setCanvasWidth = function(width) {
            props.canvas.width = width;
            return props; // for chaining.
        }
        
        // Set the canvas height.
        props.setCanvasHeight = function(height) 
        {
            props.canvas.height = height;
            return props; // for chaining.
        }
        
        return props; // for chaining.
    }
         
    // privileged functions //
    
    // initialize the class.
    function init() {            
        // Initialize the module properties.
        initProperties()
            .initCanvas()
            .initContext()
            .initGraphics()
            .initTimer();
        
        // Print debug information.
        // props.debugCanvas().debugContext().debugGraphics();
        props.debugTimer();
        
        // start the timer.
        props.timer.start();
        
        // Call the update loop for the first time.
        options.setAnimationID(requestAnimationFrame(update));
    }
    
    // stop the update loop.    
    function pause() {
        // Set the state to paused.
        options.setPaused(true);
        
        // Pause the timer.
        props.timer.pause();
        
        // Cancel the current animation frame.
        cancelAnimationFrame(options.animationID);
        
        // Debug information.
        debug.print("Paused loop.");
    }
    
    // continue the update loop.
    function resume() {
        // Set the state to unpaused.
        options.setPaused(false);
        
        // Resume the timer.
        props.timer.resume();
        
        // Call update on the animation frame run again.
        options.animationID = requestAnimationFrame(update);
        
        // Debug information.
        debug.print("Resumed loop.");        
    }
    
    // physics update.
    function physics(dt) {
        
    }
    
    // render update.
    function render(dt) {
        
        // Clear the canvas.
        props.graphics.clear(props.context, 
                             { x: 0, 
                              y: 0,
                              w: props.getCanvasWidth(),
                              h: props.getCanvasHeight() });
        
    }     
        
    // update the game loop. [Timestep info gathered from here https://gafferongames.com/post/fix_your_timestep/]
    function update() {
        
        // Update the current time.
        props.timer.update();
                
        if(!options.paused) {  
            let frameTime = props.timer.getDeltaSeconds();
            
            if(frameTime <= props.fixedDelta) {        
                physics(props.fixedDelta);
            }         
        }
        
        render(props.fixedDelta);
        
        // Loop the game by calling the appropriate method to get the animation bonus.
        options.animationID = requestAnimationFrame(update);

    }
        
    return {
        name,
        init,
        pause,
        resume
    };    
}());