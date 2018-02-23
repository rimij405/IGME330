/*
    loader.js - Ian Effendi
    Loads the application and calls the initialization method.
*/
"use strict";

// Create a new empty object literal if app doesn't already exist.
var application = application || {};

// Set up the onload callback function.
window.onload = function() {
    console.log("Window loaded.");
    application.main.init();
    application.main.playStream(application.main.SOUNDS[0]);
    console.dir(application);
}

// Set up the onblur functionality.
window.onblur = function() {
    console.log("Window focus lost at " + Date());
    application.main.paused = true;
    cancelAnimationFrame(application.main.animationID);
    application.main.update();
}

// Set up the focus functionality.
window.onfocus = function() {
    console.log("Window focus gained at " + Date());
    application.main.paused = false;
    application.main.update();
}
