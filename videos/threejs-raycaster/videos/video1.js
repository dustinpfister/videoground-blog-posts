// video1 for threejs-raycaster
 
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
// set mesh posiiton if we have a hit
const setMeshIfHit = (raycaster, mesh, target, v_lookat) => {
    const result = raycaster.intersectObject(target, false);
    if(result.length > 0){
        const hit = result[0];
        mesh.position.copy( hit.point );
        mesh.lookAt(v_lookat);
   }
};
// get dir
const getDir = (v_origin, v_lookat) => {
    const obj = new THREE.Object3D();
    obj.position.copy(v_origin);
    obj.lookAt(v_lookat);
    const dir = new THREE.Vector3(0, 0, 1);
    dir.applyEuler(obj.rotation).normalize();
    return dir;
};
// get look at vector
const getLookAt = (deg, radius) => {
    let radian = Math.PI / 180 * deg;
    return new THREE.Vector3(1, 0, 0).applyEuler( new THREE.Euler(0, radian, 0) ).multiplyScalar(radius);
};
//-------- ----------
// MESH - SPHERE
//-------- ----------
const torus_radius = 4;
const torus = new THREE.Mesh(
        new THREE.TorusGeometry(torus_radius, 1.25, 20, 20),
        new THREE.MeshNormalMaterial({wireframe: true, wireframeLinewidth: 3}));
torus.geometry.rotateX(Math.PI * 0.5)
scene.add(torus);
// create mesh at point
const box = new THREE.Mesh(
    new THREE.SphereGeometry(1, 30, 30),
    new THREE.MeshNormalMaterial());
scene.add(box);
//-------- ----------
// RAYCASTER
//-------- ----------
// create raycaster
const raycaster = new THREE.Raycaster();


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
            ['Raycaster in', 64, 17, 14, 'white'],
            ['threejs', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 10/06/2022 )', 64, 70, 12, 'gray'],
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
            textCube.position.set(6, 0.8, 0);
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
                    textCube.position.set(6, 0.8, 0);
                    textCube.material.opacity = 1.0;
                }
            },
            {
                per: 0.75,
                update: function(seq, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8 + 1 * partPer, 0);
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
    let b = 1 - Math.abs(0.5 - a * 2 % 1 ) / 0.5;
    let v_lookat = getLookAt(360 * a, torus_radius);
    let v_ray_origin = new THREE.Vector3(0, -20 + 40 * b, 0)
    let v_ray_dir = getDir(v_ray_origin,  v_lookat);
    raycaster.set(v_ray_origin, v_ray_dir);
    setMeshIfHit(raycaster, box, torus, v_lookat);
};


    var seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){

update(seq.per);

            textCube.visible = false;
            camera.position.set(8, 1, 0);
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
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8, 8, 8);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 20,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8 - 16 * partPer, 8, 8);
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

