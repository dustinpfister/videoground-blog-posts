// video1 for threejs-examples-tree-sphere
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js',
   '../../../js/datatex.js',
   '../../../js/tile-index.js',
   '../js/canvas_texture.js',
   '../js/tree_sphere.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');

    // GRID
    //var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    //scene.add( grid );
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Tree Sphere', 64, 17, 14, 'white'],
            ['Threejs', 64, 32, 14, 'white'],
            ['Example', 64, 47, 14, 'white'],
            ['( r135 05/07/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    // light
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(1, 1, 1);
    scene.add(dl);

    var materials = {
        sphere: new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0x000000,
            map: datatex.seededRandom(32, 32, 0, 1, 0, [64, 128]),
            side: THREE.DoubleSide
        }),
        trunk: new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0x000000,
            map: datatex.seededRandom(32, 32, 1, 0.5, 0, [64, 128]),
            side: THREE.DoubleSide
        })
    };

    // trees
    [
        [1, 4, 0, 0],
        [1, 2, 3, -3],
        [2, 3, -3, 3],

        [1, 1, -2, -4],
        [1, 1, -4, -1]
    ].forEach(function(argu){
        // create a tree
        var tree = TreeSphereMod.create({
            sphereSize: argu[0],
            trunkLength: argu[1],
            materials: materials
        });
        //tree.add( new THREE.BoxHelper(tree) );
        tree.position.set(argu[2], argu[1] / 2, argu[3]);
        tree.lookAt(argu[2], -10, argu[3]);
        scene.add(tree);
    });

    // ground
    var ground = TileMod.create({
            w: 200,
            h: 200,
            sw: 20,
            sh: 20,
            materials: [
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            map: datatex.seededRandom(80, 80, 0, 1, 0, [32, 64]),
            //emissive: 0x00ff00,
            //emissiveIntensity: 0.75,
            side: THREE.DoubleSide
        }),
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            map: datatex.seededRandom(80, 80, 0, 1, 0.50, [32, 64]),
            //map: textureRND2,
            //emissive: 0x00ff00,
            //emissiveIntensity: 0.2,
            side: THREE.DoubleSide
        })
    ]
        });
    ground.position.set(0, 0, 0);
    TileMod.setCheckerBoard(ground);
    scene.add(ground)


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
            // sq1 - 
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8, 1 + 7 * partPer, 8 * partPer);
                    camera.lookAt(0, 2 * partPer, 0);
                }
            },
            // sq2 - 
            {
                per: 0.25,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8, 8, 8);
                    camera.lookAt(0, 2, 0);
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
    // sequences
    Sequences.update(sm.seq, sm);
};

