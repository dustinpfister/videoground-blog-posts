// video1 for threejs-examples-sequence-hooks
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences-hooks-r0.js'
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
            ['Video Sequence', 64, 17, 14, 'white'],
            ['hooks module', 64, 32, 14, 'white'],
            ['threejs example', 64, 47, 14, 'white'],
            ['( r135 05/12/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    // A SEQ FOR TEXT CUBE
    var seq_textcube = seqHooks.create({
        setPerValues: false,
        fps: 30,
        beforeObjects: function(seq){
            var textCube = scene.userData.textCube;
            textCube.rotation.y = 0;
            textCube.position.set(6, 0.8, 0);
            textCube.visible = false;
            textCube.material.transparent = true;
            textCube.material.opacity = 0.0;
        },
        objects: [
            {
                per: 0,
                update: function(seq, partPer, partBias){
                    // text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8, 0);
                    textCube.material.opacity = 1.0;
                }
            },
            {
                per: 0.75,
                update: function(seq, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8 + 1 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    textCube.material.opacity = 1.0 - partPer;
                }
            }
        ]
    });

    // MESH Objects
    var mesh1 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshNormalMaterial());
    scene.add(mesh1);
    var mesh2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 30, 30),
        new THREE.MeshNormalMaterial());
    scene.add(mesh2);
    // seq object for mesh1 that scales the mesh
    var seq_mesh1_scale = seqHooks.create({
        setPerValues: false,
        beforeObjects: function(seq){
            mesh1.scale.set(1, 1, 1);
        },
        objects: [
            {
                per: 0,
                update: function(seq, partPer, partBias){
                    var s = 1 + 2 * partPer;
                    mesh1.scale.set(s, s, s);
                }
            },
            {
                per: 0.15,
                update: function(seq, partPer, partBias){
                    mesh1.scale.set(3, 3, 3);                    
                }
            },
            {
                per: 0.25,
                update: function(seq, partPer, partBias){
                    var s = 3 - 2 * partPer;
                    mesh1.scale.set(s, s, s);                    
                }
            }
        ]
    });
    // seq object for mesh1 that rotates the mesh
    var seq_mesh1_rotate = seqHooks.create({
        setPerValues: false,
        beforeObjects: function(seq){
            mesh1.scale.set(1, 1, 1);
            mesh1.rotation.set(0, 0, 0);
            mesh1.rotation.y = Math.PI * 4 * seq.per;
        },
        objects: [
            {
                per: 0,
                update: function(seq, partPer, partBias){
                    mesh1.rotation.x = Math.PI * 1.5;
                }
            },
            {
                per: 0.5,
                update: function(seq, partPer, partBias){
                    mesh1.rotation.x = Math.PI;
                }
            }
        ]
    });

    // A MAIN SEQ OBJECT
    var seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){
            textCube.visible = false;

            var r = Math.PI * 2 * seq.per;
            var x = Math.cos(r) * 4;
            var z = Math.sin(r) * 4;
            mesh2.position.set(x, 0, z);

            camera.position.set(8, 1, 0);

        },
        afterObjects: function(seq){
        },
        objects: [
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // textcube
                    seqHooks.setFrame(seq_textcube, seq.partFrame, seq.partFrameMax);
                    // camera
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 7,
                update: function(seq, partPer, partBias){
                    // seq_mesh1
                    seqHooks.setFrame(seq_mesh1_scale, seq.partFrame, seq.partFrameMax);
                    // camera
                    camera.position.set(8, 1 + 7 * partPer, 8 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 7,
                update: function(seq, partPer, partBias){
                    // seq_mesh1
                    seqHooks.setFrame(seq_mesh1_rotate, seq.partFrame, seq.partFrameMax);
                    // camera
                    camera.position.set(8, 8, 8);
                    camera.lookAt(0, 0, 0);
                }
            }

                    
        ]
    });


};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    var seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);

};

