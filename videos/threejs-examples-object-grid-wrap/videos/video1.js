// video1 for threejs-examples-object-grid-wrap
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences-hooks-r1.js',
   '../../../js/datatex.js',
   '../js/object-grid-wrap.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#cfcfcf');

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
            ['Object grid wrap', 64, 17, 14, 'white'],
            ['module', 64, 32, 14, 'white'],
            ['threejs example', 64, 47, 14, 'white'],
            ['( r135 05/20/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);
//******** **********
// LIGHT
//******** **********
var dl = new THREE.DirectionalLight(0xffffff, 1);
dl.position.set(8, 10, -4);
scene.add(dl);
//******** **********
// GRID OPTIONS
//******** **********
var tw = 20,
th = 20,
space = 1.25;
// source objects
var textureRND1 = datatex.seededRandom(32, 32, 1, 1, 1, [32, 128]);
var textureRND2 = datatex.seededRandom(32, 32, 1, 1, 1, [180, 240]);
var mkBox = function(color, h){
    var box = new THREE.Group();
    var mesh = new THREE.Mesh(
        new THREE.BoxGeometry( 1, h, 0.25 + 0.25),
        new THREE.MeshStandardMaterial({ color: color, map: textureRND2}) );
    mesh.position.y = h / 2;
    mesh.rotation.y = Math.PI / 180 * 20 * -1;
    var ground = new THREE.Mesh(
        new THREE.BoxGeometry( space, 0.1, space),
        new THREE.MeshStandardMaterial({ color: 0x00ff00, map: textureRND1}) );
    ground.position.y = 0.05 * -1;
    box.add(mesh)  
    box.add(ground);
    return box;
};
var array_source_objects = [
    mkBox(0xff0000, 0.5),
    mkBox(0x00ff00, 1),
    mkBox(0x0000ff, 1.5),
    mkBox(0x00ffff, 2),
    mkBox(0xff00ff, 2.5)
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


/*
    var seq_grid_wrap = seqHooks.create({
        setPerValues: false,
        fps: 30,
        beforeObjects: function(seq){


            
        },
        objects: [
            {
                per: 0,
                update: function(seq, partPer, partBias){
                    
                }
            },
            {
                per: 0.75,
                update: function(seq, partPer, partBias){
                    
                }
            }
        ]
    });
*/

    // A MAIN SEQ OBJECT
    var seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){
            //seqHooks.setFrame(seq_grid_wrap, seq.frame, seq.frameMax);

            ObjectGridWrap.setPos(grid, (1 - seq.per) * 2, Math.cos(Math.PI * seq.bias) * 0.25 );
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
                secs: 7,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8, 5, 0);
                    camera.lookAt(0, 5 - 4 * partPer, 0);
                }
            },
            {
                secs: 20,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8, 5, 0);
                    camera.lookAt(0, 1, 0);
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

