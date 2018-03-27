/*
    app/config.js
    Dependencies: ---
    Description: singleton object
    Contains common definitions.
    ---
    (C) 2018 - Ian Effendi
*/

"use strict";

// import from global scope, or, create a new object literal.
var app = app || {};

// configuration settings given to the application.
app.config = (function (title = 'Configuration') {

    // fields //

    // name of the module.
    const name = title;
    
    // contains the states.
    const STATE = {
        INIT: 0,
        LOADING: 1,
        BEGIN: 2,
        GAME_OVER: 3,
        END: 4,
        PAUSED: 5
    }
    
    // returns default values.
    const DEFAULTS = Object.freeze({
        WIDTH: 640,
        HEIGHT: 420,
        ANIMATION_ID: 0,
        STATE: STATE.INIT,
        FIXED_DELTA: getAsSeconds((1 / 60.0) * 1000),
    });

    // contains collection of DOM object IDs.
    const SELECTORS = Object.freeze({
        MAIN_CANVAS: "#mainCanvas"        
    });
        
    // functions //                       
        
    // export via the revealing module pattern.
    return {
        name,
        DEFAULTS,
        SELECTORS,
        STATE
    };
                                  
}());