// video1 for threejs-object3d-get-world-position
 
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
const createGroup = function (color, x) {
    color = color || new THREE.Color(1, 1, 1);
    const group = new THREE.Group();
    const geo = new THREE.CylinderGeometry(0, 0.75, 2.25, 12);
    geo.rotateX(Math.PI * 0.5);
    const pointer = group.userData.pointer = new THREE.Mesh(
            geo,
            new THREE.MeshNormalMaterial());
    pointer.position.set(0, 0, 0);
    pointer.rotation.y = 1.57;
    group.add(pointer);
    const cube = group.userData.cube = new THREE.Mesh(
            new THREE.BoxGeometry(0.75, 0.75, 0.75),
            new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.5 }));
    cube.position.set(0, 0, 1);
    group.add(cube);
    group.position.set(x, 0, 0);
    return group;
};
// update
const updateGroup = (group, alpha) => {
    const e = new THREE.Euler();
    e.y = Math.PI * 2 * alpha;
    group.userData.cube.position.copy( new THREE.Vector3(1,0,0) ).applyEuler(e).normalize().multiplyScalar(1.5);
};

//-------- ----------
// SCENE CHILD OBJECTS
//-------- ----------
// just set up group1 and group2
const group1 = createGroup(0xff0000, -2.75);
scene.add(group1);
const group2 = createGroup(0x00ff00, 2.75);
scene.add(group2);

const helper1 = new THREE.BoxHelper(group1);
helper1.material.linewidth = 3;
scene.add(helper1);
const helper2 = new THREE.BoxHelper(group2);
helper2.material.linewidth = 3;
scene.add(helper2);
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#2a2a2a');
    //-------- ----------
    // GRID
    //-------- ----------
    const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    scene.add( grid );
    //-------- ----------
    // TEXT CUBE
    //-------- ----------
    const textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Object3d Get World', 64, 17, 14, 'white'],
            ['Position Method in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r140 10/12/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);
    // A SEQ FOR TEXT CUBE
    const seq_textcube = seqHooks.create({
        setPerValues: false,
        fps: 30,
        beforeObjects: function(seq){
            const textCube = scene.userData.textCube;
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
    // animate groups the same way
    updateGroup(group1, a);
    updateGroup(group2, a);
    helper1.update();
    helper2.update();
    // with group1 I am just passing lookAt the LOCAL position of the cube
    group1.userData.pointer.lookAt(group1.userData.cube.position);
    // with group to I am USING GETWORLDPOSITION to get a vector to pass to lookAt
    const v = new THREE.Vector3(0, 0, 0);
    group2.userData.cube.getWorldPosition(v);
    group2.userData.pointer.lookAt(v);
};
    const seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){

update(seq.getSinBias(4, false));

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
                secs: 7,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8 - 2 * partPer, 1 + 6 * partPer, 6 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 20,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(6 + 3 * partPer, 6, 6 - 12 * seq.getSinBias(1));
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
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
 