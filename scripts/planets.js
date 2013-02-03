define(function() {
    var planets = [];
    var history = [];
    var iInHistory = 0;

    function clone(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            copy[attr] = obj[attr];
        }
        return copy;
    }

    planets.play = function() {
        history.length = iInHistory++;
        var newHis = [];
        for (var i = 0; i < planets.length; i++) {
            newHis.push(clone(planets[i]));
        }
        history.push(newHis);
    }

    planets.go = function(step) {
        if (0 <= iInHistory+step && iInHistory+step < history.length) {
            console.log("I " +iInHistory+ " L: " +history.length);
            if (iInHistory == history.length) {
                planets.play();
                iInHistory--;
            }
            iInHistory += step;
            planets.length = 0;
            history[iInHistory].forEach(function (entry) {
                entry.trail = [];
                planets.push(entry);
            });
        }
    }

    return planets;
});
