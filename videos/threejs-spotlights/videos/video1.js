// video1 for threejs-spotlights
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js',
   '../../../js/datatex.js',
   '../../../js/tile-index.js',
   '../js/tree_sphere.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
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
            ['Spotlights', 64, 17, 14, 'white'],
            ['in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r135 05/09/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);


    var plane = TileMod.create();
    scene.add(plane);


    // ---------- ----------
    // SPOTLIGHT
    // ---------- ----------
    var color = new THREE.Color('white'),
    intensity = 1,
    distance = 30,
    angle = Math.PI * 0.05,
    penumbra = 0.25,
    decay = 0.5;
    var spotLight = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay);
    spotLight.position.set(0, 8, 0);
    scene.add(spotLight);

    // ---------- ----------
    // SPOTLIGHT HELPER
    // ---------- ----------
    var spotLightHelper = new THREE.SpotLightHelper(spotLight);
    var sphMaterial = spotLightHelper.children[0].material;
    sphMaterial.linewidth = 6;
    sphMaterial.transparent = true;
    sphMaterial.opacity = 0.0;
    spotLight.add(spotLightHelper);

     // ---------- ----------
    // AMBIENTLIGHT
    // ---------- ----------   
    scene.add( new THREE.AmbientLight(0xffffff, 0.07));

    // TARGET
    var spotTarget = new THREE.Object3D(); // spotlight target
    spotLight.target = spotTarget; // set spotLight target for spotLight
    scene.add(spotTarget); // add spotLight target to the scene

    // OBJECTS
    var tree = TreeSphereMod.create({
        trunkLength: 1,
        sphereSize: 0.5
    });
    tree.position.y = 0.5;
    tree.rotation.x = Math.PI * 0.5;
    scene.add(tree)


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
                    // target
                    spotTarget.position.set(0, 0, 0);
                    // spotlight
                    spotLight.position.set(0, 8, 0);
                    spotLight.intensity = 1;
                    spotLight.distance = 30;
                    spotLight.angle = angle = Math.PI * 0.05;
                    // helper
                    spotLightHelper.update();
                    sphMaterial.opacity = 0.0;
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
                    // target
                    spotTarget.position.set(0, 0, 0);
                    // spotlight
                    spotLight.position.set(0, 8, 0);
                    spotLight.intensity = 1;
                    spotLight.distance = 30;
                    spotLight.angle = angle = Math.PI * 0.05;
                    // helper
                    spotLightHelper.update();
                    sphMaterial.opacity = 0.0;
                    // camera
                    camera.position.set(8, 1, 0);
                    camera.lookAt(0, 0, 0);
                }
            },
            // sq1 - target moves
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // target
                    var r = Math.PI * 4 * partPer;
                    var x = Math.cos(r) * 5 * partBias;
                    var z = Math.sin(r) * 5 * partBias;
                    spotTarget.position.set(x, 0, z);
                    // spotlight
                    spotLight.position.set(0, 8, -16 * partBias);
                    spotLight.intensity = 1;
                    spotLight.distance = 30;
                    spotLight.angle = angle = Math.PI * 0.05;
                    // helper
                    spotLightHelper.update();
                    sphMaterial.opacity = 0.0;
                    // camera
                    camera.position.set(8, 1 + 5 * partPer, - 8 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            // sq2 - intensity
            {
                per: 0.35,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // target
                    spotTarget.position.set(0, 0, 0);
                    // spotlight
                    spotLight.position.set(0, 8 + 10 * partPer, 0);
                    spotLight.intensity = 1 - 1 * partBias;
                    spotLight.distance = 30;
                    spotLight.angle = angle = Math.PI * 0.05;
                    // helper
                    spotLightHelper.update();
                    sphMaterial.opacity = 0.0;
                    // camera
                    camera.position.set(8 + 4 * partPer, 6, -8 - 4 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            // sq3 - Spot light helper becomes visible
            {
                per: 0.55,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // target
                    spotTarget.position.set(0, 0, 0);
                    // spotlight
                    spotLight.position.set(0, 18 - 16 * partPer, 0);
                    spotLight.intensity = 1;
                    spotLight.distance = 30 - 27 * partPer;
                    spotLight.angle = angle = Math.PI * 0.05;
                    // helper
                    spotLightHelper.update();
                    sphMaterial.opacity = partPer;
                    // camera
                    camera.position.set(12, 6, -12);
                    camera.lookAt(0, 0, 0);
                }
            },
            // sq4 - 
            {
                per: 0.65,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // target
                    spotTarget.position.set(2 * partPer, 0, 0);
                    // spotlight
                    spotLight.position.set(0, 2, -2 * partPer);
                    spotLight.intensity = 1;
                    spotLight.distance = 3 + 3 * partPer;
                    spotLight.angle = angle = Math.PI * (0.05 + 0.2 * partPer);
                    // helper
                    spotLightHelper.update();
                    sphMaterial.opacity = 1;
                    // camera
                    camera.position.set(12, 6, -12 + 24 * partPer);
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
    textCube.position.set(6, 0.8, 0);
    textCube.visible = false;
    textCube.material.transparent = true;
    textCube.material.opacity = 0.0;
    // sequences
    Sequences.update(sm.seq, sm);
};

