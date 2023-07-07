// video3-mirror for threejs-camera-perspective
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
    canvasMod.update(canObj_bg);
    scene.background = canObj_bg.texture;
    //sm.renderer.setClearColor(null, 0);
//-------- ----------
// LIGHT
//-------- ----------
const dl = new THREE.DirectionalLight(0xffffff, 1);
dl.position.set(3, -2, 1);
scene.add(dl);
const pl = new THREE.DirectionalLight(0xffffff, 1);
pl.position.set(4, 8, 4);
scene.add(pl);
//-------- ----------
// SCENE CHILD OBJECTS
//-------- ----------
const renderer_mirror = new THREE.WebGL1Renderer();
renderer_mirror.setSize(256, 256, false);
const camera_mirror = new THREE.PerspectiveCamera(45, 1 / 1, 0.05, 1000);
camera_mirror.zoom = 0.42;
camera_mirror.updateProjectionMatrix();
// things to look at
const group = new THREE.Group();
scene.add(group);
const mesh_sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.75, 20, 20),
    new THREE.MeshPhongMaterial({
        color: 0xff0000
    })
);
group.add( mesh_sphere );
mesh_sphere.position.set(0, 7.25, 0);
const mesh_box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshPhongMaterial({
        color: 0x00ff00
    })
);
group.add( mesh_box );
mesh_box.position.set(0, -7.25, 0);
const mesh_cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.75, 3, 20, 20),
    new THREE.MeshPhongMaterial({
        color: 0x0000ff
    })
);
group.add( mesh_cone );
mesh_cone.position.set(0, 0, -7.25);
const mesh_torus = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.25, 20, 20),
    new THREE.MeshPhongMaterial({
        color: 0xff00ff
    })
);
group.add( mesh_torus );
mesh_torus.position.set(0, 0, 7.25);
// the plane
const mesh_plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshPhongMaterial({
        emissive: 0x2f2f2f,
        map: new THREE.CanvasTexture( renderer_mirror.domElement )
    })
);
mesh_plane.geometry.rotateX( Math.PI * 1.5 );
mesh_plane.geometry.rotateY( Math.PI * 1.0 );
scene.add(mesh_plane);
// helper
//const helper = new THREE.CameraHelper(camera_mirror);
//scene.add(helper);
// position and rotation of camera_mirror
camera_mirror.position.copy(mesh_plane.position).add( new THREE.Vector3( 0, -5, 0 ) );
camera_mirror.lookAt( mesh_plane.position );
    //-------- ----------
    // UPDATE GROUP METHOD
    //-------- ----------
const update_group = function (a_frame) {
    const a_group = a_frame * 8 % 1;
    const a2 = 1 - Math.abs(0.5 - a_frame) / 0.5;
    group.rotation.x = Math.PI * 2 * a_group;
    group.rotation.y = Math.PI * 2 * a_frame;
    renderer_mirror.render(scene, camera_mirror);
    mesh_plane.material.map.needsUpdate = true;
};
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            camera.zoom = 1;
             update_group(seq.per);
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
            camera.position.set(-10, 4, -10);
            camera.lookAt(0, -1, 0);
        }
    };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 27,
        update: function(seq, partPer, partBias){
            // camera
            camera.position.set(-10 + 16 * partPer, 4, -10);
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // update and draw dom element of renderer
    sm.renderer.render(sm.scene, sm.camera);
    ctx.drawImage(sm.renderer.domElement, 0, 0, sm.canvas.width, sm.canvas.height);

    // additional plain 2d overlay for status info
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(0, 0, sm.canvas.width, sm.canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '40px arial';
    ctx.textBaseline = 'top';
    ctx.fillText('frame: ' + sm.frame + '/' + sm.frameMax, 10, 10);

};
 