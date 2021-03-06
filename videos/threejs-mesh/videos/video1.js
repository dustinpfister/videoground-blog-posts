// video1 for threejs mesh
 
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
            ['Mesh Objects', 64, 17, 14, 'white'],
            ['in', 64, 32, 14, 'white'],
            ['Three.js', 64, 47, 14, 'white'],
            ['( r135 05/02/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    // single cube
    var cube = scene.userData.cube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshNormalMaterial({})
    );
    scene.add(cube);

    var group = scene.userData.group = new THREE.Group;
    group.visible = false;
    scene.add(group);

    var i = 0, len = 10;
    var m = new THREE.MeshNormalMaterial({ transparent: true, opacity: 1})
    while(i < len){
        var copy = cube.clone();
        copy.material = m;
        var per = i / len,
        radian = Math.PI * 2 * per;
        copy.position.set(
            Math.cos(radian) * 4,
            0,
            Math.sin(radian) * 4
        );
        copy.lookAt(cube.position);
        group.add(copy);
        i += 1;
    }

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
            // sq1 - cube moves around
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8, 1 + 5 * partPer, 0);
                    camera.lookAt(0, 0, 0);
                    // cube
                    var radian = Math.PI * 4 * partPer;
                    var x = Math.cos(radian) * (3 * partBias);
                    var z = Math.sin(radian) * (3 * partBias);
                    cube.position.set(x, 0, z);
                }
            },
            // sq2 - cube rotates
            {
                per: 0.25,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8, 6, 0);
                    camera.lookAt(0, 0, 0);
                    // cube
                    cube.rotation.set(Math.PI * 2 * partPer, Math.PI * 4 * partPer, 0);
                }
            },
            // sq3 - scale cube
            {
                per: 0.35,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8, 6, 0);
                    camera.lookAt(0, 0, 0);
                    // cube
                    var s = 1 + 4 * partBias;
                    cube.scale.set(s, s, s);
                }
            },
            // sq4 - group becomes visible
            {
                per: 0.45,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8, 6, 0);
                    camera.lookAt(0, 0, 0);
                    // cube

                    // group
                    group.visible = true;
                    var len = group.children.length;
                    group.children.forEach(function(copy, i){
                        copy.material.opacity = partPer;
                    });
                }
            },
            // sq5 - group rotates
            {
                per: 0.55,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8, 6, 0);
                    camera.lookAt(0, 0, 0);
                    // cube
                    cube.position.y = 4 * partPer;
                    // group
                    group.visible = true;
                    group.rotation.y = Math.PI * 4 * partPer;
                    //group.rotation.x = Math.PI * 2 * partPer;
                    var len = group.children.length;
                    group.children.forEach(function(copy, i){
                        copy.material.opacity = 1;
                        copy.lookAt(cube.position);
                    });
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

    var cube = scene.userData.cube;
    cube.position.set(0, 0, 0);
    cube.rotation.set(0, 0, 0);
    cube.scale.set(1, 1, 1);

    var group = scene.userData.group;
    group.rotation.set(0, 0, 0);
    group.visible = false;
    group.children.forEach(function(copy, i){
        copy.material.opacity = 0.0;
        copy.rotation.set(0, 0, 0);
    });

    // sequences
    Sequences.update(sm.seq, sm);
};

