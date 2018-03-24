/*
    state.js
    Dependencies: ---
    Description: state object
    Describes the state class.
    ---
    (C) 2018 - Ian Effendi
*/

"use strict";

// --- CLASS --- //

// A state has information about the current status of the game.
class State {
    
    // -- constructor -- //
    
    // creates the state object.
    constructor(state, updateFunc) {
        // set the state.
        this.setState(state);
        this.paused = false;
        this.update = updateFunc;
    }
    
    // -- service methods -- //
    
    // pause the state.
    pause() {
        this.paused = true;
    }
    
    // resume the state.
    resume() {
        this.paused = false;
    }    
    
    // send the canvas object to be as a string.
    toString() {
        return `[object State]\n` 
             + `| Last State: ${this.getLastState()}\n` 
             + `| Current State: ${this.getState()}\n` 
             + `| First Frame: ${this.stateChanged}\n` 
             + `| Elapsed Time: ${this.elapsedTime} seconds.`;
    }
        
    // check if state has just been changed.
    hasStateChanged(){
        return this.stateChanged;        
    }
    
    // check if state has been paused.
    isPaused() {
        return this.paused;
    }
    
    // -- accessors -- //
    
    // the last state.
    getLastState() {
        return this.lastState;
    }
    
    // current state.
    getState(){
        return this.currentState;        
    }
    
    // time since state started.
    getElapsedTime(){
        return this.elapsedTime;        
    }
    
    // -- mutators -- //
    
    // set the state.
    setState(state) 
    {
        this.lastState = this.currentState;
        this.currentState = state;
        this.elapsedTime = 0;
        this.stateChanged = true;
    }
    
    // enables ability to toggle state changed frame flag.
    toggleStateChanged() {
        this.stateChanged = !this.stateChanged;
    }
}