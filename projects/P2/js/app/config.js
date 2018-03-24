/*
    config.js
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
app.config = (function (title) {

    // fields //

    // name of the module.
    let name = title || "config";
    
    // returns default values.
    const DEFAULTS = Object.freeze({
        WIDTH: 640,
        HEIGHT: 480         
    });

    // contains collection of DOM object IDs.
    const SELECTORS = Object.freeze({
        MAIN_CANVAS: "#mainCanvas"        
    });
    
    // contains the states.
    const STATE = {
        INIT: 0,
        LOADING: 1,
        BEGIN: 2,
        GAME_OVER: 3,
        END: 4
    }
    
    // functions //                       
        
    // export via the revealing module pattern.
    return {
        DEFAULTS,
        SELECTORS,
        STATE
    };
                                  
}());