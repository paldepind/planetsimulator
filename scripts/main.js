//require.config({
 //   urlArgs: "bust=" + (new Date()).getTime()
//});
requirejs(["vector", "render", "planet", "planets", "ui", "settings", "tools"],
function (vector, render, planet, planets, ui, settings) {

// Globals
var stats = {};
document.onselectstart = function(){ return false; }

// Handle mouse input
var mouse = {
    pos: vector.create(),
    over: false,
    selected: false,
};

render.canvas.onmousedown = function(ev) {
    mouse.pos.x = ev.clientX;
    mouse.pos.y = ev.clientY;
    settings.selected = mouse.over;
    if (settings.selected.planet) {
        ui.updatePlanetBox(settings.selected.planet);
    }
};

document.onmouseup = function(ev) {
    settings.selected.callback = false;
};

function pointToLineDistance(A, B, P) {
 normalLength = Math.sqrt(B.x - A.x*B.x - A.x + B.y - A.y*B.y - A.y)
 return Math.abs((P.x - A.x) * (B.y - A.y) - (P.y - A.y) * (B.x - A.x)) / normalLength;
}

document.onmousemove = function(ev) {
    var pos = vector.create(ev.clientX, ev.clientY);
    var dpos = mouse.pos.sub(pos);

    if (settings.selected.callback) {
        settings.selected.callback(dpos, pos);
    } else {
        mouse.over = checkMouseOver(pos);
    }

    render.setCursor(mouse.over.cursor);
    mouse.pos = pos;
    
    if (settings.selected.planet) {
        ui.updatePlanetBox(settings.selected.planet);
    }
};

function checkMouseOver(pos) {
    var ret = false;
    planets.forEach(function(planet) {
        var d = render.convertCoordinates(pos)
        d = d.sub(planet.position);
        if (d.lengthSquared() < planet.radiusSquared*0.8) {
            // We're over a planet
            ret = { planet: planet,
                    cursor: "move",
                    callback: function(dpos) {
                        this.planet.position = this.planet.position.sub(dpos.scale(1/settings.zoomLevel));
                        this.planet.trail = [];
                    },
                  };
        } else if (d.lengthSquared() < planet.radiusSquared * 1.2) {
            // We're over the perimiter
            ret = { planet: planet,
                    cursor: "col-resize",
                    callback: function(dpos, pos) {
                        var d = render.convertCoordinates(pos)
                        d = d.sub(planet.position);
                        this.planet.setRadius(d.length());
                        
                        var angle = Math.atan2(-d.y, d.x);
                        this.cursor = "move";
                        if (angle > -Math.PI/8 && angle < Math.PI/8) {
                            this.cursor = "e-resize";
                        } else if (angle > Math.PI/8 && angle < Math.PI/8*3) {
                            this.cursor = "ne-resize";
                        } else if (angle > Math.PI/8*3 && angle < Math.PI/8*5) {
                            this.cursor = "n-resize";
                        } else if (angle > Math.PI/8*5 && angle < Math.PI/8*7) {
                            this.cursor = "nw-resize";
                        } else if (angle > Math.PI/8*7 || angle < -Math.PI/8*7) {
                            this.cursor = "w-resize";
                        } else if (angle > -Math.PI/8*7 && angle < -Math.PI/8*5) {
                            this.cursor = "sw-resize";
                        } else if (angle > -Math.PI/8*5 && angle < -Math.PI/8*3) {
                            this.cursor = "s-resize";
                        } else if (angle > -Math.PI/8*3 && angle < -Math.PI/8*1) {
                            this.cursor = "se-resize";
                        }
                    },
                  };
        }
        d = d.sub(planet.velocity.scale(20));
        if (d.lengthSquared() < 100 / settings.zoomLevel) {
            // We're over a velocity vector
            ret = { planet: planet,
                    cursor: "move",
                    callback: function(dpos) {
                        this.planet.velocity =
                            this.planet.velocity.sub(dpos.scale(1/settings.zoomLevel/20));
                    },
                  };
        }
    });
    if (!ret) {
        // We're over nothing
        ret = { planet: settings.selected.planet,
                cursor: "default",
                callback: function(dpos) {
                    render.moveView(dpos.x, dpos.y);
                },
              };
    }
    return ret;
}

function init() {
    planets.push(planet(100000, 0, 0, 0, 0));
    planets.push(planet(100, 300, 0, 0, -7));
    settings.selected.planet = planets[1];
    ui.updatePlanetBox(settings.selected.planet);

    stats = new Stats();
    document.body.appendChild(stats.domElement);

    update();
}

function update() {
    render.clear();
    ui.updateZoom();
    
    
    if (settings.selected.planet && !settings.pause) {
        ui.updatePlanetBox(settings.selected.planet);
    }

    var loopCircles = planets.slice();
    var totalMass = 0;
    planets.forEach(function(planet) {
        totalMass += planet.mass;
        render.circle(planet.position.x, planet.position.y, planet.radius, planet.color);
        if (settings.showForce) {
            var force = planet.totalForce(planets);
            render.arrow(planet.position, force, 3, "black");
        }
        if (settings.showVelocity) {
            render.arrow(planet.position, planet.velocity, 20, "black");
        }

        if(!settings.pause) {
            planet.integrate();
            
            if (!planet.trail.length) {
                planet.trail.push([planet.position.x, planet.position.y]);
            } else {
                var lastTrail =  planet.trail[planet.trail.length-1];
                if (Math.pow(lastTrail[0] - planet.position.x, 2) +
                    Math.pow(lastTrail[1] - planet.position.y, 2) > 1) {
                    planet.trail.push([planet.position.x, planet.position.y]);
                }
            }

            loopCircles.splice(loopCircles.indexOf(planet), 1);
            if (loopCircles.length) {
                if (settings.detectCollisions) {
                    planet.detectCollisions(loopCircles, function() {
                        settings.pause = true;
                    });
                }
            }
            
            if (settings.selected.planet == planet && planet.trail.length > 10) {
                for (var c = planet.trail.length-10; c >= 0; c--) {
                    var diffx = planet.position.x - planet.trail[c][0];
                    var diffy = planet.position.y - planet.trail[c][1];
                    if (diffx*diffx + diffy*diffy < 49) {
                        planet.period = planet.trail.length - c;
                        break;
                    }
                }
            } else planet.period = 0;
            
            if (settings.showKeplers2 &&
                settings.selected.planet == planet &&
                planet.trail.length >= settings.keplers2Time) {
                    var slice = planet.trail.slice(planet.trail.length-settings.keplers2Time);
                    var area = 0;
                    var prevSlice = 0;
                    for (var i = 0; i < slice.length; i++) {
                        var sliceLength = Math.sqrt(slice[i][0]*slice[i][0] + slice[i][1]*slice[i][1]);
                        if (prevSlice) {                            
                            var line = vector.create(slice[i][0], slice[i][1]);
                            var point = vector.create(prevSlice[0], prevSlice[1]);
                            var vinkel = Math.acos(line.dot(point)/ (line.length()*point.length()) );
                            var what = Math.sin(vinkel)*point.length();
                            area =+ sliceLength*what/2;
                        }
                        prevSlice = slice[i];
                    }
                    planet.sweepArea = area;
                    slice.push([0,0]); slice.unshift([0,0]);
                    render.lines(slice, true);
            }
                
        }
        if (settings.showTrail && planet.trail.length) {
            render.lines(planet.trail);
        }
    });
    var centerOfMass = vector.create();
    planets.forEach(function (planet) {
        centerOfMass = centerOfMass.add(planet.position.scale(planet.mass/totalMass));
    });
    if (settings.showCenterOfMass) {
        render.circle(centerOfMass.x, centerOfMass.y, 3, "red");
        if (!settings.pause) {
            var offsetSize = centerOfMass.lengthSquared();
            planets.forEach(function (planet) {
                if (offsetSize > 12) planet.trail = [];
                planet.position.x -= centerOfMass.x;
                planet.position.y -= centerOfMass.y;
            });
        }
    }
    
    stats.update();
    window.requestAnimationFrame(update);
}

init();
});
