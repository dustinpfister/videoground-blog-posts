// video1 for threejs-buffer-geometry-set-draw-range
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
// create a non indexed geometry
const createGeometry = () => {
    return new THREE.SphereGeometry(3, 30, 30).toNonIndexed();
};
//
const updateGeometry = (geometry, alpha, tri_count) => {
    const att_pos = geometry.getAttribute('position');
    const total_tri = att_pos.count / 3;


    const start = Math.floor( total_tri * alpha) * 3;
    const count = Math.round( 3 * tri_count );
    geometry.setDrawRange( start, count );
};
// ---------- ----------
// GEOMETRY
// ---------- ----------
const geometry = createGeometry();
// ---------- ----------
// SCENE CHILDREN
// ---------- ----------
scene.add(new THREE.GridHelper(10, 10));
const mesh1 = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial( { side: THREE.DoubleSide, transparent: true, opacity: 0.8 } ));
scene.add(mesh1);
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
            ['Set Draw Range', 64, 17, 14, 'white'],
            ['Method of Buffer', 64, 32, 14, 'white'],
            ['Geometry', 64, 47, 14, 'white'],
            ['( r146 May/15/2023 )', 64, 70, 12, 'gray'],
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
            camera.position.set(8, 1, 0);
            camera.lookAt(0, 0, 0);

            // update draw range
            updateGeometry(geometry, seq.getSinBias(4), 200);
        }
    };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 5,
        update: function(seq, partPer, partBias){
            // camera
            camera.position.set(8, 1, 8 * partPer);
            camera.lookAt(0, 0, 0);

            // update draw range
            const att_pos = geometry.getAttribute('position');
            updateGeometry(geometry, 0, att_pos.count / 3 * partPer);
        }
    };
    // SEQ 2 - ...
    opt_seq.objects[2] = {
        secs: 5,
        update: function(seq, partPer, partBias){
            // camera
            camera.position.set(8 - 16 * partPer, 1, 8);
            camera.lookAt(0, 0, 0);
            // update draw range
            const att_pos = geometry.getAttribute('position');
            updateGeometry(geometry, partPer, Infinity);
        }
    };
    // SEQ 3 - ...
    opt_seq.objects[3] = {
        secs: 5,
        update: function(seq, partPer, partBias){
            // camera
            camera.position.set(-8, 1 - 2 * partPer, 8);
            camera.lookAt(0, 0, 0);
            // update draw range
            updateGeometry(geometry, 1 - partPer, Infinity);
        }
    };

    // SEQ 4 - ...
    opt_seq.objects[4] = {
        secs: 12,
        update: function(seq, partPer, partBias){
            // camera
            camera.position.set(-8, -1, 8 - 16 * partPer);
            camera.lookAt(0, 0, 0);
            // update draw range
            updateGeometry(geometry, partPer, 200);
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
 