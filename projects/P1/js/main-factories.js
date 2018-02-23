/*
    main-factories.js - Ian Effendi
    Factory functions for creating objects.
*/
"use strict";

// Create a new empty object literal if app doesn't already exist.
var application = application || {};

// Create the object literal factory functions of application, if they don't already exist.
application.factory = application.factory || {
        
    // use the properties information.
    props: application.props || {},
            
    //// factory functions.
    
    // Reads in the data from a select element in the DOM.
    buildUISelect: function (selector, callback) {
        let element = new UISelect(selector);
        element.setCallback(callback);        
        return element;
    },
    
    // Reads in the data from a button element in the DOM.
    buildUIButton: function (selector, callback) {
        let element = new UIButton(selector);
        element.setCallback(callback);        
        return element;
    },
    
    // Reads in the data from a slider element in the DOM.
    buildUISlider: function (selector, callback) {
        let element = new UISlider(selector);
        element.setCallback(callback);        
        return element;
    },
    
    // Reads in the data from a checkbox element in the DOM.
    buildUICheckbox: function (selector, callback) {
        let element = new UICheckbox(selector);
        element.setCallback(callback);        
        return element;
    }    
};

