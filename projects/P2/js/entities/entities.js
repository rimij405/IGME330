/*
    entities.js
    Dependencies: ---
    Description: Entities to create.
    ---
    (C) 2018 - Ian Effendi
*/

"use strict";

// Entity represented in the world.
function Entity(vPos, vVel, vAcc) {
    this.position = (vPos == null) ? vPos : new Vector2(0, 0);
    this.direction = (vVel == null) ? vVel.norm() : new Vector2(0, 1);
    this.speed = 0;
    this.acceleration = 0;    
}

// Hard set the entity position.
Entity.prototype.place = function(x, y) {
    this.position = new Vector2();
}

// Update the physics of the entity.
Entity.prototype.updatePhysics = function(delta) {
    this.velocity += acceleration * delta;
    this.position += velocity * delta;
}

Entity.prototype.setDirection = function(x, y) {
    // normalize the vector.
    let vec = new Vector2(x, y).norm();
    this.direction.set(vec.x, vec.y);    
}