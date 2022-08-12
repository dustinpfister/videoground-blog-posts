// video1 for threejs-cylinder-geometry
 
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
    scene.background = new THREE.Color('#2a2a2a');

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
            ['Cylinder Geometry', 64, 17, 14, 'white'],
            ['in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r140 08/12/2022 )', 64, 70, 12, 'gray'],
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
    // GRID OPTIONS
    //******** **********
    var tw = 5,
    th = 5,
    space = 4.0;
    var array_source_objects = [
        // 0 - solid cylinder
        new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.5, 4, 30, 30, false, 0, Math.PI * 2),
            new THREE.MeshStandardMaterial({color: 0xff0000, map: texture_rnd1})
        ),
        // 1 - no caps and half
        new THREE.Mesh(
            new THREE.CylinderGeometry(1.0, 1.0, 2, 30, 30, true, Math.PI, Math.PI),
            new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, color: 0x00ff00, map: texture_rnd1})
        ),
        // 2 - cone shape
        new THREE.Mesh(
            new THREE.CylinderGeometry(0, 0.5, 5, 30, 30, false, 0, Math.PI * 2),
            new THREE.MeshStandardMaterial({ color: 0x00ffff, map: texture_rnd1})
        ),
        // 3 -cone like shape
        new THREE.Mesh(
            new THREE.CylinderGeometry(0.75, 1.5, 3, 30, 30, false, 0, Math.PI * 2),
            new THREE.MeshStandardMaterial({ color: 0xff00ff, map: texture_rnd1})
        ),
        // 4 - 3 sides
        new THREE.Mesh(
            new THREE.CylinderGeometry(0, 1.0, 4, 3, 3, false, 0, Math.PI * 2),
            new THREE.MeshStandardMaterial({ color: 0xffff00, map: texture_rnd1})
        )
    ];
    var array_oi = [
        0,1,2,3,4,
        0,1,2,3,4,
        0,1,2,3,4,
        0,1,2,3,4,
        0,1,2,3,4
    ];

    //******** **********
    // CUSTOM CYLINDER GIRD EFFECT
    //******** **********
     ObjectGridWrap.load( {
        EFFECTS : {
            cylinder : function(grid, obj, objData, ud){
                
                obj.rotation.x = Math.PI * 0.5 - Math.PI * objData.b;
                obj.rotation.y = Math.PI * 2 * objData.b;


var s = 0.5 + 1 * objData.b;
obj.scale.set(s, s, s);

            }
        }
    } );

    //******** **********
    // CREATE GRID
    //******** **********
    var grid = ObjectGridWrap.create({
        space: space,
        tw: tw,
        th: th,
        dAdjust: 1.25,
        effects: ['opacity2', 'cylinder'],
        sourceObjects: array_source_objects,
        objectIndices: array_oi
    });
    // minB value can be used to adjust min distance for opacity drop off
    // when it comes to using the opacity2 effect
    grid.userData.minB = 0.35;
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

            ObjectGridWrap.setPos(grid, (1 - seq.per) * 2, Math.cos(Math.PI * seq.bias) * 0.25 );
            ObjectGridWrap.update(grid);

            textCube.visible = false;
            camera.position.set(10, 1, 0);
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
                    var v1 = new THREE.Vector3(10, 1, 0);
                    var v2 = new THREE.Vector3(12, 12, 12);
                    //camera.position.set(8, 1 + 7 * partPer, 8 * partPer);
                    camera.position.copy(v1).lerp(v2, partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 20,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(12, 12, 12);
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

