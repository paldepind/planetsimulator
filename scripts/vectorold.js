// Simple vector class

define(["libs/thing"], function(Thing) {
    var prototype = {
        init: function(newx, newy) {
            this.x = newx || 0;
            this.y = newy || 0;
        },

        set: function(nx, ny) {
            this.x = nx;
            this.y = ny;
            return this;
        },

        setVec: function(v) {
            this.x = v.x;
            this.y = v.y;
            return this;
        },

        lengthSquared: function() {
            return Math.pow(this.x, 2) + Math.pow(this.y, 2);
        },

        length: function() {
            return Math.sqrt(this.lengthSquared());
        },
    
        scale: function(s) {
            return this.set(this.x * s, this.y * s);
        },
    
        sub: function(v) {
            return this.set(this.x - v.x, this.y - v.y);
        },
    
        add: function(v) {
            return this.set(this.x + v.x, this.y + v.y);
        },
    
        dot: function(v) {
            return this.x * v.x + this.y * v.y;
        },
    
        normalize: function() {
            return this.scale(1/this.length());
        },

        toString: function() {
            return "(" + this.x + ", " + this.y + ")";
        }
    };
        
    return function(x, y) {
        return Thing.create(prototype, true, x, y);
    };
});
