// video1 for threejs-vector3-set-from-spherical-coords
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#000000');

    // GRID
    var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#008800', '#ffffff');
    scene.add( grid );
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Set From Spherical', 64, 17, 14, 'white'],
            ['Coords Vector3', 64, 32, 14, 'white'],
            ['Method in threejs', 64, 47, 14, 'white'],
            ['( r135 05/03/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);


    // A Mesh with a Sphere for geometry and using the Standard Material
    var sphere = new THREE.Mesh(
        new THREE.SphereGeometry(2.5, 20, 20),
        new THREE.MeshBasicMaterial({
            color: new THREE.Color('lime'),
            wireframe: true,
            transparent: true,
            opacity: 0.4
        })
    );
    scene.add(sphere);
 
    var mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshNormalMaterial({
        })
    );
    scene.add(mesh);

    // USING setFromSphericalCoords to set position of the Mesh
    var setMeshPos = function(p, t, r){
        var radius = r === undefined ? 3 : r,
        phi = THREE.MathUtils.degToRad(p === undefined ? 0 : p),
        theta = THREE.MathUtils.degToRad(t === undefined ? 0 : t);
        mesh.position.setFromSphericalCoords(radius, phi, theta);
        mesh.lookAt(0, 0, 0);
    };

    setMeshPos(90, 90, 3);


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
                    // set mesh pos
                    setMeshPos(90, 90, 3);
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
                    // set mesh pos
                    setMeshPos(90, 90, 3);
                }
            },
            // sq1 - move camera up and start moving mesh
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8 - 1 * partPer, 1 + 5 * partPer, 0);
                    camera.lookAt(0, 0, 0);
                    // set mesh pos
                    setMeshPos(90, 90 + 90 * partPer, 3);
                }
            },
            // sq2 - move camera and mesh
            {
                per: 0.30,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(7, 6 + 1 * partPer, 7 * partPer);
                    camera.lookAt(0, 0, 0);
                    // set mesh pos
                    setMeshPos(90, 180 + 90 * partPer, 3);
                }
            },
            // sq3 - move camera up and mesh
            {
                per: 0.45,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(7 - 14 * partPer, 7, 7);
                    camera.lookAt(0, 0, 0);
                    // set mesh pos
                    var r = Math.PI * 2 * 4 * partPer;
                    setMeshPos(90 - Math.cos(r) * (45 * partPer), 270 + 360 * 2 * partPer, 3);
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

