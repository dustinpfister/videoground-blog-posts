// video1 for threejs-camera-perspective
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/datatex/r0/datatex.js'
];
// dae files
VIDEO.daePaths = [
  '../../../dae/land-set-one/land-set-1a.dae'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // DAE FILE
    var dscene = VIDEO.daeResults[0].scene;

    var sourceObj = {};
    var tree1 = sourceObj.tree1 = dscene.getObjectByName('tree-1');
    tree1.geometry.scale(1.5, 1.5, 1.5);
    tree1.geometry.translate(0, 0, 2.85);

    var tree2 = sourceObj.tree2 =  dscene.getObjectByName('tree-2');
    tree2.geometry.translate(0, 0, 2.3);


    var w = 10, h = 10;
    [
        2,1,2,2,1,1,1,1,1,2,
        2,0,0,0,2,2,1,1,1,1,
        0,1,0,0,0,2,2,1,0,0,
        0,0,2,1,2,0,0,0,0,0,
        0,0,2,2,0,0,0,0,0,0,
        0,1,0,0,0,0,0,1,0,0,
        0,0,0,2,1,1,2,0,2,0,
        1,0,2,0,0,0,0,1,0,0,
        2,2,1,0,0,2,0,0,1,2,
        2,1,2,2,0,0,0,0,1,1
    ].forEach(function(sourceIndex, i){
        var x = i % w,
        z = Math.floor(i / w);
        // sourceIndex of 1 or higher means create a mesh there
        if(sourceIndex > 0){
            var mesh = sourceObj['tree' + sourceIndex].clone();
            mesh.position.set(
               (w * -1) + x * (w * 2 / w), 
               0, 
               (h * -1) + z * (h * 2 / h));
            var s = 0.75 + 0.5 * THREE.MathUtils.seededRandom();
            mesh.scale.set(s, s, s);
            mesh.rotation.z = Math.PI * 2 * THREE.MathUtils.seededRandom();
            scene.add(mesh);
        }
    });

 
    // BACKGROUND
    scene.background = new THREE.Color('#00a2a2');

    // GRID
    //var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    //grid.material.linewidth = 3;
    //scene.add( grid );
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,75,100,0.8)',
        lineCount: 9,
        lines: [
            ['Perspective Camera', 64, 17, 13, 'white'],
            ['in', 64, 32, 12, 'white'],
            ['threejs', 64, 47, 12, 'white'],
            ['( r140 08/17/2022 )', 64, 70, 11, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    // LIGHT
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(2, 1, 3);
    scene.add(dl);
    var al = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(al);

    // TEXTURES
    var tex1 = datatex.seededRandom(128, 128, 0, 1, 0.75, [120, 255]);

    // MESH
    var plane = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20, 1, 1), 
        new THREE.MeshStandardMaterial({ map: tex1, color: 0xffffff }));
    plane.geometry.rotateX(Math.PI * 1.5)
    scene.add(plane);

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
                    camera.position.set(8 + 4 * partPer, 1 + 9 * partPer, 8 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 20,
                update: function(seq, partPer, partBias){
                    // camera
                    var b = seq.getSinBias(2);
                    camera.position.set(12 - 24 * b, 10, 8);
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

