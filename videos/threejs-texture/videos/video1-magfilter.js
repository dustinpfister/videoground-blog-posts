// video1-magfilter.js - for threejs-texture
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js'
];
// init
VIDEO.init = function(sm, scene, camera){

//-------- ----------
// CANVAS ELEMENT, 2D DRAWING CONTEXT
//-------- ----------
const canvas = document.createElement('canvas'), 
ctx = canvas.getContext('2d');
ctx.translate(0.5, 0.5);
canvas.width = 64;
canvas.height = 64;
ctx.lineWidth = 1;
let i = 0;
const len = 11;
const color = new THREE.Color();
while(i < len){
    const a_child =  i / len;
    const a_bias = Math.sin( Math.PI * a_child );
    const r = 0.2 + 0.8 * a_child;
    const g = 0.8 - 0.6 * a_child;
    color.setRGB(r, g, a_bias);
    ctx.strokeStyle = color.getStyle();
    const a = 1 + 3 * i;
    const s = canvas.width - a * 2
    ctx.strokeRect(a, a, s, s);
    i += 1;
}
//-------- ----------
// TEXTURE - using a canvas element
//-------- ----------
const texture1 = new THREE.Texture(canvas);
texture1.needsUpdate = true;
const texture2 = texture1.clone();
texture2.magFilter = THREE.NearestFilter;
//-------- ----------
// GEOMETRY, MATERIAL, MESH
//-------- ----------
const geo = new THREE.BoxGeometry(1, 1, 1);
const material1 = new THREE.MeshBasicMaterial({ map: texture1 });
const material2 = new THREE.MeshBasicMaterial({ map: texture2 });
const mesh1 = new THREE.Mesh( geo, material1);
mesh1.position.x = -0.6;
scene.add(mesh1);
const mesh2 = new THREE.Mesh( geo, material2);
mesh2.position.x = 0.6;
scene.add(mesh2);
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = null;
    sm.renderer.setClearColor(null, 0);
    sm.renderer.antialias = false;
    //-------- ----------
    // GRID
    //-------- ----------
    const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#ffffff');
    grid.material.linewidth = 3;
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
            camera.position.set(2, 1, 2);
            camera.lookAt(0, -0.25, 0);
        }
    };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 27,
        update: function(seq, partPer, partBias){
            // camera
            camera.position.set(2 - 4 * partPer, 1, 2);
            camera.lookAt(0, -0.25, 0);
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
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // update and draw dom element of renderer
    sm.renderer.render(sm.scene, sm.camera);
    ctx.drawImage(sm.renderer.domElement, 0, 0, sm.canvas.width, sm.canvas.height);

    // additional plain 2d overlay for status info
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(0, 0, sm.canvas.width, sm.canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '40px monospace';
    ctx.textBaseline = 'top';
    ctx.fillText('frame: ' + sm.frame + '/' + sm.frameMax, 10, 15);

};
 