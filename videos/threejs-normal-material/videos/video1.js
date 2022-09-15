// video1 for threejs-normal-material
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/r140-files/VertexNormalsHelper.js',
   '../../../js/object-grid-wrap/r2/object-grid-wrap.js',
   '../../../js/object-grid-wrap/r2/effects/opacity2.js',
   './lerp-geo.js',
   './weird-face.js'
];


VIDEO.daePaths = [
    '../../../dae/weird-face-1/weird-face-1c.dae',
    '../../../dae/weird-face-1/mouths-1c.dae'
];

// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // HELPERS
    //-------- ----------
    const toNormalMaterial = (object, range) => {
        range = range || [-2, 2];
        object.traverse((obj) => {
            if(obj.type === 'Mesh'){
                // use normal material
                obj.material = new THREE.MeshNormalMaterial({
                   side: THREE.DoubleSide
                });
                // add vertex helper
                const helper = obj.userData.helper = new THREE.VertexNormalsHelper( obj, 0.05, 0x00ff00, 1 );
                scene.add(helper);
                // normals
                const normal = obj.geometry.getAttribute('normal');
                obj.userData.normalStart = normal.clone();
                obj.userData.toArray = normal.array.map((a)=>{
                    return range[0] + (range[1] - range[0]) * THREE.MathUtils.seededRandom();
                });
                
            }
        });
    };
    // update normals
    const updateNormals = (nose, alpha) => {
        nose.traverse((obj) => {
            if(obj.type === 'Mesh'){
                const ud = obj.userData;
                const normalStart = ud.normalStart;
                const normal = obj.geometry.getAttribute('normal');
                let i = 0, len = normal.array.length;
                while(i < len){
                    const v = new THREE.Vector3(normalStart.array[i], normalStart.array[i + 1], normalStart.array[i + 2]);
                    v.x = v.x + ud.toArray[i] * alpha;
                    v.y = v.y + ud.toArray[i + 1] * alpha;
                    v.z = v.z + ud.toArray[i + 2] * alpha;
                    v.normalize();
                    normal.array[i] = v.x;
                    normal.array[i + 1] = v.y;
                    normal.array[i + 2] = v.z;
                    i += 3;
                }
                normal.needsUpdate = true;
            }
        });
    };
    // update helpers
    const updateHelpers = (nose) => {
        nose.traverse((obj) => {
            if(obj.type === 'Mesh'){
                obj.userData.helper.update();
            }
        });
    };
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#000000');
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
            ['Normal Material', 64, 17, 14, 'white'],
            ['in threejs', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 09/15/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);
    //-------- ----------
    // GRID OPTIONS
    //-------- ----------
    var tw = 8,
    th = 8,
    space = 5.1;
    var array_source_objects = [
        new THREE.Mesh( new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial() )
    ];
    var array_oi = [
        0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0
    ]
    //-------- ----------
    // CREATE GRID
    //-------- ----------
    var grid = ObjectGridWrap.create({
        space: space,
        tw: tw,
        th: th,
        dAdjust: 1.25,
        effects: ['opacity2'],
        sourceObjects: array_source_objects,
        objectIndices: array_oi
    });
    scene.add(grid);
    grid.position.y = -1.5;


    //-------- ----------
    // WERID FACE SET UP
    //-------- ----------
    var rScene = VIDEO.daeResults[1].scene;
    toNormalMaterial(rScene, [-2, 2]);
    var nose = rScene.getObjectByName('nose');
    scene.add(nose);
    nose.scale.set(2.25, 2.25, 2.25);
    nose.position.set(0, 0.1, 0);
    // mouth objects
    rScene = VIDEO.daeResults[0].scene;
    var m0 = rScene.getObjectByName('mouth-0');
    var m1 = rScene.getObjectByName('mouth-1');
    //-------- ----------
    // SPHERE
    //-------- ----------
    const sphere = new THREE.Mesh( new THREE.SphereGeometry(30, 30, 30) );
    toNormalMaterial(sphere, [-2, 2]);
    scene.add(sphere)
    //-------- ----------
    // A SEQ FOR TEXT CUBE
    //-------- ----------
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

            ObjectGridWrap.setPos(grid, (1 - seq.per) * 2, 0 );
            ObjectGridWrap.update(grid);

            // UPDATING EYES
            var aBias = seq.getSinBias(4, false);
            var a = -0.1 + 0.2 * aBias;
            weirdFace.setEye(nose, 1, a, 0, 1);
            weirdFace.setEye(nose, 2, a, 0, 1);
            // updating mouth
            var mBias = seq.getSinBias(32, false);
            weirdFace.setMouth(nose, mBias, m0, m1);

            updateNormals(nose, seq.getSinBias(16, false));
            updateNormals(sphere, seq.getSinBias(4, false));
            updateHelpers(nose);

            textCube.visible = false;
            camera.position.set(8, 1, 0);
        },
        afterObjects: function(seq){
        },
        objects: [
            // s0 - 0 secs - text cube seq
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
            // s1 - 3 secs - move camera to look at werid face, eyes move to a = -10
            {
                secs: 4,
                update: function(seq, partPer, partBias){


                    // camera
                    camera.position.set(8 - 7 * partPer, 1 - 0.25 * partPer, 2 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            // s2 - 7 secs - look at face, eyes move back and forth
            {
                secs: 4,
                update: function(seq, partPer, partBias){


                    // camera
                    camera.position.set(1, 0.75, 2);
                    camera.lookAt(0, 0, 0);
                }
            },
            // s3 - 11 secs - camera moves, weird face says 'I have no anwsers'
            {
                secs: 4,
                update: function(seq, partPer, partBias){

                    // camera
                    camera.position.set(1 - 2 * partPer, 0.75, 2);
                    camera.lookAt(0, 0, 0);
                }
            },
            // s4 - 15 secs - pause
            {
                secs: 2,
                update: function(seq, partPer, partBias){

                    // camera
                    camera.position.set(-1, 0.75, 2);
                    camera.lookAt(0, 0, 0);
                }
            },
            // s5 - 17 secs - camera moves, weird face says 'I have only questions'
            {
                secs: 4,
                update: function(seq, partPer, partBias){

                    // camera
                    camera.position.set(-1 + 2 * partPer, 0.75, 2);
                    camera.lookAt(0, 0, 0);
                }
            },
            // s6 - 21 secs - eyes get bigger
            {
                secs: 6,
                update: function(seq, partPer, partBias){

                    // camera
                    camera.position.set(1, 0.75, 2);
                    camera.lookAt(0, 0, 0);
                }
            },
            // s7 - 27 secs - zoom out
            {
                secs: 3,
                update: function(seq, partPer, partBias){

                    // camera
                    camera.position.set(1 + 9 * partPer, 0.75 + 8.25 * partPer, 2 + 7 * partPer);
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

