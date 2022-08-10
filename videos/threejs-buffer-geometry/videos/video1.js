// video1 for threejs-buffer-geometry
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/datatex/r0/datatex.js'
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
            ['Buffer Geometry', 64, 17, 14, 'white'],
            ['in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r140 08/09/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    //******** **********
    // THREE MESH OBJECTS WITH CUSTOM GEOMETRY ( mesh1, mesh2, and mesh3 )
    //******** **********

    // mesh1 - position only with basic material
    var geometry1 = new THREE.BufferGeometry();
    var vertices = new Float32Array([
                -1, 0, 0,
                1, 0, 0,
                1, 1.25, 0
            ]);
    geometry1.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    var mesh1 = new THREE.Mesh(
            geometry1,
            new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide
            }));
    mesh1.rotateY(Math.PI * 0.25);
    mesh1.position.x  = -1.00;
    scene.add(mesh1);

    // mesh2 - position and normal attributes with normal material
    var geometry2 = new THREE.BufferGeometry();
    var vertices = new Float32Array([
                0,0,0,
                1,0,0,
                1,1,0
            ]);
    // create position property
    geometry2.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    // compute vertex normals
    geometry2.computeVertexNormals();
    var mesh2 = new THREE.Mesh(
            geometry2,
            new THREE.MeshNormalMaterial({
                side: THREE.FrontSide
            }));
    mesh2.rotateY(Math.PI * 0.25);
    mesh2.position.x  = 0.0;
    scene.add(mesh2);

    // mesh3 - position, normal, and uv attributes using basic material with data texture for map
    var geometry3 = new THREE.BufferGeometry();
    var vertices = new Float32Array([
                0, 0, 0,
                1, 0, 0,
                1, 1, 0
            ]);
    // create position property
    geometry3.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    // compute vertex normals
    geometry3.computeVertexNormals();
    // creating a uv
    var uvs = new Float32Array([
                0, 1, 1, 0.5
            ]);
    geometry3.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    var texture = datatex.seededRandom(5, 5, 1, 1, 1, [128, 250]);
    var mesh3 = new THREE.Mesh(
            geometry3,
            new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.FrontSide
            }));
    mesh3.rotateY(Math.PI * 0.25);
    mesh3.position.x = 1;
    scene.add(mesh3);

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

    // A MAIN SEQ OBJECT
    var seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){
            textCube.visible = false;
            camera.position.set(8, 1, 0);
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
                    camera.position.set(8 - 6 * partPer, 1 + 1 * partPer, 2 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 20,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(2, 2, 2);
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

