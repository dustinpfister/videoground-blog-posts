// video2-s6-1-lerp.js for threejs-math-utils
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js',
   '../../../js/curve/r1/curve.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js'
];
// init
VIDEO.init = function(sm, scene, camera){
//-------- ----------
// CURVE
//-------- ----------
const v_start = new THREE.Vector3(-5, 0, -5);
const v_end = new THREE.Vector3(5, 0, 0);
const v_control1 = v_start.clone().lerp(v_end, 0.25).add( new THREE.Vector3(0,0,20) );
const v_control2 = v_start.clone().lerp(v_end, 0.75).add( new THREE.Vector3(0,10,-10) );
const curve = new THREE.CubicBezierCurve3(v_start, v_control1, v_control2, v_end);
//-------- ----------
// HELPERS
//-------- ----------
const updateMesh = (mesh, curve, alphaDelta) => {
    const mud = mesh.userData;
    mud.a = mud.a === undefined ? 0 : mud.a;
    mud.a_last = mud.a_last === undefined ? 0.5 : mud.a_last;
    mud.speed = mud.speed === undefined ? 0.2 + 0.8 * Math.random() : mud.speed;
    if(mud.a_target === undefined || mud.a === 1){
       mud.a_last = mud.a_target;
       mud.a_target = Math.random();
       mud.a = 0;
    }
    mud.v_current = curve.getPoint( THREE.MathUtils.lerp(mud.a_last, mud.a_target, mud.a) );
    mud.a += (alphaDelta * mud.speed);
    mud.a = THREE.MathUtils.clamp(mud.a, 0, 1);
    const a_scale = 0.25 + 0.75 * ( 1 - Math.abs(0.5 - mud.a) / 0.5 );
    mesh.scale.set( a_scale, a_scale, a_scale);
};
//-------- ----------
// OBJECTS
//-------- ----------
scene.add( new THREE.GridHelper(10, 10) );
const group = new THREE.Group();
scene.add(group);
let i = 0;
const geometry = new THREE.SphereGeometry(1.00, 20, 20);
const material = new THREE.MeshNormalMaterial({ transparent: true, opacity: 0.5 });
while(i < 50){
    const mesh = new THREE.Mesh( geometry, material );
    updateMesh(mesh, curve, 0.5);
    group.add(mesh);
    i += 1;
}
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
        [8,1,0, 8,3,8,  5,2,5,    0],
        [8,3,8, -8,3,8,  0,0,0,    0]
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
            ['Math Utils', 64, 17, 14, 'white'],
            ['lerp method', 64, 32, 14, 'white'],
            ['threejs demo', 64, 47, 14, 'white'],
            ['( r146 Mar/15/2023 )', 64, 70, 12, 'gray'],
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
                    textCube.material.opacity = 0.9;
                }
            },
            {
                per: 0.75,
                update: function(seq, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8 + 1 * partPer, 0);
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
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            textCube.visible = false;
            camera.position.set(8, 1, 0);
            camera.zoom = 1;

    group.traverse( (obj) => {
        if(obj.type === 'Mesh'){
            const mesh = obj;
            const mud = mesh.userData;
            mesh.position.copy( mud.v_current );
            updateMesh(mesh, curve, 0.015);
        }
    });

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
            camera.zoom = 1 - 0.5 * partPer;
            camera.lookAt(0, 3.25 * partPer, 0);
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
 