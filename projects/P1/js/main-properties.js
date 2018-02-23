/*
    main-properties.js - Ian Effendi
    Main controller class properties for the visualizer application.
*/
"use strict";

// Create a new empty object literal if app doesn't already exist.
var application = application || {};

// Create the object literal properties of application, if they don't already exist.
application.props = application.props || { 
    
    // CONSTANTS
    CONSTANTS: Object.freeze({
        
        // dimensions
        WIDTH: 640,
        HEIGHT: 480,
        
        // limits
        RADIUS: {
            MAX: 250,
            MIN: 0
        },
        
        // DOM selector keywords to use.
        SELECTORS: {
            TRACK: "#trackSelect",
            CANVAS: "canvas"
        }
        
    }),
    
    // objects.
    
    
    // mutable properties.
    canvas: undefined,
    context: undefined,
    audio: undefined,
    library: undefined,
    player: undefined,
    
    // components - elements of the HUD and other doohickies.
    COMPONENTS: {
        GUI: {
            TRACKS: undefined 
        }
    },
    
    // flags
    FLAGS: {
        
        // state flags.
        DEBUG: false,
        PAUSED: false,
        
        // graphic switches.
        SHOW_BARS: false,
        SHOW_QUADS: false,
        SHOW_BEZIER: false,
        
        BLUR: false,
        SEPIA: false,
        TINT: false,
        INVERT: false,
        NOISE: false,
        LINES: false,
        
        // mode.
        WAVEFORM_MODE: false // when false, FREQ_MODE is on.   
        
    },
    
    // attributes
    ATTRIBUTES: {
        
        // audio settings
        THRESHOLD: 0,
        FREQUENCY: 0,
        AUDIO_PAN: 50,
        DELAY: 0.5 // in millseconds
        
    }      
};