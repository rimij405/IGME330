/*
    utilities.js - Ian Effendi
    Contains global-scoped functions.
*/

"use strict";

// Functions would go below.

// credit: classwork method.
function makeColor(red, green, blue, alpha){
	var color='rgba('+red+','+green+','+blue+', '+alpha+')';
	return color;
}

// debug message log.
function log(message = "", debug = true) {
    if(debug != null && message != null) {
        if(debug == true){
            console.log(message);   
        }
    }
}