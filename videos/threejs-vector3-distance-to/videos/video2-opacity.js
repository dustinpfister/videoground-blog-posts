// video2-opacity for threejs-vector3-distance-to
//     * based off of the s2-2-loop-opacity demo form the post
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
// HELPER FUNCTIONS
//-------- ----------
// opaicty effect using length method which is distance to origin
const opacityEffect = (mesh) =>  {
    mesh.material.opacity = 1 - mesh.position.length() / 5;
};
// rotation effect using the distanceTo method
const rotationEffect = (group, mesh) =>  {
    const minDist = 5;
    group.children.forEach( (child) => {
        mesh.lookAt(0, 0, 0);
        if(child != mesh){
            const d = mesh.position.distanceTo(child.position);
            if(d < minDist){
                const p = d / minDist;
                const ud = mesh.userData;
                ud.rp += p;
                ud.rp %= 1;
                mesh.rotation.z += Math.PI / 180 * ud.maxDegPerChid * ud.rp;
            }
        }
    })
};
// get a start position by passing two values that are 0 - 1
const getStartPosition = (a, b) => {
    a = a === undefined ? 0 : a;
    b = b === undefined ? 0 : b;
    const pos = new THREE.Vector3( 5, 0, 0);
    const e = new THREE.Euler(0, a * Math.PI * 2, b * Math.PI * 2);
    return pos.applyEuler(e);
};
// get a seeded random start position
const getSeededRandomStartPosition = function(){
    return getStartPosition(
       THREE.MathUtils.seededRandom(), 
       THREE.MathUtils.seededRandom() );
};
// set new mesh user data
const newMeshUserData = (mesh) => {
    const ud = mesh.userData;
    ud.startPos = getSeededRandomStartPosition();
    ud.alphaDelta = 0.1 + 0.5 * THREE.MathUtils.seededRandom();
    ud.alpha = 0;
    ud.rp = 0;
    ud.maxDegPerChid = 5 + 355 * THREE.MathUtils.seededRandom();
};
// create group
const createGroup = (count) => {
    count = count === undefined ? 10 : count;
    const group = new THREE.Group();
    let i = 0;;
    while(i < count){
        // create mesh object
        const mesh = new THREE.Mesh( 
            new THREE.BoxGeometry(1,1,1), 
            new THREE.MeshNormalMaterial({
                transparent: true
            }) );
        // user data
        const ud = mesh.userData;
        newMeshUserData(mesh);
        // start pos, lookAt, add to group
        mesh.position.copy( ud.startPos );
        group.add(mesh);
        i += 1;
    }
    return group;
};
// update group
const updateGroup = function(group, secs){
    secs = secs === undefined ? 0 : secs;
    group.children.forEach( (mesh) => {
        const ud = mesh.userData;
        ud.alpha += ud.alphaDelta * secs;
        ud.alpha = ud.alpha > 1 ? 1 : ud.alpha;
        // new positon using start pos in userData and lerping from there
        mesh.position.copy(ud.startPos).lerp( new THREE.Vector3(), ud.alpha );
        // new data if alpha === 1
        if(ud.alpha === 1){
            newMeshUserData(mesh);
        }
        // opaicty effect
        opacityEffect(mesh);
        rotationEffect(group, mesh);
    });
};
//-------- ----------
// OBJECTS
//-------- ----------
const group1 = createGroup(80);
scene.add(group1);
const group2 = createGroup(20);
group2.position.set(-10, 0, 0);
scene.add(group2);
const group3 = createGroup(20);
group3.position.set(0, 0, -10);
scene.add(group3);

    updateGroup(group1, 1);
    updateGroup(group2, 1);
    updateGroup(group3, 1);
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
        [8,1,0,   8,3,8,  5,2,5,    0]
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
            ['Vector3.distanceTo', 64, 17, 14, 'white'],
            ['Method', 64, 32, 14, 'white'],
            ['Threejs Demo', 64, 47, 14, 'white'],
            ['( r146 MAR/13/2023 )', 64, 70, 12, 'gray'],
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
    updateGroup(group1, 1 / 30);
    updateGroup(group2, 1 / 30);
    updateGroup(group3, 1 / 30);
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
 