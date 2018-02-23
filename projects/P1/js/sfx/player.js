/*
    player.js - Ian Effendi
    Player class keeps track of current songs.
*/
"use strict";

// Player that keeps track of information regarding the music.
class Player {
    
    // sets up properties for the object.
    constructor(){
        this.currentSong = undefined;
        this.startTime = undefined;
        this.elapsedTime = undefined;
        this.deltaTime = undefined;
        this.beatsPassed = undefined;
        this.pulse = 0;
        this.songs = [];
    }
    
    get music() {
        return this.songs;
    }
    
    // adds a song to the collection.
    addSong(music) {
        if(this.songs.length == 0) { this.currentSong = music; }        
        this.songs.push(music);
    }
    
}