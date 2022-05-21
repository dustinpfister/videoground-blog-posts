// video1 for threejs-plane
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences-hooks-r1.js',
   '../../../js/datatex.js',
   '../../../js/tile-index.js',
   '../js/object-grid-wrap.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');

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
            ['Plane Geometry', 64, 17, 14, 'white'],
            ['in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r135 05/21/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    var dl = new THREE.DirectionalLight();
    scene.add(dl);

//******** **********
// GRID OPTIONS WITH TILE INDEX
//******** **********
var tw = 20,
th = 20,
space = 1.25;
// source objects


    var ground = TileMod.create({w: 1, h: 1, sw: 2, sh: 2});
    TileMod.setCheckerBoard(ground)
    //scene.add(ground);

var array_source_objects = [
    ground
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
            textCube.visible = false;

            ObjectGridWrap.setPos(grid, 1 - seq.per, 0 );
            ObjectGridWrap.update(grid);

            camera.position.set(8, 1, 0);
            camera.lookAt(0, 0, 0);
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
                }
            },
            {
                secs: 7,
                update: function(seq, partPer, partBias){
                }
            },
            {
                secs: 20,
                update: function(seq, partPer, partBias){
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

