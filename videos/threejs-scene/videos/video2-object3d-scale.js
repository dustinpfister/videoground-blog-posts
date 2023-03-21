// video2-object3d-scale.js for threejs-scene
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
const dl = new THREE.DirectionalLight(0xffffff, 1);
dl.position.set(3, 2, 1);
scene.add(dl);
scene.add( new THREE.AmbientLight(0xffffff, 0.1) );
// mesh objects
const mesh1 = new THREE.Mesh( new THREE.BoxGeometry(2, 2, 2), new THREE.MeshPhongMaterial({
    color: 0xff0000
}));
mesh1.position.set(0, 1, 0)
scene.add(mesh1);
const mesh2 = new THREE.Mesh( new THREE.SphereGeometry(2, 20, 20), new THREE.MeshPhongMaterial({
    color: 0x00ff00
}));
mesh2.position.set(-4, 2.0, 4);
scene.add(mesh2);
const mesh3 = new THREE.Mesh( new THREE.ConeGeometry(2, 5, 20, 20), new THREE.MeshPhongMaterial({
    color: 0x0000ff
}));
mesh3.position.set(-4, 2.5, -4);
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
            ['Scale a Whole', 64, 17, 14, 'white'],
            ['Scene Object', 64, 32, 14, 'white'],
            ['in threejs', 64, 47, 14, 'white'],
            ['( r146 Mar/21/2023 )', 64, 70, 12, 'gray'],
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

            scene.scale.set(1,1,1);

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

let s = 0.25 + 0.75 * (partPer * 5);
s = s > 1 ? 1 : s;
scene.scale.set(s,s,s);

scene.rotation.y = 0;

        }
    };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            scene.scale.set(1,1, 1 - seq.getSinBias(1))
            camera.position.set(8, 1, 0).lerp( new THREE.Vector3(12, 6, 7), partPer );
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 2 - ...
    opt_seq.objects[2] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            scene.scale.set(1 - seq.getSinBias(1),1, 1);
            camera.position.set(12, 6, 7);
            camera.lookAt(0, 0, 0);
        }
    };

    // SEQ 3 - ...
    opt_seq.objects[3] = {
        secs: 21,
        update: function(seq, partPer, partBias){
            const s = 1 - 0.75 * seq.getSinBias(8);
            scene.scale.set(s, s, s);
            scene.rotation.y = Math.PI * 2 * partPer;
            camera.position.set(12, 6, 7);
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
 