/*
    music.js - Ian Effendi
    Classes associated with music files and their collections.
    
    /////
    
    // References used:
    // Joe Sullivan's Beat Detection Using Javascript and the Web Audio API: [http://joesul.li/van/beat-detection-using-web-audio/]

    /////
    
    // Class definitions are in this order:
    // Music - Individual songs.
    // MusicLibrary - Collection of music files.
*/
"use strict";

// represents a musical piece.
class Music {    
    
    // creates a song by referencing its path.    
    constructor(path, low = 100, high = 200, index = -1) {       
        this.path = path;  // The filepath for the song.
        this.index = index;
        this.bounds = { // Represents the possible tempo range in the song.
            lower: low,
            upper: high
        };
        this.bpm = 0; // Beats per minute of the track.
        this.duration = 0; // Duration of the track.
        this.beats = {
            timeBetween: 0,
            offset: 0,
            loaded: false,
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
    
    toString() {
        let str = `${this.title} [${this.index}] | Loaded: ${this.beats.loaded} |:`;
        str += `\nFile located at '${this.path}'`;
        str += `\n${this.tempo} BPM | Tempo Bounds: [${this.lowerBound} : ${this.upperBound}]`
        str += `\nDuration of ${this.length} total seconds`;
        str += `\nBeats timed at intervals of ${this.beats.timeBetween} seconds.`;
        str += `\nFirst beat offset by ${this.beats.offset} seconds`;
        return str;
    }
    
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
                    
            // console.log("'" + this.title + "': " + offlineContext);
            // console.dir(offlineContext);
            
            // Using the provided path, we an put the file into an audio buffer.
            offlineContext.decodeAudioData(request.response, function(arrayBuffer){
                // DecodeAudioData uses the first parameter as the ArrayBuffer and the second parameter as the success callback with the audio buffer as the argument.
                
                // console.log("'" + this.title + "': " + offlineContext + " - decodeAudioData() method.");
                
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
                
                // console.log("'" + this.title + "': " + offlineContext + " - startRendering() method.");
                
            }.bind(file));
            
            // Now, on the completion of the audio decode process, we have our next callback function:
            offlineContext.oncomplete = function(source) {
                                
                // console.log("'" + this.title + "': " + offlineContext + " - oncomplete callback method.");
                                
                // Retrieves the filtered results from the decode audio data method.
                let render = source.renderedBuffer;
                let arrayBuffer = [];
                
                // This is where we take our small selection of 30 seconds.
                let clipDuration = 44100 * 30;
                let clipStart = 44100 * 10;
                clipStart = 0;
                
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
                peaks = peaks.splice(0, peaks.length * 0.5);
                
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
                            batch.bpm /= 2;
                        }
                        
                        batch.bpm = Math.round(batch.bpm);
                        
                        let batched = false;
                        batches.forEach(function(item){
                            if(item.bpm == batch.bpm) {
                                item.count++;
                                item.peaks.push(batch.peaks[0]);
                                batched = true;
                                return;
                            }
                        });
                        
                        if(!batched) {
                            batches.push(batch);
                        }
                    }                    
                }, file);
                
                // Best candidate bpm batch.
                let candidate = batches.sort(function(a, b){
                    return b.count - a.count;
                });
                                
                // This candidate's bpm is the estimate.
                this.bpm = candidate[0].bpm;
                                
                // console.log("'" + this.title + "' has " + candidate.length + " candidates.");
                // console.dir(candidate);
                
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
                                
                this.beats.loaded = true;
                
                // console.log("Tempo calculated for " + file.toString());
                
            }.bind(file);
            
        }.bind(file);     
        
        // debugger;
        
        request.send();
    }    
}

// represents a collection of songs.
class MusicLibrary {
    
    // constructor will take the selector id for the track selection object.
    constructor(selectorID, debug = false) {    
        
        // debug flag.
        this.debug = debug;
                
        // keeping track of the library's songs.
        this.collection = [];          
        this.collection.currentSong = 0;
        this.collection.loadedSongs = 0;
        this.loadedIndices = {};
        
        // this.collection.totalSongs = length of collection.
        
        // loads songs for the library.
        this.loadSongs = function (selector){  
            
            // set current song to the first index.
            this.collection.currentSong = 0;
            
            // get the option selector on the DOM with all the songs.
            let element = document.querySelector(selector);
            
            // loop through the DOM element's options for each song.
            for(let i = 0; i < element.options.length; i++) {
                // add each song to the collection.
                if(this.debug) { console.log("Loading song located at: " + element.options[i].value + "."); }
                
                // set index value of option.
                element.options[i].dataset.index = i;
                
                // make song reference.
                let song = new Music(element.options[i].value,
                                     element.options[i].dataset.lower, 
                                     element.options[i].dataset.upper, i);
                
                
                // add the new element to the collection.                
                this.collection.push(song);
                
                // load the tempo for the given song.
                if(this.debug) { console.log("Starting tempo calculation for " + song.title + "."); }
                if(song.tempo == null || song.tempo == 0) {
                    song.calculateTempo();
                }                
            }
            
        }
                        
        // load the songs.
        this.loadSongs(selectorID);
    }
    
    // property to return the collection reference.
    get songs() {
        return this.collection;
    }
    
    get currentSong() {
        return this.songs[this.songs.currentSong];
    }
        
    // check if the tempos have been calculated.
    get temposCalculated() {
        if (this.calcuationsComplete != null) { return true; }
        
        if(this.songs != null && this.songs.length > 0){
            for(let i = 0; i < this.songs.length; i++){
                if(this.songs[i].bpm == null || this.songs[i].bpm == 0 || this.songs[i].beats.timeBetween == 0){
                    return false;
                }
            }   
            this.calculationsComplete = true;
            return true;
        }        
        return false;
    }
    
    // go to the previous song in the library.
    previousSong() {
        if(this.songs != null && this.songs.length > 1) {
            this.songs.currentSong--;
            if(this.songs.currentSong < 0) {
                this.songs.currentSong = this.songs.length - 1;
            }
        }
        else 
        {
            this.songs.currentSong = 0;
        }
    }
    
    // go to the next song in the library.
    nextSong() {
        if(this.songs != null && this.songs.length > 1) {
            this.songs.currentSong++;
            if(this.songs.currentSong >= this.songs.length) {
                this.songs.currentSong = 0;
            }
        }
        else 
        {
            this.songs.currentSong = 0;
        }
    }
    
    // return the library in the form of a string.
    toString() {
        let str = "This MusicLibrary currently contains:\n";
        for(let i = 0; i < this.songs.length; i++){
            str += "[" + (i + 1) + "]: '" + this.songs[i].title + "' at '" + this.songs[i].path + "'";
            if(i < this.songs.length - 1) {
                str += "\n";
            }            
        } 
        
        str += "\n";
        str += "Current Song: [" + this.songs.currentSong + "] '" + this.currentSong.title + "'\n";
        str += "Total Songs: " + this.songs.length + ".\n";
        return str;
    }
        
    // update the music library and currently playing music.
    update() {        
        
        if(!this.temposCalculated) {                     
            // count of loaded songs thus far.            
            for(let i = 0; i < this.songs.length; i++){
                // if(this.loadedIndices["key: " + i]) { continue; }
                if(this.loadedIndices["key: " + i] == null && this.songs[i].beats.loaded === true) {
                    this.songs.loadedSongs++;                    
                    this.loadedIndices["key: " + i] = 'loaded';
                }
            }                        
        }            
    }
        
}
