var CanvasTextCube = (function () {

    var api = {};

    // solid color background
    var drawBackground = (ctx, canvas, style) => {
        ctx.fillStyle = style || 'gray';
        ctx.fillRect(-1, -1, canvas.width + 2, canvas.height + 2);
    };
    // draw edge
    var drawEdge = (ctx, canvas, style, width, count) => {
        ctx.lineWidth = width || 1;
        var i = 0, lc = count === undefined ? 1 : count;
        while(i < lc){
            var x = width / 2 + width * i,
            y = width / 2 + width * i;
            ctx.globalAlpha = 1 - (i / lc);
            ctx.strokeStyle = style || 'blue';
            ctx.strokeRect(x, y, canvas.width - x * 2, canvas.height - y * 2);
          
            i += 1;
        }
        ctx.globalAlpha = 1;
    };

    // draw methods
    var DRAW_METHODS = api.DRAW_METHODS = {};

    DRAW_METHODS.text = {};

    DRAW_METHODS.text.face = (ctx, canvas, sm, opt) => {
        opt = opt || {};
        opt.lines = opt.lines || [];
        // solid background
        drawBackground(ctx, canvas, 'black');
        // edge
        drawEdge(ctx, canvas, opt.lineColor || 'red', opt.lineWidth || 1, opt.lineCount);
        // draw lines
        opt.lines.forEach(function(line){
            ctx.fillStyle = line[4] || 'white';
            ctx.textAlign = line[5] || 'center';
            var size = line[3] === undefined ? 10 : line[3];
            ctx.font = size + 'px arial';
            ctx.textBaseline = line[6] || 'middle';
            ctx.fillText(line[0] || '', line[1] || 0, line[2] || 0);
        });	
    };

    api.create = function(opt){
        // options
        opt = opt || {};
        // box geomety
        var geo = new THREE.BoxGeometry(1, 1, 1);
        // canvas obj
        let canvasObj = CanvasMod.createCanvasObject({}, DRAW_METHODS, opt)
        canvasObj.draw({
            drawClass: 'text', 
            drawMethod: 'face', 
            lines: opt.lines || [],
            lineWidth: opt.lineWidth || 1,
            lineColor: opt.lineColor || 'green',
            lineCount: opt.lineCount || 0
        });
        // material
        var material = new THREE.MeshBasicMaterial({
            map: canvasObj.texture,
            fog: false
        });
        // mesh
        var cube = new THREE.Mesh(geo, material);
        // user data object
        cube.userData.canvasObj = canvasObj;
        // return cube mesh
        return cube;
    };
    
    // return public api
    return api;
}
    ());
