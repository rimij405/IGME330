/*
    app/debug.js
    Dependencies: ---
    Description: singleton object
    Creates a debugger object.
    ---
    (C) 2018 - Ian Effendi
*/

"use strict";

// import from global scope, or, create a new object literal.
var app = app || {};

// debug flag set.
app.debug = {
    
    // debug module value.
    flag: true,
    
    // debugger.
    break: function(callingMethod = 'Unknown Method', lineNumber = 'unknown line'){
        if(this.flag) {
            if(typeof callingMethod === 'number') { callingMethod = 'Unknown Method'; }
            if(typeof lineNumber !== 'number') { lineNumber = "unknown line"; }
            else { lineNumber = `line [${lineNumber}]`; }
            console.log(`Breakpoint set by ${callingMethod} on ${lineNumber}.`);
            debugger;
        }
    },
    
    // debug console.dir() method.
    dir: function(obj) { 
        if(this.flag) { 
            console.dir(obj); 
        } 
    },
        
    // debug console.log() method.
    print: function(message) { 
        if(this.flag) { 
            console.log(`${message}`); 
        } 
    },
        
    // toggle the debug flag value.
    toggle: function() { 
        this.flag = !this.flag;
    },
    
    // hard set the debug flag value.
    set: function(value) { 
        if(value === true) { this.flag = true; }
        else if(value === false) { this.flag = false; }
        else { this.print(`Warning: Input value of ${value} is invalid.`); }
    }
    
};