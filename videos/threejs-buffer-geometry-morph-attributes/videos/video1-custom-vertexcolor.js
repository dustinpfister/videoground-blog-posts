// video1 for threejs-buffer-geometry-morph-attributes
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js',
   '../../../js/curve/r1/curve.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js'
];
// init
VIDEO.init = function(sm, scene, camera){

// ---------- ----------
// GEOMETRY
// ---------- ----------
const geo = new THREE.BufferGeometry();
geo.morphAttributes.position = [];
// USING MORPH TARGETS RELATIVE
geo.morphTargetsRelative = true;
// home data position
const data_pos = [
  // body
  -0.5,-1.0, 1.0,  -1.0,-1.0, 0.0,
   0.0,-1.5,-4.0,   1.0,-1.0, 0.0,
   0.0,-2.0, 0.0,   0.0, 0.0, 0.0,
   // wings
   1.0, 1.0,-0.7,   1.0, 1.0, 0.7,   2.0, 1.0, 0.0,
  -1.0, 1.0,-0.7,  -1.0, 1.0, 0.7,  -2.0, 1.0, 0.0
];
geo.setAttribute('position', new THREE.Float32BufferAttribute(data_pos, 3) );
geo.setIndex([ 0,5,1, 0,3,5, 0,4,3, 0,1,4, 5,3,2, 4,2,3, 4,1,2, 1,5,2, 6,7,8, 5,7,6, 10,9,11, 5,9,10 ]);
geo.computeVertexNormals();
// position deltas 0 - move tail up and down
const data_pos_deltas0 = [
   // body
   0, 0, 0,   0, 0, 0,   0, 1, 0,
   0, 0, 0,   0, 0, 0,   0, 0, 0,
   // wings
   0, 0, 0,   0, 0, 0,   0, 0, 0,
   0, 0, 0,   0, 0, 0,   0, 0, 0,
];
geo.morphAttributes.position[ 0 ] = new THREE.Float32BufferAttribute( data_pos_deltas0, 3 );
// position deltas 1 - move head side to side
const data_pos_deltas1 = [
   1, 0, 0.0,   0, 0, 0.5,   0, 0, 0,
   0, 0,-0.5,   0, 0, 0.0,   0, 0, 0,
   // wings
   0, 0, 0.0,   0, 0, 0.0,   0, 0, 0,
   0, 0, 0.0,   0, 0, 0.0,   0, 0, 0
];
geo.morphAttributes.position[ 1 ] = new THREE.Float32BufferAttribute( data_pos_deltas1, 3 );
// position deltas 2 - move wings
const data_pos_deltas2 = [
   0, 0, 0,   0, 0, 0,   0, 0, 0,
   0, 0, 0,   0, 0, 0,   0, 0, 0,
   // wings
   0,-2,-1,   0,-2,-1,   0,-2,-1,
   0,-2,-1,   0,-2,-1,   0,-2,-1
];
geo.morphAttributes.position[ 2 ] = new THREE.Float32BufferAttribute( data_pos_deltas2, 3 );
// ---------- ----------
// COLOR ATTRIBUTE
// ---------- ----------
const data_color = [
    1, 1, 0,   0, 1, 0,   1, 0, 0,
    0, 1, 0,   0, 1, 1,   0, 0, 1,
    // wings
    1, 1, 1,   1, 1, 1,   1, 1, 0,
    1, 1, 1,   1, 1, 1,   1, 1, 0
];
geo.setAttribute('color', new THREE.Float32BufferAttribute(data_color, 3) );
// ---------- ----------
// LIGHT
// ---------- ----------
const dl = new THREE.DirectionalLight();
dl.position.set(2,1,0)
scene.add(dl);
const al = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(al);
// ---------- ----------
// MATERIAL
// ---------- ----------
const material = new THREE.MeshPhongMaterial({
     vertexColors: true,
     side: THREE.DoubleSide
});
// ---------- ----------
// MESH
// ---------- ----------
const mesh = new THREE.Mesh(geo, material);
mesh.position.set(0, 2, 0);
scene.add(mesh);



    //-------- ----------
    // BACKGROUND - using canvas2 and lz-string to create a background texture
    //-------- ----------
    const canObj = canvasMod.create({
        size: 512,
        draw: 'grid_palette',
        palette: ['#000000', '#1f1f1f', '#00ffff'],
        dataParse: 'lzstring64',
        state: { w: 8, h: 5, data: 'AwGlEYyzNCVgpcmPit1mqvTsg===' }
    });
    // can use LZString to compress and decompress
    //console.log( LZString.decompressFromBase64('AwGlEYyzNCVgpcmPit1mqvTsg===') );
    // I want to repeat the texture
    const texture = canObj.texture;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(32, 24);
    scene.background = texture;
    //-------- ----------
    // CURVE PATHS - cretaing a curve path for the camera
    //-------- ----------
    const cp_campos = curveMod.QBCurvePath([
        [8,1,0, 5,0,5,  2,0,2,    0],
        [5,0,5, -5,2,5,  0,0,0,    0],
    ]);
    //scene.add( curveMod.debugPointsCurve(cp_campos) )
    //-------- ----------
    // CURVE Alphas
    //-------- ----------
    const getCamPosAlpha = curveMod.getAlphaFunction({
        type: 'curve2',
        ac_points: [0, 0,  0.25, 0,  1]
    });
    //scene.add( curveMod.debugAlphaFunction(getCamPosAlpha) )
    //-------- ----------
    // GRID
    //-------- ----------
    const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    scene.add( grid );
    //-------- ----------
    // TEXT CUBE
    //-------- ----------
    const textCube = scene.userData.textCube = CanvasTextCube.create({
        bg: '#000000',
        size: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,0,0.8)',
        lineCount: 9,
        lines: [
            ['Morph Attributes', 64, 17, 14, 'white'],
            ['Buffer Geometry', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 02/06/2023 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);
    //-------- ----------
    // A SEQ FOR TEXT CUBE
    //-------- ----------
    const seq_textcube = seqHooks.create({
        setPerValues: false,
        fps: 30,
        beforeObjects: function(seq){
            const textCube = scene.userData.textCube;
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
                    textCube.material.opacity = 0.8;
                }
            },
            {
                per: 0.75,
                update: function(seq, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8 + 1 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    textCube.material.opacity = 0.8 - 0.8 * partPer;
                }
            }
        ]
    });
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            textCube.visible = false;
            camera.lookAt(0,0,0);
            camera.zoom = 1;


    const a1 = seq.frame / seq.frameMax;
    const a2 = 1 - Math.abs(0.5 - a1 * 8 % 1) / 0.5;
    const a3 = 1 - Math.abs(0.5 - a1 * 4 % 1) / 0.5;
    const a4 = 1 - Math.abs(0.5 - a1 * 20 % 1) / 0.5;
    // using morph target influences to set current state of each position attribite
    mesh.morphTargetInfluences[ 0 ] = a2;
    mesh.morphTargetInfluences[ 1 ] = a3;
    mesh.morphTargetInfluences[ 2 ] = a4;
    mesh.geometry.computeVertexNormals();


        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    // SEQ 0 - ...
    opt_seq.objects[0] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            // textcube
            if(seq.partFrame < seq.partFrameMax){
               seqHooks.setFrame(seq_textcube, seq.partFrame, seq.partFrameMax);
            }
            // camera
            //camera.position.set(-8, 4, -8);
            camera.position.set(8, 1, 0);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 2,
        update: function(seq, partPer, partBias){
            const v1 = new THREE.Vector3(0,0,0);
            const v2 = new THREE.Vector3(0,1,0)
            camera.lookAt( v1.lerp(v2, partPer));
            camera.zoom = 1 + 0.25 * partPer;
        }
    };
    // SEQ 1 - ...
    opt_seq.objects[2] = {
        secs: 25,
        update: function(seq, partPer, partBias){
            const a1 = getCamPosAlpha(partPer);
            camera.position.copy( cp_campos.getPoint(a1) );
            camera.lookAt(0, 1, 0);
            camera.zoom = 1.25 - 0.25 * partPer;
        }
    };
    const seq = scene.userData.seq = seqHooks.create(opt_seq);
    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
 