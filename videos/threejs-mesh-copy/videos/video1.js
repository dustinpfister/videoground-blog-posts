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

    var createBoxGroup = function(opt){
        opt = opt || {};
        opt.r1 = opt.r1 === undefined ? 4 : opt.r1;
        opt.r2 = opt.r2 === undefined ? 4 : opt.r2;

        // a group
        var group = new THREE.Group();
        var mainBox = createBox(1, 1, 1);
        group.add(mainBox);
        // Mesh cloned a bunch of times from original
        var i = 0, len = 10, mesh, rad, s, x, z, per;
        while (i < len) {
            per = i / len
            s = 0.25 + 0.25 * ( Math.random() * 5 );
            mesh = mainBox.clone();
            // changes made to position and rotation to not effect original
            rad = Math.PI * 2 * per;
            x = Math.cos(rad) * opt.r1;
            z = Math.sin(rad) * opt.r2;

            mesh.position.set(x, 0, z);
            mesh.scale.set(1, 1 - 0.75 * per, 1);

            mesh.lookAt(mainBox.position);
            group.add(mesh);
            i += 1;
        }
        // changing the color of the main box ONLY EFFECTS THE MAIN BOX
        //mainBox.material.color.setRGB(0, 1, 0);
        return group;
    };

    var g1 = scene.userData.g1 = createBoxGroup({r1: 2});
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
                }
            },
            // sq1 - move camera and rotate g1 along y
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8, 1 + 3 * partPer, -5 * partPer);
                    camera.lookAt(0, 0, 0);
                    // g1
                    g1.rotation.set(0, Math.PI * 0.5 * partPer, 0);
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

