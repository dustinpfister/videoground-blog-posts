// video2 for threejs-userdata
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
// ---------- ----------
// SETTINGS
// ---------- ----------
const CUBE_COUNT = 40;
const CUBE_SIZE = 0.5;
const CUBE_HSIZE = CUBE_SIZE / 2;
const CUBE_DROP_SPEED = 20;
const CUBE_MOVE_SPEED = [30, 100];
const CUBE_START_HEIGHT = [5, 15];
const CUBE_MIN_HEIGHT = -5;
const PLANE_SIZE = 5;
const PLANE_HSIZE = PLANE_SIZE / 2;
// ---------- ----------
// HELPER FUNCTIONS
// ---------- ----------
const createCubes = () => {
    let i = 0;
    const count = CUBE_COUNT;
    const group = new THREE.Group();
    while(i < count){
        const geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
        const material = new THREE.MeshPhongMaterial({
            transparent: true, opacity: 0.7,
            color: new THREE.Color(Math.random(),Math.random(),Math.random()),
            //emissive: new THREE.Color(1,1,1),
            //emissiveMap: canObj.texture
        });
        const mesh = new THREE.Mesh( geometry, material );
        mesh.position.y = CUBE_MIN_HEIGHT - 10;
        // USER DATA FOR MESH OBJECTS
        const mud = mesh.userData;
        mud.radian = Math.PI * 2 * Math.random();
        const sr = CUBE_MOVE_SPEED;
        mud.ups = sr[0] + (sr[1] - sr[0]) * Math.random();
        group.add(mesh);
        i += 1;
    }
    return group;
};
// update the given group by a secs value
const updateCubes = (group, secs) => {
    let i = 0;
    const count = CUBE_COUNT;
    while(i < count){
        const mesh = group.children[i];
        const mud = mesh.userData;
        const v_pos = mesh.position;
        // reset to spawn location if y is too low
        if(v_pos.y < CUBE_MIN_HEIGHT){
            const sh = CUBE_START_HEIGHT;
            v_pos.set(0, sh[0] + (sh[1] - sh[0]) * Math.random(), 0);
            break;
        }
        // y adjust
        v_pos.y -= CUBE_DROP_SPEED * secs;
        // is mesh on the plane
        const n = PLANE_HSIZE + CUBE_HSIZE;
        if(v_pos.x <= n && v_pos.x >= n * -1 && v_pos.z <= n && v_pos.z >= n * -1){
            // y will get capped if it is on the plane
            v_pos.y = v_pos.y < CUBE_HSIZE ? CUBE_HSIZE : v_pos.y;
            if(v_pos.y === CUBE_HSIZE){
                const dx = Math.cos(mud.radian) * mud.ups * secs;
                const dz = Math.sin(mud.radian) * mud.ups * secs;
                v_pos.x += dx * secs;
                v_pos.z += dz * secs;
            }
        }
        i += 1;
    }
};
// ---------- ----------
// OBJECTS
// ---------- ----------
const group = createCubes();
scene.add(group);
const geometry = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE);
geometry.rotateX(Math.PI * 1.5)
const plane = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
   color: new THREE.Color(0,1,1),
   transparent: true,
   opacity: 0.25
}))
scene.add( plane );
// ---------- ----------
// LIGHT
// ---------- ----------
const dl = new THREE.DirectionalLight(0xffffff, 1);
dl.position.set(3,2,1);
scene.add(dl);

    //-------- ----------
    // CURVE PATHS - cretaing a curve path for the camera
    //-------- ----------
    const cp_campos = curveMod.QBCurvePath([
        [8,1,0, 2.5,1,2.5,  5,2,5,    0]
    ]);
    //scene.add( curveMod.debugPointsCurve(cp_campos) )
    //-------- ----------
    // CURVE Alphas
    //-------- ----------
    const getCamPosAlpha = curveMod.getAlphaFunction({
        type: 'curve2',
        ac_points: [0,0.4,  0.6,-0.25,  1]
    });
    //scene.add( curveMod.debugAlphaFunction(getCamPosAlpha) )
    //-------- ----------
    // GRID
    //-------- ----------
    //const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    //grid.material.linewidth = 3;
    //scene.add( grid );
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
            ['User Data Objects', 64, 17, 14, 'white'],
            ['in', 64, 32, 14, 'white'],
            ['Threejs', 64, 47, 14, 'white'],
            ['( r140 02/01/2023 )', 64, 70, 12, 'gray'],
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


    updateCubes(group, 1 / 30);
    camera.lookAt(group.position);

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
 