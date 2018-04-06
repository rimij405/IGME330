/*
    util/vector.js
    Dependencies: ---
    Description: utility methods
    handles vector math and calculations.
    ---
    (C) 2018 - Ian Effendi
*/

"use strict";

// 2-dimensional vector.
function Vector2(x = 0, y = 0){
    this.x = x;
    this.y = y;
}

// Format float values.
function format(value) {
    return +(value.toFixed(3));
}

// Return zero vector.
function ZeroVector() {
    return new Vector2();   
}

// Set the x value.
Vector2.prototype.setX = function(value = 0) {
    this.x = format(value);
}

// Set the y value.
Vector2.prototype.setY = function(value = 0) {
    this.y = format(value);
}

// Set the x and y value.
Vector2.prototype.set = function(x = 0, y = 0){
    this.setX(x);
    this.setY(y);
}

// Checks to see if this vector is zero.
Vector2.prototype.isZero = function() {
    return ((this.x === 0) && (this.y === 0));
}

// Find the magnitude for a vector.
Vector2.prototype.magnitude = function() {
    let length = Math.pow(this.x, 2) + Math.pow(this.y, 2);
    return format(Math.sqrt(length));
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
