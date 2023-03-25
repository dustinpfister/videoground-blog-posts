// video2-rotatesphere.js for threejs-quaternion
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
// OBJECTS
// ---------- ----------
const geo = new THREE.SphereGeometry(2.5, 16, 16);
const material = new THREE.MeshNormalMaterial({wireframe: true, wireframeLinewidth: 6});
const mesh1 = new THREE.Mesh( geo, material);
scene.add(mesh1);
const arrowHelper = new THREE.ArrowHelper();
arrowHelper.setLength(3.5);
arrowHelper.line.material.linewidth = 8;
scene.add(arrowHelper);

const v_up = new THREE.Vector3(0, 1, 0);
const updateDemo = function(a1){
    const a2 = 0.75 - 0.75 * a1; //1 - Math.abs(0.5 - (a1 * 4 % 1)) / 0.5;
    const a3 = a1 * 1 % 1;
    const a4 = a1 * 6 % 1;
    // axis vector
    const v_axis = v_up.clone();
    const e = new THREE.Euler();
    e.y = Math.PI / 180 * ( 180 * a2);
    e.z = Math.PI / 180 * ( 360 * a3 );
    v_axis.applyEuler(e);
    // two Quaternion objects using 
    // setFromUnitVectors and setFromAxisAngle methods
    const q1 = new THREE.Quaternion();
    q1.setFromUnitVectors(v_up, v_axis);
    mesh1.quaternion.copy(q1);
    const q2 = new THREE.Quaternion();
    q2.setFromAxisAngle(v_axis, Math.PI * 2 * a4);
    // premultiply with q2 and q1
    mesh1.quaternion.premultiply(q2, q1);
    arrowHelper.setDirection(v_axis);
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
    const grid = scene.userData.grid = new THREE.GridHelper(5, 5, '#ffffff', '#00afaf');
    grid.material.linewidth = 6;
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
            ['Quaternion', 64, 17, 13, 'white'],
            ['Sphere Rotation', 64, 32, 13, 'white'],
            ['On Axis', 64, 47, 13, 'white'],
            ['( r146 Mar/25/2023 )', 64, 70, 12, 'gray'],
            ['video2', 64, 100, 10, 'gray']
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
updateDemo(seq.per)
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
 