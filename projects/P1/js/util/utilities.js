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
            // console.log(message);   
        }
    }
}

// clamp the value.
function clamp(value, low, high) {
    if(typeof low === 'number' && typeof high === 'number'){
        if(value < low) 
        { 
            return low;
        }   
        else if (value > high) 
        {
            return high;    
        } 
        else
        {
            return value;
        }
    } 
    
    return 0;
}

// [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random]
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}