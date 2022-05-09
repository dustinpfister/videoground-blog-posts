// video1 for threejs-box3
 
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
    grid.material.linewidth = 3;
    scene.add( grid );
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Box3 Constructor', 64, 17, 14, 'white'],
            ['in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r135 05/09/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    // GROUP OF MESH OBJECTS
    var group = new THREE.Group();
    var i = 0, len = 8;
    while(i < len){
        var mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1), 
            new THREE.MeshNormalMaterial());
        group.add(mesh);
        i +=1;
    }
    scene.add(group);

    // BOX3 and HELPER
    var box3 = new THREE.Box3();
    box3.setFromCenterAndSize(
        new THREE.Vector3( 0, 0, 0 ), 
        new THREE.Vector3( 4, 4, 4 ) );
    var box3Helper = new THREE.Box3Helper( box3, 0xffff00 );
    box3Helper.material.linewidth = 6;
    scene.add(box3Helper);

    // 
    var groupDefault = function(){
        group.children.forEach(function(mesh){
            mesh.visible = false;
            mesh.position.set(0, 0, 0);
            mesh.scale.set(1, 1, 1);
        });
    };

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
                    // group
                    groupDefault();
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
                    // group
                    groupDefault();
                }
            },
            // sq1 - scale up and down one mesh in the box
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8, 1 + 5 * partPer, 0);
                    camera.lookAt(0, 0, 0);
                    // group
                    groupDefault();
                    var s = new THREE.Vector3();
                    box3.getSize(s);
                    s.multiplyScalar(partBias);
                    group.children[0].visible = true;
                    group.children[0].scale.copy(s);
                }
            },
            {
                per: 0.35,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(0, 6, 6);
                    camera.lookAt(0, 0, 0);
                    // group
                    groupDefault();
                    var s = new THREE.Vector3();
                    box3.getSize(s);
                    group.children.forEach(function(mesh, i, arr){
                        var len = arr.length;
                        var xPer = Math.random();
                        var zPer = Math.random();
                        var yPer = Math.random();
                        var x = box3.min.x + (box3.max.x - box3.min.x) * xPer + 0.5;
                        var z = box3.min.z + (box3.max.z - box3.min.z) * zPer + 0.5;
                        var y = box3.min.y + (box3.max.y - box3.min.y) * yPer + 0.5;
                        mesh.visible = true;
                        mesh.position.set(x, 0, z);
                    });
                }
            }
            // sq2 - 
/*
            {
                per: 0.35,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(0, 6, 6);
                    camera.lookAt(0, 0, 0);
                    // group
                    groupDefault();
                    var s = new THREE.Vector3();
                    box3.getSize(s);
                    group.children.forEach(function(mesh, i, arr){
                        var len = arr.length;
                        var xPer = (i % 2) / 2;
                        var zPer = Math.floor(i / ) / 4;
                        var yPer = Math.floor(i / 4) / 2;
                        var x = box3.min.x + (box3.max.x - box3.min.x) * xPer + 0.5;
                        var z = box3.min.z + (box3.max.z - box3.min.z) * zPer + 0.5;
                        var y = box3.min.y + (box3.max.y - box3.min.y) * yPer + 0.5;
                        mesh.visible = true;
                        mesh.position.set(x, 0, z);
                    });
                }
            }
*/
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

