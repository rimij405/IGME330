/*
    app/loader.js
    Dependencies:
        - main.js
        - debug.js
    Description: singleton object
    Creates the global 'app' and loads in the other classes.
    ---
    (C) 2018 - Ian Effendi
*/

"use strict";

// import from global scope, or, create a new object literal.
var app = app || {};

// Call the init method of main on load.
window.onload = function() {
    app.debug.print("window.onload called at " + Date());
    app.main.init();
};

// On loss of focus
window.onblur = function() {
    app.debug.print('blur at' + Date());
    app.main.pause(); 
}

// On regain of focus
window.onfocus = function() {
    app.debug.print('focus at ' + Date());
    app.main.resume();    
}

let vec0 = new Vector2(10, 10);
let vec1 = new Vector2(0, 0);

app.debug.print(`[0]: ${vec0}`);
app.debug.print(`[1]: ${vec1}`);

let mag0 = vec0.magnitude();
let vec3 = vec0.norm();
let mag3 = vec3.magnitude();

app.debug.print(`[0]: ${mag0} - ${vec0}`);
app.debug.print(`[3]: ${mag3} - ${vec3}`);


// Data holds resource and property information for the game.
app.data = (function(){
    
    let game = {
        score: 0,
        muted: true
    }
    
    let resources = {
        images: [
            
        ],
        sounds: [
            
        ]        
    }
        
    // Create a resource object.
    function Resource(name, type, source) 
    {
        this.name = name;
        this.type = type;
        this.src = source;
    }
    
    // Get resource name.
    Resource.prototype.getName = function() {
        return this.name;
    }
    
    // Get resource type.
    Resource.prototype.getType = function() {
        return this.type;
    }
    
    // Get resource source.
    Resource.prototype.getSource = function() {
        return this.src;
    }
    
    // Factory functions:
    
    // Create a general resource path object.
    function CreateResource(name, type, source) {
        return new Resource(name, type, source);
    }
    
    // Create an image resource path object.
    function CreateImageResource(name, source) {
        return CreateResource(name, "image", source);   
    }
    
    // Create an audio resource path object.
    function CreateAudioResource(name, source){
        return CreateResource(name, "audio", source);
    }
    
    return {
        game,
        resources
    }
})();