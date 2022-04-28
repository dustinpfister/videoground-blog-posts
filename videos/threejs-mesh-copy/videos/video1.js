// video1 for threejs-mesh-copy
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js'
];
 
// init method for the video
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');

    // GRID
    scene.add( new THREE.GridHelper(10, 10, '#ffffff', '#00afaf') );
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Mesh Copy', 64, 20, 15, 'white'],
            ['Method', 64, 35, 15, 'white'],
            ['in Three.js.', 64, 50, 15, 'white'],
            ['( r135 04/27/2022 )', 64, 80, 12, 'gray'],
            ['video1', 64, 115, 10, 'gray']
        ]
    });
    scene.add(textCube);

    // LIGHT
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(3, 2, 1);
    scene.add(dl);

    // HELPERS
 
    // create box helper
    var createBox = function(w, h, d){
        var box = new THREE.Mesh(
            new THREE.BoxGeometry(w, h, d),
            new THREE.MeshStandardMaterial({
                color: 'red'
            }));
        return box;
    };

    var circleGroup = function(boxGroup, opt){
        opt = opt || {};
        opt.r1 = opt.r1 === undefined ? 4 : opt.r1;
        opt.r2 = opt.r2 === undefined ? 4 : opt.r2;
        var len = boxGroup.children.length;
        boxGroup.children.forEach(function(mesh, i){
            var per = i / len,
            rad = Math.PI * 2 * per,
            x = Math.cos(rad) * opt.r1,
            z = Math.sin(rad) * opt.r2;
            mesh.position.set(x, 0, z);
            mesh.scale.set(1, 1 - 0.75 * per, 1);
        });

    };

    // create a new box group
    var createBoxGroup = function(opt){
        opt = opt || {};
        var mainBox = createBox(1, 1, 1);
        // Mesh cloned a bunch of times from original
        var i = 0, len = 10, mesh;
        while (i < len) {
            mesh = mainBox.clone();
            mainBox.add(mesh);
            i += 1;
        }
        circleGroup(mainBox)
        return mainBox
    };

    var g1 = scene.userData.g1 = createBoxGroup();
    scene.add(g1);

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

                    // g1
                    g1.rotation.set(0, 0, 0);
                    circleGroup(g1, {r1: 4, r2: 4});
                }
            },
            {
                per: 0.10,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8 + 2.2 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    // camera
                    camera.position.set(8, 1, 0);
                    camera.lookAt(0, 0, 0);
                    // g1
                    g1.rotation.set(0, 0, 0);
                    circleGroup(g1, {r1: 4, r2: 4});
                }
            },
            // sq1 - move camera, rotate g1 along y, change r1 and r2
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8, 1 + 3 * partPer, -5 * partPer);
                    camera.lookAt(0, 0, 0);
                    // g1
                    g1.rotation.set(0, Math.PI * 0.5 * partPer, 0);
                    circleGroup(g1, {r1: 4 - 2 * partPer, r2: 4 + 2 * partPer});
                }
            },
            // sq2 - rotate g1 on x and y
            {
                per: 0.30,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8, 4, -5);
                    camera.lookAt(0, 0, 0);
                     // g1
                    g1.rotation.set(
                        Math.PI * 2 * partPer, 
                        Math.PI * 0.5  + Math.PI * 1.5 * partPer, 
                        0
                    );
                    circleGroup(g1, {r1: 2, r2: 6 - 3 * partPer});
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

    var g1 = scene.userData.g1;
    g1.rotation.set(0, 0, 0);

    // sequences
    Sequences.update(sm.seq, sm);
};

