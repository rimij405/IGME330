/*
    ui.js - Ian Effendi
    Contains UI elements for usage with the visualization application.
*/
"use strict";

// The button performs some form of action on click.
class UIButton {
    
    // Creates a button based off of input DOM selector.
    constructor(selector, func) {
        // selector = query selector to parse button from.
        // func = callback function triggered when button is clicked.
                
        // private properties.
        this.name = selector;
        this.buttonElement = undefined;
        this.callback = undefined;
        
        // methods.
        this.init = function() {
            // setup for callback function.
            this.callback = func;
            
            console.log("Creating button " + selector + ".");
            this.buttonElement = document.querySelector(selector);
            this.buttonElement.onclick = function(e) { 
                console.log(this.name + " button clicked.");
                this.callback(e);
            }.bind(this);           
        }
        
        // Initialize the button.
        this.init();        
    }    
    
} // end UIButton.

// Select elements will call a method on value change.
class UISelect {
    
    // Creates a selection box based off of input DOM selector.
    constructor(selector, func) {
        // selector = query selector to parse select from.
        // func = callback function triggered when select is changed.
                
        // private properties.
        this.name = selector;
        this.selectElement = undefined;
        this.callback = undefined;
        
        // methods.
        this.init = function() {
            // setup for callback function.
            this.callback = func;
            console.dir(func);
            console.dir(this.callback);
            
            console.log("Creating select " + selector + ".");
            this.selectElement = document.querySelector(selector);
            this.selectElement.onchange = function(e) { 
                console.log(this.name + " select value changed to " + e.target.value);
                console.dir(this.callback);
                this.callback(e);
            }.bind(this);     
        }
        
        // Initialize the select.
        this.init();        
    }        
} // end UISelect.

// Slider elements will call a method on value change.
class UISlider {
    
    // Creates a slider based off of input DOM selector.
    constructor(selector, func) {
        // selector = query selector to parse slider from.
        // func = callback function triggered when slider value is changed.
                
        // private properties.
        this.name = selector;
        this.sliderElement = undefined;
        this.callback = undefined;
        
        // methods.
        this.init = function() {
            // setup for callback function.
            this.callback = func;
            
            console.log("Creating slider " + selector + ".");
            this.sliderElement = document.querySelector(selector);
            this.sliderElement.onchange = function(e) { 
                console.log(this.name + " slider value changed to " + e.target.value);
                this.callback(e);
            }.bind(this);        
        }
        
        // Initialize the slider.
        this.init();        
    }        
} // end UISlider.

// Checkbox elements will call a method on value change.
class UICheckbox {
    
    // Creates a checkbox based off of input DOM selector.
    constructor(selector, func) {
        // selector = query selector to parse checkbox from.
        // func = callback function triggered when checkbox value is changed.
                
        // private properties.
        this.name = selector;
        this.checkboxElement = undefined;
        this.callback = undefined;
        
        // methods.
        this.init = function() {
            // setup for callback function.
            this.callback = func;
            
            console.log("Creating checkbox " + selector + ".");
            this.checkboxElement = document.querySelector(selector);
            this.checkboxElement.onchange = function(e) { 
                console.log(this.name + " checkbox value changed to " + e.target.checked);
                this.callback(e);
            }.bind(this);           
        }
        
        // Initialize the checkbox.
        this.init();        
    }        
} // end UICheckbox.