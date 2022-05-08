// video1 for threejs-examples-tree-sphere-world
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js',
   '../js/canvas.js',
   '../js/tree-sphere.js',
   '../js/world.js'
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
            ['World Threejs', 64, 32, 14, 'white'],
            ['Example', 64, 47, 14, 'white'],
            ['( r135 05/08/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

// WORLDS
var MATERIALS_TREE = {
        sphere: new THREE.MeshStandardMaterial({
            //color: 0x00ff80,
            map: canvasTextureMod.randomGrid(['0', 'r1', '64'], 32, 32, 150),
            side: THREE.DoubleSide
        }),
        trunk: new THREE.MeshStandardMaterial({
            color: 0xffaf80,
            map: canvasTextureMod.randomGrid(['r1', 'r1', '64'], 32, 32, 150),
            side: THREE.DoubleSide
        })
    };
    var MATERIALS_LIGHTS = {
        sun: new THREE.MeshStandardMaterial({
            emissive: 'white',
            emissiveMap: canvasTextureMod.randomGrid(['r1', 'r1', '0'])
        }),
        moon: new THREE.MeshStandardMaterial({
            emissive: 'white',
            emissiveMap: canvasTextureMod.randomGrid(['0', 'r1', 'ri'])
        })
    };
    var MATERIALS_GROUND = {
        grass: new THREE.MeshStandardMaterial({
            color: 'white',
            map: canvasTextureMod.randomGrid(['0', 'r1', '64'], 128, 125, 200),
        })
    };


    var worldOptions = {
        MATERIALS_GROUND: MATERIALS_GROUND,
        MATERIALS_TREE: MATERIALS_TREE,
        MATERIALS_LIGHTS: MATERIALS_LIGHTS,
        lightsDPSY: 20,
        lightsDPSZ: 5,
        worldRotation: 5
    };
    var world = WorldMod.create(worldOptions);
    scene.add(world);
 
    // world2
    worldOptions.worldRotation = 65;
    worldOptions.lightsDPSY = 75;
    worldOptions.lightsDPSZ = 25;
    var world2 = WorldMod.create(worldOptions);
    world2.position.set(-28, -3, -5);
    scene.add(world2);
 
    // world3
    worldOptions.worldRotation = 1;
    worldOptions.lightsDPSX = 25;
    worldOptions.lightsDPSY = 25;
    worldOptions.lightsDPSZ = 0;
    var world3 = WorldMod.create(worldOptions);
    world3.position.set(-15, -20, -50);
    scene.add(world3);


    var secs = 1 / 30;
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
                    textCube.material.opacity = 1.0;
                    // camera
                    camera.position.set(10, 1, 0);
                    camera.lookAt(0, 0, 0);
                    // worlds
                    WorldMod.update(world, secs);
                    WorldMod.update(world2, secs);
                    WorldMod.update(world3, secs);
                }
            },
            {
                per: 0.10,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(8, 0.8 + 1 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    textCube.material.opacity = 1.0 - partPer;
                    // camera
                    camera.position.set(10, 1, 0);
                    camera.lookAt(0, 0, 0);
                    // worlds
                    WorldMod.update(world, secs);
                    WorldMod.update(world2, secs);
                    WorldMod.update(world3, secs);
                }
            },
            // sq1 - 
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(10, 1 + 9 * partPer, 9 * partPer);
                    camera.lookAt(0, 0, 0);
                    // worlds
                    WorldMod.update(world, secs);
                    WorldMod.update(world2, secs);
                    WorldMod.update(world3, secs);
                }
            },
            // sq2 - 
            {
                per: 0.25,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(10, 10, 10);
                    camera.lookAt(0, 0, 0);
                    // worlds
                    WorldMod.update(world, secs);
                    WorldMod.update(world2, secs);
                    WorldMod.update(world3, secs);
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
    textCube.material.transparent = true;
    textCube.material.opacity = 0.0;
    // sequences
    Sequences.update(sm.seq, sm);
};

