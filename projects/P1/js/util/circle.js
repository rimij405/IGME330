/*
    circle.js - Ian Effendi
    Creates a circle class object that can be 'drawn' to the canvas.
*/

class Circle {
    
    constructor(size, color) {
        this.radius = size;
        
        this.color = color || {
            r: 21,
            g: 21,
            b: 21,
            a: 1,
            toColor: function() { return makeColor(this.r, this.g, this.b, this.a); }
        };        
    }
    
    set red(value) {
        this.color.r = value || 0;
        this.color.r = clamp(this.color.r, 0, 255);
    }
    
    set green(value) {
        this.color.g = value || 0;
        this.color.g = clamp(this.color.g, 0, 255);
    }
    
    set blue(value) {
        this.color.b = value || 0;
        this.color.b = clamp(this.color.b, 0, 255);
    }
    
    set opacity(value) {
        this.color.a = value || 0;
        this.color.a = clamp(this.color.a, 0, 1);
    }
    
    getColor() {
        if(this.color.toColor != null){
            return this.color.toColor();
        }
        return this.color;        
    }
    
    setColor(r, g, b, a) {
        this.red = r;
        this.green = g;
        this.blue = b;
        this.opacity = a;
    }
    
    // draw to the canvas.
    draw(context, options){
        let o = options || {};
        o.x = o.x || 0;
        o.y = o.y || 0;
        o.modifier = o.modifier || 1; 
        
        context.save();
        
        let size = this.radius * o.modifier;
        this.opacity = this.color.a;
                
        context.beginPath();
        context.globalAlpha = this.color.a;
        context.fillStyle = this.getColor();
        context.arc(o.x, o.y, clamp(size, o.bounds.min, o.bounds.max), 0, Math.PI * 2, false);
        context.fill();
        
        if(options.name) { console.log("Drawing circle: " + options.name); }
        
        context.restore();
    }
}