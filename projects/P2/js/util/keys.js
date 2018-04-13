/*
    util/keys.js
    Dependencies: ---
    Description: singleton object
    handles drawing functionality
    ---
    (C) 2018 - Ian Effendi
*/

"use strict";

// --- GLOBAL --- //

var keystrokes = {};

keystrokes.KB = Object.freeze({
	"KEY_LEFT": 37, 
	"KEY_UP": 38, 
	"KEY_RIGHT": 39, 
	"KEY_DOWN": 40,
	"KEY_SPACE": 32,
	"KEY_SHIFT": 16,
    "KEY_D": 68,
    "KEY_P": 80
});

// myKeys.keydown array to keep track of which keys are down
// this is called a "key daemon"
// main.js will "poll" this array every frame
// this works because JS has "sparse arrays" - not every language does
keystrokes.keydown = [];

// check if a key was held down.
keystrokes.poll = function(key) {
    if(keystrokes.keydown.length > 0){
        return keystrokes.keydown[this.KB[key]];   
    }
    else {
        return false;
    }
}

// when focus is lost, remove all keystrokes.
keystrokes.reset = function(){
    this.keydown = [];
}

// event listeners
window.addEventListener("keydown",function(e){
	// console.log("keydown=" + e.keyCode);
	keystrokes.keydown[e.keyCode] = true;
});
	
window.addEventListener("keyup",function(e){
	// console.log("keyup=" + e.keyCode);
	keystrokes.keydown[e.keyCode] = false;
	
	// pausing and resuming
	var char = String.fromCharCode(e.keyCode);
	if (char == "p" || char == "P"){
		if (app.main.isPaused()){
			app.main.resume();
		} else {
			app.main.pause();
		}
	}
    
    if (char == "d" || char == "D"){
        // console.log("debug toggled=" + app.debug.flag);
        app.debug.toggle();
    }
});