// video1 for threejs-box-helper
 
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
    var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#afafaf', '#008f8f');
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
            ['Box Helper', 64, 17, 14, 'white'],
            ['in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r135 05/08/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);


    // OBJECTS
    var group = new THREE.Group();
    var i = 0, len = 20;
    while(i < len){
        var mesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.25, 30, 30), 
            new THREE.MeshNormalMaterial());
        var r = Math.PI * 2 * (i / len);
        mesh.position.set(
            Math.cos(r) * 3,
            Math.sin( Math.PI * 8 * (i / len) ) * 0.25,
            Math.sin(r) * 3
        );
        group.add(mesh);
        i += 1;
    }
    scene.add(group);

    // BOX HELPER
    var boxHelper = new THREE.BoxHelper(group.children[0]);
    boxHelper.material.linewidth = 6;
    scene.add(boxHelper);



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
                    group.scale.set(1, 1, 1);
                    // box helper
                    boxHelper.setFromObject(group.children[0]);
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
                    group.scale.set(1, 1, 1);
                    // box helper
                    boxHelper.setFromObject(group.children[0]);
                }
            },
            // sq1 - 
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8 - 3 * partPer, 1 + 1 * partPer, -5 * partPer);
                    camera.lookAt(0, 0, 0);
                    // group
                    group.scale.set(1, 1, 1);
                    // box helper
                    boxHelper.setFromObject(group.children[0]);
                }
            },
            // sq2 - 
            {
                per: 0.25,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(5, 2, -5);
                    camera.lookAt(0, 0, 0);
                    // group
                    group.scale.set(1, 1, 1);
                    // box helper
                    boxHelper.setFromObject(group.children[0]);
                }
            },
            // sq3 - 
            {
                per: 0.25,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(5, 2, -5);
                    camera.lookAt(0, 0, 0);
                    // group
                    group.scale.set(1, 1, 1);
                    // box helper
                    var len = group.children.length; 
                    boxHelper.setFromObject( group.children[ Math.floor( len * partPer ) ] );
                }
            },
            // sq4 - box helper with group 
            {
                per: 0.75,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(5, 2, -5);
                    camera.lookAt(0, 0, 0);
                    // group
                    var s = 1 - 0.75 * partPer;
                    group.scale.set(s, s, s);
                    // box helper 
                    boxHelper.setFromObject( group );
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

