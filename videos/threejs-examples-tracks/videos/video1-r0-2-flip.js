// video1 for threejs-examples-tracks
//     * demo video based on the r0-2-flip example
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js',
   '../../../js/curve/r1/curve.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js',

   './tracks-r0.js'
];
// init
VIDEO.init = function(sm, scene, camera){
// ---------- ----------
// SOURCE OBJECTS - Just want one source object for this flip demo that is a single turn
// ---------- ----------
const group_source = new THREE.Group();
group_source.add( trackMod.createSourceObject(4.0, 4.0,   1.5,-2.0,   -2.0, 1.5,   0.8, 0.8,  1.8, 1.0) );
// ---------- ----------
// TRACK OBJECTS - creating the tracks objects from the source objects
// ---------- ----------
const n = 6;
const curve = new THREE.CurvePath();
[
    [0,   9.0,  2.0,  0.0,  0, false, false],
    [0,   5.0,  5.0,  0.0,  1, true, false],
    [0,   2.0,  9.0,  0.0,  0, false, false],
    [0,  -2.0,  9.0,  0.0,  3, false, false],
    [0,  -5.0,  5.0,  0.0,  2, true, false],
    [0,  -9.0,  2.0,  0.0,  3, false, false],
    [0,  -9.0, -2.0,  0.0,  0, true, true],
    [0,  -5.0, -5.0,  0.0,  1, false, true],
    [0,  -2.0, -9.0,  0.0,  0, true, true],
    [0,   2.0, -9.0,  0.0,  3, true, true],
    [0,   5.0, -5.0,  0.0,  2, false, true],
    [0,   9.0, -2.0,  0.0,  3, true, true]
].forEach((data)=>{
    const track = trackMod.createTrackObject(group_source, data[0], data[1], data[2], data[3], data[4], data[5], data[6]);
    scene.add(track);
    curve.add( trackMod.createTrackCurvePart(track) );
});
// curve
const geo_points = new THREE.BufferGeometry().setFromPoints( curve.getPoints(19) );
scene.add( new THREE.Points( geo_points, new THREE.PointsMaterial({size: 0.25}) ) );
// ---------- ----------
// OBJECTS
// ---------- ----------
// grid helper
scene.add( new THREE.GridHelper(10, 10) );
const mesh = new THREE.Mesh( new THREE.BoxGeometry(1,1,1), new THREE.MeshNormalMaterial() )
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
    //const cp_campos = curveMod.QBCurvePath([
    //    [8,1,0, 8,3,8,  5,2,5,    0]
    //]);
    //scene.add( curveMod.debugPointsCurve(cp_campos) )
    //-------- ----------
    // CURVE Alphas
    //-------- ----------
    //const getCamPosAlpha = curveMod.getAlphaFunction({
    //    type: 'curve2',
    //    ac_points: [0,0.4,  0.6,-0.25,  1]
    //});
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
            ['Tracks Module', 64, 17, 14, 'white'],
            ['Threejs Example', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 02/17/2023 )', 64, 70, 12, 'gray'],
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
            camera.position.set(8, 1, 0);
            camera.zoom = 1;

    const a1 = seq.frame / seq.frameMax;

    const a2 = a1 * 5 % 1;
    const a4 = ( a2 * 0.94 + 0.05 ) % 1;
    mesh.position.copy( curve.getPoint(a2) );
    mesh.lookAt( curve.getPoint( a4 ) );

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
            //camera.position.set(8, 1, 0);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 2,
        update: function(seq, partPer, partBias){
            const v1 = new THREE.Vector3(8, 1, 0);
            const v2 = new THREE.Vector3(15, 15, 15);
            camera.position.copy(v1).lerp(v2, partPer);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 2 - ...
    opt_seq.objects[2] = {
        secs: 25,
        update: function(seq, partPer, partBias){
            camera.position.set(15 - 30 * partPer, 15, 15)
            camera.lookAt(0, 0, 0);
        }
    };
    
    // SEQ 1 - ...
    //opt_seq.objects[1] = {
    //    secs: 27,
    //    update: function(seq, partPer, partBias){
    //        const a1 = getCamPosAlpha(partPer);
    //        camera.position.copy( cp_campos.getPoint(a1) );
    //        camera.lookAt(0, 0, 0);
    //    }
    //};
    const seq = scene.userData.seq = seqHooks.create(opt_seq);
    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
 