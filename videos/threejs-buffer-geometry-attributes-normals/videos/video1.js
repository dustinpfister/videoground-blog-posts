// video1 for threejs-buffer-geometry-attributes-normals
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences-hooks-r1.js',
   '../../../js/r135-files/VertexNormalsHelper.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');

    // GRID
    var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#8a8a8a', '#008a8a');
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
            ['Buffer geometry', 64, 17, 14, 'white'],
            ['normals attribute', 64, 32, 14, 'white'],
            ['in threejs', 64, 47, 14, 'white'],
            ['( r135 05/19/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    // CUBE AND HELPERS
    var cube = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshNormalMaterial()
    );
    scene.add(cube);

    // CUBE VERTEX NORMALS HELPER
    var cube_helper = new THREE.VertexNormalsHelper( cube, 2, 0x00ff00, 1 );
    cube_helper.material.linewidth = 6;
    scene.add(cube_helper);

    console.log(cube.geometry)


    var posArray = [
        { vHome: new THREE.Vector3(1, 0, 0), vNew: new THREE.Vector3(-1, 2, 1), normalIndex: 0},
        { vHome: new THREE.Vector3(1, 0, 0), vNew: new THREE.Vector3(-1, 2, -1), normalIndex: 1},
        { vHome: new THREE.Vector3(1, 0, 0), vNew: new THREE.Vector3(-1, -2, 1), normalIndex: 2},
        { vHome: new THREE.Vector3(1, 0, 0), vNew: new THREE.Vector3(-1, -2, -1), normalIndex: 3}
    ];


    // normal mutaion helper
    var setNormal = function (mesh, normalIndex, v) {
        var geometry = mesh.geometry;
        var normal = geometry.getAttribute('normal');
        normal.array[normalIndex * 3] = v.x;
        normal.array[normalIndex* 3 + 1] = v.y;
        normal.array[normalIndex * 3 + 2] = v.z;
        normal.needsUpdate = true;
    };

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
            // defaults for normals
            posArray.forEach(function(posObj){
               setNormal(cube, posObj.normalIndex, posObj.vHome );
            });
            cube_helper.update();
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
                secs: 2,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8 - 3 * partPer, 1 + 4 * partPer, 4 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 25,
                update: function(seq, partPer, partBias){
                    // lerping points
                    posArray.forEach(function(posObj){
                        var v1 = posObj.vHome.clone().lerp( posObj.vNew, partPer);
                        setNormal(cube, posObj.normalIndex, v1);
                    });
                    cube_helper.update();                
                    // camera
                    camera.position.set(5 - 2 * partPer, 5 - 2 * partPer, 4 - 8 * partPer);
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

