/*
    util/vector.js
    Dependencies: ---
    Description: utility methods
    handles vector math and calculations.
    ---
    (C) 2018 - Ian Effendi
*/

"use strict";

// Format float values.
function format(value) {
    return +(value.toFixed(3));
}

let Range = (function(){
    
    // constructor.
    function Range(min, max){
        this.min = min;
        this.max = max;
    }
        
    // private functions.
    
    // check if the input value is between a maximum and a minimum for a range.
    function isBetween(value) {
        if(value && typeof value === 'number')
        {
            if(!this.hasLimits()) 
            {
                // if no limits, and value is a number, it's valid.
                return true;   
            }
            else
            {
                let valid = false;
                if(this.hasMaximum()) {
                    valid = valid && (value < this.max.value);
                }
                return valid;
            }
        }
        else
        {
            return false;
        }
    }
    
    // Prototype inheritance call.
    Range.prototype = Object.create({}, {
        toString: {
            value: function(){ };
        }        
    });
    
    // Set maximum on the range (and determine if it's inclusive or not).
    Range.prototype.setMaximum = function(value, inclusive) {
        this.max = {
            value: value ? value : undefined,
            inclusive: inclusive ? inclusive : false
        };
        return this;
    }
    
    // Set minimum on the range (and determine if it's inclusive or not).
    Range.prototype.setMinimum = function(value, inclusive) {
        this.min = {
            value: value ? value : undefined,
            inclusive: inclusive ? inclusive : false
        };
        return this;
    }
    
    // Check if less than max.
    Range.prototype.underMaximum = function(value) {
        if(value != null && typeof value === 'number'){
            if(this.hasMaximum()){
                if()
            }
            return true;
        }
        return false;
    }
    
    // Check if there's a maximum associated with this range.
    Range.prototype.hasMaximum = function() {
        return (this.max != null || this.max.value != null);
    }
    
    // Check if there's a minimum associated with this range.
    Range.prototype.hasMinimum = function() {
        return (this.min != null || this.min.value != null);
    }
    
    // Check if there are limits on this range.
    Range.prototype.hasLimits = function() {
        return (this.hasMaximum() && this.hasMinimum());
    }
    
    // Factory function.
    function createRange = function(min, max){
        return new Range(min, max);
    }
    
    return {
        create: createRange,
        parent: Range
    };
    
})();

let Vector2 = (function(){
    
    // 2-dimensional vector.
    function Vector2(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }

    // Prototype inheritance call.
    Vector2.prototype = Object.create({}, {

        // Set the x and y value.
        set: {
            value: function(x = 0, y = 0){
                this.setX(x);
                this.setY(y);
                return this;
            },
            writable: false,
            configurable: false,
            enumerable: false
        },

        // Set the x value.
        setX: {
            value: function(value = 0) {
                this.x = format(value);
                return this;
            },
            writable: false,
            configurable: false,
            enumerable: false
        },

        // Set the y value.
        setY: {
            value: function(value = 0) {
                this.y = format(value);
                return this;
            },
            writable: false,
            configurable: false,
            enumerable: false
        },

        // Checks to see if this vector is zero.
        isZero: { 
            value: function() {
                return ((this.x === 0) && (this.y === 0));
            },
            writable: false,
            configurable: false,
            enumerable: false
        },

        // Find the magnitude for a vector.
        magnitude: { 
            value: function() {
                let length = Math.pow(this.x, 2) + Math.pow(this.y, 2);
                return format(Math.sqrt(length));
            },
            writable: false,
            configurable: false,
            enumerable: false
        },

    });

    // Factory function.
    function CreateVector2(x = 0, y = 0){
        return new Vector2(x, y);
    }

    // Return zero vector.
    function ZeroVector() {
        return new Vector2();   
    }

    // Scale x dimension.
    Vector2.prototype.scaleX = function(scalar = 1) {
        this.x *= scalar;
        this.x = format(this.x);
        return this;
    }

    // Scale y dimension.
    Vector2.prototype.scaleY = function(scalar = 1) {
        this.y *= scalar;
        this.y = format(this.y);
        return this;
    }

    // Scale the vector by a scalar.
    Vector2.prototype.scale = function(scalar = 1) {
        this.scaleX(scalar);
        this.scaleY(scalar);
        return this;
    }

    // Normalize a copy of this vector and return it.
    Vector2.prototype.norm = function() {
        let vec = new Vector2(this.x, this.y);
        if(this.isZero()) { return vec; }
        vec.scale(1 / vec.magnitude());
        return vec;
    }

    // Add x value.
    Vector2.prototype.addX = function(x) {
        this.x += x;
        this.x = format(this.x);
        return this;
    }

    // Add y value.
    Vector2.prototype.addY = function(y) {
        this.y += y;
        this.y = format(this.y);
        return this;
    }

    // Add values.
    Vector2.prototype.add = function(x = 0, y = 0){
        this.addX(x);
        this.addY(y);
        return this;
    }

    // Add vector.
    Vector2.prototype.addVector = function(vec = undefined){
        if(vec != null) {
            if(!vec.isZero()) { this.add(vec.x, vec.y); }
        }
        return this;
    }

    // Negate x dimension.
    Vector2.prototype.negateX = function() {
        this.x *= -1;
        return this;
    }

    // Negate y dimension.
    Vector2.prototype.negateY = function() {
        this.y *= -1;
        return this;
    }

    // Negate vector values.
    Vector2.prototype.negate = function() {
        this.negateX();
        this.negateY();
        return this;
    }

    // Swap vector values.
    Vector2.prototype.flip = function() {
        let temp = this.x;
        this.x = this.y;
        this.y = temp;
        return this;
    }

    // Print the vector2 object.
    Vector2.prototype.toString = function() {
        return `Vector2 <${this.x}, ${this.y}> [${this.magnitude()}]`;
    }
    
    return {
        create: CreateVector2,
        ZeroVector: ZeroVector,
        parent: Vector2
    };

})();

