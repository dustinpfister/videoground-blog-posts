// video1-threespheres.js 
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js',
   '../../../js/curve/r1/curve.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js'
];
// init
VIDEO.init = function(sm, scene, camera){
// ---------- ----------
// HELPERS
// ---------- ----------
const makeMesh = () => {
    const material = new THREE.MeshNormalMaterial({wireframe: true, wireframeLinewidth: 6 });
    const mesh_parent = new THREE.Mesh(
        new THREE.SphereGeometry(2, 12, 12),
        material);
    const mesh_child = new THREE.Mesh(
        new THREE.CylinderGeometry(0, 0.25, 1.5, 8, 8),
        material);
    mesh_child.position.y = 2.75;
    mesh_parent.add(mesh_child);
    return mesh_parent;
};
// ---------- ----------
// OBJECTS
// ---------- ----------
scene.add( new THREE.GridHelper( 10,10 ) );
const mesh1 = makeMesh();
mesh1.position.set(0, 0, -5);
scene.add(mesh1);
const mesh2 = makeMesh();
mesh2.position.set(0, 0, 5);
scene.add(mesh2);
const mesh3 = makeMesh();
mesh3.position.set(0, 0, 0);
scene.add(mesh3);
// ---------- ----------
// SETTING ROTATION WITH QUATERNION
// ---------- ----------
const q = new THREE.Quaternion();
const q1 = q.clone();
const q2 = q.clone();
// ---------- ----------
// UPDATE DEMO
// ---------- ----------
const axis1 = new THREE.Vector3( 0, 0, 1 );
const e1 = new THREE.Euler();
const axis2 = new THREE.Vector3( 1, 0, 0 );
const updateDemo = function(a1){
    const a2 = a1 * 1 % 1;
    const a3 = a1 * (16 * Math.sin(Math.PI * a1) ) % 1;
    const radian1 = Math.PI * 2 * a2;
    e1.x = Math.cos(radian1);
    e1.y = 0;
    e1.z = Math.sin(radian1);
    axis1.set( 0, 1, 0 ).applyEuler(e1);
    const deg1 = 90;
    const deg2 = 360 * a3;
    // set q1 and q2 using setFromAxisAngle method
    q1.setFromAxisAngle( axis1.normalize(), THREE.MathUtils.degToRad(deg1) );
    q2.setFromAxisAngle( axis2.normalize(), THREE.MathUtils.degToRad(deg2) );
    // update mesh object local rotations with quaternion objects
    // where mesh1 and mesh 2 are just the current state of q1 and q2
    // and the rotation of mesh3 is q1 premultiplyed by q2
    mesh1.quaternion.copy(q1);
    mesh2.quaternion.copy(q2);
    mesh3.quaternion.copy(q1).premultiply(q2);
};

    //-------- ----------
    // BACKGROUND - using canvas2 and lz-string to create a background texture
    //-------- ----------
    const canObj = canvasMod.create({
        size: 512,
        draw: 'grid_palette',
        palette: ['#000000', '#1f1f1f', '#00ffff'],
        dataParse: 'lzstring64',
        state: { w: 8, h: 5, data: 'AwGlEYyzNCVgpcmPit1mqvTsg===' }
    });
    // can use LZString to compress and decompress
    //console.log( LZString.decompressFromBase64('AwGlEYyzNCVgpcmPit1mqvTsg===') );
    // I want to repeat the texture
    const texture = canObj.texture;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(32, 24);
    scene.background = texture;
    //-------- ----------
    // CURVE PATHS - creating a curve path for the camera
    //-------- ----------
    const cp_campos = curveMod.QBCurvePath([
        [8,1,0, 8,3,8,  5,2,5,    0],
        [8,3,8, -8,3,8,  0,0,0,    0]
    ]);
    //scene.add( curveMod.debugPointsCurve(cp_campos) )
    //-------- ----------
    // CURVE Alphas
    //-------- ----------
    const getCamPosAlpha = curveMod.getAlphaFunction({
        type: 'curve2',
        ac_points: [0,0.2,  0.6, -0.15,  1]
    });
    //scene.add( curveMod.debugAlphaFunction(getCamPosAlpha) )
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
        bg: '#000000',
        size: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,0,0.8)',
        lineCount: 9,
        lines: [
            ['Quaternion Premultiply', 64, 17, 12, 'white'],
            ['Method three spheres', 64, 32, 12, 'white'],
            ['demo', 64, 47, 12, 'white'],
            ['( r146 Apr/01/2023 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);
    //-------- ----------
    // A SEQ FOR TEXT CUBE
    //-------- ----------
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
                    textCube.material.opacity = 0.9;
                }
            },
            {
                per: 0.75,
                update: function(seq, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8 + 1 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    textCube.material.opacity = 0.9 - 0.9 * partPer;
                }
            }
        ]
    });
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            textCube.visible = false;
            camera.position.set(8, 1, 0);
            camera.zoom = 1;
updateDemo(seq.per);
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
            // textcube
            if(seq.partFrame < seq.partFrameMax){
               seqHooks.setFrame(seq_textcube, seq.partFrame, seq.partFrameMax);
            }
            // camera
            //camera.position.set(-8, 4, -8);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 27,
        update: function(seq, partPer, partBias){
            const a1 = getCamPosAlpha(partPer);
            camera.position.copy( cp_campos.getPoint(a1) );
            camera.lookAt(0, 0, 0);
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
 