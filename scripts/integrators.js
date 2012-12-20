define(["vector", "planets"], function(vector, planets) {
    function derivative(obj, vel, acc, dt) {
        var deltapos = vel.scale(dt);
        var deltavel = acc.scale(dt);

        obj.position = obj.position.add(deltapos);
        
        var acceleration = obj.totalAcceleration();
        var velocity = obj.velocity.add(deltavel);

        obj.position = obj.position.sub(deltapos);

        return { vel: velocity, acc: acceleration }
    }

    return {
        euler: function(planet) {
            var acceleration = planet.totalAcceleration();
            planet.position = planet.position.add(planet.velocity);
            planet.velocity = planet.velocity.add(acceleration);
        },

        midpointMethod: function(planet) {
            var der = derivative(planet, planet.velocity, planet.totalAcceleration(), 0.5);

            planet.position = planet.position.add(der.vel);
            planet.velocity = planet.velocity.add(der.acc);
        },

        rk4: function(planet) {
            var da = derivative(planet, planet.velocity, planet.totalAcceleration(), 0)
            var db = derivative(planet, da.vel, da.acc, 0.5);
            var dc = derivative(planet, db.vel, db.acc, 0.5);
            var dd = derivative(planet, dc.vel, dc.acc, 1);

            velocity = vector.create((1/6)*(da.vel.x + 2*(db.vel.x + dc.vel.x) + dd.vel.x),
                                     (1/6)*(da.vel.y + 2*(db.vel.y + dc.vel.y) + dd.vel.y));
            acceleration = vector.create((1/6)*(da.acc.x + 2*(db.acc.x + dc.acc.x) + dd.acc.x),
                                         (1/6)*(da.acc.y + 2*(db.acc.y + dc.acc.y) + dd.acc.y));

            planet.position = planet.position.add(velocity);
            planet.velocity = planet.velocity.add(acceleration);
        },
    }
});
