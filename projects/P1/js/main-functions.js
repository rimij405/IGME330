/*
    main-functions.js - Ian Effendi
    Main controller class for the visualizer.
*/
"use strict";

// Create a new empty object literal if app doesn't already exist.
var application = application || {};

// Create the object literal functions of application.
application.main = application.main || {
    
    // use the properties information.
    props: application.props || {},
    
    // use the factory reference
    factory: application.factory || {},
    
    // animation frame ID
    animationID: undefined,
    
    // the debug flag.
    debug: application.props.FLAGS.DEBUG,
    
    // set the debug flag for this application.
    setDebug: function(value) {
        application.props.FLAGS.DEBUG = value;   
        this.debug = value;
    },
    
    // Check if the app is paused.
    isPaused: function() {
        this.printf("Is the app paused? " + this.props.FLAGS.PAUSED);
        return this.props.FLAGS.PAUSED;
    },
    
    // Pause the app.
    pause: function() {
        this.printf("Pausing application.");
        this.props.FLAGS.PAUSED = true;
    },
    
    // Resume the app.
    resume: function() {
        this.printf("Resuming application.");
        this.props.FLAGS.PAUSED = false;        
    },
        
    //// init methods.
    
    // initialize the main program.
    init: function(debug = false) {
        
        // Set the debug flag.
        this.setDebug(debug);
        
        // Prints out this object.
        this.printf("Initializing the main application.");
        
        // Set unpaused.
        this.resume();
        
        // Init the children.
        this.initCanvas(this.props);
        
        // Init the audio element.
        this.initAudio(this.props);
        
        // Get tempos for songs.
        
        // Set up the UI.
        this.initGUI(this.props);
        
        // Call the update method.
        this.update(this.props);
        
    },
    
    // initialize the canvas. (pass in the properties)
    initCanvas: function(e) {
        if(e == null) { e = this.props; }
        
        this.printf("Initializing the canvas and drawing context.");
        
        // Load the canvas.
        e.canvas = document.querySelector('canvas');
        e.canvas.width = e.CONSTANTS.WIDTH;
        e.canvas.height = e.CONSTANTS.HEIGHT;
        
        // Load the drawing context.
        e.context = e.canvas.getContext('2d');        
    },
    
    initAudio: function(e) {
        if(e == null) { e = this.props; }
        
        this.printf("Initializing the audio context.");
        
        e.audio = new AudioElement();
        e.audio.addAnalyzerNode(256, true);
        this.printf(e.audio);
        
        this.printf("Initializing the audio player.");
        
        e.player = new Player();
        this.printf(e.player);
        
        this.printf("Initializing the library.");
        e.library = new MusicLibrary(e.CONSTANTS.SELECTORS.TRACK, this.debug);
        this.printf(e.library);
        this.printf(e.library.toString());
        
        this.printf("Finding tempo for all songs.");
        e.library.songs.forEach(function(item, index, array){
            if(item.tempo == 0) {
                item.calculateTempo();
            }
            // this.printf("Tempo calculated for " + item.toString());
        }, this);
        
    },
    
    initGUI: function(e) {   
        if(e == null) { e = this.props; }
        
        this.printf("Initializing the GUI.");
        
        e.COMPONENTS.GUI.TRACKS = this.factory.buildUISelect(
            this.props.CONSTANTS.SELECTORS.TRACK,
            function(e) {
                this.printf("Switched track to '" + e.target.value + "'");
                // this.playStream(this.props, e.target.value);            
            }.bind(application.main)
        );
    
    },
    
    //// update methods.
    update: function(e) {
        if(e == null) { e = this.props; }
        
        if(!e.FLAGS.PAUSED){            
            // this.printf("Updating application.");
            
            // Update the animation ID.
            this.animationID = requestAnimationFrame(this.update.bind(application.main, this.props));
            
            // Update the audio analysis.
            e.audio.update();
            
            // DRAW!
            e.context.clearRect(0,0,800,600);  
            var barWidth = 4;
            var barSpacing = 1;
            var barHeight = 100;
            var topSpacing = 50;
            var maxRadius = 250;
            var data = e.audio.audioNodes[1].getData();

            // loop through the data and draw!
            for(var i=0; i < data.length; i++) { 
                e.context.fillStyle = 'rgba(0,255,0,0.6)'; 

                // Drawing spheres instead of rectangles.
                e.context.moveTo(i * (barWidth + barSpacing), 0);
                e.context.beginPath();
                e.context.arc(i * (barWidth + barSpacing), topSpacing + 256 - data[i], 5, 0, 2 * Math.PI, false);
                e.context.fill();
                e.context.closePath();

                // the higher the amplitude of the sample (bin) the taller the bar
                // remember we have to draw our bars left-to-right and top-down
                e.context.fillRect(i * (barWidth + barSpacing),topSpacing + 256-data[i],barWidth,barHeight); 

                // draw inverted bars
                // this.context.fillRect(640 - i * (barWidth + barSpacing), topSpacing + 256 - data[i] - 20, barWidth, barHeight);

                // reddish circles
                let percent = data[i] / 255;
                let circleRadius = percent * maxRadius;
                e.context.beginPath();
                e.context.fillStyle = makeColor(255, 111, 111, .34 - percent/3.0);
                e.context.arc(e.canvas.width / 2, e.canvas.height / 2, circleRadius, 0, 2 * Math.PI, false);
                e.context.fill();
                e.context.closePath(); 

                // blue-ish circles, bigger, more transparent.
                e.context.beginPath();
                e.context.fillStyle = makeColor(0, 0, 255, .10 - percent/10.0);
                e.context.arc(e.canvas.width / 2, e.canvas.height / 2, circleRadius * 1.5, 0, 2 * Math.PI, false);
                e.context.fill();
                e.context.closePath();

                // yellow-ish circles, smaller
                e.context.save();
                e.context.beginPath();
                e.context.fillStyle = makeColor(200, 200, 0, .5 - percent/5.0);
                e.context.arc(e.canvas.width / 2, e.canvas.height / 2, circleRadius * 0.5, 0, 2 * Math.PI, false);
                e.context.fill();
                e.context.closePath();
                e.context.restore();       

            }            
        }
        else 
        {
            this.printf("Application is paused.");
        }
    },
    
    
    //// service methods.
    
    // Print a message to the console, with an optional debug-only flag.
    print: function(message, debug) {  
        if(message == null) { message = this; }
        log(message, debug);
    },
    
    // Print a debug message to the console. Will not print if debug is not true.
    printf: function(message) {
        this.print(message, this.debug);
    },
    
    playStream: function(e, path) { 
        if(e == null) { e = this.props; }        
        e.audio.source = path;
        e.audio.volume = 0.2;
        e.audio.play();
    }
    
    
    
    
    
    /*
    
    // methods
    
    // Initializes the application.
    init: function() {
        this.print("Initializing application.");
        
        // Load the canvas.
        this.canvas = document.querySelector('canvas');
        this.canvas.width = this.DIMENSIONS.WIDTH;
        this.canvas.height = this.DIMENSIONS.HEIGHT;
        
        // Load the drawing context.
        this.context = this.canvas.getContext('2d');
        
        // Load the audio element.
        // this.audio = document.querySelector('audio');
        this.audio = new AudioElement();
        this.audio.addAnalyzerNode(256, true);
        
        // Get the tempos for all the songs.
        for(let i = 0; i < this.PLAYER.songs.length; i++){
            if(this.PLAYER.songs[i].bpm == 0) {
                this.PLAYER.songs[i].calculateTempo();
            }   
        }
        
        // Setup the UI.
        this.setupUI();
                
        console.dir(this.canvas);
        console.dir(this.context);
        console.dir(this.audio);
                    
        // Initial update.
        this.update();
    },*/
}; // end application.main.