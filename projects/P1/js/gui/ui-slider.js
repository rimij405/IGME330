/*
    ui-slider.js - Ian Effendi
    Contains slider form element analogy.
*/
"use strict";

// Slider elements will call a method on value change.
class UISlider extends BaseUIElement {
    
    // Creates a slider based off of input DOM selector.
    constructor(selector) {   
        super(selector); // call the parent class constructor.
        
        // Update type.
        this.type = "UISlider";
    }    
    
    // Set the callback function AND rig it to on click.
    setCallback(func) {
        super.setCallback(func); // set the callback function to input parameter.
        this.rig('onchange');
    }   
    
} // end UISlider.