// video1 for threejs-box-geometry
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');

    // GRID
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
            ['Box Geometry', 64, 17, 14, 'white'],
            ['Constructor in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r135 05/06/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);


// the array of materials that is only two materials
var materials = [
    new THREE.MeshBasicMaterial({color: new THREE.Color('red')}),
    new THREE.MeshBasicMaterial({color: new THREE.Color('lime')}),
    new THREE.MeshBasicMaterial({color: new THREE.Color('cyan')}),
    new THREE.MeshBasicMaterial({color: new THREE.Color('blue')}),
    new THREE.MeshBasicMaterial({color: new THREE.Color('green')}),
    new THREE.MeshBasicMaterial({color: new THREE.Color('purple')})
];
// create the box geometry
var geo = new THREE.BoxGeometry(2, 2, 2);
// The objects in the groups array is what there is to
// use to set material index values for each face
geo.groups.forEach(function (face, i) {
    face.materialIndex = face.materialIndex % materials.length;
});
// now create the box like always passing the geometry first,
// and the array of materials second
var box = new THREE.Mesh(
        geo,
        materials);
scene.add(box)

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
                    // box
                    box.rotation.set(0, 0, 0);
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
                    // box
                    box.rotation.set(0, 0, 0);
                }
            },
            // sq1 - 
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8, 1 + 7 * partPer, 8 * partPer);
                    camera.lookAt(0, 0, 0);
                    // box
                    box.rotation.set(0, 0, 0);
                }
            },
            // sq2 - 
            {
                per: 0.25,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8 - 16 * partPer, 8, 8);
                    camera.lookAt(0, 0, 0);
                    // box
                    box.rotation.set(0, 0, 0);
                }
            },
            // sq3 - 
            {
                per: 0.30,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(-8, 8, 8 - 16 * partPer);
                    camera.lookAt(0, 0, 0);
                    // box
                    box.rotation.set(0, 0, 0);
                }
            },
            // sq4 - 
            {
                per: 0.35,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(-8, 8, -8);
                    camera.lookAt(0, 0, 0);
                    // box
                    box.rotation.set(0, 0, 0);
                }
            },
            // sq5 - 
            {
                per: 0.50,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    var s = 8 - 6 * partPer;
                    camera.position.set(s * -1, s, s * -1);
                    camera.lookAt(0, 0, 0);
                    // box
                    box.rotation.set(0, Math.PI * 2 * partPer, 0);
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

