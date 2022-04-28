// video1 for threejs-examples-nested-groups

VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js',
   'cube-groups.js',
   'nested-groups.js'
];

// init method for the video
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#000000');

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
            ['Nested Groups', 64, 17, 15, 'white'],
            ['Example', 64, 32, 15, 'white'],
            ['in Three.js.', 64, 47, 15, 'white'],
            ['( r135 04/28/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    // light
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(1, 1, 1);
    scene.add(dl);

    var nested = scene.userData.nested = NestedGroupsMod.create();
    scene.add(nested);


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
                    textCube.position.set(8, 0.8, 0);
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
                    textCube.position.set(8, 0.8 + 2 * partPer, 0);
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
                    camera.position.set(10, 1, 0);
                    camera.lookAt(0, 0, 0);  
                    
                }
            }
        ]
    });
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    var textCube = scene.userData.textCube;
    textCube.rotation.y = 0;
    textCube.position.set(8, 0.8, 0);
    textCube.visible = false;

    var nested = scene.userData.nested;
    NestedGroupsMod.update(nested, 1 / 30);

    // sequences
    Sequences.update(sm.seq, sm);

};
