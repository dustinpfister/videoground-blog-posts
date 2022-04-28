// video1 for threejs-examples-tree

VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js',
   'datatex.js',
   'tile-index.js',
   'tree.js'
];

// init method for the video
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#00afaf');

    // GRID
    //var grid = scene.userData.grid = new THREE.GridHelper(30, 30, '#00ff00', '#ffffff');
    //scene.add( grid );
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Tree Model', 64, 17, 15, 'white'],
            ['Example', 64, 32, 15, 'white'],
            ['in Three.js.', 64, 47, 15, 'white'],
            ['( r135 04/28/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);


    var textureRND1 = datatex.seededRandom(80, 80, 1, 1, 1, [200, 250]);
    var tree = scene.userData.tree = new Tree({
            sections: 8,
            conesPerSection: 16,
            coneMaterial: new THREE.MeshStandardMaterial({
                color: 0x00af00,
                map: textureRND1
            })
        });
    scene.add(tree.group);

    // ground
    var ground = TileMod.create({
            w: 200,
            h: 200,
            sw: 20,
            sh: 20
        });
    ground.position.set(0, -1, 0);
    TileMod.setCheckerBoard(ground);
    scene.add(ground)

    // light
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(3, 1, 1);
    scene.add(dl);


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
                    camera.position.set(10, 1 + 9 * partPer, 10 * partPer);
                    camera.lookAt(0, 1 * partPer, 0);  
                    
                }
            },
            // sq2 - 
            {
                per: 0.25,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(10, 10, 10);
                    camera.lookAt(0, 1, 0);                   
                }
            },
            // sq3 - 
            {
                per: 0.35,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(10 - 20 * partPer, 10, 10 + 10 * partPer);
                    camera.lookAt(0, 1, 0);                   
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

    var tree = scene.userData.tree;
    tree.group.children.forEach(function(coneGroup, i){
        coneGroup.rotation.y = Math.PI / 180 * 90 * per * (i + 1);
    });

    // sequences
    Sequences.update(sm.seq, sm);

};
