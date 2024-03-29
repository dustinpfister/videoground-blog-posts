// video1 for threejs-materials
 
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/datatex/r0/datatex.js',
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // TEXTURES
    //-------- ----------
    const texture_rnd = datatex.seededRandom(16, 16, 1, 1, 1, [64, 255]);
    //-------- ----------
    // LIGHT
    //-------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(1, 3, 2);
    scene.add(dl);
    //-------- ----------
    // camera
    //-------- ----------
    camera.near = 1;
    camera.far = 20;
    camera.updateProjectionMatrix();
    //-------- ----------
    // MESH
    //-------- ----------
    let mi = 0;
    const materials = [
        new THREE.MeshBasicMaterial({ map: texture_rnd, color: 0xff0000 }),
        new THREE.MeshDepthMaterial(),
        new THREE.MeshLambertMaterial({ map: texture_rnd, color: 0x00ff00 }),
        new THREE.MeshNormalMaterial(),
        new THREE.MeshPhongMaterial({ map: texture_rnd, shininess: 90, color: 0x0000ff }),
        new THREE.MeshStandardMaterial({ map: texture_rnd, color: 0xffff00 })
    ];
    const mesh = new THREE.Mesh( new THREE.SphereGeometry(4.5, 30, 30), materials[mi] );
    scene.add(mesh);
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#2a2a2a');
    //-------- ----------
    // GRID
    //-------- ----------
    var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    scene.add( grid );
    //-------- ----------
    // TEXT CUBE
    //-------- ----------
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Materials in', 64, 17, 14, 'white'],
            ['threejs', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 10/05/2022 )', 64, 70, 12, 'gray'],
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
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    var seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){
            mi = 0;
            camera.near = 1;
            camera.far = 20;
            textCube.visible = false;
            camera.position.set(8, 1, 0);
        },
        afterObjects: function(seq){
            mesh.material = materials[mi];
            mesh.rotation.y = Math.PI * 8 * seq.per;
            camera.updateProjectionMatrix();
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
                    camera.position.set(8, 1 + 7 * partPer, 8 * partPer);
                    camera.lookAt(0, 0, 0);
                    camera.near = 1 + 4 * partPer;
                }
            },
            {
                secs: 25,
                update: function(seq, partPer, partBias){
                    mi = Math.floor(materials.length * partPer);
                    // camera
                    camera.position.set(8, 8, 8);
                    camera.lookAt(0, 0, 0);
                    camera.near = 5;
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

