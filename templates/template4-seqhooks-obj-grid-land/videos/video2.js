// video2 for template4-seqhooks-obj-grid-land
// using land-set-1 dae file for trees
//******** **********
// scripts
//******** **********
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/datatex/r0/datatex.js',
   '../../../js/object-grid-wrap/r2/object-grid-wrap.js',
   '../../../js/object-grid-wrap/r2/effects/opacity2.js',
   '../../../js/object-grid-wrap/r2/land/land.js'
];
//******** **********
// dae files
//******** **********
VIDEO.daePaths = [
  '../../../dae/land-set-one/land-set-1a.dae'
];
//******** **********
// init methods of video
//******** **********
VIDEO.init = function(sm, scene, camera){
    //******** **********
    // BACKGROUND
    //******** **********
    scene.background = new THREE.Color('#008a8a');
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
            ['Template4', 64, 17, 14, 'white'],
            ['', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 dd/mm/yyyy )', 64, 70, 12, 'gray'],
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
    // GRID WRAP LAND
    //******** **********
    var grid = ObjectGridWrapLand.create({
        tw: 14,
        th: 14,
        crackSize: 0,
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
    });
    grid.scale.set(1, 1, 1);
    ObjectGridWrapLand.setDataTextures(grid)
    scene.add(grid);
    //******** **********
    // ADDING CHILD MESH OBJECTS FOR GRID WRAP LAND
    //******** **********

    var mkCone = function(height){
        return new THREE.Mesh(
            new THREE.ConeGeometry(0.5, height, 30, 30),
            new THREE.MeshStandardMaterial({color: new THREE.Color('#00ff88')})
        );
    };

    var dscene = VIDEO.daeResults[0].scene;
    var sourceObj = {};
    var tree1 = sourceObj.tree1 = dscene.getObjectByName('tree-1');
    tree1.geometry.translate(0, -1, 0);
    //tree1.geometry.scale(1, -0.25, -2.25);

    var box = new THREE.Box3();
    tree1.geometry.computeBoundingBox();
    var bb = tree1.geometry.boundingBox
    console.log(bb.max.x.toFixed(2), bb.max.y.toFixed(2), bb.max.z.toFixed(2));

    var cone1 = mkCone(1);
    cone1.geometry.computeBoundingBox();
    var bb = cone1.geometry.boundingBox
    console.log(bb.max.x.toFixed(2), bb.max.y.toFixed(2), bb.max.z.toFixed(2));


    //tree1.geometry.scale(1.5, 1.5, 1.5);
    //tree1.geometry.translate(0, 2.8, 0);

    var tree2 = sourceObj.tree2 =  dscene.getObjectByName('tree-2');
    //tree2.geometry.translate(0, 1.7, 0);

    var tree3 = sourceObj.tree3 = dscene.getObjectByName('tree-3');
    //tree3.geometry.scale(1.1, 1.1, 1.1);
    //tree3.geometry.translate(0, 3.5, 0);

    // can make another system that involves a grid if index values
    // but with child objects
/*
    var mkMeshFunctions = [
        null,
        function(){
            return mkCone(4)
        },
        function(){
            return mkCone(7)
        },
        function(){
            return mkCone(10)
        }
    ];
*/

    var mkMeshFunctions = [
        null,
        function(){
            var mesh = tree1.clone();
            mesh.material = tree1.material.clone();
            return mesh;
        },
        function(){
            var mesh = tree1.clone();
            mesh.material = tree1.material.clone();
            return mesh;
        },
        function(){
            var mesh = tree1.clone();
            mesh.material = tree1.material.clone();
            return mesh;
        }
    ];

    // object index grid
    [
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,2,0,0,0,0,0,0,0,1,0,0,
        0,0,1,0,0,0,3,0,0,1,2,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,1,0,1,1,0,0,
        0,0,0,1,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,1,0,1,2,1,0,0,
        0,0,2,0,0,0,0,0,0,2,0,0,0,0,
        0,0,0,1,0,0,0,2,1,0,1,1,0,0,
        0,0,1,0,0,0,0,1,0,1,3,3,0,1,
        0,1,0,1,0,1,2,0,1,2,1,1,2,0,
        0,0,0,0,2,0,0,1,0,3,1,1,0,0,
        0,1,0,1,0,1,0,0,0,1,2,3,1,1,
        0,0,0,0,0,0,0,0,0,0,1,0,1,0
    ].forEach(function(objIndex, i){
        var mkMesh = mkMeshFunctions[objIndex];
        if(mkMesh){
            var mesh = mkMesh(),
            x = i % grid.userData.tw;
            y = Math.floor(i / grid.userData.tw);
            // using add at method
            ObjectGridWrapLand.addAt(grid, mesh, x, y);
            //mesh.position.y = 0;
        }
    });
    //******** **********
    // A SEQ FOR TEXT CUBE
    //******** **********
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
    //******** **********
    // A MAIN SEQ OBJECT
    //******** **********
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
                secs: 24,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(10, 10, 10);
                    camera.lookAt(0, 0, 0);
                }
            }
        ]
    });
    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;
};
//******** **********
// update method for the video
//******** **********
VIDEO.update = function(sm, scene, camera, per, bias){
    var seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
