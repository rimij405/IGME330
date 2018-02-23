/*
    ui-button.js - Ian Effendi
    Contains UI button analogy.
*/
"use strict";

// The button performs some form of action on click.
class UIButton extends BaseUIElement {
    
    // Creates a button based off of input DOM selector.
    constructor(selector) {   
        super(selector); // call the parent class constructor.
        
        // Update type.
        this.type = "UIButton";
    }    
    
    // Set the callback function AND rig it to on click.
    setCallback(func) {
        super.setCallback(func); // set the callback function to input parameter.
        this.rig('onclick');
    }   
    
} // end UIButton.