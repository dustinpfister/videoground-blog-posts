// video1 for threejs-cone
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences-hooks-r1.js'
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
            ['Cone Geometry', 64, 17, 14, 'white'],
            ['in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r135 05/17/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    // light
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(1, 3, 2);
    scene.add(dl);

    // cone1 - basic example
    var cone1 = new THREE.Mesh(new THREE.ConeGeometry(1, 3), new THREE.MeshStandardMaterial({
            color: 0x00ff00
        }));
    cone1.position.y = 1.5;
    scene.add(cone1);

    // cone2 - segment settings
    var cone2 = new THREE.Mesh(new THREE.ConeGeometry(0.5, 2, 60, 20), new THREE.MeshStandardMaterial({
            color: 0x00ff00
        }));
    cone2.position.set(3, 1, 3);
    scene.add(cone2);

    // cone3 - half cone
    var cone3 = new THREE.Mesh(new THREE.ConeGeometry(1.0, 4, 60, 20, false, Math.PI, Math.PI * 1.0), new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            side: THREE.DoubleSide
        }));
    cone3.position.set(-3, 2, 3);
    scene.add(cone3);

    // cone4 - rotation
    var cone4 = new THREE.Mesh(
        new THREE.ConeGeometry(1.0, 4, 60, 60), 
        new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            side: THREE.DoubleSide
        }));
    cone4.geometry.rotateX(Math.PI * 0.5)
    cone4.position.set(-5, 0.5, -5);
    scene.add(cone4);

    // cube1 - object that cone4 looks at
    var cube1 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1), 
        new THREE.MeshNormalMaterial());
    scene.add(cube1);


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


    var seq_cube1 = seqHooks.create({
        setPerValues: false,
        fps: 30,
        afterObjects: function(seq){
            cone4.lookAt(cube1.position); 
        },
        objects: [
            {
                per: 0,
                update: function(seq, partPer, partBias){
                    // cube1
                    var r = Math.PI * 6 * partPer,
                    x = -5 + Math.cos(r) * 4,
                    z = -5 + Math.sin(r) * 4;
                    cube1.position.set(x, 0, z);       
                }
            },
            {
                per: 0.5,
                update: function(seq, partPer, partBias){
                    // cube1
                    var r = Math.PI * 12 * partPer,
                    x = -5 + Math.cos(r) * 4,
                    y = Math.sin(r) * 5 * partBias,
                    z = -5 + Math.sin(r) * 4;
                    cube1.position.set(x, y, z);                      
                }
            }
        ]
    });

    // A MAIN SEQ OBJECT
    var seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){
            textCube.visible = false;
            camera.position.set(8, 1, 0);
            // cube1 seq            
            seqHooks.setFrame(seq_cube1, seq.frame, seq.frameMax);
        },
        afterObjects: function(seq){
        },
        objects: [
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // textcube
                    if(seq.partFrame < seq.partFrameMax){
                        seqHooks.setFrame(seq_textcube, seq.partFrame, seq.partFrameMax);
                    }
                    // camera
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 7,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8, 1 + 7 * partPer, 8 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8, 8, 8);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8 - 16 * partPer, 8, 8);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(-8 - 8 * partPer, 8, 8 - 24 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(-16 + 6 * partPer, 8, -16 + 6 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            }
        ]
    });

    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;

};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    var seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);

};

