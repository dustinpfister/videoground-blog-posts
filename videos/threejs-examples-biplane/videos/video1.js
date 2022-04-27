// video1 for threejs-examples-biplane

VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js',
   'biplane.js'
];

// init method for the video
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#008a8a');

    // GRID
    var grid = scene.userData.grid = new THREE.GridHelper(30, 30, '#ffffff', '#000000');
    scene.add( grid );
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Biplane Informal', 64, 17, 15, 'white'],
            ['Model example', 64, 32, 15, 'white'],
            ['in Three.js.', 64, 47, 15, 'white'],
            ['( r135 04/27/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    var bp = scene.userData.bp = Biplane.create();
    bp.scale.set(0.25, 0.25, 0.25);
    scene.add(bp);

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
                    // camera
                    camera.position.set(10, 1, 0);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                per: 0.10,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8 + 2 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    // camera
                    camera.position.set(10, 1, 0);
                    camera.lookAt(0, 0, 0);
                }
            },
            // sq1 - 
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(10 + 2 * partPer, 1, 0);
                    camera.lookAt(0, 2 * partPer, 0);
                }
            },
            // sq2 - 
            {
                per: 0.20,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(12, 1, 0);
                    camera.lookAt(0, 2, 0);
                }
            },
            // sq3 - 
            {
                per: 0.50,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(12 - 12 * partPer, 1 + 3 * partPer, 0);
                    camera.lookAt(bp.position);
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

    var bp = scene.userData.bp;
    Biplane.update(bp, per);

    var r = Math.PI * 4 * per,
    x = Math.cos(r) * 5,
    z = Math.sin(r) * 5;
    bp.position.set(x, 2, z);
    bp.lookAt( Math.cos(r + 0.25) * 5, 2.0, Math.sin(r + 0.25) * 5 );
    bp.rotation.z += 1;

    // sequences
    Sequences.update(sm.seq, sm);

};
