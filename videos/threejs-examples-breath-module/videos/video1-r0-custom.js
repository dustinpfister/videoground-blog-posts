// video1-r0-custom.js for threejs-examples-breath-module
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js',
   '../../../js/curve/r1/curve.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js',
   '../../../js/breath/r0/breath.js'
];
// init
VIDEO.init = function(sm, scene, camera){
// ---------- ----------
// LIGHT
// ---------- ----------
const dl = new THREE.DirectionalLight(0xffffff, 1);
dl.position.set(5, 2, 1)
scene.add(dl);
//-------- ----------
// BREATH GROUP
//-------- ----------
const group = BreathMod.create({
    curveCount: 20,
    meshPerCurve: 16,
    radiusMin: 0.5, radiusMax: 8,
    totalBreathSecs: 30,
    breathsPerMinute: 6,
    breathParts: {restLow: 1, breathIn: 4, restHigh: 1, breathOut: 4},
    curveUpdate: (curve, alpha, v_c1, v_c2, v_start, v_end, gud, group) => {
        const e1 = new THREE.Euler();
        e1.z = Math.PI / 180 * 60 * alpha;
        const e2 = new THREE.Euler();
        e2.z = Math.PI / 180 * -60 * alpha;
        v_c1.copy( v_start.clone().lerp(v_end, 0.25).applyEuler(e1) );
        v_c2.copy( v_start.clone().lerp(v_end, 0.75).applyEuler(e2) );
    },
    meshUpdate: (mesh, curve, alpha, index, count, group) => {
        // position
        const a_meshpos = (index + 1) / count;
        mesh.position.copy( curve.getPoint(a_meshpos * alpha) );
        // opacity
        const a_meshopacity = (1 - a_meshpos) * 0.50 + 0.50 * alpha;
        mesh.material.opacity = a_meshopacity;
        // scale
        const s = 0.25 + 2.25 * a_meshpos * Math.sin(Math.PI * 0.5 * alpha);
        mesh.scale.set( s, s, s );
    },
    material: new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.1
    })
});
group.rotation.y = Math.PI * 0.5;
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
    // GRID
    //-------- ----------
    const grid = scene.userData.grid = new THREE.GridHelper(20, 20, '#ffffff', '#008800');
    grid.material.transparent = true;
    grid.material.opacity = 0.4;
    grid.material.linewidth = 5;
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
            ['Breath Module', 64, 17, 14, 'white'],
            ['threejs example', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r146 03/06/2023 )', 64, 70, 12, 'gray'],
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
            camera.lookAt(0,0,0);
            camera.zoom = 1;

            BreathMod.update(group, seq.per);

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
        }
    };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 27,
        update: function(seq, partPer, partBias){

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
 