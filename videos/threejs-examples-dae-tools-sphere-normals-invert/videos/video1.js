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
   '../../../js/object-grid-wrap-r1.js',
   '../../../js/tile-index.js',
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
// LIGHT
//******** **********

var dl = new THREE.DirectionalLight(0xffffff, 1);
dl.position.set(2, 3, 1);
scene.add(dl);

//var pl = new THREE.PointLight(0xffffff, 1);
//scene.add(pl);

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
    var group = createGroup(VIDEO.daeResults, 0);
    scene.add(group);
    var mesh = group.children[0];
    var sourceMaterial = mesh.material;
    var newMaterial = new THREE.MeshBasicMaterial({
        map: sourceMaterial.map
    });
    mesh.material = newMaterial;

    //******** **********
    // BASE GROUND MESH
    //******** **********
    var baseGround = new THREE.Mesh( new THREE.BoxGeometry(1, 0.1, 1), new THREE.MeshPhongMaterial({
         color: 0x00ff00
    }));
    baseGround.position.y = -0.125;
    baseGround.scale.set(60, 1, 60);
    scene.add(baseGround);

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
    // TEXTURES
    //******** **********
    var texture_rnd1 = datatex.seededRandom(40, 40, 1, 1, 1, [0, 255]);

//******** **********
// GRID OPTIONS WITH TILE INDEX
//******** **********
var tw = 8,
th = 8,
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
    dAdjust: 1.25,
    effects: ['opacity'],
    sourceObjects: array_source_objects,
    objectIndices: array_oi
});
grid.scale.set(2, 1, 2)
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

            ObjectGridWrap.setPos(grid, (1 - seq.per) * 2, 0 );
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
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8 - 8 * partPer, 1 + 2 * partPer, 0);
                    camera.lookAt(0, 3 * partPer, 10 * partPer);
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(0, 3, 0);

                    var v_old = new THREE.Vector3(0, 3, 10),
                    v_new = new THREE.Vector3(10, 6, 0);
                    camera.lookAt(v_old.clone().lerp(v_new, partPer));
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(0, 3, 0);

                    var v_old = new THREE.Vector3(10, 6, 0),
                    v_new = new THREE.Vector3(0, 6, -10);
                    camera.lookAt(v_old.clone().lerp(v_new, partPer));
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(0, 3, 0);

                    var v_old = new THREE.Vector3(0, 6, -10),
                    v_new = new THREE.Vector3(0, 6, -1);
                    camera.lookAt(v_old.clone().lerp(v_new, partPer));
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(0, 3, 0);

                    var v_old = new THREE.Vector3(0, 6, -1),
                    v_new = new THREE.Vector3(-10, 3, -1);
                    camera.lookAt(v_old.clone().lerp(v_new, partPer));
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(0, 3, -10 * partPer);

                    camera.lookAt(-10, 3, -1);
                }
            },
            {
                secs: 9,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(0, 3, -10);

                    camera.lookAt(-10 + 10 * partPer, 3, -1);
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

