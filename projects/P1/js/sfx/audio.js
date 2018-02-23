/*
    audio.js - Ian Effendi
    Creates an audio context for use with the main application.
*/
"use strict";

// creates an analyzer node for use with an audio context.
class AnalyzerNode {
    
    constructor(audioContext, samples) {
        this.node = audioContext.createAnalyser();
        this.node.fftSize = samples;
        this.data = undefined;
        this.waveform = false;
    }

    setFrequencyMode(value) {
        this.waveform = !value;
    }
    
    setWaveformMode(value) {
        this.waveform = value;
    }
    
    connect(destination) {
        this.node.connect(destination);
    }
    
    update() {        
        // Create array.
        this.data = new Uint8Array(this.node.fftSize / 2);
        
        // Populate array based on mode.
        if(this.waveform) {
            this.node.getByteTimeDomainData(this.data);
        }
        else 
        {
            this.node.getByteFrequencyData(this.data);
        }
    }
    
    getData() {
        return this.data;
    }
        
}

class AudioElement {
    
    // Retrieves the audio element from the document.
    constructor() {        
        // class properties.
        this.audioElement = undefined;
        this.audioContext = undefined;
        this.sourceNode = undefined;
        this.audioNodes = undefined;
                
        // private, internal functions.
        this.init = function() {
            console.log("Initializing the audio element.");
            this.audioElement = document.querySelector('audio');
            
            console.log("Creating the audio context.");
            this.audioContext = new (window.AudioContext || window.webkitAudioContext);
            
            console.log("Creating and hooking the source node.");
            this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);
            
            console.log("Creating collection for analyzer nodes.");
            this.audioNodes = [];
            this.audioNodes.push(this.sourceNode);
            this.sourceNode.connect(this.audioContext.destination);
        }
        
        // Calling the method.
        this.init();
    }
    
    // properties.    
    get source() {
        return this.audioElement.src;
    }
    
    set source(value) {
        this.audioElement.src = value;
    }
    
    get volume() {
        return this.audioElement.volume;
    }
    
    set volume(value) {
        this.audioElement.volume = value;
    }
    
    // methods.
    play() {
        this.audioElement.play();
    }
    
    addNode(node) {
        if(node != null) {
            console.log("Adding node to context.");
            
            // Add node to chain.
            this.audioNodes.push(node);
            
            console.log("Updating node connection destinations.");
            for(let i = 0; i < this.audioNodes.length - 1; i++) {
                this.audioNodes[i].connect(this.audioNodes[i + 1].node);
            }

            // Connect the most recently added node to the destination.
            this.audioNodes[this.audioNodes.length - 1].connect(this.audioContext.destination);            
        }
    }
    
    addAnalyzerNode(samples = 256, waveform = false) {
        console.log("Adding a new analyzer node.");
        let node = new AnalyzerNode(this.audioContext, samples);
        node.setWaveformMode(waveform);
        this.addNode(node);       
        console.dir(this.audioNodes);
    }
    
    update() {
        for(let i = 1; i < this.audioNodes.length; i++) 
        {
            // console.dir(this.audioNodes[i]);
            this.audioNodes[i].update();            
        }
    }
}
