define(["vector", "settings"], function (vector, settings) {
    var canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight+4;
    var ctx = canvas.getContext('2d');
    var offset = vector.create();
    var twoPI = Math.PI * 2 + 0.0001;

    var center = vector.create(canvas.width/2, canvas.height/2);
    ctx.translate(center.x, center.y);
    offset.x = 0;
    offset.y = 0;

    return {
        width: canvas.width,
        height: canvas.height,
        canvas: canvas,

        convertCoordinates: function (c) {
            return c.sub(center).scale(1/settings.zoomLevel).sub(offset);
        },
        
        circle: function(x, y, r, color) {
            ctx.beginPath();
            ctx.fillStyle = color;
            x = (x + offset.x) * settings.zoomLevel;
            y = (y + offset.y) * settings.zoomLevel;
            r *= settings.zoomLevel;
            ctx.moveTo(x+r, y);
            ctx.arc(x, y, r, 0, twoPI, true);
            ctx.fill();
            ctx.stroke();
        },
        
        lines: function(lines, fill) {
            ctx.beginPath();
            ctx.moveTo((lines[0][0] + offset.x) * settings.zoomLevel, (lines[0][1] + offset.y) * settings.zoomLevel);
            for(var i = 1; i<lines.length; i++) {
                ctx.lineTo((lines[i][0] + offset.x) * settings.zoomLevel,
                           (lines[i][1] + offset.y) * settings.zoomLevel);
            }
            if (fill) ctx.fill();
            ctx.stroke();
        },
        
        arrow: function(p1, p2, scale, color) {
            var headlen = 10;   // length of head in pixels
            var angle = Math.atan2(p2.y, p2.x);
            var tox = p2.x * scale * settings.zoomLevel + Math.cos(angle) * headlen / 2;
            var toy = p2.y * scale * settings.zoomLevel + Math.sin(angle) * headlen / 2;

            ctx.save();
            ctx.translate((p1.x + offset.x) * settings.zoomLevel, (p1.y + offset.y) * settings.zoomLevel);
            ctx.beginPath();
            ctx.moveTo(0,0);

            ctx.lineTo(tox, toy);
            ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
            ctx.moveTo(tox, toy);
            ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));

            ctx.strokeStyle = color;
            ctx.stroke();
            ctx.restore();
        },
        
        clear: function() {
            ctx.clearRect(-center.x, -center.y, this.width, this.height);
        },
        
        setCursor: function(type) {
            canvas.style.cursor = type;
        },
        
        moveView: function(diffx, diffy) {
            offset.x -= diffx / settings.zoomLevel;
            offset.y -= diffy / settings.zoomLevel;
        },
    };
});
