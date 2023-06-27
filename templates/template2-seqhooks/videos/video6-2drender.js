// video6-2drender for template2-sequence-hooks using videoground r9 2d canvas rendering features
// * use of 2d canvas for backgorund, and forground
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // BACKGROUND - using canvas2
    //-------- ----------
    const BG_SCALE = 8;
    const canObj_bg = scene.userData.canObj_bg = canvasMod.create({
        size: 128 * BG_SCALE,
        palette: ['#220000', '#440000', '#880000', '#aa0000', 'red', 
                  'purple',  'orange',  'yellow',  '#22aa00', 'lime', 
                  '#00ffaa', 'cyan',    'blue',    '#0000aa', '#000088', 
                  '#000044', '#000022'],
        draw: (canObj, ctx, canvas, state) => {
            const x0 = 128 * BG_SCALE * state.a_x;
            const x1 = 128 * BG_SCALE - x0;
            const gradient = ctx.createLinearGradient(x0, 0, x1, 72 * BG_SCALE);
            canObj.palette.forEach( (color, i_color, arr) => {
                const a_color = i_color / arr.length * state.a_stops;
                gradient.addColorStop(a_color, color);
            });
            ctx.fillStyle = gradient;
            ctx.fillRect(0,0, canvas.width, canvas.height);
        },
        state: { a_x: 0, a_stops: 1 }
    });
    canObj_bg.canvas.height = 72 * BG_SCALE;
    scene.background = null;
    sm.renderer.setClearColor(null, 0);
    //-------- ----------
    // GRID
    //-------- ----------
    const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#ffffff');
    grid.material.linewidth = 6;
    scene.add( grid );
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            camera.zoom = 1;
        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    // SEQ 0 - ...
    opt_seq.objects[0] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            // camera
            camera.position.set(-8, 4, -8);
            camera.lookAt(0, -1, 0);
        }
    };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 27,
        update: function(seq, partPer, partBias){
            // camera
            camera.position.set(-8 + 16 * partPer, 4, -8);
            camera.lookAt(0, -1, 0);
        }
    };
    const seq = scene.userData.seq = seqHooks.create(opt_seq);
    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
// custom render function
VIDEO.render = function(sm, canvas, ctx, scene, camera, renderer){

    // background
    const canObj_bg = scene.userData.canObj_bg;
    canvasMod.update(canObj_bg);
    ctx.drawImage(canObj_bg.canvas, 0, 0, canvas.width, canvas.height)
  
    // update and draw dom element of renderer
    sm.renderer.render(sm.scene, sm.camera);
    ctx.drawImage(sm.renderer.domElement, 0, 0, sm.canvas.width, sm.canvas.height);

    // additional plain 2d overlay for status info
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(0, 0, sm.canvas.width, sm.canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '60px arial';
    ctx.textBaseline = 'top';
    ctx.fillText('frame: ' + sm.frame + '/' + sm.frameMax, 10, 10);

};
 