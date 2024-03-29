// video1 for threejs-camera
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/datatex/r0/datatex.js',
   '../../../js/object-grid-wrap/r2/object-grid-wrap.js',
   '../../../js/object-grid-wrap/r2/effects/opacity2.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#000000');


    // cams to work with
    sm.cams = [
        new THREE.PerspectiveCamera(40, 854 / 480, 0.1, 1000),
        new THREE.OrthographicCamera( -5, 5, 2, -2, 1, 1000 )
    ];

    // GRID
    //var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    //grid.material.linewidth = 3;
    //scene.add( grid );

    //******** **********
    // TEXT CUBE
    //******** **********
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Cameras', 64, 17, 14, 'white'],
            ['in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r140 08/15/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    //******** **********
    // LIGHT
    //******** **********
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(2, 1, 3);
    scene.add(dl);

    //******** **********
    // TEXTURES
    //******** **********
    var texture_rnd1 = datatex.seededRandom(40, 40, 1, 1, 1, [0, 255]);

    //******** **********
    // Group
    //******** **********
    var group = new THREE.Group();
    var m1 = new THREE.Mesh(
        new THREE.SphereGeometry(1, 30, 30),
        new THREE.MeshStandardMaterial({color: 0xff00ff, map: texture_rnd1}) );
    m1.position.set(0, 0, 0);
    group.add(m1);

    var m2 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({color: 0xff0000, map: texture_rnd1}) );
    m2.position.set(0, 0, 1.5);
    group.add(m2);

    var m3 = new THREE.Mesh(
        new THREE.ConeGeometry(0.75, 4, 30, 30),
        new THREE.MeshStandardMaterial({color: 0x00ff00, map: texture_rnd1}) );
    m3.rotation.x = Math.PI * 1.5;
    m3.position.set(0, 0, -2.0);
    group.add(m3);

    var m4 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.50, 0.50, 3, 30, 30),
        new THREE.MeshStandardMaterial({color: 0x00ffff, map: texture_rnd1}) );
    //m4.rotation.x = Math.PI * 1.5;
    m4.position.set(0, 1.5, 0);
    group.add(m4);

    group.scale.set(1.5, 1.5, 1.5);
    scene.add(group);

    //******** **********
    // GRID OPTIONS
    //******** **********
    var tw = 10,
    th = 10,
    space = 2.0;
    var array_source_objects = [
        new THREE.Mesh( new THREE.SphereGeometry(0.75, 30, 30), new THREE.MeshStandardMaterial({map: texture_rnd1}) )
    ];

    var array_oi = [
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0
    ]
    //******** **********
    // CREATE GRID
    //******** **********
    var grid = ObjectGridWrap.create({
        space: space,
        tw: tw,
        th: th,
        //aOpacity: 1.25,
        dAdjust: 1.25,
        effects: ['opacity2', 'scale', 'rotationB'],
        sourceObjects: array_source_objects,
        objectIndices: array_oi
    });
    // minB value can be used to adjust min distance for opacity drop off
    // when it comes to using the opacity2 effect
    grid.userData.minB = 0.25;
    grid.position.y = -2;
    scene.add(grid);


    // A SEQ FOR TEXT CUBE
    var seq_textcube = seqHooks.create({
        setPerValues: false,
        fps: 30,
        beforeObjects: function(seq){
            var textCube = scene.userData.textCube;
            textCube.rotation.y = 0;
            textCube.position.set(8, 0.8, 0);
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
                    textCube.position.set(8, 0.8, 0);
                    textCube.material.opacity = 1.0;
                }
            },
            {
                per: 0.75,
                update: function(seq, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(8, 0.8 + 1 * partPer, 0);
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

            // cam 0 as default
            sm.camera = sm.cams[ 0 ];


            // defaults for cam0
            sm.cams[0].fov = 40;
            sm.cams[0].aspect = 854 / 480;

            // defaults for cam1
            sm.cams[1].left = -5;
            sm.cams[1].right = 5;
            sm.cams[1].top = 5;
            sm.cams[1].bottom = -5;

            // rotation of group
            group.rotation.x = Math.PI / 180 * -15 + Math.PI / 180 * 30 * seq.per;
            group.rotation.y = Math.PI * 4 * seq.per;

            ObjectGridWrap.setPos(grid, (1 - seq.per) * 2, Math.cos(Math.PI * seq.bias) * 0.25 );
            ObjectGridWrap.update(grid);

            textCube.visible = false;
            sm.camera.position.set(10, 1, 0);
        },
        afterObjects: function(seq){
            // always call update projection matrix for bolth cameras so that value changes 
            // made in beforeObjects hook as well as current seq take effect
            sm.cams[0].updateProjectionMatrix();
            sm.cams[1].updateProjectionMatrix();
        },
        objects: [
            // seq0 - text cube
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // textcube
                    if(seq.partFrame < seq.partFrameMax){
                        seqHooks.setFrame(seq_textcube, seq.partFrame, seq.partFrameMax);
                    }
                    // camera
                    sm.camera.lookAt(0, 0, 0);
                }
            },
            // seq1 - fast move to corner
            {
                secs: 1,
                update: function(seq, partPer, partBias){
                    // camera
                    var v1 = new THREE.Vector3(10, 1, 0);
                    var v2 = new THREE.Vector3(9, 9, 9);
                    sm.camera.position.copy(v1).lerp(v2, partPer);
                    sm.camera.lookAt(0, 0, 0);
                }
            },
            // seq2 - pan from corner to corner, switching between cam0 and cam1
            {
                secs: 6,
                update: function(seq, partPer, partBias){

                    var per = seq.partFrame / ( seq.partFrameMax + 3 );

                    var b = per * 4 % 1;

                    sm.camera = sm.cams[ Math.floor(sm.cams.length * b) ];

                    // camera
                    sm.camera.position.set(9 - 18 * partPer, 9, 9);
                    sm.camera.lookAt(0, 0, 0);
                }
            },
            // seq3 - cam0 muation of values
            {
                secs: 10,
                update: function(seq, partPer, partBias){

            var b1 = partPer;
            var b2 = partPer;

            sm.camera = sm.cams[ 0 ];

            sm.cams[0].fov = 20 + 40 * b1;
            sm.cams[0].aspect = 854 / (240 + 240 * b2);

                    // camera
                    sm.camera.position.set(-9, 9, 9);
                    sm.camera.lookAt(0, 0, 0);
                }
            },
            // seq4 - cam1 muation of values
            {
                secs: 10,
                update: function(seq, partPer, partBias){

            sm.camera = sm.cams[ 1 ];

            sm.cams[1].left = -5;
            sm.cams[1].right = 5;

            var s = 1 + 8 * partPer; 
            sm.cams[1].top = s
            sm.cams[1].bottom = s * -1;

                    // camera
                    sm.camera.position.set(-9, 9, 9);
                    sm.camera.lookAt(0, 0, 0);
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

