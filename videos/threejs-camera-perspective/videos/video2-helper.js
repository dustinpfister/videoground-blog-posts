// video2-helper.js for threejs-camera-perspective
//    * just a video based on the camera helper demo
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js',
   '../../../js/curve/r1/curve.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // OTHER CAMERA, AND CAMERA HELPER
    //-------- ----------
    const camera2 = new THREE.PerspectiveCamera(50, 16 / 9, 0.5, 6);
    camera2.position.set(2.5, 1, 2.5);
    camera2.lookAt(0, 0, 0);
    scene.add(camera2);
    const helper = new THREE.CameraHelper(camera2);
    helper.material.linewidth = 6;
    console.log(helper);
    scene.add(helper);
    //-------- ----------
    // MESH OBJECTS
    //-------- ----------
    const material_mesh = new THREE.MeshNormalMaterial();
    const mesh1 = new THREE.Mesh( new THREE.BoxGeometry(1,1,1), material_mesh);
    mesh1.position.set(1,0.5,-2);
    scene.add(mesh1);
    const mesh2 = new THREE.Mesh( new THREE.BoxGeometry(1,1,1), material_mesh);
    mesh2.position.set(-3.6,0.5, -0.3);
    scene.add(mesh2);
    const mesh3 = new THREE.Mesh( new THREE.BoxGeometry(1,1,1), material_mesh);
    mesh3.position.set(-4.5,0.5,-4.5);
    scene.add(mesh3);
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
        [8,1,0, 2.5,1,2.5,  2,0.5,7,    0]
    ]);
    //scene.add( curveMod.debugPointsCurve(cp_campos) )
    //-------- ----------
    // CURVE Alphas
    //-------- ----------
    const getCamPosAlpha = curveMod.getAlphaFunction({
        type: 'curve2',
        ac_points: [0, 0.25,  0.5, -0.25, 1]
    });
    //scene.add( curveMod.debugAlphaFunction(getCamPosAlpha) )
    //-------- ----------
    // GRID
    //-------- ----------
    const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#afafaf', '#008888');
    grid.material.transparent = true;
    grid.material.opacity = 0.6;
    grid.material.linewidth = 5;
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
            ['Camera Helper and', 64, 17, 13, 'white'],
            ['The Perspective Camera', 64, 32, 11, 'white'],
            ['in threejs', 64, 47, 11, 'white'],
            ['( r146 03/02/2023 )', 64, 70, 12, 'gray'],
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
            textCube.position.set(6.4, 0.825, 0);
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
                    textCube.material.opacity = 0.8;
                }
            },
            {
                per: 0.75,
                update: function(seq, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(6.4, 0.825 + 1 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    textCube.material.opacity = 0.8 - 0.8 * partPer;
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
            camera.aspect = camera2.aspect;
            camera.fov = camera2.fov;
            camera.zoom = camera2.zoom;
            camera.near = camera2.near;
            camera.far = camera2.far;
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
            camera.far = 50; THREE.MathUtils.lerp(camera2.far, 0, partPer)
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 1 - rotate
    opt_seq.objects[1] = {
        secs: 10,
        update: function(seq, partPer, partBias){

            const e = new THREE.Euler();
            e.y = Math.PI * 2 * partPer;
            camera.position.set(8, 1, 0).applyEuler(e);
            camera.far = 50;
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 2 - move into the same state as camera2
    opt_seq.objects[2] = {
        secs: 10,
        update: function(seq, partPer, partBias){
            const a1 = getCamPosAlpha(partPer);
            camera.position.copy( cp_campos.getPoint(a1) );
            camera.far = THREE.MathUtils.lerp(50, camera2.far, partPer);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 2 - move into the same state as camera2
    opt_seq.objects[3] = {
        secs: 7,
        update: function(seq, partPer, partBias){
            camera.position.copy(camera2.position);
            camera.lookAt(0, 0, 0);
            camera.zoom = THREE.MathUtils.lerp(camera2.zoom, 2, partPer);
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
 