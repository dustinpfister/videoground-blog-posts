// video1 for threejs-examples-biplane-group
//******** **********
// scripts
//******** **********
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences-hooks-r1.js',
   '../../../js/datatex.js',
   '../../../js/object-grid-wrap-r2-with-opacity2.js',
   '../../../js/object-grid-wrap-r2-land.js',
   '../js/biplane.js',
   '../js/biplane-group.js'
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
            ['Biplane Group', 64, 17, 14, 'white'],
            ['threejs example', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 07/24/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
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
        tw: 16,
        th: 16,
        crackSize: 0,
        //effects:[],
        altitude: [
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,1,1,1,0,0,0,1,1,1,1,0,0,0,
            0,0,0,1,1,1,0,0,0,1,1,1,1,0,0,0,
            0,0,0,1,1,1,0,0,0,1,1,1,1,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,
            0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,
            0,1,2,2,2,1,1,0,0,0,0,0,0,0,0,0,
            0,1,2,2,2,1,1,0,0,0,1,1,1,0,0,0,
            0,1,2,2,2,1,1,0,0,0,1,1,1,0,0,0,
            0,1,1,1,1,1,0,0,0,0,1,1,1,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        ],
        objectIndices: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 7, 4, 6, 0, 0, 0, 7, 4, 4, 6, 0, 0, 0,
            0, 0, 0, 1, 0, 3, 0, 0, 0, 1, 0, 0, 3, 0, 0, 0,
            0, 0, 0, 8, 2, 5, 0, 0, 0, 8, 2, 2, 5, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 7, 4, 4, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 7, 4, 9, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 7, 4, 6, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 1, 0, 3, 0, 3, 0, 0, 0, 7, 4, 6, 0, 0, 0,
            0, 1, 8, 2, 5,11, 5, 0, 0, 0, 1, 0, 3, 0, 0, 0,
            0, 8, 2, 2, 2, 5, 0, 0, 0, 0, 8, 2, 5, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
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
    // can make another system that involves a grid if index values
    // but with child objects
    var mkMeshFunctions = [
        null,
        function(){
            return mkCone(2)
        },
        function(){
            return mkCone(3)
        },
        function(){
            return mkCone(4)
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
            x = i % grid.userData.tw,
            y = Math.floor(i / grid.userData.tw)
            ObjectGridWrapLand.addAt(grid, mesh, x, y);
        }
    });


    //******** **********
    // BIPLANE GROUPS
    //******** **********


    var biGroups = new THREE.Group();
    scene.add(biGroups);
    var i = 0,
    group;
    while (i < 9) {
        group = BiplaneGroup.create();
        group.position.z = -50 + 50 * (i % 3);
        group.position.y = 50 - 25 * Math.floor(i / 3);
        group.rotation.y = Math.PI * 0.5;
        biGroups.add(group);
        i += 1;
    }
    // adjusting scale of main biplane group group
    biGroups.scale.set(0.25, 0.25, 0.25);
    // higher alt of main group
    biGroups.position.y = 7;


    //******** **********
    // A SEQ FOR TEXT CUBE
    //******** **********
    var seq_textcube = seqHooks.create({
        setPerValues: false,
        fps: 30,
        beforeObjects: function(seq){
            var textCube = scene.userData.textCube;
            textCube.rotation.y = 0;
            textCube.position.set(13.85, 13.85, 13.85);
            textCube.visible = false;
            textCube.material.transparent = true;
            textCube.material.opacity = 0.0;

textCube.lookAt(camera.position);

        },
        objects: [
            {
                per: 0,
                update: function(seq, partPer, partBias){
                    // text cube
                    textCube.visible = true;
                    textCube.material.opacity = 1.0;
                }
            },
            {
                per: 0.75,
                update: function(seq, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(13.85, 13.85 - 1 * partPer, 13.85);
                    textCube.rotation.y += Math.PI * 0.5 * partPer;
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



        biGroups.children.forEach(function (biGroup) {


biGroup.position.x = 0;
biGroup.position.y = 7;
biGroup.userData.pps = 0;
biGroup.userData.active = true;

            BiplaneGroup.update(biGroup, 1 / 30);


/*
            if (!biGroup.userData.active) {
                biGroup.position.x = -200;
                biGroup.userData.pps = 0; //32 + Math.round(64 * Math.random());
                biGroup.userData.active = true;
            } else {
                biGroup.position.x += biGroup.userData.pps * ( 1 / 30);
                if (biGroup.position.x >= 200) {
                    biGroup.userData.active = false;
                }
            }
*/
        });


            ObjectGridWrap.setPos(grid, ( 1 - seq.per ) * 2, 0 );
            ObjectGridWrap.update(grid);
            textCube.visible = false;
            camera.position.set(15, 15, 15);
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
                secs: 20,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(15, 15, 15);
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
