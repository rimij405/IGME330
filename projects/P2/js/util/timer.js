/*
    util/timer.js
    Dependencies: ---
    Description: a timer that handles floating point percision time
    handles the calculation of time
    ---
    (C) 2018 - Ian Effendi
*/

"use strict";

// factory function //

// The timer handles calculations of time.
function Timer({startTime = 0, elapsedTime = 0, deltaTime = 0} = {}) {
    
    // Time in a timer is stored, raw, in milliseconds.
    // Functions exist to retreive this value as seconds.
    // and set as vice versa.
            
    // object construction //    
    let timer = {        
        
        // properties //
        startTime: startTime,
        elapsed: elapsedTime,
        delta: deltaTime,
        lastUpdate: deltaTime,
        animID: 0,
        paused: true,
        
        // functions //
        
        // start the timer.
        start: function() {   
            this.startTime = Math.floor(Date.now());   
            this.resume();
            return this; // for chaining.         
        },
        
        // pause the timer.
        pause: function() {
            this.paused = true;  
            // cancelAnimationFrame(this.animID);
            return this; // for chaining.
        },
        
        // resume the timer.
        resume: function() {
            this.paused = false;
            // this.animID = requestAnimationFrame(this.update.bind(this));
            return this; // for chaining.
        },
        
        // clear the timer.
        clear: function() {
            this.elapsed = 0;
            this.delta = 0;
            return this; // for chaining.
        },
        
        // stop and clear the timer.
        stop: function() { 
            this.pause();
            this.start();
            this.clear();
            return this; // for chaining.
        },       
        
        // update total elapsed time passed.
        updateElapsed: function() {
            this.setElapsed(Math.floor(Date.now()) - this.getStart());
            return this; // for chaining.
        },
                
        // update the time passed since last frame.
        updateDelta: function() {
            let now = Math.floor(Date.now());            
            this.setDelta(now - this.lastUpdate);
            this.lastUpdate = now;
            return this; // for chaining.
        },
                        
        // update the timer.
        update: function() {
            // app.debug.print(this.toString());
            
            if(!this.paused) {
                this.updateElapsed();                
                this.updateDelta();
            }
            // this.animID = requestAnimationFrame(this.update.bind(this));
            return this; // for chaining.
        },
        
        // get the total elapsed time in milliseconds.
        getElapsed: function() {
            return this.elapsed;
        },
        
        // get the total elapsed time in seconds.
        getElapsedSeconds: function() {
            return getAsSeconds(this.getElapsed());
        },
        
        // get the delta time in milliseconds.
        getDelta: function() {
            return this.delta;
        },
        
        // get the delta time in seconds.
        getDeltaSeconds: function() {
            return getAsSeconds(this.getDelta());
        },
        
        // get the start time in milliseconds.
        getStart: function() {
            return this.startTime;
        },
        
        // get the start time in seconds.
        getStartSeconds: function() {
            return getAsSeconds(this.getStart());
        },
        
        // set time in ms.
        setElapsed: function(milliseconds) {
            this.elapsed = milliseconds;
            return this; // for chaining.
        },
        
        // set time in seconds.
        setElapsedSeconds: function(seconds) {
            this.elapsed = getAsMilliseconds(seconds);
            return this; // for chaining.
        },
        
        // set time in ms.
        setDelta: function(milliseconds) {
            this.delta = milliseconds;
            return this; // for chaining.
        },
        
        // set time in seconds.
        setDeltaSeconds: function(seconds) {
            this.delta = getAsMilliseconds(seconds);
            return this; // for chaining.
        },
        
        // set time in ms.
        setStart: function(milliseconds) {
            this.startTime = milliseconds;
            return this; // for chaining.
        },
        
        // set time in seconds.
        setStartSeconds: function(seconds) {
            this.startTime = getAsMilliseconds(seconds);
            return this; // for chaining.
        },
               
        // send the timer to a string.
        toString: function() {
            return `Timer (Is Paused?: ${this.paused})\n`
                + `Start Time: ${this.getStart()} ms\n`
                + `Elapsed Time: ${this.getElapsed()} ms\n`
                + `Delta Time: ${this.getDelta()} ms`;
        }
    }
    
    return timer;    
}

