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
        WIDTH: 720,
        HEIGHT: 480,
        
        // limits
        SAMPLES: 256,
        RADIUS: {
            MAX: 250,
            MIN: 0
        },
        
        // DOM selector keywords to use.
        SELECTORS: {
            TRACK: "#trackSelect",
            CANVAS: "#mainCanvas",
            HUD: "#uiCanvas",
            MUTE: "#muteButton",
            VOLUME: "#volumeSlider",
            VOLUMELABEL: "#volumeLabel",
            DELAY: "#delaySlider",
            DELAYLABEL: "#delayLabel",
            DATA: "#dataSelect",  
            DISTORTION: "#distortionSlider",
            DISTORTIONLABEL: "#distortionLabel",
            COMPRESSOR: {
                LABELS: {
                    THRESHOLD: "#thresholdLabel",
                    KNEE: "#kneeLabel",
                    RATIO: "#ratioLabel",
                    ATTACK: "#attackLabel",
                    RELEASE: "#releaseLabel"
                },  
                CONTROLS: {
                    THRESHOLD: "#thresholdSlider",
                    KNEE: "#kneeSlider",
                    RATIO: "#ratioSlider",
                    ATTACK: "#attackSlider",
                    RELEASE: "#releaseSlider"
                }
            },
            FILTERS: {     
                BUTTON: 'input[type=radio]',
                NONE: 'input[type="radio"][value="none"]',
                BLUR: 'input[type="radio"][value="blur"]',
                GRAYSCALE: 'input[type="radio"][value="grayscale"]',
                INVERT: 'input[type="radio"][value="invert"]',
                SEPIA: 'input[type="radio"][value="sepia"]',
                AMOUNT: "#filterSlider",
                LABEL: "label#filterLabel.small"
            },
            BIQUAD: {
                LABELS: {
                    FREQUENCY: "#frequencyLabel",
                    DETUNE: "#detuneLabel",
                    Q: "#qLabel"
                },
                CONTROLS: {
                    TYPE: "#filterSelect",
                    FREQUENCY: "#frequencySlider",
                    DETUNE: "#detuneSlider",
                    Q: "#qSlider"
                }
            },
            EFFECTS: {
                LABELS: {
                    RADIUS: "#radiusLabel"
                },
                CONTROLS: {
                    BARS: "#showBarsCheckbox",
                    CURVES: "#showCurvesCheckbox",
                    CIRCLES: "#showCirclesCheckbox",
                    TINT: "#tintCheckbox",
                    NOISE: "#noiseCheckbox",
                    RADIUS: "#radiusSlider"
                }
            }
        }
        
    }),
    
    //// objects
    
    // mutable properties.
    canvas: undefined,
    context: undefined,
    topCanvas: undefined,
    topContext: undefined,
    audio: undefined,
    library: undefined,
    player: undefined,
    
    // components - elements of the HUD and other doohickies.
    COMPONENTS: {
        GUI: {
            TRACKS: undefined,
            VOLUME: undefined,
            MUTE: undefined,
            DELAY: undefined,
            DATATYPE: undefined,
            DISTORTION: undefined,
            FILTERS: {
                BUTTONS: undefined,
                NONE: undefined,
                BLUR: undefined,
                GRAYSCALE: undefined,
                INVERT: undefined,
                SEPIA: undefined,
                AMOUNT: undefined
            },
            COMPRESSOR: {
                THRESHOLD: undefined,
                KNEE: undefined,
                RATIO: undefined,
                ATTACK: undefined,
                RELEASE: undefined,
            },
            BIQUAD: {
                TYPE: undefined,
                FREQUENCY: undefined,
                DETUNE: undefined,
                Q: undefined
            },
            EFFECTS: {
                BARS: undefined,
                CURVES: undefined,
                CIRCLES: undefined,
                TINT: undefined,
                NOISE: undefined,
                RADIUS: undefined
            }
        }
    },
    
    // flags
    FLAGS: {
        
        // state flags.
        DEBUG: false,
        PAUSED: false,
        LOADED: false,
        
        // graphic switches.
        SHOW_BARS: true,
        SHOW_CURVES: true,
        SHOW_CIRCLES: true,
        TINT: false,
        NOISE: false,
        
        CHANGED: false,
        BLUR: false,
        SEPIA: false,
        GRAYSCALE: false,
        INVERT: false,
        
        // mode.
        WAVEFORM_MODE: false // when false, FREQ_MODE is on.   
        
    },
    
    // attributes
    ATTRIBUTES: {
        
        // settings.
        TIME: {
            ELAPSED: 0,
            DELTA: 0,
            PULSE: 0,
            BEATS_HIT: 0,
            START: 0,
            SCALE: 1000
        },
        GLOBAL_ALPHA: 1,
        FADE_ALPHA: 1,
        FILTER: 0,
        DISTORTION: 100,
        BACKGROUND: '#212121',
        TINT: 'blue',
        RADIUS: 50,
        DELAY: 0 // in millseconds
        
    }      
};