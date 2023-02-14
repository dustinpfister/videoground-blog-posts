// video1 for threejs-dae-collada-loader
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js',
   '../../../js/curve/r1/curve.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js',
   '../../../js/dae-helper/r0/dae-helper.js'
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
    //-------- ----------
    // LIGHT
    //-------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(5, 1, 2)
    scene.add(dl);
    //-------- ----------
    // CURVE PATHS - cretaing a curve path for the camera
    //-------- ----------
    const cp_campos = curveMod.QBCurvePath([
        [8,1,0, 8,3,8,  5,2,5,    0]
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
            ['DAE Collada Loader', 64, 17, 13, 'white'],
            ['in', 64, 32, 13, 'white'],
            ['threejs', 64, 47, 13, 'white'],
            ['( r140 02/14/2023 )', 64, 70, 12, 'gray'],
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
    // LOAD DAE FILES
    //-------- ----------
    return DAE_loader({
        urls_dae: [
            videoAPI.pathJoin(sm.filePath, '../../../dae/house_two/house_2.dae'),
            videoAPI.pathJoin(sm.filePath, '../../../dae/land-set-one/land-set-1c.dae'),
        ],
        urls_resource: [
            videoAPI.pathJoin(sm.filePath, '../../../dae/house_two/skins/windows/'),
            videoAPI.pathJoin(sm.filePath, '../../../dae/land-set-one/')
        ],
        cloner: (obj, scene_source, scene_result, result) => {
            if(obj.type === 'Mesh'){
                const mesh = obj.clone();
                console.log(mesh.name)
                mesh.position.set(0,0,0);
                scene_source.add(mesh);
            }
        }
    })
    .then((scene_source) => {
        //-------- ----------
        // A MAIN SEQ OBJECT
        //-------- ----------
        const mesh1 = scene_source.getObjectByName('house_0').clone();
        scene.add(mesh1);
        // land tiles
        const data_land_index = [
            1,0,0,0,0,0,0,0,0,0,
            1,0,0,0,0,0,0,0,0,0,
            1,0,0,0,0,0,0,0,0,0,
            1,0,0,0,0,0,0,0,0,0,
            1,0,0,0,0,0,0,0,0,0,
            1,0,0,0,0,0,0,0,0,0,
            1,0,0,0,0,0,0,0,0,0,
            1,0,0,0,0,0,0,0,0,0,
            1,0,0,0,0,0,0,0,0,0,
            1,0,0,0,0,0,0,0,0,0
        ];
        const data_land_rotation = [
            2,0,0,0,0,0,0,0,0,0,
            2,0,0,0,0,0,0,0,0,0,
            2,0,0,0,0,0,0,0,0,0,
            2,0,0,0,0,0,0,0,0,0,
            2,0,0,0,0,0,0,0,0,0,
            2,0,0,0,0,0,0,0,0,0,
            2,0,0,0,0,0,0,0,0,0,
            2,0,0,0,0,0,0,0,0,0,
            2,0,0,0,0,0,0,0,0,0,
            2,0,0,0,0,0,0,0,0,0
        ];
        let i = 0, len = 10 * 10;
        while(i < len){
            const x = -4.5 + i % 10;
            const z = -4.5 + Math.floor(i / 10);
            const index = data_land_index[i];
            const mesh = scene_source.getObjectByName('land_' + index).clone();
            mesh.rotation.y = Math.PI * 2 / 4 * data_land_rotation[i];
            let y = -0.5;
            if(index > 0){
                y = 0.5;
            }
            mesh.position.set(x,y,z);
            scene.add(mesh)
            i += 1;
        }
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
        return '';
    });
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
 