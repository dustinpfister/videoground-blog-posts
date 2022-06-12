// video1 for threejs-examples-lines-sphere-circles
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences-hooks-r1.js',
   '../js/lines-sphere-circles-r1.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#000000');

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
            ['Sphere Circle Lines', 64, 17, 14, 'white'],
            ['threejs example', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r135 06/12/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);


    // opt1 is plain sphere
    var opt1 = { 
        maxRadius: 4, pointsPerCircle: 20, linewidth: 8,
        forOpt: function(opt, per, bias, frame, frameMax){
           var a = per * 10 % 1,
           b = 1 - Math.abs(0.5 - a) / 0.5;
           opt.maxRadius = 3 + 1 * b;
        }
    }
    var g1 = LinesSphereCircles.create(opt1);
    g1.position.set(-10, -2, 0)
    scene.add(g1);


// seeded random
var opt2 = { 
    maxRadius: 8, 
    forPoint: 'seededRandom', 
    linewidth: 8}
var g2 = LinesSphereCircles.create(opt2);
g2.position.set(-5,-10,-25)
scene.add(g2);

// seashell
var opt3 = {
    circleCount: 20,
    maxRadius: 4,
    pointsPerCircle: 30,
    colors: [0x004444, 0x00ffff],
    linewidth: 8,
    forPoint: 'seaShell',
    forOpt: function(opt, per, bias, frame, frameMax){
        var a = per * 6 % 1,
        b = 1 - Math.abs(0.5 - a) / 0.5;
        opt.minRadius = 1 + 3 * b;
    }
};
var g3 = LinesSphereCircles.create(opt3);
scene.add(g3);


    // g4 is plain sphere but with r1 changes over time
    var opt4 = { 
        maxRadius: 4, pointsPerCircle: 20, linewidth: 8,
        forOpt: function(opt, per, bias, frame, frameMax){
           var a = per * 6 % 1,
           b = 1 - Math.abs(0.5 - a) / 0.5;
           opt.r1 = 1 * b;
        }
    }
    var g4 = LinesSphereCircles.create(opt4);
    g4.position.set(-10, -2, -10)
    scene.add(g4);


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

            LinesSphereCircles.setByFrame(g1, seq.frame, seq.frameMax, opt1);
            //LinesSphereCircles.setByFrame(g2, seq.frame, seq.frameMax, opt2);
            g2.rotation.y = Math.PI * 4 * seq.per;
            LinesSphereCircles.setByFrame(g3, seq.frame, seq.frameMax, opt3);
            LinesSphereCircles.setByFrame(g4, seq.frame, seq.frameMax, opt4);

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
                    camera.position.set(8, 1 + 4 * partPer, 8 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 10,
                update: function(seq, partPer, partBias){
                    // camera
                    var v1 = new THREE.Vector3(8, 5, 8),
                    v2 = new THREE.Vector3(-20, -5, 20);
                    camera.position.copy(v1).lerp(v2, partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 10,
                update: function(seq, partPer, partBias){
                    // camera
                    var v1 = new THREE.Vector3(-20, -5, 20),
                    v2 = new THREE.Vector3(-30, 0, 0);
                    camera.position.copy(v1).lerp(v2, partPer);
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

