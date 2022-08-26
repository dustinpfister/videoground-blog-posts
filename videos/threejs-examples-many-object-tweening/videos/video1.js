// video1 for threejs-examples-many-object-tweening
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/tween-many/r0/tween-many.js'
];
//******** **********
// dae files
//******** **********
VIDEO.daePaths = [
  '../../../dae/many-object-tweening/many-object-tweening-1a.dae'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // create source objects from DAE file
    var sObj = tweenMany.createSourceObj(VIDEO.daeResults[0])

    // create mesh from source object
    var mesh = tweenMany.createMesh(sObj, 'box_3');
    mesh.scale.set(4, 4, 4);
    scene.add(mesh);



    // LIGHT
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(2, 1, 4);
    scene.add(dl);

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
            ['Many Object ', 64, 17, 14, 'white'],
            ['Tweening', 64, 32, 14, 'white'],
            ['threejs example', 64, 47, 14, 'white'],
            ['( r140 08/26/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

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
            camera.position.set(8, 1, 0);

            mesh.rotation.y = Math.PI * 2 * seq.per;
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

                    tweenMany.tween(mesh.geometry, [
                        [ sObj.box_1.geometry, sObj.box_3.geometry, partPer ]
                    ]);
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8, 1 + 7 * partPer, 8 * partPer);
                    camera.lookAt(0, 0, 0);
                    tweenMany.tween(mesh.geometry, [
                        [ sObj.box_3.geometry, sObj.box_2.geometry, partPer ]
                    ]);
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8, 8, 8);
                    camera.lookAt(0, 0, 0);
                    tweenMany.tween(mesh.geometry, [
                        [ sObj.box_2.geometry, sObj.box_4.geometry, partPer ]
                    ]);
                }
            },
            {
                secs: 4,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8, 8, 8);
                    camera.lookAt(0, 0, 0);
                    tweenMany.tween(mesh.geometry, [
                        [ sObj.box_4.geometry, sObj.box_1.geometry, partPer ]
                    ]);
                }
            },
            {
                secs: 17,
                update: function(seq, partPer, partBias){
                    // camera
                    //var b = seq.getSinBias(2);
                    //camera.position.set(8, 8 - 16 * b, 8);
                    //camera.lookAt(0, 0, 0);

                    var a = 8 - 4 * partPer;
                    camera.position.set(a, a, a);
                    camera.lookAt(0, 0, 0);

                    tweenMany.tween(mesh.geometry, [
                        [ sObj.box_1.geometry, sObj.box_2.geometry, partPer ],
                        [ sObj.box_1.geometry, sObj.box_3.geometry, seq.getBias(4) ],
                        [ sObj.box_1.geometry, sObj.box_4.geometry, seq.getBias(16) ]
                    ]);

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

