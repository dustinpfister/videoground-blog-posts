// video1 for threejs-camera-orthographic
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences-hooks-r1.js',
   '../../../js/datatex.js',
   '../../../js/object-grid-wrap-r2-with-opacity2.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // CAMERAS
    sm.cams = [
        camera,
        new THREE.OrthographicCamera(-8, 8, 4, -4, 0.1, 100)
    ];
 
    // STACK
    var stack = CubeStack.create({gx: 7, gy: 4, boxCount: 35});
    stack.position.set(0, 0.6, 0)
    scene.add(stack);

    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');

    // GRID
    var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    scene.add( grid );

    //******** **********
    // TEXT CUBE
    //******** **********
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Orthographic', 64, 17, 14, 'white'],
            ['Camera', 64, 32, 14, 'white'],
            ['in threejs', 64, 47, 14, 'white'],
            ['( r135 07/27/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    //******** **********
    // LIGHT
    //******** **********
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(2, 1, 3);
    scene.add(dl);

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

            ObjectGridWrap.setPos(grid, (1 - seq.per) * 2, Math.cos(Math.PI * seq.bias) * 0.25 );
            ObjectGridWrap.update(grid);

            textCube.visible = false;

            // camera defaults 
            sm.camera = sm.cams[0];

            var cam1 = sm.cams[1];
            cam1.left = -8;
            cam1.right = 8;
            cam1.top = 4;
            cam1.bottom = -4;

        },
        afterObjects: function(seq){
             sm.cams[1].updateProjectionMatrix();
        },
        objects: [
            // sq0 - textcube
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // textcube
                    if(seq.partFrame < seq.partFrameMax){
                        seqHooks.setFrame(seq_textcube, seq.partFrame, seq.partFrameMax);
                    }
                    // camera
                    sm.camera = sm.cams[0];
                    sm.camera.position.set(8, 1, 0);
                    sm.camera.lookAt(0, 0, 0);
                }
            },
            // sq1 - move to 5, 4, 5
            {
                secs: 1,
                update: function(seq, partPer, partBias){
                    // camera
                    var v1 = new THREE.Vector3(8, 1, 0);
                    var v2 = new THREE.Vector3(5, 4, 5);
                    sm.camera = sm.cams[0];
                    sm.camera.position.copy(v1).lerp(v2, partPer);
                    sm.camera.lookAt(0, 0, 0);
                }
            },
            // sq2 - swith between cameras at fixed 5, 4, 5 location
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    var len = sm.cams.length;
                    sm.camera = sm.cams[ Math.floor( partPer * len * 4.5 % len) ];
                    sm.camera.position.set(5, 4, 5);
                    sm.camera.lookAt(0, 0, 0);
                }
            },
            // sq3 - move to -5, 4, 5
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    var v1 = new THREE.Vector3(5, 4, 5);
                    var v2 = new THREE.Vector3(-5, 4, 5);
                    sm.camera = sm.cams[1];
                    sm.camera.position.copy(v1).lerp(v2, partPer);
                    sm.camera.lookAt(0, 0, 0);
                }
            },
            // sq4 - move to -5, 4, -5
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    var v1 = new THREE.Vector3(-5, 4, 5);
                    var v2 = new THREE.Vector3(-5, 4, -5);
                    sm.camera = sm.cams[1];
                    sm.camera.position.copy(v1).lerp(v2, partPer);
                    sm.camera.lookAt(0, 0, 0);
                }
            },
            // sq5 - move to 5, 0, -5
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    var v1 = new THREE.Vector3(-5, 4, -5);
                    var v2 = new THREE.Vector3(5, 4, -5);
                    sm.camera = sm.cams[1];
                    sm.camera.position.copy(v1).lerp(v2, partPer);
                    sm.camera.lookAt(0, 0, 0);
                }
            },
            // sq6 - move to up and down
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    var v1 = new THREE.Vector3(5, 4, -5);
                    var v2 = new THREE.Vector3(5, -4, -5);
                    sm.camera = sm.cams[1];
                    sm.camera.position.copy(v1).lerp(v2, partBias);
                    sm.camera.lookAt(0, 0, 0);
                }
            },
            // sq7 - 
            {
                secs: 4,
                update: function(seq, partPer, partBias){
                    var cam1 = sm.camera = sm.cams[1];
                    cam1.left = -8 - 16 * partBias;
                    cam1.right = 8 + 16 * partBias;
                    sm.camera.lookAt(5, 4, -5);
                    sm.camera.lookAt(0, 0, 0);
                }
            },
            // sq8 - 
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    var cam1 = sm.camera = sm.cams[1];
                    cam1.top = 4 + 8 * partBias;
                    cam1.bottom = -4 - 8 * partBias;
                    sm.camera.lookAt(5, 4, -5);
                    sm.camera.lookAt(0, 0, 0);
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

