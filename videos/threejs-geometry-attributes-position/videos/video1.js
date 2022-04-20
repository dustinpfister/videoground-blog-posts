// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js'
];

var CubeDeltas = [

    new THREE.Vector3(3, 0, 0),
    new THREE.Vector3(3, 0, 0),
    new THREE.Vector3(3, 0, 0),
    new THREE.Vector3(3, 0, 0),

    new THREE.Vector3(-3, 0, 0),
    new THREE.Vector3(-3, 0, 0),
    new THREE.Vector3(-3, 0, 0),
    new THREE.Vector3(-3, 0, 0),

    new THREE.Vector3(0, 2, 0),
    new THREE.Vector3(0, 2, 0),
    new THREE.Vector3(0, 2, 0),
    new THREE.Vector3(0, 2, 0),

    new THREE.Vector3(0, -2, 0),
    new THREE.Vector3(0, -2, 0),
    new THREE.Vector3(0, -2, 0),
    new THREE.Vector3(0, -2, 0),

    new THREE.Vector3(0, 0, 2),
    new THREE.Vector3(0, 0, 2),
    new THREE.Vector3(0, 0, 2),
    new THREE.Vector3(0, 0, 2),

    new THREE.Vector3(0, 0, -2),
    new THREE.Vector3(0, 0, -2),
    new THREE.Vector3(0, 0, -2),
    new THREE.Vector3(0, 0, -2)
];

var updateCubeGeo = function(cube, per){
    var pos = cube.geometry.getAttribute('position'),
    posHome = cube.userData.posHome;
    var i = 0;
    while(i < pos.count){
        var s = i * 3;
        var x = pos.array[s],
        y = pos.array[s + 1],
        z = pos.array[s + 2]
        var delta = CubeDeltas[i];
        pos.array[s] = posHome.array[s] + delta.x * per;
        pos.array[s + 1] = posHome.array[s + 1] + delta.y * per;
        pos.array[s + 2] = posHome.array[s + 2] + delta.z * per;
        i += 1;
    }
    pos.needsUpdate = true;
};

// init method for the video
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');
    var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    scene.add( grid );
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Position Attribute of', 64, 17, 14, 'white'],
            ['Bufer Geometry', 64, 32, 14, 'white'],
            ['in Three.js.', 64, 47, 14, 'white'],
            ['( r135 04/20/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    var cube = scene.userData.cube = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 2.0, 2.0),
        new THREE.MeshNormalMaterial({
            side: THREE.DoubleSide
        })
    );
    var pos = cube.geometry.getAttribute('position');
    cube.userData.posHome = pos.clone();
    scene.add(cube);

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
                    textCube.position.set(6, 1 + 2 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
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
                    camera.position.set(8 + 2 * partPer, 1 + 5 * partPer, 10 * partPer);
                    camera.lookAt(0, 0, 0);
                    updateCubeGeo(scene.userData.cube, partPer);
                }
            },
            // sq2 - 
            {
                per: 0.50,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(10, 6, 10);
                    camera.lookAt(0, 0, 0);
                    updateCubeGeo(scene.userData.cube, 1);
                    cube.rotation.y = Math.PI * 2 * partPer;
                }
            },
            // sq3 - 
            {
                per: 0.85,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(10, 6, 10);
                    camera.lookAt(0, 0, 0);
                    updateCubeGeo(scene.userData.cube, 1 - partPer);
                    cube.rotation.y = Math.PI * 2 * partPer;
                }
            }
        ]
    });
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    var textCube = scene.userData.textCube;
    textCube.rotation.y = 0;
    textCube.position.set(8, 1, 0);
    textCube.visible = false;


    var cube = scene.userData.cube;
    cube.rotation.y = 0;
/*
    var cube = scene.userData.cube;
    var pos = cube.geometry.getAttribute('position'),
    posHome = cube.userData.posHome;
    var i = 0;
    while(i < pos.count){
        var s = i * 3;
        var x = pos.array[s],
        y = pos.array[s + 1],
        z = pos.array[s + 2]
        var delta = CubeDeltas[i];
        pos.array[s] = posHome.array[s] + delta.x * bias;
        pos.array[s + 1] = posHome.array[s + 1] + delta.y * bias;
        pos.array[s + 2] = posHome.array[s + 2] + delta.z * bias;
        i += 1;
    }
    pos.needsUpdate = true;
*/

    // sequences
    Sequences.update(sm.seq, sm);

};

