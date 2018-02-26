/*
    ui-checkbox.js - Ian Effendi
    Contains checkbox form element analogy.
*/
"use strict";

// Checkbox elements will call a method on value change.
class UICheckbox extends BaseUIElement {
    
    // Creates a checkbox based off of input DOM selector.
    constructor(selector) {   
        super(selector); // call the parent class constructor.
        
        // Update type.
        this.type = "UICheckbox";
    }    
    
    // Set the callback function AND rig it to on click.
    setCallback(func) {
        super.setCallback(func); // set the callback function to input parameter.
        this.rig('onchecked');
    }   
    
} // end UICheckbox.