/*
    entities.js
    Dependencies: ---
    Description: Entities to create.
    ---
    (C) 2018 - Ian Effendi
*/

"use strict";

// Base object.
const empty = {}; // an empty object for creating prototypes.

let Component = (function(){
        
    // Base game object.    
    function Component(identifier) {
        this.name = identifier ? identifier : "Component";       
    }
         
    Component.prototype = Object.create(empty, {
        getName: {
            value: function(){ return `${this.name.trim()}`; },
            writable: false,
            configurable: false,
            enumerable: false
        },
        getKey: {
            value: function(){ return this.getName().trim().toLowerCase(); }
        },
        toString: {
            value: function(){ return `${this.name}`; },
            writable: false,
            configurable: false,
            enumerable: false
        },
        is: {
            value: function(name){ return this.name.trim().toLowerCase() === name.trim().toLowerCase(); },
            writable: false,
            configurable: false,
            enumerable: false
        },
        clone: {
            value: function() { return new Component(this.name); },
            writable: false,
            configurable: false,
            enumerable: false            
        }
    });
    
    // Position component.
    function PositionComponent(position) {
        Component.call(this, "Position");
        this.position = position ? Vector2.create(position.x, position.y) : Vector2.create();
    }
    
    PositionComponent.prototype = Object.create(Component.prototype, {
        toString: {
            value: function() { return `${this.getName()}:\n${this.position}`; },
            writable: false,
            configurable: false,
            enumerable: false
        },
        get: {
            value: function() { return this.position; }
        },
        getX: {
            value: function() { return this.position.x; }
        },
        getY: {
            value: function() { return this.position.y; }
        },
        set: {
            value: function(x = 0, y = 0) {
                this.position.set(x, y);
                return this;
            }
        },
        setX: {
            value: function(x) { 
                if(x) { this.position.setX(x); }
                return this;
            }
        },
        setY: {
            value: function(y) { 
                if(y) { this.position.setY(y); }
                return this;
            }
        },
        translate: {
            value: function(x = 0, y = 0) {
                this.position.addVector(Vector2.create(x, y));
                return this;
            }
        },
        clone: {
            value: function(){
                return new PositionComponent({
                    x: this.getX(),
                    y: this.getY()
                });
            }
        }
    });
    
    // Velocity component.
    function VelocityComponent(direction, speed) {
        Component.call(this, "Velocity");
        this.direction = direction ? Vector2.create(direction.x, direction.y).norm() : Vector2.create();
        this.speed = speed ? speed : 0;
    }
    
    VelocityComponent.prototype = Object.create(Component.prototype, {
        
        
        
    });
    
    function CreateComponent(name){
        return new Component(name);
    }
    
    function CreatePositionComponent(position) {
        return new PositionComponent(position);
    }
    
    function CreateVelocityComponent(direction, speed) {
        return new VelocityComponent(direction, speed);
    }
    
    return {
        // create: CreateComponent,
        createPosition: CreatePositionComponent,
        createVelocity: CreateVelocityComponent,
        parent: Component
    };
    
})();

let GameObject = (function(){    
    
    // Base game object.    
    function GameObject(identifier) {
        this.name = identifier ? identifier : "Empty GameObject";
        this.components = {};
    }
    
    function formatKey(value = "") {
        return value.trim().toLowerCase();
    }
    
    GameObject.prototype = Object.create(empty, {
        toString: {
            value: function(){ return `${this.name}`; },
            writable: false,
            configurable: false,
            enumerable: false
        },
        update: {
            value: function() { 
                let compKeys = this.getAllComponentKeys();
                if(this.compKeys.length > 0){
                    for(let i = 0; i < compKeys.length; i++){
                        if(this.components[compKeys[i]].update){
                            this.components[compKeys[i]].update();
                        };
                    }
                }
                return this;
            },
            writable: true,
            configurable: true,
            enumerable: false            
        },
        getAllComponents: {
            value: function(){ return this.components; }
        },
        getAllComponentKeys: {
            value: function(){ return Object.keys(this.components); }
        },
        hasComponent: {
            value: function(componentKey){
                return componentKey ? (
                    this.components.hasOwnProperty(`${formatKey(componentKey)}`)
                ) : false;
            }
        },
        addComponent: {
            value: function(component){
                if(!this.hasComponent(component.getKey())){
                    this.components[`${component.getKey()}`] = component;
                }
                return this.getComponent(component.getKey());
            }
        },
        removeComponent: {
            value: function(component){
                if(this.hasComponent(component.getKey())){
                    let key = `${component.getKey()}`;
                    let obj = this.components[key];
                    this.components[key] = undefined;
                    delete this.components[key];
                    return obj;
                }
                return null;
            }
        },
        getComponent: {
            value: function(name){
                let key = formatKey(name);
                if(this.hasComponent(key)){
                    return this.components[key];
                }
                return null;
            }
        }        
    });
          
    function Entity(identifier){
        
    }
    
    function CreateGameObject(name){
        return new GameObject(name);
    }
    
    return {
        create: CreateGameObject,
        parent: GameObject.prototype
    };
    
})();

var app = app || {};

app.factory = (function(){
    
    let pos1 = Component.createPosition().set(10, 10);
    console.log(`${pos1}`);
    
    pos1.translate(10, 0);
    console.log(`${pos1}`);
    
})();
