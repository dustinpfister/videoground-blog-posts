var CanvasTextCube = (function () {

    var api = {};

    // just draw a solid color background
    var drawBackground = (ctx, canvas, style) => {
        ctx.fillStyle = style || 'gray';
        ctx.fillRect(-1, -1, canvas.width + 2, canvas.height + 2);
    };

    // draw methods
    var DRAW_METHODS = {};

    DRAW_METHODS.text = {};

    DRAW_METHODS.text.face = (ctx, canvas, sm, opt) => {
        drawBackground(ctx, canvas, 'white');
    };
    
    // return public api
    return api;
}
    ());
