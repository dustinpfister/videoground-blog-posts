// video1 for threejs-euler
 
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
            ['The Euler', 64, 17, 14, 'white'],
            ['Class in', 64, 32, 14, 'white'],
            ['three.js', 64, 47, 14, 'white'],
            ['( r135 05/05/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

var dl = new THREE.DirectionalLight(0xffffff, 1);
dl.position.set(1, 3, 2);
scene.add(dl);

// AN INSTANCE OF THREE.Euler
var euler = new THREE.Euler(Math.PI / 180 * 45, 0, 0)

// GroupA is a group of mesh objects of box geos in a line
var meshA = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({
            color: new THREE.Color('red')
        }));
var groupA = scene.userData.groupA = new THREE.Group();
scene.add(groupA);
var i = 0, len = 6;
while(i < len){
    var m = meshA.clone();
    groupA.add(m);
    i += 1;
}
// update effect should be rotation of each cube by differing sets of axis deltas
var updateGroupA = scene.userData.updateGroupA = function(groupA, perANI, deltas){
    deltas = deltas || [];
    groupA.children.forEach(function(mesh, i){
        var d = deltas[i] || [0, 0, 0],
        per = i / (len - 1);
        mesh.rotation.set(d[0] * perANI, d[1] * perANI, d[2] * perANI);
        var z = 5 - 10 * per;
        mesh.position.set(0, 0, z);
    });
};
// deltas to use with update
deltasA = scene.userData.deltasA = [
    [0,5,0],[0,10,0], [0,20,0], [0,40,0], [0,80,0], [0,160,0]
];

// MESH B
var meshB = scene.userData.meshB = new THREE.Mesh(
        new THREE.SphereGeometry(2, 30, 30),
        new THREE.MeshStandardMaterial({
            color: new THREE.Color('lime')
        }));
scene.add(meshB)

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
                    // groupA
                    groupA.position.set(0, 0, 0);
                    groupA.rotation.set(0, 0, 0);
                    // meshB
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
                    // groupA
                    groupA.position.set(0, 0, 0);
                    groupA.rotation.set(0, 0, 0);
                }
            },
            // sq1 - 
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8 + 2 * partPer, 1 + 9 * partPer, 10 * partPer);
                    camera.lookAt(0, 0, 0);
                    // groupA
                    groupA.position.set(0, 0, 0);
                    groupA.rotation.set(0, 0, 0);
                }
            },
            // sq2 - 
            {
                per: 0.25,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    var a = 10 - 5 * partPer;
                    camera.position.set(a, a, a);
                    camera.lookAt(0, 0, 0);
                    // groupA
                    groupA.position.set(0, 0, 0);
                    groupA.rotation.set(0, Math.PI * 2 * partPer, 0);
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

    var ud = scene.userData;
    // groupA
    var groupA = ud.groupA;
    var deltasA = ud.deltasA;
    var updateGroupA = ud.updateGroupA;
    updateGroupA(groupA, per, deltasA);
    // meshB
    var meshB = ud.meshB;
    meshB.position.copy( new THREE.Vector3(-7, 0, 0) ).applyEuler( new THREE.Euler(0, 0, Math.PI * 4 * per))


    // sequences
    Sequences.update(sm.seq, sm);
};

