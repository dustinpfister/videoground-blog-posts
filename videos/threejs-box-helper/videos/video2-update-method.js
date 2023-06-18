// video2-update-method.js - for threejs-box-helper
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js'
];
// init
VIDEO.init = function(sm, scene, camera){
//-------- ----------
// SCENE CHILD OBJECTS
//-------- ----------
const mesh1 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 2, 3),
        new THREE.MeshNormalMaterial({ transparent: true, opacity: 0.5 }));
scene.add(mesh1);
// helper
const helper1 = new THREE.BoxHelper(mesh1, 0xffffff);
helper1.material.linewidth = 8;
helper1.material.vertexColors = true;
helper1.material.transparent = true;
const data_color = [];
const att_pos = helper1.geometry.getAttribute('position');
let i = 0;
while(i < att_pos.count){
    const a_vertex = i / att_pos.count;
    const a_opacity = (a_vertex * 4) % 1;
    data_color.push(1 * a_vertex, 1, 1 - a_vertex, 0.8 + 0.2 * Math.random());
    i += 1;
}
helper1.geometry.setAttribute('color', new THREE.BufferAttribute( new Float32Array( data_color ), 4));
scene.add(helper1);


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
    //-------- ----------
    // GRID
    //-------- ----------
    const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#ffffff');
    grid.material.linewidth = 6;
    grid.material.transparent = true;
    grid.material.opacity = 0.3;
    scene.add( grid );
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            camera.zoom = 1;

    const a_frame = seq.per,
    a_z = Math.sin( Math.PI * (a_frame * 2 % 1) ),
    a_x = Math.sin( Math.PI * (a_frame * 8 % 1) );

        mesh1.position.x = -2  + 4 * a_x;
        mesh1.position.z = -2  + 4 * a_z;
        mesh1.rotation.y = Math.PI * (a_frame * 8 % 1);
        mesh1.rotation.z = Math.PI * (a_frame * 24 % 1);
        // using the update method as a way to update the geometry of the box
        helper1.update();

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

   const canObj_bg = scene.userData.canObj_bg;

   // background
   ctx.clearRect(0,0, canvas.width, canvas.height);
   canObj_bg.state.a_x = sm.per;
   canObj_bg.state.a_stops = 0.5 + 0.5 * sm.per;
   canvasMod.update(canObj_bg);
   ctx.drawImage(canObj_bg.canvas, 0,0, canvas.width, canvas.height);
   ctx.fillStyle = 'rgba(255,0,128,0.3)';
   ctx.fillRect(0, 0, sm.canvas.width, sm.canvas.height);

   // update and draw dom element of renderer
   sm.renderer.render(sm.scene, sm.camera);
   ctx.drawImage(sm.renderer.domElement, 0, 0, sm.canvas.width, sm.canvas.height);

   // additional plain 2d overlay for status info
   //ctx.fillStyle = 'rgba(0,0,0,0.3)';
   //ctx.fillRect(0, 0, sm.canvas.width, sm.canvas.height);
   //ctx.fillStyle = 'white';
   //ctx.font = '60px arial';
   //ctx.textBaseline = 'top';
   //ctx.fillText('frame: ' + sm.frame + '/' + sm.frameMax, 10, 10);
};
 