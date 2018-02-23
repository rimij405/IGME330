/*
    audio.js - Ian Effendi
    Creates an audio context for use with the main application.
*/
"use strict";

// References used:
// Joe Sullivan's Beat Detection Using Javascript and the Web Audio API: [http://joesul.li/van/beat-detection-using-web-audio/]

// represents a musical piece.
class Music {    
    
    // creates a song by referencing its path.    
    constructor(path, low = 100, high = 200) {       
               
        this.path = path;  // The filepath for the song.
        this.bounds = { // Represents the possible tempo range in the song.
            lower: low,
            upper: high
        };
        this.bpm = undefined; // Beats per minute of the track.
        this.duration = 0; // Duration of the track.
        this.beats = {
            timeBetween: 0,
            offset: 0
        }
    }
    
    // properties.
    get lowerBound() { // Return lower bound tempo of the file.
        return this.bounds.lower;
    }
    
    set lowerBound(value) { // Set lower bound tempo of the file.
        this.bounds.lower = value;
    }
    
    get upperBound() { // Return upper bound tempo of the file.
        return this.bounds.upper;
    }
    
    set upperBound(value) { // Set upper bound tempo of the file.
        this.bounds.upper = value;
    }
    
    get tempo() { // Return tempo of the file.
        return this.bpm;
    }
    
    set tempo(value) { // Set tempo of the file.
        this.bpm = value;
    }
    
    get length() { // Return duration of the file.
        return this.duration;
    }
    
    set length(value) { // Set duration value of the file.
        this.duration = value;
    }
    
    get title() { // Return the title of the file.
        return this.path.split("/")[1].split(".")[0];
    }
    
    // methods.
    
    // calculates the beats per minute in a song!
    calculateTempo() {
        
        let file = this;
        
        // This cool technique was discovered on Joe Sullivan's website.
        
        // First, get an array buffer to hold the a small, central piece of the song.
        let request = new XMLHttpRequest();
        request.open('GET', this.path, true);
        request.responseType = 'arraybuffer';
        
        // When the request is loaded, it will run this callback function.
        request.onload = function() {
            
            // Since we need to cover for cross-platform, we first create a reference to the class.
            let OfflineContextObject = (window.OfflineAudioContext || window.webkitOfflineAudioContext);
            
            // Now, we can call the constructor with the associated parameters, on the pointer we just created.
            let offlineContext = new OfflineContextObject(2, 44100 * 56, 44100);
            
            // Using the provided path, we an put the file into an audio buffer.
            offlineContext.decodeAudioData(request.response, function(arrayBuffer){
                // DecodeAudioData uses the first parameter as the ArrayBuffer and the second parameter as the success callback with the audio buffer as the argument.
                
                // We can query this buffer for metadata, like the total song length.
                this.duration = arrayBuffer.duration;
                
                // Then we can create the buffer that we'll be filtering for the tempo detection algorithm.
                let source = offlineContext.createBufferSource();
                source.buffer = arrayBuffer;
                
                // Filtering out the high frequencies with a low-pass-filter allows us to hear more drumbeats and thus calculate a bpm.
                let filter = offlineContext.createBiquadFilter();
                filter.type = "lowpass";
                filter.frequency.setValueAtTime(140, 0);
                filter.Q.setValueAtTime(1, 0);
                source.connect(filter);
                filter.connect(offlineContext.destination);
                
                // This is the reason we use an 'offline' audio context.
                // It isn't that it's not on the internet: it's that it's not connected to our actual speakers!
                // It's all the data-streaming without any of the enjoyment! (but that's good since we're just using this to do math!)
                source.start(0);
                offlineContext.startRendering();
            }.bind(file));
            
            // Now, on the completion of the audio decode process, we have our next callback function:
            offlineContext.oncomplete = function(source) {
                
                // Retrieves the filtered results from the decode audio data method.
                let render = source.renderedBuffer;
                let arrayBuffer = [];
                
                // This is where we take our small selection of 30 seconds.
                let clipDuration = 44100 * 30;
                let clipStart = 44100 * 10;
                
                // Grabs our samples and pushes them into the buffer.
                for(let i = 0; i < clipDuration; i++) {
                    let sample = Math.abs(render.getChannelData(0)[clipStart + i]);
                    arrayBuffer.push(sample);
                }
                
                // Grabs the peaks from the clips.
                let peaks = [];
                let batches = [];
                let sectionDuration = 44100 / 4; // gives us a quarter of a second.
                let sectionCount = arrayBuffer.length / sectionDuration;
                
                // Loop through each of the sections, and push the maximum peak value for each individual section.
                for(let j = 0; j < sectionCount; j++) {
                    let max = 0;
                    for(let k = j * sectionDuration; k < (j + 1) * sectionDuration; k++) {
                        if(max == 0 || (arrayBuffer[k] > max.volume)) {
                            max = {
                                position: k,
                                volume: arrayBuffer[k]
                            }
                        }
                    }
                    peaks.push(max);
                }
                
                // Sort peaks by volume.
                peaks.sort(function(a, b){
                    return b.volume - a.volume;
                });
                
                // Splice array by peaks larger than the average.
                peaks = peaks.splice(0, peaks.length / 2);
                
                // Sort peaks by position.
                peaks.sort(function(a, b) {
                    return a.position - b.position; 
                });
                
                // Group all of the peaks. (We group possible tempos, tally them up, and choose the one that usually is the highest occurring).
                peaks.forEach(function(peak, index){
                    for(let n = 1; (index + n) < peaks.length && n < 10; n++) {
                        let batch = {
                            bpm: (30 * 44100) / (peaks[index + n].position - peak.position),
                            count: 1,
                            peaks: [peak]
                        }
                        
                        while (batch.bpm < this.lowerBound) {
                            batch.bpm *= 2;
                        }
                        
                        while (batch.bpm > this.upperBound) {
                            batch.bpm *= 2;
                        }
                        
                        batch.bpm = Math.round(batch.bpm);
                        
                        let grouped = false;
                        batches.forEach(function(g){
                            if(g.bpm == batch.bpm) {
                                g.count++;
                                g.peaks.push(batch.peaks[0]);
                                grouped = true;
                                return;
                            }
                        });
                        
                        if(!grouped) {
                            batches.push(batch);
                        }
                    }                    
                }.bind(file));
                
                // Best candidate bpm batch.
                let candidate = batches.sort(function(a, b){
                    return b.count - a.count;
                });
                
                // This candidate's bpm is the estimate.
                this.bpm = candidate[0].bpm;
                                
                // Calculate some other metadata.
                // Calculate the amount of time between each beat in the song.
                this.beats.timeBetween = (this.duration) / ((this.duration / 60.0) * candidate[0].bpm);
                
                // Adjust so that beats are 'on' beat.
                candidate[0].peaks.sort(function(a, b){
                    return a.position - b.position;
                });
                
                let start = candidate[0].peaks[0];
                let startPosition = start.position / sectionDuration;
                let offset = 0;
                do {
                    offset += this.beats.timeBetween;
                } while (offset < startPosition);
                
                // We can now find the beat by getting the elapsed time of the song.
                this.beats.offset = offset - startPosition;
                
            }.bind(file);
            
        }.bind(file);        
    }    
}

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
    
    addAnalyzerNode(samples = 256, waveform = false) {
        console.log("Adding a new analyzer node.");
        let node = new AnalyzerNode(this.audioContext, samples);
        node.setWaveformMode(waveform);
        this.audioNodes.push(node);
                     
        console.log("Updating node connection destinations.");
        for(let i = 0; i < this.audioNodes.length - 1; i++) {
            this.audioNodes[i].connect(this.audioNodes[i + 1].node);
        }
                
        // Connect the most recently added node to the destination.
        this.audioNodes[this.audioNodes.length - 1].connect(this.audioContext.destination);
        console.dir(this.audioNodes);
    }
    
    update() {
        for(let i = 1; i < this.audioNodes.length; i++) 
        {
            console.dir(this.audioNodes[i]);
            this.audioNodes[i].update();            
        }
    }
}
