define(["jquery", "settings", "planet", "planets"], function($, settings, planet, planets) {
    var zooming = false,
        zoomToDefault = false,
        outSpeed = .98,
        fastOutSpeed = Math.pow(outSpeed, 6)
        inSpeed = 1.02;
        fastInSpeed = Math.pow(inSpeed, 6)

    $('.check-btn').click(function () {
        $(this).toggleClass('btn-checked');
    });

    $('.radio-btn').click(function () {
        $(this).siblings('.btn-checked').removeClass('btn-checked')
        $(this).addClass('btn-checked');
    });
        
    var zoomBox = $('#zoomBox');
    $('#zoomIn').mousedown(function () {
        zooming = inSpeed;
    }).mouseup(function () {
        zooming = false;
    }).mouseleave(function () {
        zooming = false;
    });

    $('#zoomOut').mousedown(function () {
        zooming = outSpeed;
    }).mouseup(function () {
        zooming = false;
    }).mouseleave(function () {
        zooming = false;
    });

    $('#zoomDefault').click(function () {
        zoomToDefault = true;
    });

    $('#playPause').click(function () {
        if(settings.pause) {
            settings.pause = false;
            $('i', this).addClass('icon-pause').
                         removeClass('icon-play');
        } else {
            settings.pause = true;
            $('i', this).addClass('icon-play').
                         removeClass('icon-pause');
            //settings.history.push(JSON.parse(JSON.stringify(planets)));
        }
    });
    $('#stepBackward').click(function () {
        planets.length = 0;
        $.extend(true, planets, settings.history.pop())
    });

    $('#showTrail').click(function() {
        settings.showTrail = !settings.showTrail;
    });

    $('#showForce').click(function() {
        settings.showForce = !settings.showForce;
    });

    $('#showVelocity').click(function() {
        settings.showVelocity = !settings.showVelocity;
    });
    $('#showCenterOfMass').click(function() {
        settings.showCenterOfMass = !settings.showCenterOfMass;
    });
    $('#showKeplers2').click(function() {
        settings.showKeplers2 = !settings.showKeplers2;
    });
    
    $('#addPlanet').click(function() {
        var newplanet = planet(Math.random()*500,
                                Math.random()*800-400,
                                Math.random()*600-300,
                                Math.random()*16-8,
                                Math.random()*16-8);
        settings.selected.planet = newplanet;
        updatePlanetBox(newplanet);
        planets.push(newplanet);
    });
    
    $('#removePlanet').click(function() {
        planets.splice(planets.indexOf(settings.selected.planet), 1);
    });

    //Integration methods
    $('#eulerInt').click(function() {
        settings.integrator = "euler";
    });
    $('#midpointInt').click(function() {
        settings.integrator = "midpointMethod";
    });
    $('#rk4Int').click(function() {
        settings.integrator = "rk4";
    });
    
    function updatePlanetBox(planet) {
        $('#posx').val(Math.round(planet.position.x));
        $('#posy').val(Math.round(-planet.position.y));
        $('#velsize').val(Math.round(planet.velocity.length()));
        $('#velangle').val(Math.round(Math.atan2(-planet.velocity.y, planet.velocity.x)/Math.PI*180));
        $('#mass').val(Math.round(planet.mass));
        $('#radius').val(planet.radius);
        $('#sweepArea').val(Math.round(planet.sweepArea) || 0);
        $('#period').val(Math.round(planet.period) || 0);
    }
    
    $('#posx').keyup(function (obj) {
        settings.selected.planet.position.x = parseInt($(this).val());
    });
    $('#posy').keyup(function (obj) {
        settings.selected.planet.position.y = -parseInt($(this).val());
    });
    $('#velsize').keyup(function (obj) {
        var oldsize = settings.selected.planet.velocity.length();
        if (!oldsize) {
            settings.selected.planet.velocity = settings.selected.planet.velocity.add({x: 1, y: 0});
            oldsize = 1;
        }
        var newsize = parseInt($(this).val()) || 1;
        settings.selected.planet.velocity = settings.selected.planet.velocity.scale(newsize/oldsize);
    });
    $('#velangle').keyup(function (obj) {
        var angle = parseInt($(this).val())/180 * Math.PI || 0;
        var length = settings.selected.planet.velocity.length();
        settings.selected.planet.velocity.x = Math.cos(angle)*length;
        settings.selected.planet.velocity.y = -Math.sin(angle)*length;
    });
    $('#mass').keyup(function (obj) {
        settings.selected.planet.setMass(parseInt($(this).val()));
    });

    return {
        updateZoom: function () {
            if (zooming) {
                settings.zoomLevel *= zooming;
            }
            if (zoomToDefault) {
                if (settings.zoomLevel > 1.05)
                    settings.zoomLevel *= fastOutSpeed;
                else if (settings.zoomLevel < .95)
                    settings.zoomLevel *= fastInSpeed;
                else
                    zoomToDefault = false;
            }
        },
        updatePlanetBox: updatePlanetBox,
    }
});
