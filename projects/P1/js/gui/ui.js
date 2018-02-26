/*
    ui.js - Ian Effendi
    Contains UI element base class.
*/
"use strict";

// The base UI element.
class BaseUIElement {
    
    // Creates a base UI element that takes a selector.
    constructor(selector) {
        if(selector == null) { selector = '#'; }
        
        this.selector = selector;      
        this.type = "UIElement";
        this.element = document.querySelector(selector);     
        
        this.callback = undefined; // The callback associated with the element.
    }
    
    //// properties.
    
    // Returns the human-readable name of the element.
    get name() { 
        return this.selector + " " + this.type;
    }
    
    // Sets the selector of the element.
    set name(value) {
        this.selector = value;
    }
    
    //// methods.
        
    // assign the callback function to the trigger parameter.
    rig(trigger) {
        // console.log("Rigging callback of " + this.name);
        if(trigger = 'onclick') {
            this.element.onclick = this.callback;
        } 
        else if(trigger = 'onchange')
        {
            this.element.onchange = this.callback;
        }
        else if(trigger = 'oninput') 
        { 
            this.element.addEventListener('input', this.callback, false);
            this.element.addEventListener('change', this.callback, false);
        }
        else if(trigger = 'onchecked') 
        { 
            this.element.addEventListener('input', this.callback, false);
            this.element.addEventListener('change', this.callback, false);
            this.element.addEventListener('checked', this.callback, false);
        }
    }
    
    // set the callback functionality up.
    setCallback(func) {
        if(func != null) {
            this.callback = func.bind(this.element);
        }
    }    
    
} // end BaseUIElement.