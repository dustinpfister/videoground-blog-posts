// 
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js'
];

// init method for the video
VIDEO.init = function(sm, scene, camera){

    scene.add( new THREE.GridHelper(10, 10))

    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Fog', 64, 20, 22, 'white'],
            ['in Three.js.', 64, 45, 22, 'white'],
            ['( r135 03/11/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    // SPHERE MESH
    let sphere = scene.userData.sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 30, 30),
        new THREE.MeshStandardMaterial({
            emissive: new THREE.Color('red')
        }));
    scene.add(sphere);

// SET UP SEQ OBJECT
    sm.seq = Sequences.create({
        sm: sm,
        part : [
            {
                per: 0,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    textCube.position.set(6, 0, 0);
                }
            },
            {
                per: 0.1,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){

                    textCube.position.set(6, 2 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                }
            },
            {
                per: 0.25,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    textCube.position.set(6, 2, 0);

                }
            }
        ]
    });

};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    var textCube = scene.userData.textCube;

    camera.position.set(8, 0, 0);

    textCube.rotation.y = 0;
    textCube.position.set(6, 0, 0);

    // sequences
    Sequences.update(sm.seq, sm);

    // have camera always look at center
    camera.lookAt(0, 0, 0);
};

