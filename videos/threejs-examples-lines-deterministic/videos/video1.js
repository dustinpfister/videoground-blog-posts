// video1 for threejs-examples-lines-deterministic
 
// scripts
VIDEO.scripts = [
    '../../../js/canvas.js',
    '../../../js/canvas-text-cube.js',
    '../../../js/sequences-hooks-r1.js',
    '../js/line-group-r0.js',
    '../js/line-group-circle-stack-r0.js',
    '../js/line-group-sphere-circles-r0.js',
    '../js/line-group-sin-grid-r1.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');

    // GRID
    //var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    //grid.material.linewidth = 3;
    //scene.add( grid );
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Deterministic', 64, 17, 14, 'white'],
            ['Line Groups', 64, 32, 14, 'white'],
            ['threejs example', 64, 47, 14, 'white'],
            ['( r135 06/13/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

// line groups
// built in 'tri' type
var lg1Base = {
    homeVectors: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0)
    ], 
    lerpVectors: [
        new THREE.Vector3(-5, 0, -5),
        new THREE.Vector3(-5, 0, 5),
        new THREE.Vector3(5, 0, 0)
    ],
    rBase: 0,
    rDelta: 2
};
var lg1 = LineGroup.create('tri', {
    forLineStyle: function(m, i){
       m.linewidth = 8;
       m.color = new THREE.Color( '#00ff00' );
       m.transparent = true;
       m.opacity = 1;
    }
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

// sin grid
var lgOpt = {
    forLineStyle: function(m, i){
       m.linewidth = 6;
       var arr = ['#00ffff']
       m.color = new THREE.Color( arr[ i % arr.length] );
       m.transparent = true;
       m.opacity = 0.5;
    }
};
var lgBaseDataSinGrid = {
    waveHeight: 3,
    simpleWave: false,
    waveCount: 4,
    radianOffsetLoops: 8,
    sizeWidth: 8,
    sizeHeight: 8
};
var lg4 = LineGroup.create('sinGrid', lgOpt);
lg4.position.set(0, -1, 0);
lg4.rotation.y = Math.PI * 0.0;
scene.add(lg4);
var lg5 = LineGroup.create('sinGrid', lgOpt);
lg5.position.set(0, -1, 0);
lg5.rotation.y = Math.PI * 0.5;
scene.add(lg5);
var lg6 = LineGroup.create('sinGrid', lgOpt);
lg6.position.set(0, -1, 0);
lg6.rotation.y = Math.PI * 1.0;
scene.add(lg6);
var lg7 = LineGroup.create('sinGrid', lgOpt);
lg7.position.set(0, -1, 0);
lg7.rotation.y = Math.PI * 1.5;
scene.add(lg7);

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

    // A MAIN SEQ OBJECT
    var seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){
            textCube.visible = false;

            LineGroup.set(lg1, seq.frame, seq.frameMax, lg1Base);
            LineGroup.set(lg2, seq.frame, seq.frameMax, {});
            LineGroup.set(lg3, seq.frame, seq.frameMax, {});

            LineGroup.set(lg4, seq.frame, seq.frameMax, lgBaseDataSinGrid);
            LineGroup.set(lg5, seq.frame, seq.frameMax, lgBaseDataSinGrid);
            LineGroup.set(lg6, seq.frame, seq.frameMax, lgBaseDataSinGrid);
            LineGroup.set(lg7, seq.frame, seq.frameMax, lgBaseDataSinGrid);

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
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    vOld = new THREE.Vector3(8, 1, 0),
                    vNew = new THREE.Vector3(10, 10, 10);
                    camera.position.copy(vOld).lerp(vNew, partPer)
                    camera.lookAt(-3 * partPer, 0, 0);
                }
            },
            {
                secs: 4,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(10, 10, 10);
                    camera.lookAt(-3, 0, 0);
                }
            },
            {
                secs: 20,
                update: function(seq, partPer, partBias){
                    // camera
                    vOld = new THREE.Vector3(10, 10, 10),
                    vNew = new THREE.Vector3(-10, 10, 20);
                    camera.position.copy(vOld).lerp(vNew, partPer)
                    camera.lookAt(-3, 0, 0);
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

