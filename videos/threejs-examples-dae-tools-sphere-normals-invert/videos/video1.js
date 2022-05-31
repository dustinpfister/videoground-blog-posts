// video1 for threejs-examples-dae-tools-sphere-normals-invert
 
VIDEO.daePaths = [
  '../../../dae/sphere-normal-invert/sphere-normal-invert.dae'
];

// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences-hooks-r1.js',
   '../../../js/datatex.js',
   '../../../js/object-grid-wrap-r1.js'
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
    // INVRETED SPHERE
    //******** **********
    var createGroup = function(daeObjects, index){
        //var result = typeof what === 'object' ? what : daeObjects.results[what];
        var result = daeObjects[index];

        var group = new THREE.Group();
        // copy mesh objects only
        result.scene.children.forEach(function(obj){
            if(obj.type === 'Mesh'){
                group.add(obj.clone());
            }
        });
        // copy result.scene rotation to group
        group.rotation.copy(result.scene.rotation);
        return group;

    };

    console.log(VIDEO)

    var group = createGroup(VIDEO.daeResults, 0);
    scene.add(group);

var mesh = group.children[0];

        var sourceMaterial = mesh.material;
        var newMaterial = new THREE.MeshBasicMaterial({
            map: sourceMaterial.map
        });
        mesh.material = newMaterial;



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
            ['Invert Sphere', 64, 17, 14, 'white'],
            ['Normals', 64, 32, 14, 'white'],
            ['Threejs Example', 64, 47, 14, 'white'],
            ['( r135 05/31/2022 )', 64, 70, 12, 'gray'],
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
    var tw = 9,
    th = 9,
    space = 1.5;
    // source objects
    var mkBox = function(color, h){
        var box = new THREE.Group();
        var a = space * 0.95;
        var mesh = new THREE.Mesh(
            new THREE.BoxGeometry( a, h, a),
            new THREE.MeshStandardMaterial({ color: color, map: texture_rnd1 }) );
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
        mkBox(0x00ffff, 0.25), //new THREE.Object3D(),
        mkBox(0xff0000, 10.00),
        mkBox(0xffff00, 4.50),
        mkBox(0x00ff00, 1.50)
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
        effects: ['opacity', 'scale', 'rotationB'],
        sourceObjects: array_source_objects,
        objectIndices: array_oi
    });
    scene.add(grid);


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

            ObjectGridWrap.setPos(grid, (1 - seq.per) * 2, Math.cos(Math.PI * seq.bias) * 0.25 );
            ObjectGridWrap.update(grid);

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
                    camera.position.set(8, 1 + 7 * partPer, 8 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 20,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8, 8, 8);
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

