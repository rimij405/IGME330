/*
    util/convert.js
    Dependencies: ---
    Description: utility methods
    converts values from one format into another.
    ---
    (C) 2018 - Ian Effendi
*/

"use strict";

// Converts input milliseconds into seconds.
function getAsSeconds(milliseconds = 0) {
    if(milliseconds == null || milliseconds === 0 || typeof milliseconds !== 'number') { return 0; }
    else {
        let seconds = Math.round(milliseconds * 100) / (100 * 1000); // for percision purposes.
        return parseFloat(seconds.toFixed(7));
    }
}
    
// Converts input seconds into milliseconds.
function getAsMilliseconds(seconds = 0) {
    if(seconds == null || seconds === 0 || typeof seconds !== 'number') { return 0; }
    else {
        return seconds * 1000;
    }
}

// Assertion check to see if two values meet a specified requirement.
function assert(arg1, arg2, flag = true, message = 'Assertion'){
    if(flag !== true && flag !== false) { return false; }
    else {
        console.log(`${message}: ${arg1} === ${arg2} is ${flag}?`);
        
        let result = (arg1 === arg2);        
        if(result === flag) {
            console.log(`${message} successful.`);
        } 
        else 
        {
            console.log(`${message} not successful.`);            
        }
    }    
}