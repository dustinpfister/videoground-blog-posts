// video1 for threejs-userdata
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences-hooks-r1.js',
   '../../../js/datatex.js',
   '../../../js/tile-index.js',
   '../js/object-grid-wrap.js',
   '../js/cube-group.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#000000');

    // GRID
    //var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    //grid.material.linewidth = 3;
    //scene.add( grid );
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['User Data Object', 64, 17, 14, 'white'],
            ['in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r135 05/23/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

//******** **********
// LIGHT
//******** **********

var dl = new THREE.DirectionalLight(0xffffff, 1);
dl.position.set(1, 3, 2);
scene.add(dl);

var pl = new THREE.PointLight(0xffffff, 1);
scene.add(pl);


//******** **********
// CUBE GROUPS
//******** **********
    var cubes3 = CubeGroupMod.create({
       anglesA:[180, 270, 90, 0],
       yDelta: 0.25,
       xzDelta: 0.75,
       maxFrame: 60,
       fps: 30,
       cubeRotations: [
          [0, 0, 1],
          [0, 1, 0],
          [0, 1, 1],
          [1, 0, 0],
          [1, 0, 1],
          [1, 1, 0],
          [1, 1, 1],
          [0, 0, 1]
       ]
    });

    cubes3.position.y = 2;

    scene.add(cubes3);


//******** **********
// GRID OPTIONS WITH TILE INDEX
//******** **********
var tw = 12,
th = 12,
space = 3.1;
// source objects
    var textureRND1 = datatex.seededRandom(40, 40, 0, 1, 0, [150, 180]);
    var textureRND2 = datatex.seededRandom(40, 40, 0, 1, 0.5, [200, 255]);

    var MATERIALS = [
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            map: textureRND1,
            //emissive: 0x00ff00,
            //emissiveIntensity: 0.75,
            side: THREE.DoubleSide
        }),
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            map: textureRND2,
            //emissive: 0x00ff00,
            //emissiveIntensity: 0.2,
            side: THREE.DoubleSide
        })
    ];
var ground = TileMod.create({w: 3, h: 3, sw: 2, sh: 2, materials: MATERIALS});
TileMod.setCheckerBoard(ground);

var ground2 = ground.clone();
var cone = new THREE.Mesh( 
    new THREE.ConeGeometry(0.5, 1, 30, 30),
    new THREE.MeshStandardMaterial({
        color: new THREE.Color('white'),
        map: textureRND2
    }));
cone.geometry.rotateX(1.57);
cone.position.z = 0.5;
ground2.add(cone);

var array_source_objects = [
    ground, // 0 - just ground
    ground2 // 1 - ground with cone
];
var array_oi = [],
len = tw * th, i = 0;
while(i < len){
    array_oi.push( Math.floor( array_source_objects.length * THREE.MathUtils.seededRandom() ) );
    i += 1;
}
//******** **********
// CREATE GRID
//******** **********
var grid = ObjectGridWrap.create({
    space: space,
    tw: tw,
    th: th,
    aOpacity: 1.25,
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

            CubeGroupMod.setCubes(cubes3, seq.frame, seq.frameMax);

            // object grid
            ObjectGridWrap.setPos(grid, 1 - 2 * seq.per, 0 );
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
                    camera.position.set(8 - 2 * partPer, 1 + 5 * partPer, 6 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 10,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(6, 6, 6);
                    camera.lookAt(0, 1.5 * partPer, 0);
                }
            },
            {
                secs: 10,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(6 - 12 * partPer, 6, 6);
                    camera.lookAt(0, 1.5, 0);
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

