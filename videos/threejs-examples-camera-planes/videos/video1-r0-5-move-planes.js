// video1=r0-5-move-planes.js for threejs-examples-camera-planes
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js',
   '../../../js/curve/r1/curve.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js',
   '../../../js/camera-planes/r0/camera-planes.js'
];
// init
VIDEO.init = function(sm, scene, camera){
//-------- ----------
// HELPERS
//-------- ----------
// Simple canvas object
const createCanvasObject = (opt) => {
    opt = opt || {};
    const can = {
        size: opt.size === undefined ? 32 : opt.size,
        draw: opt.draw || function(can, ctx, canvas){},
        userData: opt.userData || {},
        canvas: null, ctx: null, texture: null
    };
    can.canvas = document.createElement('canvas');
    can.ctx = can.canvas.getContext('2d');
    can.canvas.width = can.size;
    can.canvas.height = can.size;
    can.draw(can, can.ctx, can.canvas);
    can.texture = new THREE.CanvasTexture(can.canvas);
    can.texture.magFilter = THREE.NearestFilter;
    can.texture.minFilter = THREE.NearestFilter;
    return can;
};
const updateCanvasObject = (can) => {
    can.draw(can, can.ctx, can.canvas);
    can.texture.needsUpdate = true;
};
// draw method to use with canvas object
const draw_info = (can, ctx, canvas) => {
    ctx.clearRect(0,0, can.size, can.size);
    ctx.fillStyle = 'rgba(0,255, 255, 0.1)';
    ctx.fillRect(0,0, can.size, can.size);
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '24px arial';
    const ud = can.userData;
    ctx.fillText(ud.frame + ' / ' + ud.frameMax, can.size / 2, can.size / 2);
    ctx.fillRect(0,0, can.size * ud.a_vid, 5)
};
// ---------- ----------
// CAN object
// ---------- ----------
const can = createCanvasObject({
    size: 128,
    draw: draw_info,
    userData: {
        frame: 0, frameMax: 10,
        a_vid: 0.5
    }
});
//-------- ----------
// camera group
//-------- ----------
const group_camera = cameraPlanes.create({
    planeScale: 0.73,
    camera: camera,
    zMax: 3,
    count: 1,
    effect: (group, mesh_plane, gud, mud, a_plane, alpha) => {
        const z = gud.zMax - gud.zMax * a_plane * alpha;
        mesh_plane.position.set(0, 0, z);
        mesh_plane.rotation.y = THREE.MathUtils.degToRad(-90 + 90 * alpha);
        mesh_plane.material.opacity = 0.25 + 0.75 * alpha;
    }
});
// can use the getObjectByname object3d method to get a ref to a mesh
const mesh_plane = group_camera.getObjectByName('plane_0');
mesh_plane.material.map = can.texture;
scene.add(group_camera);
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
    // CURVE PATHS - creating a curve path for the camera
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
    //    ac_points: [0,0.2,  0.6, -0.15,  1]
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
            ['Camera Planes', 64, 17, 14, 'white'],
            ['threejs example', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r146 03/10/2023 )', 64, 70, 12, 'gray'],
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
            textCube.position.set(7, 0.92, 0);
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
                    textCube.material.opacity = 0.9;
                }
            },
            {
                per: 0.75,
                update: function(seq, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(7, 0.92 + 1 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    textCube.material.opacity = 0.9 - 0.9 * partPer;
                }
            }
        ]
    });
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------



    // start options for main seq object
const v1 = new THREE.Vector3(8, 1, 0);
const v2 = new THREE.Vector3(-10, 1, 0);
const ud = can.userData;
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            textCube.visible = false;
            //group_camera.position.set(8, 1, 0);
            //group_camera.lookAt(0,0,0)
            //camera.zoom = 1;



        },
        afterObjects: function(seq){
            //camera.updateProjectionMatrix();
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
    group_camera.position.copy(v1);
    group_camera.lookAt( 0, 0, 0);
    cameraPlanes.update(group_camera, 0);
        }
    };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 27,
        update: function(seq, partPer, partBias){
    const a1 = partPer;
    const a2 = 1 - Math.abs(0.5 - a1) / 0.5;
    ud.frame = seq.frame;
    ud.frameMax = seq.frameMax;
    ud.a_vid = a1;
    updateCanvasObject(can);
    group_camera.position.copy(v1).lerp(v2, a2);
    group_camera.lookAt( 0, 0, 5 * a2 );
    let a3 = a2 * 2;
    a3 = a3 > 1 ? 1 : a3;
    cameraPlanes.update(group_camera, a3);
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
 