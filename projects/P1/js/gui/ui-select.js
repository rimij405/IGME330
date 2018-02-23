/*
    ui-select.js - Ian Effendi
    Contains select form element analogy.
*/
"use strict";

// Select elements will call a method on value change.
class UISelect extends BaseUIElement {
    
    // Creates a select based off of input DOM selector.
    constructor(selector) {   
        super(selector); // call the parent class constructor.
        
        // Update type.
        this.type = "UISelect";
    }    
    
    // Set the callback function AND rig it to on click.
    setCallback(func) {
        super.setCallback(func); // set the callback function to input parameter.
        this.rig('onchange');
    }   
    
} // end UISelect.