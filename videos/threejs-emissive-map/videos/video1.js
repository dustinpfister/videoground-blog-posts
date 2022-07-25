// video1 for threejs-emissive-map
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences-hooks-r1.js',
   '../../../js/datatex.js',
   '../../../js/object-grid-wrap-r2-with-opacity2.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');

    // GRID
    var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    scene.add( grid );

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
            ['Emissive maps', 64, 17, 14, 'white'],
            ['in threejs', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 07/25/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    //******** **********
    // LIGHT
    //******** **********
    var dl = new THREE.DirectionalLight(0xffffff, 0);
    dl.position.set(2, 1, 3);
    scene.add(dl);
    var al = new THREE.AmbientLight(0xffffff, 0);
    scene.add(al);

    //******** **********
    // TEXTURES
    //******** **********
    var texture_rnd1 = datatex.seededRandom(40, 40, 1, 1, 1, [0, 255]);
    // emmisve map textures
    var data_square = [
        3,3,2,1,1,2,3,3,
        3,2,1,1,1,1,2,3,
        2,1,0,0,0,0,1,2,
        1,1,0,0,0,0,1,1,
        1,1,0,0,0,0,1,1,
        2,1,0,0,0,0,1,2,
        3,2,1,1,1,1,2,3,
        3,3,2,1,1,2,3,3
    ];
    // square
    var texture_square = datatex.fromPXDATA(data_square, 8, [
        [0,0,0,255],
        [32,32,32,255],
        [64,64,64,255],
        [128,128,128,255],
    ]);
    var texture_square_cyan = datatex.fromPXDATA(data_square, 8, [
        [0,0,0,255],
        [0,32,32,255],
        [0,64,64,255],
        [0,128,128,255],
    ]);
    var texture_square_red = datatex.fromPXDATA(data_square, 8, [
        [0,0,0,255],
        [32,0,0,255],
        [64,0,0,255],
        [128,0,0,255],
    ]);
    var texture_square_green = datatex.fromPXDATA(data_square, 8, [
        [0,0,0,255],
        [0,32,0,255],
        [0,64,0,255],
        [0,128,0,255],
    ]);
    var texture_square_blue = datatex.fromPXDATA(data_square, 8, [
        [0,0,0,255],
        [0,0,32,255],
        [0,0,64,255],
        [0,0,128,255],
    ]);

    //******** **********
    // GRID OPTIONS
    //******** **********
    var tw = 9,
    th = 9,
    space = 2;
    // source objects
    var mkBox = function(color, h, emmisive_texture){
        emmisive_texture = emmisive_texture || texture_square;
        var box = new THREE.Group();
        var a = space * 0.75;
        var mesh = new THREE.Mesh(
            new THREE.BoxGeometry( a, h, a),
            new THREE.MeshStandardMaterial({ 
                color: color,
                map: texture_rnd1,
                emissive: new THREE.Color('white'),
                emissiveMap: emmisive_texture,
                emissiveIntensity: 1}) );
        mesh.position.y = h / 2;
        //mesh.rotation.y = Math.PI / 180 * 20 * -1;
        var ground = new THREE.Mesh(
            new THREE.BoxGeometry( space, 0.1, space),
            new THREE.MeshStandardMaterial({ color: 0xffffff, map: texture_rnd1}) );
        ground.position.y = 0.05 * -1;
        box.add(mesh)  
        box.add(ground);
        return box;
    };
    var array_source_objects = [
        mkBox(0x00ffff, 0.25, texture_square_cyan),
        mkBox(0xff0000, 4.75, texture_square_red),
        mkBox(0x00ff00, 3.50, texture_square_green),
        mkBox(0x0000ff, 1.25, texture_square_blue)
    ];

    var array_oi = [
        0,0,0,0,0,3,3,0,0,
        0,0,0,0,3,2,3,0,0,
        0,0,0,3,2,3,3,0,0,
        0,0,3,2,2,2,3,0,0,
        0,3,2,2,1,2,3,0,0,
        3,2,3,2,2,2,2,3,0,
        0,3,0,3,3,3,2,3,0,
        0,0,0,0,0,0,3,3,0,
        0,0,0,0,0,0,0,0,0
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
    scene.add(grid);

    var setGridemissiveIntensity = function(emissiveIntensity){
        emissiveIntensity = emissiveIntensity || 0;
        grid.children.forEach(function(g){
             g.children.forEach(function(child){
                 child.material.emissiveIntensity = emissiveIntensity;
             })
        });
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

            // defualt light intensity for al and dl is 0
            dl.intensity = 0;
            al.intensity = 0;

            setGridemissiveIntensity(1);

            ObjectGridWrap.setPos(grid, (1 - seq.per) * 2, Math.cos(Math.PI * seq.bias) * 0.25 );
            ObjectGridWrap.update(grid);

            textCube.visible = false;
            camera.position.set(8, 1, 0);
        },
        afterObjects: function(seq){
        },
        objects: [
            // sq 0 - text cube
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // start out with light intensity high for directional and ambient light
                    dl.intensity = 1;
                    al.intensity = 0.25;
                    // textcube
                    if(seq.partFrame < seq.partFrameMax){
                        seqHooks.setFrame(seq_textcube, seq.partFrame, seq.partFrameMax);
                    }
                    // camera
                    camera.lookAt(0, 0, 0);
                }
            },
            // sq 1 - fast move to corver
            {
                secs: 2,
                update: function(seq, partPer, partBias){
                    dl.intensity = 1;
                    al.intensity = 0.25;
                    // camera
                    var v1 = new THREE.Vector3(8, 1, 0);
                    var v2 = new THREE.Vector3(12, 12, 12);
                    //camera.position.set(8, 1 + 7 * partPer, 8 * partPer);
                    camera.position.copy(v1).lerp(v2, partPer);
                    camera.lookAt(0, -2 * partPer, 0);
                }
            },
            // s1 2 - lights out
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    dl.intensity = 1 - partPer;
                    al.intensity = 0.25 -  0.25 * partPer;
                    // camera
                    camera.position.set(12, 12, 12);
                    camera.lookAt(0, -2, 0);
                }
            },
            // sq 3 - hold at corner
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(12, 12, 12);
                    camera.lookAt(0, -2, 0);
                }
            },
            // sq 4 - move camera lower intensity
            {
                secs: 10,
                update: function(seq, partPer, partBias){

                    setGridemissiveIntensity(1 - partPer);

                    // camera
                    camera.position.set(12 - 24 * partPer, 12, 12);
                    camera.lookAt(0, -2, 0);
                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    dl.intensity = 0.35 * partPer;
                    al.intensity = 0.10 * partPer;
                    setGridemissiveIntensity(0);
                    // camera
                    camera.position.set(-12, 12, 12);
                    camera.lookAt(0, -2, 0);
                }
            },
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

