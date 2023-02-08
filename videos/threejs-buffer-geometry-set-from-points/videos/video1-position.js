// video1 for threejs-buffer-geometry-set-from-points
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
// HELPERS
//-------- ----------
// a function that creates and returns an array of vector3 objects
const myV3Array = (point_count, sec_count, rotation_count, y_mag, radius) => { 
    const v3array = [];
    for ( let i = 0; i < point_count; i ++ ) {
        const a1 = i / point_count;
        const a2 = a1 * sec_count % 1;
        const a3 = Math.floor(sec_count * a1) / sec_count;
        const a4 = 1 - Math.abs(0.5 - a1) / 0.5;
        const e = new THREE.Euler();
        e.y = Math.PI * 2 * rotation_count * a2;
        const v = new THREE.Vector3(1, 0, 0);
        v.applyEuler(e).multiplyScalar(radius * a4);
        v.y = y_mag * -1 + (y_mag * 2) * a3;
        v3array.push(v);
    }
    return v3array;
};
// create a geometry to begin with
const createGeometry = (point_count, sec_count, rotation_count, y_mag, radius) => {
    const v3array =  myV3Array(point_count, sec_count, rotation_count, y_mag, radius);
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(v3array);
    // adding vertex color to while I am at it
    let i = 0;
    const att_pos = geometry.getAttribute('position');
    const len = att_pos.count;
    const data_color = [];
    while(i < len){
        const n = 0.25 + 0.75 * (i / len);
        data_color.push(0, 1 - n, n);
        i += 1;
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(data_color, 3));
    return geometry;
};
// update a geometry
const updateGeometry = (geometry, sec_count, rotation_count, y_mag, radius) => {
    const att_pos = geometry.getAttribute('position');
    const v3array =  myV3Array(att_pos.count, sec_count, rotation_count, y_mag, radius);
    let i = 0;
    const len = att_pos.count;
    while(i < len){
        const v = v3array[i];
        att_pos.setX(i, v.x);
        att_pos.setY(i, v.y);
        att_pos.setZ(i, v.z);
        i += 1;
    }
    att_pos.needsUpdate = true;
};
//-------- ----------
// OBJECTS
//-------- ----------
const geometry = createGeometry(400, 1, 2, 1, 3);
const points1 = new THREE.Points(geometry, new THREE.PointsMaterial({
    size: 0.5,
    transparent: true,
    opacity: 0.8,
    vertexColors: true
}));
scene.add(points1);




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
        [8,1,0, 8,5,8,  -1,0,-1,    0]
    ]);
    //scene.add( curveMod.debugPointsCurve(cp_campos) )
    //-------- ----------
    // CURVE Alphas
    //-------- ----------
    const getCamPosAlpha = curveMod.getAlphaFunction({
        type: 'curve2',
        ac_points: [0,-0.1,  0.2, -0.25,  1]
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
            ['Buffer Geometry', 64, 17, 14, 'white'],
            ['set from points', 64, 32, 14, 'white'],
            ['method', 64, 47, 14, 'white'],
            ['( r140 02/08/2023 )', 64, 70, 12, 'gray'],
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
            camera.zoom = 1.1;


    const a1 = seq.per;
    const a2 = THREE.MathUtils.smoothstep(a1, 0, 1)
    const sec_count = 2 + 3 * a2;
    const rotation_count = 1 + 3 * a2;
    const y_mag = 0.5 + 1.5 * a2;
    const radius = 1 + 4 * a2;
    updateGeometry(geometry, sec_count, rotation_count, y_mag, radius);

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
            camera.lookAt(0, -1.25 * partPer, 0);
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
 