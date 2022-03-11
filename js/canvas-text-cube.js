var CanvasTextCube = (function () {

    var api = {};

    // solid color background
    var drawBackground = (ctx, canvas, style) => {
        ctx.fillStyle = style || 'gray';
        ctx.fillRect(-1, -1, canvas.width + 2, canvas.height + 2);
    };
    // draw edge
    var drawEdge = (ctx, canvas, style, width) => {
        ctx.strokeStyle = style || 'blue';
        ctx.lineWidth = width || 1;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    };

    // draw methods
    var DRAW_METHODS = api.DRAW_METHODS = {};

    DRAW_METHODS.text = {};

    DRAW_METHODS.text.face = (ctx, canvas, sm, opt) => {
        // solid background
        drawBackground(ctx, canvas, 'black');
        // edge
        drawEdge(ctx, canvas, 'cyan', 3);

        ctx.fillStyle = 'white';
        ctx.fillText(opt.text, 10, 10);	
    };

    api.create = function(opt){
        // options
        opt = opt || {};
        // box geomety
        var geo = new THREE.BoxGeometry(1, 1, 1);
        // canvas obj
        let canvasObj = CanvasMod.createCanvasObject({}, DRAW_METHODS, opt)
        canvasObj.draw({ drawClass: 'text', drawMethod: 'face', text: 'foo'});
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
