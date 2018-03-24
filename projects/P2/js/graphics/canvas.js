/*
    canvas.js
    Dependencies: ---
    Description: returns a canvas object.
    Returns a canvas object if one exists in the page.
    ---
    (C) 2018 - Ian Effendi
*/

"use strict";

// --- CLASS --- //

// The canvas object allows us to create multiple canvases.
class Canvas {
    
    // -- constructor -- //
    
    // creates the canvas object.
    constructor(id, init = true) {
        // return if no id supplied.
        if(id == null) { return; }
        
        // fields.
        this.id = id;
        this.canvas = undefined;
        this.context = undefined;
        
        // if true - which it is by default - load the context and canvas immediately.
        if(init) {
            // query the dom for the canvas element.
            this.load();      
        }
    }
    
    // -- service methods -- //
    
    // load the element from the DOM.
    load() {
        if(this.id != null && this.canvas == null){
            this.canvas = document.querySelector(this.id);
            this.context = this.canvas.getContext("2d");
        }
    }
    
    // checks if it has a valid context and canvas.
    hasContext() {
        return ((this.canvas != null) && (this.getContext() != null));        
    }
    
    // -- accessors -- //
    
    // returns the context.
    getContext() {
        if(this.context == null) {        
            this.context = this.getCanvas().getContext("2d");
        }
        return this.context;
    }
    
    // returns the canvas.
    getCanvas() {
        return this.canvas;
    }
    
    // returns the width.
    getWidth() {
        return this.canvas.width;
    }
        
    // returns the height.
    getHeight() {
        return this.canvas.height;
    }
    
    // return the context alpha.
    getAlpha() 
    {        
        return this.context.globalAlpha;   
    }
        
    // -- mutators -- //
    
    // sets the line width.
    setLineWidth(value) 
    {
        if(value != null) {
            this.context.lineWidth = value;
        }
    }
    
    // sets the width
    setWidth(value) {
        if(value != null && typeof value === 'number'){
            this.canvas.width = value;
        }
    }
    
    // sets the height
    setHeight(value) {
        if(value != null && typeof value === 'number'){
            this.canvas.height = value;
        }
    }    
    
    // set the color
    setStyle(type, value) 
    {
        if(type != null && value != null) 
        {
            switch(type.toLowerCase().trim()) {
                case 'fill':
                    this.setFillStyle(value);
                    break;
                case 'stroke':
                    this.setStrokeStyle(value);
                    break;
            }               
        }        
    }
    
    // set fill style
    setFillStyle(value)
    {
        if(value != null) {
            this.context.fillStyle = `${value}`;   
        }        
    }
    
    // set stroke style
    setStrokeStyle(value)
    {
        if(value != null) {
            this.context.strokeStyle = `${value}`;   
        }        
    }
    
    // set the alpha.
    setAlpha(value) 
    {
        if(value != null) {
            this.context.globalAlpha = value;   
        }        
    }
    
    // send the canvas object to be as a string.
    toString() {
        return `${this.id} [object Canvas]\n` 
                        + `| Canvas: ${this.canvas}\n` 
                        + `| Context: ${this.getContext()}`;
    }
    
}

// --- MODULE --- //

// import from global scope, or, create a new object literal.
var app = app || {};

// settings associated with the canvas.
app.graphics = (function (title) {

    // fields //
        
    // name of the module.
    let name = title || "graphics";
    
    // Collection of canvas arrays.
    const CANVAS = {};
    
    // functions //
        
    // initialize the canvas.
    function init() {
        this.debug = app.debug;
        this.config = app.config;
        addCanvas(this.config.SELECTORS.MAIN_CANVAS);
    }
    
    // add and load a canvas to the collection.
    function addCanvas(id) {
        if(id != null && CANVAS[id] == null) {
            let c = new Canvas(id, true);
            CANVAS[id] = c;
            return c;
        }
        return undefined;
    }
    
    // get canvas from collection.
    function getCanvas(id) {
        return CANVAS[id];
    }
    
    // get context from collection.
    function getContext(id) {
        return getCanvas(id).getContext();
    }
        
    // export via the revealing module pattern.
    return {
        init, 
        getCanvas,
        getContext
    };
                                  
}());