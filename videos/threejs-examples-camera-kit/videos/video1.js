// video1 for threejs-examples-camera-kit
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/aplerp/r0/aplerp.js',
   '../../../js/camera-kit/r0/camera-kit.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');

    // GRID
    var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    scene.add( grid );
 
    // temp fix for isshue with partPer value
    var getFP = function(){
        var f = seq.partFrame >= seq.partFrameMax ? seq.partFrameMax - 1 : seq.partFrame;
        var fp = f / seq.partFrameMax;
        return fp;
    };

    // ADDING SOME MESH OBJECTS
    var material = new THREE.MeshNormalMaterial();
    var mesh1 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        material
    );
    scene.add(mesh1);

    var mesh2 = new THREE.Mesh(
        new THREE.SphereGeometry(1, 20, 20),
        material
    );
    mesh2.position.set(2, 0, 2);
    scene.add(mesh2);

    var mesh3 = new THREE.Mesh(
        new THREE.ConeGeometry(0.5, 3, 20, 20),
        material
    );
    mesh3.position.set(-2, 0, -2);
    scene.add(mesh3);

 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Camera kit', 64, 17, 14, 'white'],
            ['threejs example', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 08/05/2022 )', 64, 70, 12, 'gray'],
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
                    textCube.position.set(6, 0.8 + 1 * partPer, 0.5);
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

            var b = 1 - Math.abs(0.5 - (seq.per * 4 % 1) ) / 0.5;
            mesh3.position.y = -3 + 6 * b;
            mesh3.rotation.x = Math.PI * 4 * seq.per;
            mesh3.rotation.z = Math.PI * 8 * seq.per;

            textCube.visible = false;
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
                    var v1 = new THREE.Vector3(8, 1, 0);
                    var v2 = new THREE.Vector3(8, 10, -8);
                    var fp = getFP(seq);
                    cameraKit.sinLerp(camera, v1, v2, fp, { bMulti: 0.05 } );
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 2,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8, 10, -8);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    var v1 = new THREE.Vector3(8, 10, -8);
                    var v2 = new THREE.Vector3(-5, 5, -5);
                    var fp = getFP(seq);
                    cameraKit.sinLerp(camera, v1, v2, fp, { bMulti: 0.15 } );
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 1,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(-5, 5, -5);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 4,
                update: function(seq, partPer, partBias){
                    // camera
                    var v1 = new THREE.Vector3(-5, 5, -5);
                    var vTarget = new THREE.Vector3(0, 0, 0);
                    var fp = getFP(seq);
                    // have to do this as a temp fix for r0 of camera kit
                    camera.position.set(-5, 5, -5);
                    cameraKit.circleAround(camera, vTarget, v1, fp, 1.25);
                }
            },
            {
                secs: 1,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(-5, 5, -5);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 2,
                update: function(seq, partPer, partBias){
                    // camera
                    var v1 = new THREE.Vector3(-5, 5, -5);
                    var v2 = new THREE.Vector3(-10, 10, 10);
                    var fp = getFP(seq);
                    cameraKit.sinLerp(camera, v1, v2, fp, { bMulti: 0.25 } );
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(-10, 10, 10);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 2,
                update: function(seq, partPer, partBias){
                    // camera
                    var v1 = new THREE.Vector3(-10, 10, 10);
                    var v2 = mesh3.position.clone().add( new THREE.Vector3(-4, 4, -4) );
                    var fp = getFP(seq);
                    cameraKit.plainLerp(camera, v1, v2, fp);

                    var v3 = new THREE.Vector3(0, 0, 0);
                    var v4 = mesh3.position.clone();
                    camera.lookAt( v3.clone().lerp(v4, fp));
                    //console.log(camera.position.x, camera.position.y, camera.position.z);
                }
            },
            {
                secs: 4,
                update: function(seq, partPer, partBias){
                    var v1 = new THREE.Vector3(-4, 4, -4);
                    var v2 = mesh3.position.clone().add( v1 );
                    // camera
                    //camera.position.copy(v2);
                    //camera.lookAt(mesh3.position.clone());

                    var fp = getFP(seq);
                    // had to adjust
                    camera.position.copy( v2.add( new THREE.Vector3(-2.2, 0, -1.2) ) );
                    cameraKit.circleAround(camera, mesh3.position.clone(), v2, fp, 1.25);
                    //console.log(camera.position.x, camera.position.y, camera.position.z);
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

