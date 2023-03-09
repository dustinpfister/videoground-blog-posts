// video2 for threejs-vector3-wrap
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js',
   '../../../js/curve/r1/curve.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js'
];
// init
VIDEO.init = function(sm, scene, camera){
// ---------- ---------- ----------
// LIGHT
// ---------- ---------- ----------
const dl = new THREE.DirectionalLight(0xffffff, 1);
dl.position.set(3, 2, 1);
scene.add(dl);
// ---------- ---------- ----------
// CONST
// ---------- ---------- ----------
const TOTAL_LENGTH = 100;
const MAX_LENGTH = 15;
const COUNT = 400;
const SIN_LOOP_RANGE = [32, 64];
const Y_ROTATION_COUNT = 1;
const Y_ROTATION_OFFSET = 40;
const X_DEG = 10;
// ---------- ---------- ----------
// OBJECTS
// ---------- ---------- ----------
const group = new THREE.Group();
scene.add(group);
let i = 0;
while(i < COUNT){
    const a_index = i / COUNT;
    const color = new THREE.Color();
    color.r = 0.1 + 0.9 * a_index;
    color.g = 1 - a_index;
    color.b = Math.random();
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.MeshPhongMaterial({color: color, transparent: true, opacity: 0.5})
    );
    group.add(mesh);
    i += 1;
}

const updateGroup = function(a1){
    group.children.forEach( (mesh, i, arr) => {
        const a2 = i / arr.length;
        const a3 = a1 + 1 / (TOTAL_LENGTH * 2.5) * i;
        const sin_loops = SIN_LOOP_RANGE[0] + (SIN_LOOP_RANGE[1] - SIN_LOOP_RANGE[0]) * a1;
        const a4 = Math.sin(Math.PI * sin_loops * (a2 * 1 % 1));
        let unit_length = TOTAL_LENGTH * a3;
        unit_length = THREE.MathUtils.euclideanModulo(unit_length, MAX_LENGTH);
        const e = new THREE.Euler();
        const yfc = Y_ROTATION_OFFSET;
        const degY = ( yfc * -1 + yfc * 2 * a2) + (360 * Y_ROTATION_COUNT ) * a1;
        const xd = X_DEG;
        const degX = xd * -1 + xd * 2 * a4;
        e.y = THREE.MathUtils.degToRad( degY);
        e.x = THREE.MathUtils.degToRad(degX);
        mesh.position.set(1, 0, 0).normalize().applyEuler(e).multiplyScalar(0.5 + unit_length);
        mesh.lookAt(0,0,0);
        mesh.rotation.y = Math.PI * 2 * ( (a2 + a2) * 64 % 1);
    });
};

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
    const cp_campos = curveMod.QBCurvePath([
        [8,1,0, 12,3,12,  5,2,5,    0],
        [12,3,12, -12,3,12,  0,0,0,    0]
    ]);
    //scene.add( curveMod.debugPointsCurve(cp_campos) )
    //-------- ----------
    // CURVE Alphas
    //-------- ----------
    const getCamPosAlpha = curveMod.getAlphaFunction({
        type: 'curve2',
        ac_points: [0,0.2,  0.6, -0.15,  1]
    });
    //scene.add( curveMod.debugAlphaFunction(getCamPosAlpha) )
    //-------- ----------
    // GRID
    //-------- ----------
    const grid = scene.userData.grid = new THREE.GridHelper(20, 20, '#ffffff', '#8f8f8f');
    grid.material.transparent = true;
    grid.material.opacity = 0.25;
    grid.material.linewidth = 6;
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
            ['Wrap Vector3', 64, 17, 14, 'white'],
            ['Unit Length in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r146 MAR / 09 / 2023 )', 64, 70, 11, 'gray'],
            ['video2', 64, 100, 10, 'gray']
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
updateGroup(seq.per);
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
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 27,
        update: function(seq, partPer, partBias){
            const a1 = getCamPosAlpha(partPer);
            camera.position.copy( cp_campos.getPoint(a1) );
            camera.lookAt(0, 0, 0);
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
 