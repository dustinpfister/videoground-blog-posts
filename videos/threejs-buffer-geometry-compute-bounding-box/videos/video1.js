// video1 for threejs-buffer-geometry-compute-bounding-box
 
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js'
];
// init
VIDEO.init = function(sm, scene, camera){
//-------- ----------
// HELPERS
//-------- ----------
const getMeshGroundPosition = (mesh, x, z) => {
    const geo = mesh.geometry;
    // COMPUTE THE BOUNDING BOX AND GET bb REF TO IT
    geo.computeBoundingBox();
    const bb = geo.boundingBox;
    // GET SIZE, and return new Vector3
    const v_size = new THREE.Vector3();
    bb.getSize(v_size);
    return new THREE.Vector3(x, v_size.y / 2, z);
};
// Make Mesh

const makeMesh = (w, h, d, x, z, sh, p1, p2, m) => {
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d), m);
    mesh.userData.v_start = new THREE.Vector3(x, sh, z);
    mesh.userData.p1 = p1;
    mesh.userData.p2 = p2;
    return mesh
};
// set mesh animation state for the given alpha
const setMesh = (mesh, alpha) => {
    let mud = mesh.userData;
    let b = getAlpha(alpha, 1, mud.p1, mud.p2);
    let v_start = mud.v_start;
    let v_ground = getMeshGroundPosition(mesh, v_start.x, v_start.z);
    mesh.position.copy(v_start).lerp(v_ground, b);
};
// get alpha helper
const getAlpha = (n, d, p1, p2) => {
    let a = n / d;
    let b = 0;
    if(a < p1){ b = a * (1 / p1);}
    if(a >= p1 && a < p2){ b = 1;}
    if(a >= p2){
        b = (1 - a) / (1 - p2);
    }
    return b;
};
//-------- ----------
// GROUP, MESH, MATERIAL
//-------- ----------
const material = new THREE.MeshNormalMaterial();
let group = new THREE.Group();
[
    [1, 1, 1, 0.5, 0.5, 12, 0.65, 0.8, material],
    [1, 3, 1, -4.5, -4.5, 10, 0.75, 0.9, material],
    [1, 3.25, 3, -4.5, 0.5, 8, 0.25, 0.5, material],
    [3, 1, 2, 3, 3, 8, 0.90, 0.95, material],
    [2, 2, 2, 3, -2, 8, 0.15, 0.4, material]
].forEach((argu) => {
    let mesh = makeMesh.apply(null, argu);
    group.add(mesh);
});
scene.add(group);


    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#2a2a2a');
    //-------- ----------
    // GRID
    //-------- ----------
    var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    scene.add( grid );
    //-------- ----------
    // TEXT CUBE
    //-------- ----------
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Compute Bounding Box', 64, 17, 11, 'white'],
            ['Buffer Geometry method', 64, 32, 11, 'white'],
            ['in threejs', 64, 47, 11, 'white'],
            ['( r140 10/07/2022 )', 64, 70, 10, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);
    // A SEQ FOR TEXT CUBE
    var seq_textcube = seqHooks.create({
        setPerValues: false,
        fps: 30,
        beforeObjects: function(seq){
            var textCube = scene.userData.textCube;
            textCube.rotation.y = 0;
            textCube.position.set(6.15, 0.8, 0);
            textCube.visible = false;
            textCube.material.transparent = true;
            textCube.material.opacity = 0.0;
        },
        objects: [
            {
                per: 0,
                update: function(seq, partPer, partBias){
                    // text cube
                    textCube.visible = true;
                    textCube.position.set(6.15, 0.8, 0);
                    textCube.material.opacity = 1.0;
                }
            },
            {
                per: 0.65,
                update: function(seq, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(6.15, 0.8 + 1 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    textCube.material.opacity = 1.0 - partPer;
                }
            }
        ]
    });
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
const update = function(a){
    group.children.forEach((mesh)=>{
        setMesh(mesh, a);
    });
};
    var seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){
            textCube.visible = false;
            camera.position.set(8, 1, 0);
            update(seq.per * 2 % 1);
        },
        afterObjects: function(seq){
        },
        objects: [
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // textcube
                    if(seq.partFrame < seq.partFrameMax){
                        seqHooks.setFrame(seq_textcube, seq.partFrame, seq.partFrameMax);
                    }
                    // camera
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 2,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8, 1 + 7 * partPer, 8 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 25,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8 - 16 * partPer, 8 - 4 * partPer, 8);
                    camera.lookAt(0, 0, 0);
                }
            }
        ]
    });
    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    var seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);

};

