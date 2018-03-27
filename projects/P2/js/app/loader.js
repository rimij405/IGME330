/*
    app/loader.js
    Dependencies:
        - main.js
        - debug.js
    Description: singleton object
    Creates the global 'app' and loads in the other classes.
    ---
    (C) 2018 - Ian Effendi
*/

"use strict";

// import from global scope, or, create a new object literal.
var app = app || {};

// Call the init method of main on load.
window.onload = function() {
    app.debug.print("window.onload called at " + Date());
    app.main.init();
};

// On loss of focus
window.onblur = function() {
    app.debug.print('blur at' + Date());
    app.main.pause(); 
}

// On regain of focus
window.onfocus = function() {
    app.debug.print('focus at ' + Date());
    app.main.resume();    
}