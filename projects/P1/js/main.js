/*
    main.js - Ian Effendi
    Main controller class for the visualizer.
*/
"use strict";

// Create a new empty object literal if app doesn't already exist.
var application = application || {};

// Create the object literal properties of application.
application.main = {
    
    // properties    
    DIMENSIONS: Object.freeze({
        WIDTH: 640,
        HEIGHT: 480        
    }),    
    
    canvas: undefined,
    context: undefined,
    audio: undefined,
    debug: true,
    paused: false,
    animationID: 0,
    
    // sounds
    SOUNDS: Object.freeze({
        FILE1: new Music('media/byebyebye.mp3'),
        FILE2: new Music('media/New Adventure Theme.mp3'),
        FILE3: new Music('media/The Picard Song.mp3'),
        FILE4: new Music('media/downtheroad.mp3')  
    }),
    
    // player info
    PLAYER: {
        currentSong: undefined,
        start: undefined,
        elapsed: undefined,
        delta: undefined,
        pastBeats: undefined,
        pulseTime: 0
    },
    
    // flags
    FLAGS: {
        SHOW_BARS: true,
        SHOW_QUADS: false,
        SHOW_BEZIER: false,
        SHOW_IMAGES: false,
        SHOW_WAVEFORM: false,
        BLUR_CANVAS: false
    },
    
    // attributes
    ATTRIBUTES: {
        CIRCLE_RADIUS: 250,
        THRESHOLD: 0,
        FREQUENCY: 0,
        AUDIO_PAN: 50        
    },
    
    UI: {
        IDS: {
            TRACK: "#trackSelect"
        },
        ELEMENTS: {
            TRACK: undefined
        }
    },
    
    // methods
    
    // Prints message to the console.
    print: function(message) {
        if(this.debug === true && message != null) {
            console.log(message);
        }
    },
    
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
        
        // Setup the UI.
        this.setupUI();
                
        console.dir(this.canvas);
        console.dir(this.context);
        console.dir(this.audio);
                    
        // Initial update.
        this.update();
    },
    
    playStream: function(path) {
        this.audio.source = path;
        this.audio.volume = 0.2;
        this.audio.play();
    },
    
    pauseStream: function(path) {
    },
    
    setupUI: function() {        
        // Create the selector.
        this.UI.ELEMENTS.TRACK = new UISelect(
            this.UI.IDS.TRACK,
            function(e) { 
                this.playStream(e.target.value);
            }.bind(application.main)
        );
    },
    
    update: function() {
        
        if(!this.paused){
        
            console.log("Updating application.");

            // update animation ID.
            this.animationID = requestAnimationFrame(this.update.bind(application.main));

            // update audio analysis.
            this.audio.update();

            // DRAW!
            this.context.clearRect(0,0,800,600);  
            var barWidth = 4;
            var barSpacing = 1;
            var barHeight = 100;
            var topSpacing = 50;
            var maxRadius = 250;
            var data = this.audio.audioNodes[1].getData();

            // loop through the data and draw!
            for(var i=0; i < data.length; i++) { 
                this.context.fillStyle = 'rgba(0,255,0,0.6)'; 

                // Drawing spheres instead of rectangles.
                this.context.moveTo(i * (barWidth + barSpacing), 0);
                this.context.beginPath();
                this.context.arc(i * (barWidth + barSpacing), topSpacing + 256 - data[i], 5, 0, 2 * Math.PI, false);
                this.context.fill();
                this.context.closePath();

                // the higher the amplitude of the sample (bin) the taller the bar
                // remember we have to draw our bars left-to-right and top-down
                this.context.fillRect(i * (barWidth + barSpacing),topSpacing + 256-data[i],barWidth,barHeight); 

                // draw inverted bars
                // this.context.fillRect(640 - i * (barWidth + barSpacing), topSpacing + 256 - data[i] - 20, barWidth, barHeight);

                // reddish circles
                let percent = data[i] / 255;
                let circleRadius = percent * maxRadius;
                this.context.beginPath();
                this.context.fillStyle = makeColor(255, 111, 111, .34 - percent/3.0);
                this.context.arc(this.canvas.width / 2, this.canvas.height / 2, circleRadius, 0, 2 * Math.PI, false);
                this.context.fill();
                this.context.closePath(); 

                // blue-ish circles, bigger, more transparent.
                this.context.beginPath();
                this.context.fillStyle = makeColor(0, 0, 255, .10 - percent/10.0);
                this.context.arc(this.canvas.width / 2, this.canvas.height / 2, circleRadius * 1.5, 0, 2 * Math.PI, false);
                this.context.fill();
                this.context.closePath();

                // yellow-ish circles, smaller
                this.context.save();
                this.context.beginPath();
                this.context.fillStyle = makeColor(200, 200, 0, .5 - percent/5.0);
                this.context.arc(this.canvas.width / 2, this.canvas.height / 2, circleRadius * 0.5, 0, 2 * Math.PI, false);
                this.context.fill();
                this.context.closePath();
                this.context.restore();       

            }
        }
    }
    
}; // end application.main.