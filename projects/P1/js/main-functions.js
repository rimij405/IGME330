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
    
    // circle references.
    circles: {
        pulser: undefined,
        low: undefined,
        mid: undefined,
        high: undefined,
        waveform: undefined
    },
    
    // the debug flag.
    debug: application.props.FLAGS.DEBUG,
    
    // set the debug flag for this application.
    setDebug: function(value) {
        application.props.FLAGS.DEBUG = value;   
        this.debug = value;
    },
    
    // Check if the app visualization is paused.
    isPaused: function() {
        // this.printf("Is the app visualization paused? " + this.props.FLAGS.PAUSED);
        return this.props.FLAGS.PAUSED;
    },
    
    // Pause the app visualization.
    pause: function() {
        // this.printf("Pausing visualization.");
        this.props.FLAGS.PAUSED = true;
    },
    
    // Resume the app visualization.
    resume: function() {
        // this.printf("Resuming visualization.");
        this.props.FLAGS.PAUSED = false;        
    },
        
    //// init methods.
    
    // initialize the main program.
    init: function(debug = false) {
        
        // Set the debug flag.
        this.setDebug(debug);
        
        // Prints out this object.
        // this.printf("Initializing the main application.");
        
        // Set unpaused.
        this.resume();
        
        // Init the children.
        this.initCanvas(this.props);
        
        // Init the audio element.
        this.initAudio(this.props);
                
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
        e.canvas = document.querySelector(e.CONSTANTS.SELECTORS.CANVAS);
        e.canvas.width = e.CONSTANTS.WIDTH;
        e.canvas.height = e.CONSTANTS.HEIGHT;
        
        // Load the drawing context.
        e.context = e.canvas.getContext('2d');     
        
        // Load the canvas.
        e.topCanvas = document.querySelector(e.CONSTANTS.SELECTORS.HUD);
        e.topCanvas.width = e.CONSTANTS.WIDTH;
        e.topCanvas.height = e.CONSTANTS.HEIGHT;
        
        // Load the drawing context.
        e.topContext = e.topCanvas.getContext('2d');    
        
        // translate contexts by 0.5.
        let translate = function(e) {
            e.translate(0.5, 0.5);
        }
        
        translate(e.context);
        translate(e.topContext);
    },
    
    // initialize the audio elements and nodes.
    initAudio: function(e) {
        if(e == null) { e = this.props; }
                
        this.printf("Initializing the audio context.");
        
        e.audio = new AudioElement();
        e.audio.addDelayNode();
        e.audio.addDistortionNode();
        e.audio.addCompressor();
        e.audio.addAnalyzerNode(256, true);
        e.audio.connectNodes();
        this.printf(e.audio);
                
        this.printf("Initializing the library.");
        e.library = new MusicLibrary(e.CONSTANTS.SELECTORS.TRACK, this.debug);
        this.printf(e.library);
        this.printf(e.library.toString());
        
        let p = e;
        e.audio.audioElement.addEventListener("ended", function(e){        
            p.library.nextSong();
            p.COMPONENTS.GUI.TRACKS.element.selectedIndex = p.library.songs.currentSong; 
            this.playStream(p);
        }.bind(application.main));
    },
    
    // initialize the GUI controls.
    initGUI: function(e) {   
        if(e == null) { e = this.props; }
        
        this.printf("Initializing the GUI.");
        
        // track selection.        
        e.COMPONENTS.GUI.TRACKS = this.factory.buildUISelect(
            e.CONSTANTS.SELECTORS.TRACK,
            function(e) {    
                
                // get option index.
                let i = e.target.options[e.target.selectedIndex].dataset.index;
                let p = this.props;                
                
                // check if we aren't currently on the target song.
                this.printf("Switched track to [" + i + "] '" + e.target.value + "'");
                
                // set the current song in the library if it differs.
                if(i != p.library.songs.currentSong) {                    
                    p.library.songs.currentSong = i;
                    this.playStream(p);
                }              
                
            }.bind(application.main)
        );        
        
        // volume slider.
        e.COMPONENTS.GUI.VOLUME = this.factory.buildUISlider(
            e.CONSTANTS.SELECTORS.VOLUME,
            function(e) {    
                
                // update the audio element volume.
                this.props.audio.volume = e.target.value / 100;
                
                // update the slider value.
                let label = document.querySelector(this.props.CONSTANTS.SELECTORS.VOLUMELABEL);
                label.innerHTML = "Volume: " + e.target.value;
                
            }.bind(application.main)
        );
        
        // delay slider.
        e.COMPONENTS.GUI.DELAY = this.factory.buildUISlider(
            e.CONSTANTS.SELECTORS.DELAY,
            function(e) {    
                
                this.props.ATTRIBUTES.DELAY = (e.target.value / 10);
                this.props.audio.delayNode.setDelayAtTime(this.props.ATTRIBUTES.DELAY, this.props.audio.audioContext.currentTime);
                
                // update the slider value.
                let label = document.querySelector(this.props.CONSTANTS.SELECTORS.DELAYLABEL);
                label.innerHTML = "Delay: " + e.target.value;
                
            }.bind(application.main)
        );
        
        // waveshaper slider.
        e.COMPONENTS.GUI.DISTORTION = this.factory.buildUISlider(
            e.CONSTANTS.SELECTORS.DISTORTION,
            function(e) {    
                
                this.props.ATTRIBUTES.DISTORTION = (e.target.value);
                
                // update the slider value.
                let label = document.querySelector(this.props.CONSTANTS.SELECTORS.DISTORTIONLABEL);
                label.innerHTML = "Distortion Seed: " + e.target.value;
                
            }.bind(application.main)
        );
        
        // visualization type.
        e.COMPONENTS.GUI.DATATYPE = this.factory.buildUISelect(
            e.CONSTANTS.SELECTORS.DATA,
            function(e) {                
                this.printf("Current mode set to: " + e.target.value);
                if(e.target.value == "frequency") {
                    this.props.FLAGS.WAVEFORM_MODE = false;
                } else if(e.target.value == "waveform") {
                    this.props.FLAGS.WAVEFORM_MODE = true;
                }
            }.bind(application.main)
        );
    
        // filter amount slider.
        e.COMPONENTS.GUI.FILTERS.AMOUNT = this.factory.buildUISlider(
            e.CONSTANTS.SELECTORS.FILTERS.AMOUNT,
            function(e) {    
                
                this.props.ATTRIBUTES.FILTER = e.target.value;
                
                this.props.FLAGS.CHANGED = true;
                                
            }.bind(application.main)
        );
        
        // Add all radio buttons to the proper array.        
        e.COMPONENTS.GUI.FILTERS.BUTTONS = document.querySelectorAll(
            e.CONSTANTS.SELECTORS.FILTERS.BUTTON
        );
        
        // Set up radio buttons.
        let selectRadioButton = function(e){                        
            // set all flags to false.
            let p = this.props;            
            p.FLAGS.BLUR = false;        
            p.FLAGS.SEPIA = false;        
            p.FLAGS.GRAYSCALE = false;        
            p.FLAGS.INVERT = false;
            p.FLAGS.CHANGED = true;
            
            switch(e.target.value){
                case 'blur':
                    p.FLAGS.BLUR = true;
                    break;
                case 'sepia':
                    p.FLAGS.SEPIA = true;
                    break;
                case 'grayscale':
                    p.FLAGS.GRAYSCALE = true;
                    break;
                case 'invert':
                    p.FLAGS.INVERT = true;
                    break;                    
            }            
        }.bind(application.main);        
        
        for(let i = 0; i < e.COMPONENTS.GUI.FILTERS.BUTTONS.length; i++) {
             e.COMPONENTS.GUI.FILTERS.BUTTONS[i].onclick = selectRadioButton;
        }
                
        //// compressor ui.
        
        // threshold
        e.COMPONENTS.GUI.COMPRESSOR.THRESHOLD = this.factory.buildUISlider(
            e.CONSTANTS.SELECTORS.COMPRESSOR.CONTROLS.THRESHOLD,
            function(e) {
                // set the property's value.
                let t = this.props.audio.audioContext.currentTime;
                this.props.audio.compressor.setValueAtTime('threshold', e.target.value, t);                
                // update the slider label.
                let label = document.querySelector(this.props.CONSTANTS.SELECTORS.COMPRESSOR.LABELS.THRESHOLD);
                label.innerHTML = `Threshold: ${e.target.value}db`;                
            }.bind(application.main)
        );
                
        // knee
        e.COMPONENTS.GUI.COMPRESSOR.KNEE = this.factory.buildUISlider(
            e.CONSTANTS.SELECTORS.COMPRESSOR.CONTROLS.KNEE,
            function(e) {
                // set the property's value.
                let t = this.props.audio.audioContext.currentTime;
                this.props.audio.compressor.setValueAtTime('knee', e.target.value, t);                
                // update the slider label.
                let label = document.querySelector(this.props.CONSTANTS.SELECTORS.COMPRESSOR.LABELS.KNEE);
                label.innerHTML = `Knee: ${e.target.value}x`;                
            }.bind(application.main)
        );
        
        // ratio
        e.COMPONENTS.GUI.COMPRESSOR.RATIO = this.factory.buildUISlider(
            e.CONSTANTS.SELECTORS.COMPRESSOR.CONTROLS.RATIO,
            function(e) {
                // set the property's value.
                let t = this.props.audio.audioContext.currentTime;
                this.props.audio.compressor.setValueAtTime('ratio', e.target.value, t);                
                // update the slider label.
                let label = document.querySelector(this.props.CONSTANTS.SELECTORS.COMPRESSOR.LABELS.RATIO);
                label.innerHTML = `Ratio: ${e.target.value}db`;                
            }.bind(application.main)
        );
        
        // attack
        e.COMPONENTS.GUI.COMPRESSOR.ATTACK = this.factory.buildUISlider(
            e.CONSTANTS.SELECTORS.COMPRESSOR.CONTROLS.ATTACK,
            function(e) {
                // set the property's value.
                let t = this.props.audio.audioContext.currentTime;
                this.props.audio.compressor.setValueAtTime('attack', e.target.value, t);                
                // update the slider label.
                let label = document.querySelector(this.props.CONSTANTS.SELECTORS.COMPRESSOR.LABELS.ATTACK);
                label.innerHTML = `Attack: ${e.target.value} ms`;                
            }.bind(application.main)
        );
        
        // release
        e.COMPONENTS.GUI.COMPRESSOR.RELEASE = this.factory.buildUISlider(
            e.CONSTANTS.SELECTORS.COMPRESSOR.CONTROLS.RELEASE,
            function(e) {
                // set the property's value.
                let t = this.props.audio.audioContext.currentTime;
                this.props.audio.compressor.setValueAtTime('release', e.target.value, t);                
                // update the slider label.
                let label = document.querySelector(this.props.CONSTANTS.SELECTORS.COMPRESSOR.LABELS.RELEASE);
                label.innerHTML = `Release: ${e.target.value} ms`;                
            }.bind(application.main)
        );
        
        // mute button.
        e.COMPONENTS.GUI.MUTE = this.factory.buildUIButton(
            e.CONSTANTS.SELECTORS.MUTE,
            function(e) {
                
                if(this.props.audio.gainNode.gain.value > 0) {
                    this.props.audio.gainNode.gain.setValueAtTime(0, this.props.audio.audioContext.currentTime);
                    e.target.innerHTML = "Unmute";
                } 
                else
                {
                    this.props.audio.gainNode.gain.setValueAtTime(1, this.props.audio.audioContext.currentTime);
                    e.target.innerHTML = "Mute";                    
                }                
                
            }.bind(application.main)
        );
        
        //// biquad filter settings.
        
        // type.
        e.COMPONENTS.GUI.BIQUAD.TYPE = this.factory.buildUISelect(
            e.CONSTANTS.SELECTORS.BIQUAD.CONTROLS.TYPE,
            function(e) {                
                this.props.audio.biquadNode.type = e.target.value;                
            }.bind(application.main)
        );
        
        // frequency.
        e.COMPONENTS.GUI.BIQUAD.FREQUENCY = this.factory.buildUISlider(
            e.CONSTANTS.SELECTORS.BIQUAD.CONTROLS.FREQUENCY,
            function(e) {
                
                this.props.audio.biquadNode.frequency.setValueAtTime(e.target.value, this.props.audio.audioContext.currentTime);
                     
                // update the slider label.
                let label = document.querySelector(this.props.CONSTANTS.SELECTORS.BIQUAD.LABELS.FREQUENCY);
                label.innerHTML = `Frequency: ${e.target.value} Hz`;                   
                
            }.bind(application.main)
        );
        
        // detune settings.        
        e.COMPONENTS.GUI.BIQUAD.DETUNE = this.factory.buildUISlider(
            e.CONSTANTS.SELECTORS.BIQUAD.CONTROLS.DETUNE,
            function(e) {
                
                this.props.audio.biquadNode.detune.setValueAtTime(e.target.value, this.props.audio.audioContext.currentTime);
                     
                // update the slider label.
                let label = document.querySelector(this.props.CONSTANTS.SELECTORS.BIQUAD.LABELS.DETUNE);
                label.innerHTML = `Detune: ${e.target.value} cents`;    
                
            }.bind(application.main)
        );
                
        // quality of biquad filter.
        e.COMPONENTS.GUI.BIQUAD.Q = this.factory.buildUISlider(
            e.CONSTANTS.SELECTORS.BIQUAD.CONTROLS.Q,
            function(e) {
                
                this.props.audio.biquadNode.Q.setValueAtTime(e.target.value,  this.props.audio.audioContext.currentTime);
                     
                // update the slider label.
                let label = document.querySelector(this.props.CONSTANTS.SELECTORS.BIQUAD.LABELS.Q);
                label.innerHTML = `Q: ${e.target.value}`;    
                
            }.bind(application.main)
        );
                
        //// display checks.
        
        // Bars
        e.COMPONENTS.GUI.EFFECTS.BARS = this.factory.buildUICheckbox(
            e.CONSTANTS.SELECTORS.EFFECTS.CONTROLS.BARS,
            function(e){
                
                // Set the flag.
                this.printf("show bars." + e.target.checked);
                this.props.FLAGS.SHOW_BARS = e.target.checked;
                
            }.bind(application.main)
        );
        
        // Curves
        e.COMPONENTS.GUI.EFFECTS.CURVES = this.factory.buildUICheckbox(
            e.CONSTANTS.SELECTORS.EFFECTS.CONTROLS.CURVES,
            function(e){
                
                // Set the flag.
                this.printf("show curves." + e.target.checked);
                this.props.FLAGS.SHOW_CURVES = e.target.checked;
                
            }.bind(application.main)
        );
                        
        // Tint
       /* e.COMPONENTS.GUI.EFFECTS.TINT = this.factory.buildUICheckbox(
            e.CONSTANTS.SELECTORS.EFFECTS.CONTROLS.TINT,
            function(e){
                
                this.printf("tint." + e.target.checked);
                this.props.FLAGS.TINT = e.target.checked;
                
            }.bind(application.main)        
        );
                
        // Noise
        e.COMPONENTS.GUI.EFFECTS.NOISE = this.factory.buildUICheckbox(
            e.CONSTANTS.SELECTORS.EFFECTS.CONTROLS.NOISE,
            function(e){
                
                this.printf("noise." + e.target.checked);
                this.props.FLAGS.NOISE = e.target.checked;
                
            }.bind(application.main)        
        ); */
                
        // Max circle radius.        
        e.COMPONENTS.GUI.EFFECTS.RADIUS = this.factory.buildUISlider(
            e.CONSTANTS.SELECTORS.EFFECTS.CONTROLS.RADIUS,
            function(e) {
                
                this.props.ATTRIBUTES.RADIUS = e.target.value;                
                
                // update the slider label.
                let label = document.querySelector(this.props.CONSTANTS.SELECTORS.EFFECTS.LABELS.RADIUS);
                label.innerHTML = `Circle Radius: ${e.target.value}px`;    
                
            }.bind(application.main)
        );
        
        // Circles
        e.COMPONENTS.GUI.EFFECTS.CIRCLES = this.factory.buildUICheckbox(
            e.CONSTANTS.SELECTORS.EFFECTS.CONTROLS.CIRCLES,
            function(e){
                
                this.printf("show circles." + e.target.checked);
                this.props.FLAGS.SHOW_CIRCLES = e.target.checked;
                
                let label = document.querySelector(this.props.CONSTANTS.SELECTORS.EFFECTS.LABELS.RADIUS);
                if(!e.target.checked){
                    // update the slider label.
                    label.innerHTML = `Max Circle Radius: ---`;                     
                } 
                else
                {
                    let value = this.props.COMPONENTS.GUI.EFFECTS.RADIUS.element.value;
                    label.innerHTML = `Max Circle Radius: ${value}px`;                                           
                }
                
            }.bind(application.main)        
        );
        
        
    },
    
    //// update methods.
    
    // update the main application flow.
    update: function(e) {
        if(e == null) { e = this.props; }
        
        // Update the animation ID.
        this.animationID = requestAnimationFrame(this.update.bind(application.main, this.props));
             
        // update song metadata.
        e.library.update();
        let ready = e.library.temposCalculated;

        let options = {
            lineWidth: 1,
            fontSize: 25,
            x: (this.props.topCanvas.width / 2),
            y: (this.props.topCanvas.height / 2) - 50,
            strokeStyle: 'black',
            fillStyle: 'red'
        };
        
        if (!ready) {
            e.FLAGS.LOADED = false;

            e.topContext.clearRect(0, 0, 800, 600);
            this.message("Loading visualizer...", options);     
            options.y += 50;
            this.message("Tempos are still calculating. ( " + e.library.songs.loadedSongs + " / " + e.library.songs.length + " ) songs.", options);           
            return;
        }
        
        if(!e.FLAGS.PAUSED){            
            // this.printf("Updating application.");

            // update the gui; can't change songs while tempo is being calculated.
            e.COMPONENTS.GUI.TRACKS.element.disabled = !e.FLAGS.LOADED;
            e.COMPONENTS.GUI.EFFECTS.RADIUS.element.disabled = !e.COMPONENTS.GUI.EFFECTS.CIRCLES.element.checked;
            
            if(ready)
            {
                // When tempos are loaded for first time, start playing first track. This is the only situation in which this occurs automatically.
                if(!e.FLAGS.LOADED) {
                    e.FLAGS.LOADED = true;
                    this.playStream(e);
                }                

                // Update the audio analysis.
                // this.printf("Update the audio elements:");
                e.audio.analyzerNode.setWaveformMode(e.FLAGS.WAVEFORM_MODE);
                e.audio.update(e);
                // if(this.debug) { console.dir(e.audio); }
     
                // draw.
                this.draw(e);                       
            }
        }
        else 
        {
            if(ready) {       
                this.clearScreen(e);
                e.topContext.clearRect(0, 0, 800, 600);
                options.y += 50;
                this.message("Visualization is paused.", options);     
                return;
            }            
            
            // this.printf("Application is paused.");
        }
    },
    
    // draw effects to the canvas.
    draw: function(e) {
        if(e == null) { e = this.props; }
                
        if(e.FLAGS.CHANGED){
            e.FLAGS.CHANGED = false;
            this.drawEffects(e);
        }
        
        // DRAW!
        e.topContext.clearRect(0,0,800,600);
        this.clearScreen(e);
        
        let data = e.audio.analyzerNode.getData();   
        
        // draw the circles.
        this.drawCircles(e, data);
        
        // draw the bars.
        this.drawBars(e, data);
        
        // draw mirrored curves.
        this.drawCurves(e, data);
        this.drawCurves(e, data, -1);
        
        // write the tempo and title of the song.
        this.message(e.library.currentSong.title + " - (" + e.library.currentSong.bpm + " BPM)", {
            x: e.CONSTANTS.WIDTH / 2,
            y: 25,
            fontSize: 24
        });
        
    },
    
    drawCircles: function(e, data) {
        if(e == null) { e = this.props; }
        if(data == null) { data = e.audio.analyzerNode.getData(); }  
        
        let volume = (e.COMPONENTS.GUI.VOLUME.element.value / 10);
                        
        if(e.FLAGS.SHOW_CIRCLES && data != null && data.length > 0){
            
            // drawing options.
            let options = {
                size: e.ATTRIBUTES.RADIUS,
                bounds: {},
                x: e.CONSTANTS.WIDTH / 2,
                y: e.CONSTANTS.HEIGHT / 2,
                modifier: 1,
                percent: 1,
                name: undefined
            }
            
            options.bounds.min = parseFloat(volume);
            options.bounds.max = parseFloat(e.ATTRIBUTES.RADIUS * 2) + parseFloat(volume * 2);
            
            // save the context.
            e.context.save();
            
            for(let i = 0; i < data.length; i++) {  
                
                if(i % 4 == 0){                
                    // get the data value as a percentage.
                    options.percent = (data[i] / e.CONSTANTS.SAMPLES);
                                        
                    if(!e.FLAGS.WAVEFORM_MODE) {
                        if(data[i] >= 170 && i % 8 == 0){
                            // high frequency circle.
                            options.modifier = 5 + (options.percent * 2);
                            let high = this.circles.high || new Circle(options.size);
                            high.setColor(131, 40, 10, 0.2 + (1.0 * options.percent));
                            // options.name = undefined;
                            high.draw(e.context, options);
                        }   
                        
                        if(data[i] >= 85 && i % 32 == 0){
                            // mid frequency circle.
                            options.modifier = 2.5 + (options.percent * 2);
                            let mid = this.circles.mid || new Circle(options.size);
                            mid.setColor(31, 40, 131, 0.1 + (1.0 * options.percent));
                            // options.name = undefined;
                            mid.draw(e.context, options);
                        }
                        
                        if(data[i] >= 0) {
                            // low frequency circle. 
                            options.modifier = 1 + (options.percent * 2);
                            let low = this.circles.low || new Circle(options.size);
                            low.setColor(10, 131, 40, 0.03 + (1.0 * options.percent));
                            // options.name = "low";
                            low.draw(e.context, options);
                        }
                    }
                    else 
                    {
                        // wave form curve.                        
                        options.modifier = 3.5;
                        if(e.ATTRIBUTES.TIME.BEATS_HIT % 2 == 0) {                        
                            options.modifier = 5.5;
                        }
                        
                        let sign = 1;
                        if(getRandomIntInclusive(0, 1) === 1) {
                            sign = -1;
                        }
                        
                        options.x = options.x + 1000 * Math.cos(Math.PI * options.percent);
                        options.y = options.y + 10 * sign * Math.sin(Math.PI * options.percent);

                        let waves = this.circles.waveform || new Circle(options.size);
                        waves.setColor(46, 11, 5, 1.0 - (options.percent));
                        // console.log(1.0 - options.percent);
                        // options.name = undefined; //"waves";
                        waves.draw(e.context, options);
                    }

                    // Set height back to center.
                    options.x = e.CONSTANTS.WIDTH / 2;
                    options.y = e.CONSTANTS.HEIGHT / 2;

                    // pulsating circle:
                    let pulser = this.circles.pulser || new Circle(options.size);
                    pulser.setColor(214, 182, 0, 0.40);
                    options.modifier = 1 + e.ATTRIBUTES.TIME.PULSE;
                    // options.name = undefined;
                    // pulser.draw(e.context, options);
                }
            }
            
            // restore the context.            
            e.context.restore();
            
        }
    },
    
    // draws the curves for the visualizer.
    drawCurves: function(e, data, flip = 1) {        
        if(e == null) { e = this.props; }
        if(data == null) { data = e.audio.analyzerNode.getData(); }        
        
        if(e.FLAGS.SHOW_CURVES && data != null && data.length > 0){
            
            // save the context.
            e.context.save();
            
            let half = {
                height: (e.CONSTANTS.HEIGHT - (25 * flip)) / 2.0,
                width: e.CONSTANTS.WIDTH / 2.0
            };
            
            let padding = half.width / (data.length);
            let volume = flip * (e.COMPONENTS.GUI.VOLUME.element.value / 100);
            
            // make the color.
            let color = makeColor(45, 48, 71, 1);
            
            e.context.lineWidth = 1;
            
            // unlike the bar, a curve is a series of points on a single path.
            e.context.beginPath();

            // we'll start at our first point.
            e.context.moveTo(half.width, half.height - data[0] * volume);
                
            // loop through data, if it exists.
            for(let i = 0; i < data.length - 2; i++){
                
                let curve = {
                    x: half.width + (i * padding + (i + 1) * padding) / 2,
                    y: (((half.height) - (volume * data[i]) + (half.height) - (volume * data[i + 1])) / 2.0),
                }
                
                e.context.quadraticCurveTo(half.width + i * padding, (half.height - (volume * data[i])), curve.x, curve.y);                
                          
                if(data[i] != 0) {

                    color = e.context.createLinearGradient(0, half.height - (volume * data[i]), 0, half.height + (volume * data[i]));

                    color.addColorStop(0, makeColor(255, 249, 224, 0.9)); // light yellow
                    color.addColorStop(0.05, makeColor(214, 162, 66, 0.9)); // orange
                    color.addColorStop(0.35, makeColor(196, 85, 21, 0.9)); // light red
                    color.addColorStop(0.45, makeColor(114, 8, 6, 0.9)); // dark red
                    color.addColorStop(0.50, makeColor(45, 48, 71, 0.9)); // dark blue
                    color.addColorStop(0.55, makeColor(114, 8, 6, 0.9)); // dark red
                    color.addColorStop(0.65, makeColor(196, 85, 21, 0.9)); // light red
                    color.addColorStop(0.95, makeColor(214, 162, 66, 0.9)); // orange
                    color.addColorStop(1, makeColor(255, 249, 224, 0.9)); // light yellow

                    e.context.strokeStyle = color;
                    e.context.fillStyle = color;  
                }   

                // stroke the curve.
                // e.context.stroke();
                
                // begin path for next point on the curve.
                // e.context.beginPath();
            
            }
            
            // get the last point.
            e.context.quadraticCurveTo(half.width + (data.length - 2) * padding, 
                                        half.height - (volume * data[data.length - 2]),
                                        half.width + (data.length - 1) * padding,
                                        half.height - (volume * data[data.length - 1]));
            
            e.context.stroke();
            
            // draw the mirror:            
            
            padding = -half.width / (data.length - 1);
            
            // unlike the bar, a curve is a series of points on a single path.
            e.context.beginPath();

            // we'll start at our first point.
            e.context.moveTo(half.width - 1, half.height - data[0] * volume);
                
            // loop through data, if it exists.
            for(let i = 0; i < data.length - 2; i++){
                
                let curve = {
                    x: half.width + (i * padding + (i + 1) * padding) / 2,
                    y: (((half.height) - (volume * data[i]) + (half.height) - (volume * data[i + 1])) / 2.0),
                }
                
                e.context.quadraticCurveTo(half.width + i * padding, (half.height - (volume * data[i])), curve.x, curve.y);                
                          
                if(data[i] != 0) {

                    color = e.context.createLinearGradient(0, half.height - (volume * data[i]), 0, half.height + (volume * data[i]));

                    color.addColorStop(0, makeColor(255, 249, 224, 0.9)); // light yellow
                    color.addColorStop(0.05, makeColor(214, 162, 66, 0.9)); // orange
                    color.addColorStop(0.35, makeColor(196, 85, 21, 0.9)); // light red
                    color.addColorStop(0.45, makeColor(114, 8, 6, 0.9)); // dark red
                    color.addColorStop(0.50, makeColor(45, 48, 71, 0.9)); // dark blue
                    color.addColorStop(0.55, makeColor(114, 8, 6, 0.9)); // dark red
                    color.addColorStop(0.65, makeColor(196, 85, 21, 0.9)); // light red
                    color.addColorStop(0.95, makeColor(214, 162, 66, 0.9)); // orange
                    color.addColorStop(1, makeColor(255, 249, 224, 0.9)); // light yellow

                    e.context.strokeStyle = color;
                    e.context.fillStyle = color;  
                }   

                // stroke the curve.
                // e.context.stroke();
                
                // begin path for next point on the curve.
                // e.context.beginPath();
            
            }
            
            // get the last point.
            e.context.quadraticCurveTo(half.width + (data.length - 2) * padding, 
                                        half.height - (volume * data[data.length - 2]),
                                        half.width + (data.length - 1) * padding,
                                        half.height - (volume * data[data.length - 1]));
            
            // stroke the curve.
            e.context.stroke();
            
            // restore the context.
            e.context.restore();            
        }
    },
    
    // draws the bars as lines.
    drawBars: function(e, data) {
        if(e == null) { e = this.props; }
        if(data == null) { data = e.audio.analyzerNode.getData(); }        
        
        if(e.FLAGS.SHOW_BARS && data != null && data.length > 0){
            let bar = {
                width: 4,
                height: 100,
                padding: (e.CONSTANTS.WIDTH / 2) / e.CONSTANTS.SAMPLES,
                top: 50                
            };
            
            // save the context.
            e.context.save();
            
            e.context.lineCap = 'round';
            e.context.lineWidth = bar.width * 0.2;
            
            // loop through data, if it exists.
            for(let i = 0; i < data.length; i++){
                
                if(data[i] != 0) {
                    let position = {
                        x: (i * bar.padding * 2 + bar.width / 2) + (e.CONSTANTS.WIDTH / 2),
                        x2: (i * -bar.padding * 2 + bar.width / 2) + (e.CONSTANTS.WIDTH / 2),
                        top: e.CONSTANTS.HEIGHT / 2 - data[i] * (e.COMPONENTS.GUI.VOLUME.element.value / 150),
                        bottom: e.CONSTANTS.HEIGHT / 2 + data[i] * (e.COMPONENTS.GUI.VOLUME.element.value / 150)
                    }; 
                    
                    let color = e.context.createLinearGradient(position.x, position.top,
                                                               position.x, position.bottom);
                    
                    color.addColorStop(0, makeColor(255, 249, 224, 0.5)); // light yellow
                    color.addColorStop(0.05, makeColor(214, 162, 66, 0.5)); // orange
                    color.addColorStop(0.35, makeColor(196, 85, 21, 0.5)); // light red
                    color.addColorStop(0.45, makeColor(114, 8, 6, 0.5)); // dark red
                    color.addColorStop(0.50, makeColor(45, 48, 71, 0.5)); // dark blue
                    color.addColorStop(0.55, makeColor(114, 8, 6, 0.5)); // dark red
                    color.addColorStop(0.65, makeColor(196, 85, 21, 0.5)); // light red
                    color.addColorStop(0.95, makeColor(214, 162, 66, 0.5)); // orange
                    color.addColorStop(1, makeColor(255, 249, 224, 0.5)); // light yellow
                    
                    e.context.strokeStyle = color;
                    e.context.fillStyle = color;  
                    
                    e.context.beginPath();
                    e.context.moveTo(position.x, position.top);
                    e.context.lineTo(position.x, position.bottom);
                    e.context.fill();
                    e.context.stroke();                 
                    
                    e.context.beginPath();
                    e.context.moveTo(position.x2, position.top);
                    e.context.lineTo(position.x2, position.bottom);
                    e.context.fill();
                    e.context.stroke();
                }                
            }
            
            // restore the context.
            e.context.restore();            
        }
    },
    
    
    // applies any effects to the canvas.
    drawEffects: function(e){
        if(e == null) { e = this.props; }
                        
        let value = e.ATTRIBUTES.FILTER; // amount to apply to select filter.
        let filterStr = `none`;
                
        if(e.FLAGS.BLUR === true) {
            filterStr = `blur(${value / 10}px)`;
        }
        
        else if(e.FLAGS.GRAYSCALE === true) {
            filterStr = `grayscale(${value}%)`;
        }
        
        else if(e.FLAGS.INVERT === true) {
            filterStr = `invert(${value}%)`;
        }
        
        else if(e.FLAGS.SEPIA === true) {
            filterStr = `sepia(${value}%)`;
        }
        
        e.context.filter = filterStr;
    },
    
    //// service methods.
    
    // Print a message to the console, with an optional debug-only flag.
    print: function(message, debug) {  
        if(message == null) { message = this; }
        log(message, debug);
    },
    
    // write text to the canvas.
    message: function(message, options) {
        if(message != null && this.props.topContext != null) {
            options = options || {};
            options.font = options.font || 'Lato';
            options.fontSize = options.fontSize || 48;
            options.strokeStyle = options.strokeStyle || 'transparent';
            options.fillStyle = options.fillStyle || 'white';
            options.textAlign = options.textAlign || 'center';
            options.textBaseline = options.textBaseline || 'middle';
            options.lineWidth = options.lineWidth || 5;
            options.x = options.x || 0;
            options.y = options.y || 0;
                        
            /* options = {
                font: '48pt Alegreya',
                strokeStyle: 'white',
                textAlign: 'center',
                textBaseline: 'middle',
                x: 0,
                y: 0,                
            };  */      
            
            let context = this.props.topContext;
            context.save();
            context.font = `${options.fontSize}pt ${options.font}`;
            context.lineWidth = options.lineWidth;
            context.strokeStyle = options.strokeStyle;
            context.fillStyle = options.fillStyle;
            context.textAlign = options.textAlign;
            context.textBaseline = options.textBaseline;
            context.strokeText(message, options.x, options.y);
            context.fillText(message, options.x, options.y);
            context.restore();
        }        
    },
    
    // Print a debug message to the console. Will not print if debug is not true.
    printf: function(message) {
        this.print("DEBUG: " + message, this.debug);
    },
            
    // plays the current song.
    playStream: function(e) {
        if(e == null) { e = this.props; }  
        e.audio.source = e.library.currentSong.path;           
        e.audio.play();
        e.audio.volume = (e.COMPONENTS.GUI.VOLUME.element.value / 100);        
        e.ATTRIBUTES.TIME.ELAPSED = 0;
        e.ATTRIBUTES.TIME.BEATS_HIT = 0;   
        e.ATTRIBUTES.TIME.START = e.audio.audioContext.currentTime;   
    },
    
    // clears the screen.
    clearScreen: function(e) {
        if(e == null) { e = this.props; }
        e.context.save();
        
        e.context.fillStyle = e.ATTRIBUTES.BACKGROUND;
        e.context.globalAlpha = e.ATTRIBUTES.FADE_ALPHA;
        e.context.fillRect(0, 0, e.canvas.width, e.canvas.height);        
        
        e.context.restore();
    }
    
}; // end application.main.