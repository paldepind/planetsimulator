define(["vector", "settings", "libs/thing", "integrators", "planets"],
function(vector, settings, Thing, integrators, planets) {
    return (function () {
        var G = 0.2;
        var density = 0.1;
    
        var prototype = {
            init: function(mass, x, y, vx, vy) {
                this.setMass(mass);

                this.position = vector.create(x, y);
                this.velocity = vector.create(vx || 0, vy || 0);

                this.trail = [];
                //Generær tilfældig planet-farve
                this.color = "rgb(" + Math.round(Math.random()*255) + ", " +
                                      Math.round(Math.random()*255) + ", " +
                                      Math.round(Math.random()*255) + ")";
            },
            
            setMass: function(mass) {
                this.mass = mass;
                this.setRadius(Math.pow((3*mass)/(4*Math.PI*density),1/3));
            },
            
            setRadius: function(radius) {
                this.radius = radius;
                this.radiusSquared = radius*radius;
                this.mass = density * (4/3)*Math.PI*Math.pow(radius, 3);
            },

            integrate: function() {
                integrators[settings.integrator](this);
            },

            forceFrom: function(planet) {
                var vectorTo = planet.position.sub(this.position);

                var forceSize = G * (this.mass * planet.mass /
                                      vectorTo.lengthSquared());
                return vectorTo.scale(forceSize/vectorTo.length());
            },

            totalForce: function(planets) {
                var that = this;
                var forceSum = vector.create();
                planets.forEach(function (planet) {
                    if (that != planet)
                        forceSum = forceSum.add(that.forceFrom(planet));
                });
                return forceSum;
            },

            totalAcceleration: function() {
                var force = this.totalForce(planets);
                return force.scale(1/this.mass);
            },

            detectCollisions: function (circles, doCollisionCallback) {
                var that = this;
                
                circles.forEach(function (circle) {
                    if (that.collidedWith(circle))
                        doCollisionCallback();
                });
            },

            collidedWith: function(otherPlanet) {
                var that = this;
                var thisToOther = otherPlanet.position.sub(that.position);
                
                if (thisToOther.length() <= that.radius + otherPlanet.radius) {
                    return true;
                } else {
                    return false;
                }
            },
        };
        
        return function (mass, x, y, px, py) {
            return Thing.create(prototype, true, mass, x, y, px, py);
        };
    }());
});
