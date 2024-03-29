// video1 for threejs-examples-curves-module
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
    // BACKGROUND - using canvas2 and lz-string to create a background texture
    //-------- ----------
    const canObj_bg = canvasMod.create({
        size: 512,
        draw: 'grid_palette',
        palette: ['#000000', '#1f1f1f', '#00ffff'],
        dataParse: 'lzstring64',
        state: { w: 8, h: 5, data: 'AwGlEYyzNCVgpcmPit1mqvTsg===' }
    });
    // can use LZString to compress and decompress
    //console.log( LZString.decompressFromBase64('AwGlEYyzNCVgpcmPit1mqvTsg===') );
    // I want to repeat the texture
    const texture = canObj_bg.texture;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(32, 24);
    scene.background = texture;
    //-------- ----------
    // CURVE PATHS - cretaing a curve path for the camera
    //-------- ----------
    const cp_campos = curveMod.QBCurvePath([
        [8,1,0, 10,4,10,  8,1,0,    0 ],
        [10,4,10, 0,2,10,  -5,1,7,   0 ],
        [0,2,10, 0,1,5,  0,-0.5,0,     0 ],
        [0,1,5, 0,1,-5,  0,0,0,     0 ],
        [0,1,-5, -8,2,-10,  10,-2,-2,     0 ]
    ]);
    //scene.add( curveMod.debugPointsCurve(cp_campos, {count: 80, color: new THREE.Color(1,0,0), size: 0.75}) )
    //-------- ----------
    // CURVE Alphas
    //-------- ----------
    const getCamPosAlpha = curveMod.getAlphaFunction({
        type: 'curve2',
        ac_points: [0,0.4,  0.6,-0.25,  1]
    });
    const getSmoothAlpha = curveMod.getAlphaFunction({type: 'smooth'});
    //scene.add( curveMod.debugAlphaFunction(getCamPosAlpha, {color: new THREE.Color(0,1,1), size: 1}) )
    //-------- ----------
    // GRID
    //-------- ----------
    //const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    //grid.material.linewidth = 3;
    //scene.add( grid );
    //-------- ----------
    // TEXTURES
    //-------- ----------
    const canObj_rnd1 = canvasMod.create({
        size: 512,
        draw: 'rnd',
        palette: ['#00ff00', '#00aa00', '#008800', '#004400'],
        state: { gSize: 64 }
    });
    const canObj_rnd2 = canvasMod.create({
        size: 512,
        draw: 'rnd',
        palette: ['#aaaaaa', '#bbbbbb', '#cccccc'],
        state: { gSize: 32 }
    });
    //-------- ----------
    // MATERIALS
    //-------- ----------
    const material_1 = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: canObj_rnd1.texture });
    const material_2 = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: canObj_rnd2.texture });
    //-------- ----------
    // OBJECTS
    //-------- ----------
    const plane = new THREE.Mesh( new THREE.PlaneGeometry(20, 20, 1, 1), material_1 );
    plane.geometry.rotateX(Math.PI * 1.5);
    scene.add(plane);
    const cylinder = new THREE.Mesh( new THREE.CylinderGeometry(1, 1, 5, 20, 20, true), material_2 );
    cylinder.geometry.rotateX(Math.PI * 1.5);
    cylinder.geometry.translate(0, 1, 0);
    scene.add(cylinder);
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
            ['Curve Module', 64, 17, 14, 'white'],
            ['threejs example', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 01/17/2023 )', 64, 70, 12, 'gray'],
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
            //camera.position.set(-12, 5, -12);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 1 - move along path and use curve alpha when doing so
    opt_seq.objects[1] = {
        secs: 12,
        update: function(seq, partPer, partBias){
            const a1 = getCamPosAlpha(partPer);
            camera.position.copy( cp_campos.getPoint(a1) );
            camera.lookAt(3 * partBias, 0, 0);
        }
    };
    // SEQ 2 - move to new pos, use smooth alpha method
    opt_seq.objects[2] = {
        secs: 5,
        update: function(seq, partPer, partBias){
            const v1 = cp_campos.getPoint(1);
            const v2 = new THREE.Vector3(-10, 5, 10)
            camera.position.copy( v1 ).lerp(v2, getSmoothAlpha( partPer ));
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 3 - rotate camera around using the smooth alpha
    opt_seq.objects[3] = {
        secs: 10,
        update: function(seq, partPer, partBias){
            const v1 = new THREE.Vector3(-10, 5, 10)
            camera.position.copy( v1 );
            camera.lookAt(0, 0, 0);
            const a1 = getSmoothAlpha( partPer )
            camera.rotation.z += Math.PI * 8 * a1;
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
 