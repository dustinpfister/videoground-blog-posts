// video2-clamptogrid for threejs-vector3-clamp
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
// LIGHT
//-------- ----------
const dl = new THREE.DirectionalLight();
dl.position.set(1, 2, 3);
scene.add(dl);
//-------- ----------
// CONST
//-------- ----------
const V_MIN = new THREE.Vector3( -4.5, 0, -4.5 );
const V_MAX = new THREE.Vector3( 4.5, 0, 4.5 );
const COLORS = [0xffffff, 0xff0000, 0x00ff00, 0x0000ff, 0xff00ff];
const CHECKS = ['x,1,180','x,2,0','z,3,270','z,4,90'].map((str) => { return str.split(',') });
//-------- ----------
// HELPERS
//-------- ----------
const createGroup = (count) => {
    const group = new THREE.Group();
    let i = 0;
    while(i < count){
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1,1 + Math.random(),1),
            new THREE.MeshPhongMaterial({
                transparent: true,
                opacity: 0.75
            })
        );
        const mud = mesh.userData;
        mud.heading = Math.PI * 2 * Math.random();
        mud.upd = 0.25 + 1.75 * Math.random();
        group.add(mesh);
        i += 1;
    }
    return group;
};
const getHeading = (degHome) => {
    return Math.PI / 180 * (degHome - 45 + 90 * Math.random());
};
const updateGroup = (group, delta) => {
    group.children.forEach( (mesh, i) => {
        const mud = mesh.userData;
        const v_delta = new THREE.Vector3();
        v_delta.x = Math.cos(mud.heading) * mud.upd * delta;
        v_delta.z = Math.sin(mud.heading) * mud.upd * delta;
        mesh.position.add(v_delta).clamp(V_MIN, V_MAX);
        let ic = 0;
        while(ic < 4){
            const axis = CHECKS[ic][0];
            const maxValue = ic % 2 === 0 ? V_MAX[axis]: V_MIN[axis];
            if(mesh.position[axis] === maxValue){
                mesh.material.color = new THREE.Color(COLORS[ CHECKS[ic][1] ]);
                mud.heading = getHeading(CHECKS[ic][2]);
                break;
            }
            ic += 1;
        }
    });
};
//-------- ----------
// OBJECTS
//-------- ----------
scene.add( new THREE.GridHelper(10, 10) );
const group = createGroup(100);
scene.add(group);
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
        [8,1,0, 10,3,10,  5,2,5,    0],
        [10,3,10, -13,5,12,  0,0,0,    0]
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
            ['Vector3 Clamp', 64, 17, 14, 'white'],
            ['method', 64, 32, 14, 'white'],
            ['threejs demo', 64, 47, 14, 'white'],
            ['( r146 03/08/2023 )', 64, 70, 12, 'gray'],
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
     updateGroup(group, 0.1)
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
 