/*
    graphics/graphics.js
    Dependencies:
        - canvas.js
    Description: singleton object
    handles drawing functionality
    ---
    (C) 2018 - Ian Effendi
*/

"use strict";

// --- MODULE --- //

// import from global scope, or, create a new object literal.
var app = app || {};

// settings associated with the canvas.
app.graphics = (function (title = 'Graphics') {

        // fields //

        // Name of this module.
        const name = title;

        // default module settings.
        const options = {
            // Color to clear the canvas with.
            CLEAR_COLOR: 'black',
            
            // Set draw color.
            DRAW_COLOR: 'white',

            // set the clear color.
            setClearColor(color) {
                this.CLEAR_COLOR = color;
                return this; // for chaining.            
            }
        };

        // functions //    

        // Draw rectangle.
        function draw(context, rect) {
            context.fillRect(rect.x, rect.y, rect.w, rect.h);
        }

        // Clear the canvas.
        function clear(context, {x = 0, y = 0, w = 0, h = 0} = {}) {
            context.save();   
            context.fillStyle = options.CLEAR_COLOR;            
            draw(context, {x, y, w, h});
            context.restore();
        }
        
        // This object as a string.
        function toString() {
            return `Module: ${name} - ${options}`;
        }
    
        // expose functions of this module.
        return {
            name,
            draw,  
            clear,
            toString
        };
}());     
    