// video2 for threejs-examples-object-grid-wrap-land
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/datatex/r0/datatex.js',
   '../../../js/object-grid-wrap/r2/object-grid-wrap.js',
   '../../../js/object-grid-wrap/r2/effects/opacity2.js',
   '../../../js/object-grid-wrap/r2/land/land-r3.js'
];
//******** **********
// dae files
//******** **********
VIDEO.daePaths = [
  '../../../dae/land-set-one/land-set-1c.dae'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#008a8a');

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
            ['Object Grid Wrap', 64, 17, 14, 'white'],
            ['Land Module', 64, 32, 14, 'white'],
            ['threejs example', 64, 47, 14, 'white'],
            ['( r140 08/30/2022 )', 64, 70, 12, 'gray'],
            ['video2', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    //******** **********
    // LIGHT
    //******** **********
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(2, 1, 3);
    scene.add( new THREE.AmbientLight(0xffffff, 0.2))
    scene.add(dl);

//******** **********
// GRID OPTIONS
//******** **********
var gridOpt = {
    tw: 14,
    th: 14,
    space: 1,
    crackSize: 0,
    effects:['opacity2'],
    altitude: [
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,1,1,1,0,0,0,1,1,1,1,0,
        0,0,0,1,1,1,0,0,0,1,1,1,1,0,
        0,0,0,1,1,1,0,0,0,1,1,1,1,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,1,1,1,1,0,0,0,0,0,0,0,
        0,1,1,1,1,1,1,0,0,0,0,0,0,0,
        0,1,2,2,2,1,1,0,0,0,0,0,0,0,
        0,1,2,2,2,1,1,0,0,0,1,1,1,0,
        0,1,2,2,2,1,1,0,0,0,1,1,1,0,
        0,1,1,1,1,1,0,0,0,0,1,1,1,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0
    ],
    objectIndices: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 7, 4, 6, 0, 0, 0, 7, 4, 4, 6, 0,
        0, 0, 0, 1, 0, 3, 0, 0, 0, 1, 0, 0, 3, 0,
        0, 0, 0, 8, 2, 5, 0, 0, 0, 8, 2, 2, 5, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 7, 4, 4, 6, 0, 0, 0, 0, 0, 0, 0,
        0, 7, 4, 9, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0,
        0, 1, 7, 4, 6, 0, 3, 0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 0, 3, 0, 3, 0, 0, 0, 7, 4, 6, 0,
        0, 1, 8, 2, 5,11, 5, 0, 0, 0, 1, 0, 3, 0,
        0, 8, 2, 2, 2, 5, 0, 0, 0, 0, 8, 2, 5, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]
};

    var sObj = ObjectGridWrapLand.createSourceObj(VIDEO.daeResults[0]);

    gridOpt.sourceObjects = [
       sObj.land_0,
       sObj.land_1, sObj.land_1, sObj.land_1, sObj.land_1,
       sObj.land_2, sObj.land_2, sObj.land_2, sObj.land_2,
       sObj.land_3, sObj.land_3, sObj.land_3, sObj.land_3
    ];

    console.log(sObj);

    //******** **********
    // GRID
    //******** **********
    var grid = ObjectGridWrapLand.create(gridOpt);
    grid.scale.set(1, 1, 1);
    ObjectGridWrapLand.setDataTextures(grid)
    scene.add(grid);


    //******** **********
    // ADDING CHILD MESH OBJECTS
    //******** **********
    // get a random radian
    var getRandomRadian = function(){
        return Math.PI * 2 * THREE.MathUtils.seededRandom();
    };
    var setRandomScale = function(mesh, sMin, sMax){
        var scale = sMin + ( sMax - sMin ) * THREE.MathUtils.seededRandom();
        mesh.scale.set(scale, scale, scale);
    };
    // can make another system that involves a grid of index values
    // but with child objects
    var mkMeshFunctions = [
        null,
        function(){
            var mesh = sObj.tree_1.clone();
            mesh.material = sObj.tree_1.material.clone();
            setRandomScale(mesh, 0.25, 0.75);
            return mesh;
        },
        function(){
            var mesh = sObj.tree_2.clone();
            mesh.material = sObj.tree_2.material.clone();
            setRandomScale(mesh, 0.25, 0.75);
            mesh.rotation.y = getRandomRadian()
            return mesh;
        },
        function(){
            var mesh = sObj.tree_3.clone();
            mesh.material = sObj.tree_3.material.clone();
            setRandomScale(mesh, 0.35, 0.50);
            mesh.rotation.y = getRandomRadian()
            return mesh;
        }
    ];
    // object index grid
    [
        2,2,0,0,0,0,0,0,0,0,2,2,1,2,
        2,1,2,2,0,0,0,0,0,0,0,1,2,0,
        0,2,1,2,2,0,3,0,0,1,2,2,1,2,
        0,0,2,2,2,2,0,0,0,0,3,2,2,2,
        0,0,0,2,2,0,0,0,1,0,1,1,2,2,
        0,0,0,1,2,2,2,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,1,0,1,2,1,0,0,
        0,0,2,0,0,0,0,0,0,2,0,0,0,0,
        0,0,0,1,0,0,0,2,1,0,1,1,0,0,
        0,0,1,0,0,0,0,1,0,1,3,3,0,1,
        0,1,0,1,0,1,2,0,1,2,1,1,2,0,
        0,0,0,0,2,0,0,1,0,3,1,1,2,2,
        2,1,0,1,0,1,0,0,2,1,2,3,1,1,
        2,2,0,0,0,0,0,0,0,2,1,2,1,2
    ].forEach(function(objIndex, i){
        var mkMesh = mkMeshFunctions[objIndex];
        if(mkMesh){
            var mesh = mkMesh(),
            x = i % grid.userData.tw,
            y = Math.floor(i / grid.userData.tw);
            // add at method
            ObjectGridWrapLand.addAt(grid, mesh, x, y, function(tile, mesh, tileUD){
                // default to just the alt value of the tile
                mesh.position.y = tileUD.alt;
                // if tile is a cube
                if(tileUD.isCube){
                    mesh.position.y = tileUD.alt + 0.25;
                }
                // if tile is a cube
                if(tileUD.isSlope){
                    mesh.position.y = tileUD.alt - 0.25;
                }
                // if tile is a cube
                if(tileUD.isCorner){
                    mesh.position.y = tileUD.alt - 0.25;
                }
            });
        }
    });


    // A SEQ FOR TEXT CUBE
    var seq_textcube = seqHooks.create({
        setPerValues: false,
        fps: 30,
        beforeObjects: function(seq){
            var textCube = scene.userData.textCube;
            textCube.rotation.y = 0;
            textCube.position.set(6, 5, 0);
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
                    textCube.position.set(6, 5, 0);
                    textCube.material.opacity = 1.0;
                }
            },
            {
                per: 0.75,
                update: function(seq, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(6, 5 + 1 * partPer, 0);
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

            ObjectGridWrap.setPos(grid, ( 1 - seq.per ) * 2, 0 );
            ObjectGridWrap.update(grid);

            textCube.visible = false;
            camera.position.set(8, 5, 0);
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
                    camera.lookAt(0, 5, 0);
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8 + 2 * partPer, 5 + 5 * partPer, 10 * partPer);
                    camera.lookAt(0, 5 - 5 * partPer, 0);
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(10, 10, 10);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 4,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(10 + 5 * partPer, 10 + 5 * partPer, 10 - 25 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 4,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(15, 15, -15);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 4,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(15 - 30 * partPer, 15, -15);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 9,
                update: function(seq, partPer, partBias){
                    // camera
                    var a = 15 + 10 * partPer;
                    camera.position.set(a * -1, a, a * -1);
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

