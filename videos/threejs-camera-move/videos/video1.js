// video1 for threejs-camera-move
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js',
   '../../../js/datatex.js',
   '../../../js/tile-index.js',
   '../../../js/guy.js',
   '../../../js/guy-canvas.js',
   '../../../js/guy-characters.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#008a8a');

 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Moving the', 64, 17, 14, 'white'],
            ['Camera in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r135 05/10/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    // light
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(1, 1, 1);
    scene.add(dl);

    // ground
    var ground = TileMod.create({
            w: 200,
            h: 200,
            sw: 20,
            sh: 20
        });
    ground.position.set(0, 0, 0);
    TileMod.setCheckerBoard(ground);
    scene.add(ground);

    // ADDING GUY1 to scece
    GuyCharacters.create(scene, 'guy1');
    var guy1 = scene.userData.guy1;
    guy1.group.scale.set(0.5, 0.5, 0.5);
    guy1.group.position.set(2, 1.6, 0);


    // SET UP SEQ OBJECT
    sm.seq = Sequences.create({
        sm: sm,
        part : [
            {
                per: 0,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8, 0);
                    textCube.material.opacity = 1.0;
                    // camera
                    camera.position.set(8, 1, 0);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                per: 0.10,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8 + 1 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    textCube.material.opacity = 1.0 - partPer;
                    // camera
                    camera.position.set(8, 1, 0);
                    camera.lookAt(0, 0, 0);
                }
            },
            // sq1 - move camera to 12, 12, 12
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8 + 4 * partPer, 1 + 11 * partPer, 12 * partPer);
                    camera.lookAt(0, 10 * partPer, 7 * partPer);
                }
            },
            // sq2 - rest
            {
                per: 0.25,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(12 - 24 * partPer, 12, 12);
                    camera.lookAt(0, 10, 7);
                }
            },
            // sq3 - lerp current camera look at to position of guy1
            {
                per: 0.35,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(-12, 12, 12);

                    var v = new THREE.Vector3(0, 10, 7);
                    camera.lookAt( guy1.group.position.clone().lerp(v, 1 - partPer) );
                }
            },
            // sq4 - rest
            {
                per: 0.45,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(-12, 12, 12);

                    var v = new THREE.Vector3(0, 10, 7);
                    camera.lookAt( guy1.group.position );
                }
            },
            // sq5 - lerp position of camera from -12, 12, 12 to position 3, 3, 3 (guy1 relative)
            {
                per: 0.55,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    var vpos = new THREE.Vector3(-12, 12, 12);
                    var vposNew = guy1.group.position.clone().add( new THREE.Vector3(3, 3, 3) );
                    camera.position.copy( vpos.clone().lerp(vposNew , partPer ) )

                    var v = new THREE.Vector3(0, 10, 7);
                    camera.lookAt( guy1.group.position );
                }
            },
            // sq6 - following guy2
            {
                per: 0.75,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    var vpos = guy1.group.position.clone().add( new THREE.Vector3(3, 3, 3) );
                    camera.position.copy( vpos )

                    var v = new THREE.Vector3(0, 10, 7);
                    camera.lookAt( guy1.group.position );
                }
            }
        ]
    });
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    var textCube = scene.userData.textCube;
    textCube.rotation.y = 0;
    textCube.position.set(6, 0.8, 0);
    textCube.visible = false;
    textCube.material.transparent = true;
    textCube.material.opacity = 0.0;

    // guy moving
    var guy1 = scene.userData.guy1;
    guy1.walk(per, 8);
    guy1.group.position.z = -5 + 10 * per;

    // sequences
    Sequences.update(sm.seq, sm);
};

