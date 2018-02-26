/*
    audio.js - Ian Effendi
    Creates an audio context for use with the main application.
*/
"use strict";

class StereoPannerNode {
    
    constructor(audioContext, panValue) {
        // TODO. stub.
    }
    
}

class CompressorNode {
    
    constructor(audioContext, options){
        this.options = options;
        
        if(options == undefined) { 
            this.options = {
                threshold: -24,
                knee: 30,
                ratio: 12,
                attack: 0.003,
                release: 0.25
            };
        }
        
        this.node = audioContext.createDynamicsCompressor();        
        
        let time = audioContext.currentTime;
        this.setValueAtTime('threshold', this.options.threshold, time);
        this.setValueAtTime('knee', this.options.knee, time);
        this.setValueAtTime('ratio', this.options.ratio, time);
        this.setValueAtTime('attack', this.options.attack, time);
        this.setValueAtTime('release', this.options.release, time);
        
    }
    
    set threshold(value) {
        this.options.threshold = typeof value === 'number' ? value : -24;
    }
    
    set knee(value) {
        this.options.knee = typeof value === 'number' ? value : 30;
    }
    
    set ratio(value) {
        this.options.ratio = typeof value === 'number' ? value : 12;
    }
        
    set attack(value) {
        this.options.attack = typeof value === 'number' ? value : 0.003;
    }
    
    set release(value) {
        this.options.release = typeof value === 'number' ? value : 0.25;
    }
    
    connect(destination) {
        this.node.connect(destination);
    }
    
    update() {        
    }
    
    setValueAtTime(property, value, time = 0) {
        if(property != null){
            switch(property) {
                case 'threshold':
                    this.threshold = value;
                    this.node.threshold.setValueAtTime(this.options.threshold, time);
                    break;
                case 'knee':
                    this.knee = value;
                    this.node.knee.setValueAtTime(this.options.knee, time);
                    break;
                case 'ratio':
                    this.ratio = value;
                    this.node.ratio.setValueAtTime(this.options.ratio, time);
                    break;
                case 'attack':
                    this.attack = value;
                    this.node.attack.setValueAtTime(this.options.attack, time);
                    break;
                case 'release':
                    this.release = value;
                    this.node.release.setValueAtTime(this.options.release, time);
                    break;
            }
        }
    }
    
}

// [https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode]
class DistortionNode {
    
    constructor(audioContext, distortionSeed = 50, oversample = '4x'){
        this.seed = distortionSeed;
        this.samples = oversample || '4x';
        this.node = audioContext.createWaveShaper();
    }    
    
    findCurveUsingSeed(seed = 50) {
        var k = typeof seed === 'number' ? seed : 50,
            n_samples = 44100,
            curve = new Float32Array(n_samples),
            deg = Math.PI / 180,
            i = 0,
            x;
        for ( ; i < n_samples; ++i ) {
            x = i * 2 / n_samples - 1;
            curve[i] = ( Math.PI + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
        }
        return curve;
    }
    
    set curve(value) {
        this.seed = value;
        // console.log("seed: " + this.seed);
        this.node.curve = this.findCurveUsingSeed(this.seed);
    }
    
    set oversamples(value) {        
        this.samples = `${value}x`;
        this.node.oversample = this.samples;
    }
    
    connect(destination) {
        this.node.connect(destination);
    }
    
    update(){
        // console.log(application.props.ATTRIBUTES.DISTORTION);
        // this.curve = application.props.ATTRIBUTES.DISTORTION;
    }    
    
}

class DelayNode {
    
    constructor(audioContext, delayAmount = 0) {
        this.delay = delayAmount || 0;
        this.node = audioContext.createDelay(0.5);
        this.setDelayAtTime(delayAmount, 0);
        this.type = "Delay";
    }
    
    setDelayAtTime(delayAmount, time = 0) {
        this.node.delayTime.setValueAtTime(delayAmount, time);
    }
    
    connect(destination) {
        this.node.connect(destination);
    }
    
    update() {
    }
        
}

// creates an analyzer node for use with an audio context.
class AnalyzerNode {
    
    constructor(audioContext, samples) {
        if(samples == null) { samples = application.props.CONSTANTS.SAMPLES; }
        this.node = audioContext.createAnalyser();
        this.node.fftSize = samples;
        this.data = undefined;
        this.waveform = false;
        this.type = "Analyzer";
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
        this.delayNode = undefined;
        this.distortionNode = undefined;
        this.compressor = undefined;
        this.analyzerNode = undefined;
        this.biquadNode = undefined;
        this.gainNode = undefined;
        this.audioNodes = undefined;
                                
        // private, internal functions.
        this.init = function() {
            // console.log("Initializing the audio element.");
            this.audioElement = document.querySelector('audio');
            
            // console.log("Creating the audio context.");
            this.audioContext = new (window.AudioContext || window.webkitAudioContext);
            
           //  console.log("Creating and hooking the source node.");
            this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);
            
            // console.log("Creating collection for analyzer nodes.");
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
            // console.log("Adding node to context.");
            
            // Add node to chain.
            this.audioNodes.push(node);
            // console.dir(node);
            
            // console.log("Updating node connection destinations.");
            // for(let i = 0; i < this.audioNodes.length - 1; i++) {
               // this.audioNodes[i].connect(this.audioNodes[i + 1].node);
            // }

            // Connect the most recently added node to the destination.
            // this.audioNodes[this.audioNodes.length - 1].connect(this.audioContext.destination);            
        }
    }
    
    addCompressor(options) {
        let node = new CompressorNode(this.audioContext, options);
        
        if(this.compressor == null) { this.compressor = node; }
        // this.addNode(node);
    }
    
    addGainNode(){
        if(this.gainNode == null) { this.gainNode = this.audioContext.createGain(); }
    }
    
    addBiquadFilter() {
        if(this.biquadNode == null) { this.biquadNode = this.audioContext.createBiquadFilter(); }
        
        this.biquadNode.type = 'allpass';
        this.biquadNode.frequency.setValueAtTime(350, this.audioContext.currentTime);
        this.biquadNode.detune.setValueAtTime(0, this.audioContext.currentTime);
        this.biquadNode.Q.setValueAtTime(0.001, this.audioContext.currentTime);
    }
    
    addDistortionNode() {
        // console.log("Adding a new distortion node.");
        let node = new DistortionNode(this.audioContext);
        // this.addNode(node);
        
        if(this.distortionNode == null) { this.distortionNode = node; }
    }
    
    addDelayNode() {
        // console.log("Adding a new delay node.");
        let node = new DelayNode(this.audioContext);
        // node.connect(this.audioContext.destination);
        // this.addNode(node);
        
        if(this.delayNode == null) { this.delayNode = node; }
    }
    
    addAnalyzerNode(samples = 256, waveform = false) {
        if(waveform == null) { waveform = application.props.FLAGS.WAVEFORM_MODE; }
        // console.log("Adding a new analyzer node.");
        let node = new AnalyzerNode(this.audioContext, samples);
        node.setWaveformMode(waveform);
        this.addNode(node);     
        
        if(this.analyzerNode == null) { this.analyzerNode = node; }
    }
    
    connectNodes() {
        this.addGainNode();
        this.addBiquadFilter();
        
        this.sourceNode.disconnect(this.audioContext.destination);        
        this.sourceNode.connect(this.delayNode.node);
        this.sourceNode.connect(this.compressor.node);
        
        this.compressor.connect(this.distortionNode.node);
        
        this.delayNode.connect(this.biquadNode);
        this.distortionNode.connect(this.biquadNode);        
        this.distortionNode.connect(this.biquadNode);      
        
        this.biquadNode.connect(this.gainNode);
        
        this.gainNode.connect(this.audioContext.destination);
        this.gainNode.connect(this.analyzerNode.node);
        
        // this.sourceNode.connect(this.delayNode.node);
        // this.sourceNode.connect(this.distortionNode.node);
        
        
        // this.delayNode.node.connect(this.analyzerNode.destination);
    //    this.distortionNode.node.connect(this.analyzerNode.destination);
      //  this.analyzerNode.node.connect(this.audioContext.destination);
    }
    
    update(e) {
        if(e == null) { e = application.props; }
        
        let library = e.library;
        let t = e.ATTRIBUTES.TIME;
        
        // update time calculations.        
        t.DELTA = (this.audioContext.currentTime - t.START);
        
        // When not paused.
        if(!this.audioElement.paused){
            
            // decrease tempo pulse
            if(t.PULSE > 0) {
                t.PULSE -= t.DELTA;
            }
            
            // elapsed time is updated
            t.ELAPSED = parseFloat(t.DELTA.toFixed(7)) + parseFloat(t.ELAPSED.toFixed(7));
            
            // by counting beats, we can affect elements on the screen.
            while(t.ELAPSED >= (library.currentSong.beats.offset) + (library.currentSong.beats.timeBetween * t.BEATS_HIT)) {
                t.BEATS_HIT++;     
                if(!this.audioElement.muted){
                    if(library.currentSong.bpm > 100) {
                        t.PULSE = (75 / 1000);
                    } 
                    else
                    {
                        t.PULSE = (35 / 1000);
                    }
                }                
            }          
        
        }       
                    
        // update the next frame's starting time.
        t.START = this.audioContext.currentTime;

        // update the individual nodes that need to be updated.
        for(let i = 1; i < this.audioNodes.length; i++) 
        {
            // console.dir(this.audioNodes[i]);
            this.audioNodes[i].update();            
        }
        
    }
}
