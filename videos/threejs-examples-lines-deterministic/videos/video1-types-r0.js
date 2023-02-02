// video1 for threejs-examples-lines-determinisitc
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js',
   '../../../js/curve/r1/curve.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js',

    '../js/line-group-r0.js',
    '../js/line-group-circle-stack-r0.js',
    '../js/line-group-sphere-circles-r0.js'
];
// init
VIDEO.init = function(sm, scene, camera){


// the 'sphereCircles' type base off my other lines example
var lg0 = LineGroup.create('sphereCircles', { 
    lineCount: 60,
    forLineStyle: function(m, i){
       m.linewidth = 8;
       m.color = new THREE.Color( '#ffffff' );
       m.transparent = true;
       m.opacity = 0.25;
    }
 });
lg0.position.set(0, 0, 0);
lg0.rotation.x = Math.PI * 0.5;
LineGroup.set(lg0, 5, 10, {
    maxRadius: 30
});
scene.add(lg0);

// built in 'tri' type
var lg1Base = {
    homeVectors: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0)
    ], 
    lerpVectors: [
        new THREE.Vector3(-2, 0, -2),
        new THREE.Vector3(-2, 0, 2),
        new THREE.Vector3(2, 0, 0)
    ],
    rBase: 1,
    //rDelta: 2
};
var lg1 = LineGroup.create('tri', {
    //forLineStyle: function(m, i){
    //   m.linewidth = 8;
    //   m.color = new THREE.Color( '#00ff00' );
    //   m.transparent = true;
    //   m.opacity = 1;
    //}
});
lg1.position.set(-3, 0, 0);
//lg1.scale.set(1.5, 1.5, 1.5);
scene.add(lg1);
// the 'circleStack' type
var lg2 = LineGroup.create('circleStack', { lineCount: 20 } );
lg2.position.set(-5, 0, -5);
scene.add(lg2);
// the 'sphereCircles' type base off my other lines example
var lg3 = LineGroup.create('sphereCircles', { } );
lg3.position.set(-5, 0, 5);
scene.add(lg3);

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
    // CURVE PATHS - cretaing a curve path for the camera
    //-------- ----------
    const cp_campos = curveMod.QBCurvePath([
        [8,1,0, 5,5,5,  0,1,0,    0]
    ]);
    scene.add( curveMod.debugPointsCurve(cp_campos) )
    //-------- ----------
    // CURVE Alphas
    //-------- ----------
    //const getCamPosAlpha = curveMod.getAlphaFunction({
    //    type: 'curve2',
    //    ac_points: [0,0.4,  0.6,-0.25,  1]
    //});
    //scene.add( curveMod.debugAlphaFunction(getCamPosAlpha) )
    //-------- ----------
    // GRID
    //-------- ----------
    //const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    //grid.material.linewidth = 3;
    //scene.add( grid );
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
            ['Lines Deterministic', 64, 17, 14, 'white'],
            ['threejs example', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 02/02/2022 )', 64, 70, 12, 'gray'],
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
                    textCube.material.opacity = 0.8;
                }
            },
            {
                per: 0.75,
                update: function(seq, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8 + 1 * partPer, 0);
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
            camera.zoom = 1;


            LineGroup.set(lg1, seq.frame, seq.frameMax, lg1Base);
            LineGroup.set(lg2, seq.frame, seq.frameMax, {});
            LineGroup.set(lg3, seq.frame, seq.frameMax, {});

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
            camera.zoom = 1;
            //camera.position.set(-8, 4, -8);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 7,
        update: function(seq, partPer, partBias){
            //const a1 = getCamPosAlpha(partPer);
            camera.zoom = 1 - 0.25 * partPer;
            camera.position.copy( cp_campos.getPoint(partPer) );
            camera.lookAt(-5.0 * partPer, 1.0 * partPer, 1.4 * partPer);
        }
    };
    // SEQ 2 - ...
    opt_seq.objects[2] = {
        secs: 20,
        update: function(seq, partPer, partBias){
            camera.zoom = 0.75
            camera.position.copy( cp_campos.getPoint(1) );
            camera.lookAt(-5.0, 1.0, 1.4);
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
 