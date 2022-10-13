// video1 for threejs-plane
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   //'../../../js/datatex/r0/datatex.js',
   //'../../../js/tile-index.js',
   '../../../js/tilemod/r0/tilemod.js',
   '../../../js/object-grid-wrap/r0/object-grid-wrap.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');
 
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
var tw = 6,
th = 6,
space = 3.1;
// source objects

    const mkDataTexture = function (data, w) {
        data = data || [];
        w = w || 0;
        var width = w, //20,
        height = data.length / 4 / w;
        var texture = new THREE.DataTexture(data, width, height);
        texture.needsUpdate = true;
        return texture;
    };


    // simple gray scale seeded random texture
    const seededRandom = function (w, h, rPer, gPer, bPer, range) {
        w = w === undefined ? 5 : w,
        h = h === undefined ? 5 : h;
        rPer = rPer === undefined ? 1 : rPer;
        gPer = gPer === undefined ? 1 : gPer;
        bPer = bPer === undefined ? 1 : bPer;
        range = range || [0, 255]
        var size = w * h;
        var data = new Uint8Array(4 * size);
        for (let i = 0; i < size; i++) {
            var stride = i * 4;
            var v = Math.floor(range[0] + THREE.MathUtils.seededRandom() * (range[1] - range[0]));
            data[stride] = v * rPer;
            data[stride + 1] = v * gPer;
            data[stride + 2] = v * bPer;
            data[stride + 3] = 255;
        }
        return mkDataTexture(data, w);
    };


    var textureRND1 = seededRandom(80, 80, 1, 1, 1, [130, 250]);
    var textureRND2 = seededRandom(160, 160, 1, 1, 1, [64, 170]);

    var MATERIALS = [
        new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            map: textureRND1,
            //emissive: 0x00ff00,
            //emissiveIntensity: 0.75,
            side: THREE.DoubleSide
        }),
        new THREE.MeshStandardMaterial({
            color: 0x00aa00,
            map: textureRND2,
            //emissive: 0x00ff00,
            //emissiveIntensity: 0.2,
            side: THREE.DoubleSide
        })
    ];


    var ground = TileMod.create({w: 3, h: 3, sw: 2, sh: 2, materials: MATERIALS});
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
        },
        afterObjects: function(seq){
            camera.lookAt(0, 0, 0);
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
                    camera.position.set(8, 1, -2 * partPer);
                }
            },
            {
                secs: 20,
                update: function(seq, partPer, partBias){
                    camera.position.set(8, 1, -2 + 4 * partPer);
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

