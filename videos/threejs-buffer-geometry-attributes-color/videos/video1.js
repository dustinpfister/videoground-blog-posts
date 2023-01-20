// video1 for threejs-buffer-geometry-attributes-normals
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
    // CURVE PATHS - cretaing a curve path for the camera
    //-------- ----------
    const cp_campos = curveMod.QBCurvePath([
        [8,1,0, 0,1,0,  -5,10,0,    0],
        [0,1,0, 10,-2,0,  -5,-5,0,    0],
        [10,-2,0, 5,5,5,  15,-1,0,    0]
    ]);
    //scene.add( curveMod.debugPointsCurve(cp_campos) );
    //-------- ----------
    // CURVE Alphas
    //-------- ----------
    const getCamPosAlpha = curveMod.getAlphaFunction({
        type: 'curve2',
        ac_points: [0,0,  0.7,0, 1]
    });
    //scene.add( curveMod.debugAlphaFunction(getCamPosAlpha) )
    // ---------- ----------
    // HELPERS
    // ---------- ----------
    // just make a color array
    const make_color_array = (geo, a1, a2, a3) => {
        a1 = a1 === undefined ? 1 : a1;
        a2 = a2 === undefined ? 1 : a2;
        a3 = a3 === undefined ? 1 : a3;
        const len = geo.getAttribute('position').count;
        const color_array = [];
        let i = 0;
        while(i < len){
            const a_index = i / len;
            const a_indexbias = 1 - Math.abs(0.5 - a_index) / 0.5;
            color_array.push(a1, a_indexbias * a2, 1 - a_indexbias * a3);
            i += 1;
        }
        return color_array;
    };
    // update color attribute
    const update_color_attribute = (geo, a1, a2, a3) => {
        const color_array = make_color_array(geo, a1, a2, a3);
        const color_attribute = geo.getAttribute('color');
        if(color_attribute){
            color_attribute.array = color_attribute.array.map((n, i) => {
                return color_array[i];
            });
            color_attribute.needsUpdate = true;
        }else{
            const new_color_attribute = new THREE.BufferAttribute(new Float32Array(color_array), 3);
            geo.setAttribute('color', new_color_attribute);
        }
    };
    // ---------- ----------
    // GEOMETRY, MATERIAL, MESH
    // ---------- ----------
    const geo = new THREE.TorusGeometry( 2.00, 0.75, 80, 80 );
    geo.rotateX(Math.PI * 0.50)
    update_color_attribute(geo, 1, 1, 1);
    const material1 = new THREE.MeshPhongMaterial({
        vertexColors: true,
        shininess: 15,
        specular: new THREE.Color(0.75, 0.75, 0.75)
    });
    const mesh1 = new THREE.Mesh(geo, material1);
    scene.add(mesh1);
    // ---------- ----------
    // LIGHT
    // ---------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 0.95);
    dl.position.set(5, 3, 1);
    scene.add(dl);
    const al = new THREE.AmbientLight(0xffffff, 0.05);
    scene.add(al);
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
            ['Color Attributes', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 01/20/2023 )', 64, 70, 12, 'gray'],
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
            const a = seq.frame, b = seq.frameMax;
            const a1 = curveMod.getAlpha('sinBias', a, b, 1);
            const a2 = curveMod.getAlpha('sinBias', a, b, 8);
            const a3 = curveMod.getAlpha('sinBias', a, b, 16);
            update_color_attribute(geo, a1, a2, a3);
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
        secs: 7,
        update: function(seq, partPer, partBias){
            const a1 = getCamPosAlpha(partPer);
            camera.position.copy( cp_campos.getPoint(a1) );
            camera.lookAt(0, 0, partBias);
        }
    };
    // SEQ 2 - ...
    opt_seq.objects[2] = {
        secs: 20,
        update: function(seq, partPer, partBias){
            const n = 5 - 2.5 * partPer;
            camera.position.set(n, n, n);
            camera.lookAt(0, -2 * partPer, 0);
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
 